import { prisma } from '@/lib/prisma';
import LacakDashboardClient from './LacakDashboardClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { auth } from '@/lib/auth';

// Helper to mask names for citizen privacy (e.g. "John Doe" -> "J**n D*e")
function maskName(name: string) {
  if (!name) return "Masyarakat";
  const parts = name.split(" ");
  return parts.map(part => {
    if (part.length <= 2) return part;
    return part[0] + "*".repeat(part.length - 2) + part[part.length - 1];
  }).join(" ");
}

export const dynamic = 'force-dynamic';

export default async function LacakPage() {
  const session = await auth();

  // Fetch all reports to be searchable/trackable publicly
  const reports = await prisma.siplingLaporan.findMany({
    include: {
      user: {
        select: {
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  // Map to serializable list of items
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
      pelapor: maskName(item.user?.name),
    };
  });

  return (
    <>
      <Header />
      <LacakDashboardClient initialReports={mappedReports} />
      <Footer role={(session?.user as any)?.role || "GUEST"} />
    </>
  );
}
