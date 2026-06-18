import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import LaporanDashboardClient from './LaporanDashboardClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function LaporanPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/auth');
  }

  if ((session.user as any).role === 'ADMIN') {
    redirect('/admin');
  }

  const userId = (session.user as any).id;

  // Fetch only the reports submitted by the logged-in user
  const reports = await prisma.siplingLaporan.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  // Map database reports to serializable objects
  const mappedReports = reports.map((item) => {
    let fotos: string[] = [];
    try {
      fotos = item.foto ? JSON.parse(item.foto) : [];
    } catch (e) {
      console.error("Failed to parse foto JSON:", e);
    }

    return {
      id: item.id,
      kategori: item.kategori,
      lokasi: item.lokasi,
      deskripsi: item.deskripsi,
      status: item.status,
      foto: fotos,
      createdAt: item.createdAt.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      createdAtRaw: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      pelapor: session.user?.name || "Saya",
    };
  });

  return (
    <>
      <Header />
      <LaporanDashboardClient initialReports={mappedReports} citizenName={session.user?.name || "Masyarakat"} />
      <Footer role={(session?.user as any)?.role || "GUEST"} />
    </>
  );
}
