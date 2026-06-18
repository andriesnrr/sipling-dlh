import { prisma } from '@/lib/prisma';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PetaClient from './PetaClient';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function PetaPage() {
  const session = await auth();

  // Fetch all reports to show on the map
  const reports = await prisma.siplingLaporan.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
        }
      }
    }
  });

  const categoryNames: Record<string, string> = {
    sampah: "Penumpukan Sampah",
    drainase: "Drainase / Saluran Air",
    pohon: "Pohon Rawan Tumbang",
    udara: "Pencemaran Udara / Asap",
    lainnya: "Laporan Lainnya",
  };

  const mappedReports = reports.map((item) => {
    let fotos: string[] = [];
    try {
      fotos = item.foto ? JSON.parse(item.foto) : [];
    } catch (e) {
      console.error("Failed to parse foto JSON:", e);
    }

    // Generate stable mock coordinates for each report based on its ID
    // Gresik coordinates range: Lat: -7.15 to -7.18, Lng: 112.61 to 112.66
    const hash = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const lat = -7.15 - ((hash % 100) / 100) * 0.03; // yields -7.15 to -7.18
    const lng = 112.61 + ((hash % 79) / 79) * 0.05; // yields 112.61 to 112.66

    // Assign district based on coords
    let kecamatan = "Gresik Kota";
    if (lat < -7.165 && lng < 112.635) {
      kecamatan = "Kebomas";
    } else if (lat >= -7.165 && lng < 112.635) {
      kecamatan = "Manyar";
    }

    return {
      id: item.id,
      kategori: item.kategori,
      kategoriReadable: categoryNames[item.kategori] || item.kategori,
      lokasi: item.lokasi,
      deskripsi: item.deskripsi,
      status: item.status,
      foto: fotos,
      lat,
      lng,
      kecamatan,
      pelapor: item.user?.name || "Masyarakat",
      createdAt: item.createdAt.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
  });

  return (
    <>
      <Header />
      <PetaClient initialReports={mappedReports} />
      <Footer role={(session?.user as any)?.role || "GUEST"} />
    </>
  );
}
