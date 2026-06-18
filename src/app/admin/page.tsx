import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  const session = await auth();
  if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
    redirect('/auth');
  }

  const laporanList = await prisma.siplingLaporan.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  // Map to serializable object
  const mappedLaporan = laporanList.map(l => ({
    id: l.id,
    kategori: l.kategori,
    lokasi: l.lokasi,
    deskripsi: l.deskripsi,
    status: l.status,
    foto: l.foto ? JSON.parse(l.foto) : [],
    userId: l.userId,
    createdAt: l.createdAt.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    user: l.user,
  }));

  return <AdminDashboardClient initialLaporan={mappedLaporan} adminName={session.user.name || 'Pemerintah Admin'} />;
}
