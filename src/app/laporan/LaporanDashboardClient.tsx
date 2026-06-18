"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface ReportItem {
  id: string;
  kategori: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  foto: string[];
  createdAt: string;
  createdAtRaw: string;
  updatedAt: string;
  pelapor: string;
}

interface LaporanDashboardClientProps {
  initialReports: ReportItem[];
  citizenName: string;
}

const categoryNames: Record<string, string> = {
  sampah: "Penumpukan Sampah",
  drainase: "Drainase / Saluran Air",
  pohon: "Pohon Rawan Tumbang",
  udara: "Pencemaran Udara / Asap",
  lainnya: "Laporan Lainnya",
};

const categoryImages: Record<string, string> = {
  sampah: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
  drainase: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
  pohon: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
  udara: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80",
  lainnya: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
};

function LaporanDashboardContent({ initialReports, citizenName }: LaporanDashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [reports] = useState<ReportItem[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [zoomPhoto, setZoomPhoto] = useState<string | null>(null);

  // Sync with search parameter `?id=...`
  useEffect(() => {
    const reportId = searchParams.get("id");
    if (reportId && reports.some(r => r.id === reportId)) {
      setActiveReportId(reportId);
    } else {
      setActiveReportId(null);
    }
  }, [searchParams, reports]);

  const handleOpenDetail = (id: string) => {
    setActiveReportId(id);
    const params = new URLSearchParams(window.location.search);
    params.set("id", id);
    router.replace(`/laporan?${params.toString()}`);
  };

  const handleCloseDetail = () => {
    setActiveReportId(null);
    const params = new URLSearchParams(window.location.search);
    params.delete("id");
    router.replace(`/laporan`);
  };

  // Stats for the logged in user
  const totalLaporan = reports.length;
  const totalVerifikasi = reports.filter(r => r.status === "Verifikasi").length;
  const totalProses = reports.filter(r => r.status === "Proses").length;
  const totalSelesai = reports.filter(r => r.status === "Selesai").length;

  const filteredReports = reports.filter((item) => {
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const matchesSearch = 
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categoryNames[item.kategori] || item.kategori).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeReport = reports.find(r => r.id === activeReportId);

  return (
    <main className="pt-24 pb-24 min-h-screen bg-[var(--color-surface-container-low)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] font-[family-name:var(--font-inter)]">
      <div className="container mx-auto max-w-[1200px] space-y-8">
        
        {/* Welcome Dashboard Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-bold text-[var(--color-on-surface)] font-[family-name:var(--font-plus-jakarta-sans)] mb-1">
              Laporan Saya
            </h1>
            <p className="text-[16px] leading-[24px] text-[var(--color-on-surface-variant)]">
              Halo <span className="text-[var(--color-primary)] font-bold">{citizenName}</span>, pantau perkembangan laporan yang telah Anda kirimkan.
            </p>
          </div>
          <Link 
            href="/laporan/buat" 
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white px-6 py-3 rounded-xl text-[14px] font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Buat Laporan Baru
          </Link>
        </div>

        {/* Stats Bento Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
            <div className="w-10 h-10 bg-[var(--color-surface-variant)] rounded-xl flex items-center justify-center text-[var(--color-on-surface-variant)] mb-3">
              <span className="material-symbols-outlined">assignment</span>
            </div>
            <p className="text-[28px] font-bold text-[var(--color-on-surface)] leading-none mb-1">{totalLaporan}</p>
            <p className="text-[12px] font-semibold text-[var(--color-on-surface-variant)]">Total Laporan Saya</p>
          </div>
          
          <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 mb-3">
              <span className="material-symbols-outlined">pending</span>
            </div>
            <p className="text-[28px] font-bold text-[var(--color-on-surface)] leading-none mb-1">{totalVerifikasi}</p>
            <p className="text-[12px] font-semibold text-[var(--color-on-surface-variant)]">Verifikasi</p>
          </div>

          <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mb-3">
              <span className="material-symbols-outlined">construction</span>
            </div>
            <p className="text-[28px] font-bold text-[var(--color-on-surface)] leading-none mb-1">{totalProses}</p>
            <p className="text-[12px] font-semibold text-[var(--color-on-surface-variant)]">Diproses</p>
          </div>

          <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 mb-3">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <p className="text-[28px] font-bold text-[var(--color-on-surface)] leading-none mb-1">{totalSelesai}</p>
            <p className="text-[12px] font-semibold text-[var(--color-on-surface-variant)]">Selesai</p>
          </div>

        </div>

        {/* Filter and Search Panel */}
        <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-2xl shadow-sm border border-[var(--color-outline-variant)] flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">search</span>
            <input 
              type="text" 
              placeholder="Cari deskripsi, lokasi, nomor laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-surface-bright)] text-[14px]"
            />
          </div>

          <div className="flex border border-[var(--color-outline-variant)] p-1 rounded-xl bg-[var(--color-surface-bright)] w-full md:w-auto overflow-x-auto">
            {["All", "Verifikasi", "Proses", "Selesai"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap flex-grow md:flex-grow-0 ${
                  filterStatus === status 
                    ? "bg-[var(--color-primary)] text-white shadow-sm" 
                    : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50"
                }`}
              >
                {status === "All" ? "Semua Laporan" : status}
              </button>
            ))}
          </div>

        </div>

        {/* Reports Feed */}
        {filteredReports.length === 0 ? (
          <div className="bg-[var(--color-surface-container-lowest)] p-16 rounded-3xl border border-[var(--color-outline-variant)] text-center shadow-sm max-w-xl mx-auto">
            <span className="material-symbols-outlined text-[64px] text-[var(--color-on-surface-variant)] opacity-40 mb-4">rate_review</span>
            <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] mb-2 font-[family-name:var(--font-plus-jakarta-sans)]">
              Belum Ada Laporan
            </h3>
            <p className="text-[14px] text-[var(--color-on-surface-variant)] opacity-85 mb-6">
              {searchTerm 
                ? "Laporan Anda tidak cocok dengan filter pencarian saat ini." 
                : "Anda belum mengirimkan laporan keluhan lingkungan. Mari berkontribusi menjaga kelestarian lingkungan dengan mengirim laporan baru."}
            </p>
            {!searchTerm && (
              <Link 
                href="/laporan/buat" 
                className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-container)] transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Mulai Laporan Pertama
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredReports.map((item) => {
              const displayImage = item.foto.length > 0 ? item.foto[0] : (categoryImages[item.kategori] || categoryImages.lainnya);
              const readableCategory = categoryNames[item.kategori] || item.kategori;

              return (
                <div key={item.id} className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-sm border border-[var(--color-outline-variant)] overflow-hidden group hover:shadow-md transition-all flex flex-col h-full">
                  
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={readableCategory} 
                      src={displayImage} 
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
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {item.createdAt}
                      </p>
                      
                      <h3 className="text-[16px] leading-[24px] font-bold text-[var(--color-on-surface)] mb-2 font-[family-name:var(--font-plus-jakarta-sans)] line-clamp-1">
                        {readableCategory}
                      </h3>
                      
                      <p className="text-[13px] leading-[18px] text-[var(--color-on-surface-variant)] mb-3 flex items-start gap-0.5">
                        <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">location_on</span>
                        <span className="line-clamp-1 font-medium">{item.lokasi}</span>
                      </p>

                      <p className="text-[14px] leading-[20px] text-[var(--color-on-surface-variant)] line-clamp-2 mb-4">
                        {item.deskripsi}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-outline-variant)] flex justify-between items-center">
                      <span className="text-[10px] bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                        #{item.id.slice(0, 8)}
                      </span>

                      <button 
                        onClick={() => handleOpenDetail(item.id)}
                        className="text-[12px] leading-[16px] font-bold text-[var(--color-primary)] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Lacak Detail
                        <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Timeline Modal Details */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-[var(--color-surface-container-lowest)] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-outline-variant)] max-h-[90vh] flex flex-col animate-scale-in">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-bright)] flex justify-between items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] mb-2">
                  {categoryNames[activeReport.kategori] || activeReport.kategori}
                </span>
                <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] leading-tight font-[family-name:var(--font-plus-jakarta-sans)]">
                  Lacak Detail Laporan #{activeReport.id.slice(0, 8)}
                </h3>
              </div>
              <button 
                onClick={handleCloseDetail}
                className="w-10 h-10 rounded-full hover:bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
              
              {/* Information */}
              <div className="space-y-4 bg-[var(--color-surface-container-low)] p-5 rounded-2xl border border-[var(--color-outline-variant)]">
                
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <p className="text-[var(--color-on-surface-variant)] font-semibold">Pelapor</p>
                    <p className="font-bold text-[var(--color-on-surface)]">{citizenName}</p>
                  </div>
                  <div>
                    <p className="text-[var(--color-on-surface-variant)] font-semibold">Tanggal Kirim</p>
                    <p className="font-bold text-[var(--color-on-surface)]">{activeReport.createdAt}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> Lokasi Kejadian
                  </p>
                  <p className="font-bold text-[var(--color-on-surface)] text-[14px]">{activeReport.lokasi}</p>
                </div>

                <div>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] font-semibold">Deskripsi Keluhan</p>
                  <p className="text-[14px] text-[var(--color-on-surface)] leading-[22px] whitespace-pre-line bg-[var(--color-surface-container-lowest)] p-4 rounded-xl border border-[var(--color-outline-variant)]">
                    {activeReport.deskripsi}
                  </p>
                </div>

                {/* Photos */}
                {activeReport.foto.length > 0 && (
                  <div>
                    <p className="text-[13px] text-[var(--color-on-surface-variant)] font-semibold mb-2">Lampiran Foto Anda</p>
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {activeReport.foto.map((url, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setZoomPhoto(url)}
                          className="w-24 h-24 rounded-xl overflow-hidden border border-[var(--color-outline-variant)] shadow-sm cursor-zoom-in hover:opacity-85 transition-opacity flex-shrink-0 bg-black flex items-center justify-center relative"
                        >
                          <img src={url} alt="Aduan saya" className="object-cover w-full h-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Timeline Linimasa */}
              <div className="space-y-4">
                <h4 className="text-[16px] font-bold text-[var(--color-on-surface)] font-[family-name:var(--font-plus-jakarta-sans)] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-primary)]">timeline</span>
                  Progres Tindak Lanjut Dinas
                </h4>

                <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--color-outline-variant)]">
                  
                  {/* Step 1: Diterima */}
                  <div className="relative">
                    <span className="absolute left-[-29px] top-0.5 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center shadow">
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    </span>
                    <div>
                      <h5 className="text-[14px] font-bold text-[var(--color-on-surface)] flex justify-between items-center">
                        Laporan Diterima (Verifikasi)
                        <span className="text-[11px] font-medium text-[var(--color-on-surface-variant)]">{activeReport.createdAt}</span>
                      </h5>
                      <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-1">
                        Aduan Anda berhasil diunggah ke database SIPLING Dinas Lingkungan Hidup. Admin sedang melakukan verifikasi data pelapor, lokasi, dan deskripsi kejadian.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Proses */}
                  <div className="relative">
                    {activeReport.status === "Proses" || activeReport.status === "Selesai" ? (
                      <span className="absolute left-[-29px] top-0.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow animate-pulse">
                        <span className="material-symbols-outlined text-[14px] font-bold">engineering</span>
                      </span>
                    ) : (
                      <span className="absolute left-[-29px] top-0.5 w-6 h-6 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)] flex items-center justify-center shadow">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      </span>
                    )}
                    <div>
                      <h5 className="text-[14px] font-bold text-[var(--color-on-surface)] flex justify-between items-center">
                        Laporan Terverifikasi & Diproses
                        {(activeReport.status === "Proses" || activeReport.status === "Selesai") && (
                          <span className="text-[11px] font-medium text-[var(--color-on-surface-variant)]">{activeReport.updatedAt}</span>
                        )}
                      </h5>
                      <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-1">
                        Tinjauan awal selesai. Dinas Lingkungan Hidup telah memvalidasi laporan dan menugaskan tim lapangan serta fasilitas kebersihan/teknis ke lokasi aduan.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Selesai */}
                  <div className="relative">
                    {activeReport.status === "Selesai" ? (
                      <span className="absolute left-[-29px] top-0.5 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center shadow">
                        <span className="material-symbols-outlined text-[14px] font-bold">done_all</span>
                      </span>
                    ) : (
                      <span className="absolute left-[-29px] top-0.5 w-6 h-6 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)] flex items-center justify-center shadow">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      </span>
                    )}
                    <div>
                      <h5 className="text-[14px] font-bold text-[var(--color-on-surface)] flex justify-between items-center">
                        Penanganan Selesai (Selesai)
                        {activeReport.status === "Selesai" && (
                          <span className="text-[11px] font-medium text-[var(--color-on-surface-variant)]">{activeReport.updatedAt}</span>
                        )}
                      </h5>
                      <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-1">
                        Pekerjaan lapangan dinyatakan selesai secara paripurna. Lokasi kejadian kini bersih dari pencemaran/hambatan, mengembalikan kelestarian lingkungan sekitar.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-bright)] flex justify-end">
              <button 
                onClick={handleCloseDetail}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow active:scale-98 text-[14px] cursor-pointer"
              >
                Tutup Pelacakan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Lightbox zoom photo */}
      {zoomPhoto && (
        <div 
          onClick={() => setZoomPhoto(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
            <img src={zoomPhoto} alt="Zoomed Photo" className="max-w-full max-h-[85vh] object-contain" />
            <button 
              onClick={() => setZoomPhoto(null)}
              className="absolute top-4 right-4 bg-black/60 text-white hover:bg-black/90 p-2 rounded-full flex items-center justify-center transition-colors shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
      )}

    </main>
  );
}

export default function LaporanDashboardClient(props: LaporanDashboardClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-surface)]">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--color-on-surface-variant)] text-[16px] font-semibold">Memuat Dasbor Laporan...</p>
      </div>
    }>
      <LaporanDashboardContent {...props} />
    </Suspense>
  );
}
