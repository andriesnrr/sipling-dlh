"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface LaporanItem {
  id: string;
  kategori: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  foto: string[];
  userId: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
}

interface AdminDashboardClientProps {
  initialLaporan: LaporanItem[];
  adminName: string;
}

export default function AdminDashboardClient({ initialLaporan, adminName }: AdminDashboardClientProps) {
  const [laporan, setLaporan] = useState<LaporanItem[]>(initialLaporan);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Stats
  const totalLaporan = laporan.length;
  const totalVerifikasi = laporan.filter(l => l.status === "Verifikasi").length;
  const totalProses = laporan.filter(l => l.status === "Proses").length;
  const totalSelesai = laporan.filter(l => l.status === "Selesai").length;

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/laporan/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Gagal memperbarui status.");
      } else {
        setLaporan(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredLaporan = laporan.filter(item => {
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const matchesSearch = item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.kategori.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--color-surface-container-low)] font-[family-name:var(--font-inter)] text-[var(--color-on-surface)]">
      {/* Admin Topbar */}
      <header className="fixed top-0 z-50 w-full bg-[var(--color-surface)] shadow-sm h-16">
        <div className="container mx-auto max-w-[1200px] h-full flex justify-between items-center px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            </div>
            <div>
              <h1 className="text-[18px] md:text-[20px] font-bold text-[var(--color-primary)] font-[family-name:var(--font-plus-jakarta-sans)] leading-none mb-1">SIPLING ADMIN</h1>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wider font-semibold">Pemerintah Kabupaten Gresik</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-[14px] font-semibold text-[var(--color-on-surface-variant)]">
              Halo, <span className="text-[var(--color-primary)] font-bold">{adminName}</span>
            </span>
            <button 
              onClick={() => {
                localStorage.removeItem("sipling_user_role");
                signOut({ callbackUrl: "/auth" });
              }}
              className="flex items-center gap-1 bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all px-4 py-2 rounded-xl text-[14px] leading-[20px] font-semibold active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-28 md:pb-16 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <div className="container mx-auto max-w-[1200px] space-y-8">
          
          {/* Dashboard Header */}
          <div>
            <h2 className="text-[28px] md:text-[32px] font-bold text-[var(--color-on-surface)] font-[family-name:var(--font-plus-jakarta-sans)] mb-1">Manajemen Pengaduan Lingkungan</h2>
            <p className="text-[16px] text-[var(--color-on-surface-variant)]">Verifikasi dan tindak lanjuti laporan warga Kabupaten Gresik secara real-time.</p>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
              <div className="w-10 h-10 bg-[var(--color-surface-variant)] rounded-xl flex items-center justify-center text-[var(--color-on-surface-variant)] mb-3">
                <span className="material-symbols-outlined">assignment</span>
              </div>
              <p className="text-[28px] font-bold text-[var(--color-on-surface)] leading-none mb-1">{totalLaporan}</p>
              <p className="text-[12px] font-semibold text-[var(--color-on-surface-variant)]">Total Aduan</p>
            </div>
            
            <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 mb-3">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
              </div>
              <p className="text-[28px] font-bold text-[var(--color-on-surface)] leading-none mb-1">{totalVerifikasi}</p>
              <p className="text-[12px] font-semibold text-[var(--color-on-surface-variant)]">Menunggu Verifikasi</p>
            </div>

            <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>construction</span>
              </div>
              <p className="text-[28px] font-bold text-[var(--color-on-surface)] leading-none mb-1">{totalProses}</p>
              <p className="text-[12px] font-semibold text-[var(--color-on-surface-variant)]">Sedang Diproses</p>
            </div>

            <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 mb-3">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <p className="text-[28px] font-bold text-[var(--color-on-surface)] leading-none mb-1">{totalSelesai}</p>
              <p className="text-[12px] font-semibold text-[var(--color-on-surface-variant)]">Laporan Selesai</p>
            </div>
          </div>

          {/* Filters & Actions Panel */}
          <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-2xl shadow-sm border border-[var(--color-outline-variant)] flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">search</span>
              <input 
                type="text" 
                placeholder="Cari deskripsi, lokasi, pelapor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-surface-bright)] text-[14px]"
              />
            </div>

            {/* Status Filter Tab Buttons */}
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
                  {status === "All" ? "Semua" : status}
                </button>
              ))}
            </div>
          </div>

          {/* Reports Table / Card List */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-sm border border-[var(--color-outline-variant)] overflow-hidden">
            {filteredLaporan.length === 0 ? (
              <div className="py-16 text-center">
                <span className="material-symbols-outlined text-[48px] text-[var(--color-on-surface-variant)] opacity-40 mb-3">folder_open</span>
                <p className="text-[16px] font-semibold text-[var(--color-on-surface-variant)]">Tidak ada laporan ditemukan</p>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] opacity-70">Coba ganti filter atau kata kunci pencarian Anda.</p>
              </div>
            ) : (
              <>
                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-bright)]">
                        <th className="p-4 text-[13px] font-bold text-[var(--color-on-surface-variant)] tracking-wider">Tanggal & Pelapor</th>
                        <th className="p-4 text-[13px] font-bold text-[var(--color-on-surface-variant)] tracking-wider">Kategori & Deskripsi</th>
                        <th className="p-4 text-[13px] font-bold text-[var(--color-on-surface-variant)] tracking-wider">Lokasi</th>
                        <th className="p-4 text-[13px] font-bold text-[var(--color-on-surface-variant)] tracking-wider">Lampiran</th>
                        <th className="p-4 text-[13px] font-bold text-[var(--color-on-surface-variant)] tracking-wider">Status</th>
                        <th className="p-4 text-[13px] font-bold text-[var(--color-on-surface-variant)] tracking-wider text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-outline-variant)]">
                      {filteredLaporan.map((item) => (
                        <tr key={item.id} className="hover:bg-[var(--color-surface-bright)]/30 transition-colors">
                          {/* Reporter & Date */}
                          <td className="p-4 align-top">
                            <p className="text-[12px] text-[var(--color-on-surface-variant)] mb-1">{item.createdAt}</p>
                            <p className="font-bold text-[14px] text-[var(--color-on-surface)]">{item.user.name}</p>
                            <p className="text-[12px] text-[var(--color-on-surface-variant)]">{item.user.email}</p>
                            {item.user.phone && <p className="text-[12px] text-[var(--color-primary)] font-semibold">{item.user.phone}</p>}
                          </td>

                          {/* Category & Description */}
                          <td className="p-4 align-top max-w-sm">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] mb-2">
                              {item.kategori}
                            </span>
                            <p className="text-[14px] leading-[22px] text-[var(--color-on-surface)] whitespace-pre-line">{item.deskripsi}</p>
                          </td>

                          {/* Location */}
                          <td className="p-4 align-top">
                            <div className="flex items-start gap-1 text-[13px] leading-[18px]">
                              <span className="material-symbols-outlined text-[var(--color-primary)] text-[16px] mt-0.5">location_on</span>
                              <span className="text-[var(--color-on-surface)] font-medium">{item.lokasi}</span>
                            </div>
                          </td>

                          {/* Attachments */}
                          <td className="p-4 align-top">
                            {item.foto.length === 0 ? (
                              <span className="text-[12px] text-[var(--color-on-surface-variant)] italic">Tidak ada foto</span>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {item.foto.map((url, idx) => (
                                  <div 
                                    key={idx} 
                                    onClick={() => setPreviewPhoto(url)}
                                    className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--color-outline-variant)] shadow-sm cursor-zoom-in hover:opacity-85 transition-opacity bg-black flex items-center justify-center relative"
                                  >
                                    <img src={url} alt="Attachment" className="object-cover w-full h-full" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Status badge */}
                          <td className="p-4 align-top">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold ${
                              item.status === "Selesai" 
                                ? "bg-green-500/15 text-green-700" 
                                : item.status === "Proses" 
                                  ? "bg-blue-500/15 text-blue-700" 
                                  : "bg-yellow-500/15 text-yellow-700"
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {item.status}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-4 align-top text-right">
                            <div className="flex justify-end gap-1.5">
                              {updatingId === item.id ? (
                                <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin my-1 mx-4"></div>
                              ) : (
                                <>
                                  {item.status !== "Verifikasi" && (
                                    <button
                                      onClick={() => handleUpdateStatus(item.id, "Verifikasi")}
                                      className="p-2 bg-[var(--color-surface-variant)] hover:bg-[var(--color-surface-dim)] text-[var(--color-on-surface-variant)] rounded-xl transition-colors active:scale-95"
                                      title="Set status Verifikasi"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">undo</span>
                                    </button>
                                  )}
                                  {item.status !== "Proses" && (
                                    <button
                                      onClick={() => handleUpdateStatus(item.id, "Proses")}
                                      className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white rounded-xl transition-colors active:scale-95"
                                      title="Tindak Lanjuti (Proses)"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">engineering</span>
                                    </button>
                                  )}
                                  {item.status !== "Selesai" && (
                                    <button
                                      onClick={() => handleUpdateStatus(item.id, "Selesai")}
                                      className="p-2 bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-white rounded-xl transition-colors active:scale-95"
                                      title="Selesaikan Laporan (Selesai)"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="md:hidden divide-y divide-[var(--color-outline-variant)]">
                  {filteredLaporan.map((item) => (
                    <div key={item.id} className="p-5 space-y-4">
                      {/* Header: Category & ID */}
                      <div className="flex justify-between items-start">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]">
                          {item.kategori}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider bg-[var(--color-surface-variant)] px-2 py-0.5 rounded">
                          #{item.id.slice(0, 8)}
                        </span>
                      </div>

                      {/* Date & Reporter */}
                      <div className="space-y-0.5 text-[13px]">
                        <p className="text-[11px] text-[var(--color-on-surface-variant)]">{item.createdAt}</p>
                        <p className="font-bold text-[var(--color-on-surface)]">{item.user.name}</p>
                        <p className="text-[12px] text-[var(--color-on-surface-variant)]">{item.user.email}</p>
                        {item.user.phone && <p className="text-[12px] text-[var(--color-primary)] font-semibold">{item.user.phone}</p>}
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-1 text-[13px] leading-[18px]">
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-[16px] mt-0.5">location_on</span>
                        <span className="text-[var(--color-on-surface)] font-semibold">{item.lokasi}</span>
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-[14px] leading-[22px] text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] p-3 rounded-xl border border-[var(--color-outline-variant)] whitespace-pre-line">
                          {item.deskripsi}
                        </p>
                      </div>

                      {/* Lampiran Foto */}
                      {item.foto.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.foto.map((url, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => setPreviewPhoto(url)}
                              className="w-14 h-14 rounded-lg overflow-hidden border border-[var(--color-outline-variant)] shadow-sm cursor-zoom-in hover:opacity-85 transition-opacity bg-black flex items-center justify-center relative"
                            >
                              <img src={url} alt="Attachment" className="object-cover w-full h-full" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Status & Actions */}
                      <div className="flex justify-between items-center pt-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold ${
                          item.status === "Selesai" 
                            ? "bg-green-500/15 text-green-700" 
                            : item.status === "Proses" 
                              ? "bg-blue-500/15 text-blue-700" 
                              : "bg-yellow-500/15 text-yellow-700"
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {item.status}
                        </span>

                        <div className="flex gap-1.5">
                          {updatingId === item.id ? (
                            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin my-1 mx-4"></div>
                          ) : (
                            <>
                              {item.status !== "Verifikasi" && (
                                <button
                                  onClick={() => handleUpdateStatus(item.id, "Verifikasi")}
                                  className="p-2 bg-[var(--color-surface-variant)] hover:bg-[var(--color-surface-dim)] text-[var(--color-on-surface-variant)] rounded-xl transition-colors active:scale-95"
                                  title="Set status Verifikasi"
                                >
                                  <span className="material-symbols-outlined text-[18px]">undo</span>
                                </button>
                              )}
                              {item.status !== "Proses" && (
                                <button
                                  onClick={() => handleUpdateStatus(item.id, "Proses")}
                                  className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white rounded-xl transition-colors active:scale-95"
                                  title="Tindak Lanjuti (Proses)"
                                >
                                  <span className="material-symbols-outlined text-[18px]">engineering</span>
                                </button>
                              )}
                              {item.status !== "Selesai" && (
                                <button
                                  onClick={() => handleUpdateStatus(item.id, "Selesai")}
                                  className="p-2 bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-white rounded-xl transition-colors active:scale-95"
                                  title="Selesaikan Laporan (Selesai)"
                                >
                                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Image Preview Overlay Modal */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
            <img src={previewPhoto} alt="Zoomed Preview" className="max-w-full max-h-[85vh] object-contain" />
            <button 
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 bg-black/60 text-white hover:bg-black/90 p-2 rounded-full flex items-center justify-center transition-colors shadow"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
