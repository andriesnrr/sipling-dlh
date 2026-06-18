import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function runTest() {
  console.log('=== MULAI PENGUJIAN DATABASE BACKEND SIPLING ===');

  const testUserEmail = 'test_warga_temp@sipling.go.id';
  
  // 1. Bersihkan data lama jika ada
  await prisma.siplingLaporan.deleteMany({
    where: { user: { email: testUserEmail } }
  });
  await prisma.siplingUser.deleteMany({
    where: { email: testUserEmail }
  });
  console.log('1. Pembersihan data uji lama sukses.');

  // 2. Simulasi Registrasi Akun Warga Baru
  console.log('\n2. Mencoba mendaftarkan user baru...');
  const hashedPassword = await bcrypt.hash('warga123', 10);
  const newUser = await prisma.siplingUser.create({
    data: {
      name: 'Warga Tester',
      email: testUserEmail,
      password: hashedPassword,
      phone: '081299998888',
      role: 'USER',
    }
  });
  console.log('   User berhasil dibuat:');
  console.log(`   - ID: ${newUser.id}`);
  console.log(`   - Nama: ${newUser.name}`);
  console.log(`   - Email: ${newUser.email}`);
  console.log(`   - Role: ${newUser.role}`);

  // 3. Simulasi Warga Membuat Laporan/Aduan Lingkungan Baru
  console.log('\n3. Mencoba mengirimkan laporan baru...');
  const newLaporan = await prisma.siplingLaporan.create({
    data: {
      kategori: 'sampah',
      lokasi: 'Jalan Veteran No. 12, Gresik',
      deskripsi: 'Penumpukan botol plastik liar di trotoar jalan utama.',
      foto: JSON.stringify(['/uploads/test-img1.png', '/uploads/test-img2.png']),
      userId: newUser.id
    }
  });
  console.log('   Laporan berhasil disimpan:');
  console.log(`   - ID Laporan: ${newLaporan.id}`);
  console.log(`   - Kategori: ${newLaporan.kategori}`);
  console.log(`   - Lokasi: ${newLaporan.lokasi}`);
  console.log(`   - Status Awal: ${newLaporan.status}`);
  console.log(`   - Lampiran Foto: ${newLaporan.foto}`);

  // 4. Simulasi Admin Melihat Laporan di Dashboard
  console.log('\n4. Simulasi Admin mengambil aduan dari database...');
  const fetchedLaporan = await prisma.siplingLaporan.findUnique({
    where: { id: newLaporan.id },
    include: { user: true }
  });
  if (fetchedLaporan) {
    console.log(`   Aduan ditemukan! Dibuat oleh pelapor: ${fetchedLaporan.user.name} (${fetchedLaporan.user.email})`);
  } else {
    throw new Error('Gagal mengambil aduan yang baru dibuat.');
  }

  // 5. Simulasi Admin Mengubah Status Aduan menjadi "Proses"
  console.log('\n5. Simulasi Admin menindaklanjuti laporan (Ubah status ke "Proses")...');
  const updatedLaporan = await prisma.siplingLaporan.update({
    where: { id: newLaporan.id },
    data: { status: 'Proses' }
  });
  console.log(`   Pembaruan status berhasil! Status saat ini: "${updatedLaporan.status}"`);

  // 6. Simulasi Pembersihan Data Pengujian (Clean Up)
  console.log('\n6. Membersihkan data pengujian...');
  await prisma.siplingLaporan.delete({ where: { id: newLaporan.id } });
  await prisma.siplingUser.delete({ where: { id: newUser.id } });
  console.log('   Data pengujian warga & laporan berhasil dihapus dari database.');

  console.log('\n=== SEMUA PENGUJIAN DATABASE BACKEND BERHASIL 100% ===');
}

runTest()
  .catch((error) => {
    console.error('\n❌ PENGUJIAN GAGAL:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
