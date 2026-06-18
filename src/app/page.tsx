import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

// Category mappings for displaying in UI
const categoryNames: Record<string, string> = {
  sampah: "Penumpukan Sampah",
  drainase: "Drainase / Saluran Air",
  pohon: "Pohon Rawan Tumbang",
  udara: "Pencemaran Udara / Asap",
  lainnya: "Laporan Lainnya",
};

// Fallback images based on category
const categoryImages: Record<string, string> = {
  sampah: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
  drainase: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
  pohon: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
  udara: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80",
  lainnya: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
};

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    if (diffInMins < 5) return "Baru saja";
    return `${diffInMins} menit yang lalu`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  }
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function Home() {
  // Fetch statistics from PostgreSQL database
  const totalLaporan = await prisma.siplingLaporan.count();
  const laporanSelesai = await prisma.siplingLaporan.count({ where: { status: "Selesai" } });
  const laporanDiproses = await prisma.siplingLaporan.count({ where: { status: "Proses" } });
  const totalWarga = await prisma.siplingUser.count({ where: { role: "USER" } });

  // Fetch 3 most recent reports
  const recentLaporanDb = await prisma.siplingLaporan.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  // Map database reports or fall back to mock data if empty
  const hasReports = recentLaporanDb.length > 0;
  
  const recentLaporan = hasReports 
    ? recentLaporanDb.map((l) => {
        const fotos = l.foto ? JSON.parse(l.foto) : [];
        const imageUrl = fotos.length > 0 ? fotos[0] : (categoryImages[l.kategori] || categoryImages.lainnya);
        return {
          id: l.id,
          kategori: categoryNames[l.kategori] || l.kategori,
          lokasi: l.lokasi,
          deskripsi: l.deskripsi,
          status: l.status,
          image: imageUrl,
          waktu: formatRelativeTime(l.createdAt),
          pelapor: l.user.name,
          isMock: false,
        };
      })
    : [
        {
          id: "mock-1",
          kategori: "Penumpukan Sampah",
          lokasi: "Menteng, Jakarta Pusat",
          deskripsi: "Sampah menumpuk sejak pagi hari dan mengganggu pejalan kaki serta mengeluarkan bau tidak sedap.",
          status: "Selesai",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaYyQYjvH7Mb3TIRlpB-DKYuGM_eE5XSPk4ENN43ygnd_GIuLSOsjoaE8gBQSbPn8hjwSspsUM5OZmhVYrSeOmyJPFqsBmW-syC4Tq-ONIS33LUhwyD4gY7CZ_kmkhh8fKcdMRn0QaK55KT9GEi7tzqeATWcwtKFg7gcwIC8O55mOXyDclXm78gsNOr8OMkUWL_GMSHyqnmOX2zxSdQuuMtvrgGsM1DfFfB2sH66HM_btg2s8_8bf3i0QvyyAzDfwFccqTUZUl7g",
          waktu: "Contoh Laporan • Menteng",
          pelapor: "Admin",
          isMock: true,
        },
        {
          id: "mock-2",
          kategori: "Drainase / Saluran Air",
          lokasi: "Gambir, Jakarta Pusat",
          deskripsi: "Ditemukan sumbatan plastik dan sedimen lumpur yang mengakibatkan genangan saat hujan lebat.",
          status: "Proses",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoWwkROqHY6RSIcn1HPl8w_0S_O1lbEsQwhTvBalh-YIdVvu6w87BQM3lLPDXxzJIHJ-NmsrKnbdt8xxVedmhPsxdwuhofFgfA2PY-LRzu2EY8p1UPKJnd7sPZqKF4JF7_--53y5_nGW9wy-pqeqj2R5mBks_HxGz1pBhk1aCwACXNuHAcW-Jns5XO_Y0tfHHifV29dgd_U0ZN6d6alGdCnsT59E5P_rydWiVzcamhCCO-j84-oxCAMkyXkQmK96DTiVCcgEuONw",
          waktu: "Contoh Laporan • Gambir",
          pelapor: "Admin",
          isMock: true,
        },
        {
          id: "mock-3",
          kategori: "Pohon Rawan Tumbang",
          lokasi: "Senayan, Jakarta Pusat",
          deskripsi: "Pohon peneduh di area Senayan miring dan berpotensi tumbang jika terjadi angin kencang.",
          status: "Verifikasi",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2M5Vyl0ztBIHbklFabG33PnyWBLuJMqg6q7RYxJOR1XYZhUEZjt_nrZ06wOzDLOTn-uX9SUbUN3g5t2BChBou5rahLzBvx3GLLt3PEzQibabGPxBgNtnHeXZD6ZISCW9QTmXmj314XfqqcVUytLs4KyGMx5AMZ0ZmsMiy8EPwNlxbYR-csKyRP-sBichAbO8-Pw05JxGamhDsCQHBgwFPjviaVLxvxswmxfEGA1VU0bEcY5e32DwP61lLa2_4AcVqjYflzTqD6Q",
          waktu: "Contoh Laporan • Senayan",
          pelapor: "Admin",
          isMock: true,
        },
      ];

  return (
    <>
      <Header />
      <main className="pt-16 pb-24 md:pb-0">
        {/* Hero Section */}
        <section className="relative min-h-[751px] flex items-center overflow-hidden bg-[var(--color-surface-container-low)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
          <div className="container mx-auto max-w-[1200px] relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)] px-4 py-1 rounded-full text-[14px] leading-[20px] font-semibold font-[family-name:var(--font-inter)]">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                Layanan Resmi DLH
              </div>
              <h1 className="text-[28px] leading-[36px] md:text-[32px] md:leading-[40px] font-bold text-[var(--color-on-surface)] leading-tight font-[family-name:var(--font-plus-jakarta-sans)]">
                Laporkan Permasalahan Lingkungan dengan Mudah
              </h1>
              <p className="text-[18px] leading-[28px] text-[var(--color-on-surface-variant)] max-w-lg font-[family-name:var(--font-inter)]">
                Platform resmi Dinas Lingkungan Hidup untuk menerima dan menindaklanjuti laporan masyarakat demi lingkungan yang lebih asri dan berkelanjutan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/laporan/buat" className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-8 py-4 rounded-xl text-[14px] leading-[20px] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-primary-container)] transition-all active:scale-95 shadow-lg">
                  <span className="material-symbols-outlined">add_circle</span>
                  Buat Laporan
                </Link>
                <Link href="/lacak" className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-8 py-4 rounded-xl text-[14px] leading-[20px] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)]/5 transition-all active:scale-95">
                  <span className="material-symbols-outlined">search</span>
                  Lacak Laporan
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-2xl relative">
                <img className="object-cover w-full h-full" alt="Lush urban park in Indonesia" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO_L6_PTdhiCWFuzsOYUC965R2_ZXUtej-GmZuyjzIBhdsh6iZix-rTY70wncscFy6sS8kf-vttVe99yirwXlMKf_MsNii_eyhkkPSexNnKYd9OFxzdWGoTIDjKOuT6YYq0jcJcBD0zGJoD_TxO9UdI457sA1h_oRm4wqcdMrhtqoQE_fi6bTcJJuX0Mzv9kAdh1kwTeyyjLYngti1Hk7uDbxlw5NnD59cdYqqrP5JoVM9hoPNldBoHtgzC9wZc-oMqj6uE4bEDg"/>
                <div className="absolute bottom-6 left-6 right-6 glass-card p-6 rounded-xl border border-white/20 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-[var(--color-primary-container)] p-3 rounded-full">
                      <span className="material-symbols-outlined text-white">eco</span>
                    </div>
                    <div>
                      <p className="text-[var(--color-on-surface)] font-bold text-[14px] leading-[20px]">Lingkungan Sehat</p>
                      <p className="text-[var(--color-on-surface-variant)] text-[12px] leading-[16px]">Bersama kita jaga kota kita.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--color-tertiary-fixed-dim)] rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--color-secondary-fixed-dim)] rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </section>

        {/* Statistics Bento Grid */}
        <section className="py-[48px] bg-[var(--color-surface)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
          <div className="container mx-auto max-w-[1200px]">
            <div className="bento-grid">
              <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-sm border border-[var(--color-outline-variant)] flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-[24px]">assignment</span>
                <div>
                  <p className="text-[24px] leading-[32px] font-bold text-[var(--color-on-surface)]">
                    {hasReports ? totalLaporan.toLocaleString('id-ID') : "1.248"}
                  </p>
                  <p className="text-[var(--color-on-surface-variant)] text-[14px] leading-[20px]">Total Laporan</p>
                </div>
              </div>
              <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-sm border border-[var(--color-outline-variant)] flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-[var(--color-primary-container)] text-[24px]">check_circle</span>
                <div>
                  <p className="text-[24px] leading-[32px] font-bold text-[var(--color-on-surface)]">
                    {hasReports ? laporanSelesai.toLocaleString('id-ID') : "942"}
                  </p>
                  <p className="text-[var(--color-on-surface-variant)] text-[14px] leading-[20px]">Laporan Selesai</p>
                </div>
              </div>
              <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-sm border border-[var(--color-outline-variant)] flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-[var(--color-secondary)] text-[24px]">pending</span>
                <div>
                  <p className="text-[24px] leading-[32px] font-bold text-[var(--color-on-surface)]">
                    {hasReports ? laporanDiproses.toLocaleString('id-ID') : "156"}
                  </p>
                  <p className="text-[var(--color-on-surface-variant)] text-[14px] leading-[20px]">Laporan Diproses</p>
                </div>
              </div>
              <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-sm border border-[var(--color-outline-variant)] flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-[var(--color-tertiary)] text-[24px]">groups</span>
                <div>
                  <p className="text-[24px] leading-[32px] font-bold text-[var(--color-on-surface)]">
                    {totalWarga > 0 ? (5000 + totalWarga).toLocaleString('id-ID') : "5.000+"}
                  </p>
                  <p className="text-[var(--color-on-surface-variant)] text-[14px] leading-[20px]">Masyarakat Terlayani</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-[48px] bg-[var(--color-surface-container-low)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] overflow-hidden">
          <div className="container mx-auto max-w-[1200px]">
            <div className="text-center mb-16">
              <h2 className="text-[24px] leading-[32px] font-bold text-[var(--color-on-surface)] mb-4 font-[family-name:var(--font-plus-jakarta-sans)]">Cara Kerja SIPLING</h2>
              <p className="text-[16px] leading-[24px] text-[var(--color-on-surface-variant)] max-w-2xl mx-auto">Proses penanganan laporan yang transparan dan terukur untuk kepuasan masyarakat.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-[var(--color-outline-variant)] z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-[var(--color-surface-container-lowest)] rounded-2xl flex items-center justify-center shadow-lg mb-6 border-2 border-transparent group-hover:border-[var(--color-primary)] transition-all duration-300">
                  <span className="material-symbols-outlined text-[32px] text-[var(--color-primary)]">edit_note</span>
                </div>
                <h3 className="text-[14px] leading-[20px] font-bold text-[var(--color-on-surface)] mb-2">1. Buat Laporan</h3>
                <p className="text-[14px] leading-[20px] text-[var(--color-on-surface-variant)]">Lengkapi data dan lokasi permasalahan lingkungan.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-[var(--color-surface-container-lowest)] rounded-2xl flex items-center justify-center shadow-lg mb-6 border-2 border-transparent group-hover:border-[var(--color-primary)] transition-all duration-300">
                  <span className="material-symbols-outlined text-[32px] text-[var(--color-primary)]">fact_check</span>
                </div>
                <h3 className="text-[14px] leading-[20px] font-bold text-[var(--color-on-surface)] mb-2">2. Verifikasi</h3>
                <p className="text-[14px] leading-[20px] text-[var(--color-on-surface-variant)]">Admin akan memverifikasi keaslian dan detail laporan Anda.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-[var(--color-surface-container-lowest)] rounded-2xl flex items-center justify-center shadow-lg mb-6 border-2 border-transparent group-hover:border-[var(--color-primary)] transition-all duration-300">
                  <span className="material-symbols-outlined text-[32px] text-[var(--color-primary)]">construction</span>
                </div>
                <h3 className="text-[14px] leading-[20px] font-bold text-[var(--color-on-surface)] mb-2">3. Penanganan</h3>
                <p className="text-[14px] leading-[20px] text-[var(--color-on-surface-variant)]">Petugas lapangan diterjunkan untuk menyelesaikan masalah.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-[var(--color-surface-container-lowest)] rounded-2xl flex items-center justify-center shadow-lg mb-6 border-2 border-transparent group-hover:border-[var(--color-primary)] transition-all duration-300">
                  <span className="material-symbols-outlined text-[32px] text-[var(--color-primary)]">task_alt</span>
                </div>
                <h3 className="text-[14px] leading-[20px] font-bold text-[var(--color-on-surface)] mb-2">4. Selesai</h3>
                <p className="text-[14px] leading-[20px] text-[var(--color-on-surface-variant)]">Laporan selesai dan Anda akan menerima notifikasi hasil.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Reports Section */}
        <section className="py-[48px] bg-[var(--color-surface)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
          <div className="container mx-auto max-w-[1200px]">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-[24px] leading-[32px] font-bold text-[var(--color-on-surface)] font-[family-name:var(--font-plus-jakarta-sans)]">Laporan Terbaru</h2>
                <p className="text-[16px] leading-[24px] text-[var(--color-on-surface-variant)]">Pantau penanganan laporan di sekitar Anda secara real-time.</p>
              </div>
              <Link href="/lacak" className="hidden md:flex text-[var(--color-primary)] font-bold items-center gap-1 hover:underline">
                Lihat Semua <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentLaporan.map((item) => (
                <div key={item.id} className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-sm border border-[var(--color-outline-variant)] overflow-hidden group hover:shadow-md transition-all flex flex-col h-full">
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={item.kategori} 
                      src={item.image} 
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[12px] leading-[16px] font-bold ${
                      item.status === "Selesai" 
                        ? "bg-green-500/15 text-green-700 border border-green-500/20" 
                        : item.status === "Proses" 
                          ? "bg-blue-500/15 text-blue-700 border border-blue-500/20" 
                          : "bg-yellow-500/15 text-yellow-700 border border-yellow-500/20"
                    }`}>
                      {item.status}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <p className="text-[var(--color-on-surface-variant)] text-[12px] leading-[16px] mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {item.waktu}
                      </p>
                      <h3 className="text-[16px] leading-[24px] font-bold text-[var(--color-on-surface)] mb-2 font-[family-name:var(--font-plus-jakarta-sans)] line-clamp-1">
                        {item.kategori} di {item.lokasi.split(",")[0]}
                      </h3>
                      <p className="text-[14px] leading-[20px] text-[var(--color-on-surface-variant)] line-clamp-2">
                        {item.deskripsi}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)] flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)] flex items-center justify-center font-bold text-[11px] uppercase">
                          {item.pelapor.slice(0, 2)}
                        </div>
                        <span className="text-[12px] text-[var(--color-on-surface-variant)] font-medium">
                          Oleh {item.pelapor}
                        </span>
                      </div>
                      <Link 
                        href={item.isMock ? `/lacak` : `/lacak?id=${item.id}`} 
                        className="text-[12px] leading-[16px] font-bold text-[var(--color-primary)] hover:underline flex items-center gap-0.5"
                      >
                        Lacak Detail
                        <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-[48px] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
          <div className="container mx-auto max-w-[1200px] bg-[var(--color-primary-container)] rounded-3xl p-12 text-center text-[var(--color-on-primary-container)] overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-[32px] leading-[40px] font-bold mb-4 font-[family-name:var(--font-plus-jakarta-sans)]">Mari Berpartisipasi Jaga Lingkungan</h2>
              <p className="text-[18px] leading-[28px] mb-8 max-w-2xl mx-auto opacity-90 font-[family-name:var(--font-inter)]">Setiap laporan Anda adalah langkah nyata menuju kota yang lebih bersih, sehat, dan nyaman untuk masa depan.</p>
              <Link href="/laporan/buat" className="bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] px-10 py-4 rounded-xl font-bold hover:bg-[var(--color-surface)] transition-all active:scale-95 shadow-xl inline-flex items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Mulai Laporan Sekarang
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
