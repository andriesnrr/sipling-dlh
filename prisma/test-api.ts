import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3001/api/auth/register';
const TEST_EMAIL = 'api_warga_test@sipling.go.id';

async function runApiTest() {
  console.log('=== MULAI PENGUJIAN API HTTP ENDPOINT ===');
  
  // 1. Clean up database records if pre-existing
  await prisma.siplingUser.deleteMany({
    where: { email: TEST_EMAIL }
  });
  console.log('1. Pembersihan data uji API lama sukses.');

  // 2. Send actual HTTP POST request to /api/auth/register
  console.log('\n2. Mengirimkan HTTP POST Request ke /api/auth/register...');
  
  const payload = {
    name: 'Warga API Tester',
    email: TEST_EMAIL,
    phone: '081298765432',
    password: 'password_api_123'
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(`   Status Respon: ${response.status} ${response.statusText}`);
    
    const data: any = await response.json();
    console.log('   Body Respon:', JSON.stringify(data));

    if (response.status !== 201) {
      throw new Error(`API mengembalikan status ${response.status}. Uji gagal!`);
    }

    if (!data.userId) {
      throw new Error('API tidak mengembalikan userId. Uji gagal!');
    }

    console.log('\n3. Memverifikasi entitas di database PostgreSQL...');
    const userInDb = await prisma.siplingUser.findUnique({
      where: { id: data.userId }
    });

    if (userInDb) {
      console.log(`   User terverifikasi di DB!`);
      console.log(`   - Nama: ${userInDb.name}`);
      console.log(`   - Email: ${userInDb.email}`);
      console.log(`   - Role: ${userInDb.role}`);
    } else {
      throw new Error('User terdaftar di API namun tidak tersimpan di database!');
    }

    // 4. Clean up
    console.log('\n4. Membersihkan data uji...');
    await prisma.siplingUser.delete({
      where: { id: data.userId }
    });
    console.log('   Data uji API dibersihkan.');

    console.log('\n=== SEMUA PENGUJIAN API HTTP BERHASIL 100% ===');
  } catch (error) {
    console.error('\n❌ PENGUJIAN API GAGAL:', error);
    process.exit(1);
  }
}

runApiTest()
  .finally(async () => {
    await prisma.$disconnect();
  });
