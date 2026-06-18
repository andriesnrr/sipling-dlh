import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProfilClient from './ProfilClient';

export const dynamic = 'force-dynamic';

export default async function ProfilPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth');
  }

  const userId = (session.user as any).id;

  // Fetch real user data from the database
  const dbUser = await prisma.siplingUser.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    }
  });

  if (!dbUser) {
    redirect('/auth');
  }

  // Fetch counts of their reports
  const totalLaporan = await prisma.siplingLaporan.count({
    where: { userId: userId }
  });

  const totalSelesai = await prisma.siplingLaporan.count({
    where: {
      userId: userId,
      status: "Selesai"
    }
  });

  const totalProses = await prisma.siplingLaporan.count({
    where: {
      userId: userId,
      status: "Proses"
    }
  });

  const formattedJoinDate = dbUser.createdAt.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <Header />
      <ProfilClient 
        user={{
          id: userId,
          name: dbUser.name,
          email: dbUser.email,
          phone: dbUser.phone || "",
          role: dbUser.role,
          joinDate: formattedJoinDate
        }}
        stats={{
          total: totalLaporan,
          selesai: totalSelesai,
          proses: totalProses,
          verifikasi: totalLaporan - totalSelesai - totalProses
        }}
      />
      <Footer role={dbUser.role || "GUEST"} />
    </>
  );
}
