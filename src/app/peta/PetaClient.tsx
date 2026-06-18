"use client";

import { useState } from "react";
import Link from "next/link";

interface ReportPin {
  id: string;
  kategori: string;
  kategoriReadable: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  foto: string[];
  lat: number;
  lng: number;
  kecamatan: string;
  pelapor: string;
  createdAt: string;
}

interface PetaClientProps {
  initialReports: ReportPin[];
}

const categoryIcons: Record<string, string> = {
  sampah: "delete",
  drainase: "water_drop",
  pohon: "forest",
  udara: "air",
  lainnya: "help_outline",
};

const categoryImages: Record<string, string> = {
  sampah: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
  drainase: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
  pohon: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
  udara: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80",
  lainnya: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
};

export default function PetaClient({ initialReports }: PetaClientProps) {
  const [reports] = useState<ReportPin[]>(initialReports);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [activeReport, setActiveReport] = useState<ReportPin | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter reports
  const filteredReports = reports.filter((item) => {
    const matchesKecamatan = !selectedKecamatan || item.kecamatan === selectedKecamatan;
    const matchesCategory = selectedCategory === "All" || item.kategori === selectedCategory;
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    const matchesSearch = 
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategoriReadable.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pelapor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesKecamatan && matchesCategory && matchesStatus && matchesSearch;
  });

  // Calculate report counts per district
  const getDistrictCount = (name: string) => {
    return reports.filter(r => r.kecamatan === name).length;
  };

  // Convert lat/lng to responsive pixel coordinates inside our 500x400 SVG box
  // Lat range: -7.15 to -7.18 (mapped to Y: 50 to 350)
  // Lng range: 112.61 to 112.66 (mapped to X: 50 to 450)
  const getSvgCoords = (lat: number, lng: number) => {
    const minLat = -7.15;
    const maxLat = -7.18;
    const minLng = 112.61;
    const maxLng = 112.66;

    const x = 50 + ((lng - minLng) / (maxLng - minLng)) * 400;
    const y = 50 + ((lat - minLat) / (maxLat - minLat)) * 300;
    return { x, y };
  };

  return (
    <main className="pt-20 pb-24 min-h-screen bg-[var(--color-surface-container-low)] font-[family-name:var(--font-inter)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-6">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-[28px] md:text-[36px] font-bold text-[var(--color-on-surface)] font-[family-name:var(--font-plus-jakarta-sans)] leading-tight">
              Peta Sebaran Laporan
            </h1>
            <p className="text-[14px] md:text-[16px] text-[var(--color-on-surface-variant)]">
              Visualisasi sebaran pengaduan masalah lingkungan di wilayah perkotaan Gresik secara real-time.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-[12px] bg-white border border-[var(--color-outline-variant)] px-3 py-1.5 rounded-full font-bold shadow-xs">
              🟢 Manyar: {getDistrictCount("Manyar")}
            </span>
            <span className="text-[12px] bg-white border border-[var(--color-outline-variant)] px-3 py-1.5 rounded-full font-bold shadow-xs">
              🔵 Kebomas: {getDistrictCount("Kebomas")}
            </span>
            <span className="text-[12px] bg-white border border-[var(--color-outline-variant)] px-3 py-1.5 rounded-full font-bold shadow-xs">
              🟠 Gresik Kota: {getDistrictCount("Gresik Kota")}
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Panel: Sidebar Filters & Report Feed */}
          <div className="lg:col-span-4 flex flex-col space-y-4 max-h-[720px] overflow-hidden bg-white p-5 rounded-2xl border border-[var(--color-outline-variant)] shadow-sm">
            
            <h2 className="text-[18px] font-bold font-[family-name:var(--font-plus-jakarta-sans)] text-[var(--color-on-surface)]">
              Filter Laporan
            </h2>

            {/* District Tab selector */}
            <div className="flex gap-1.5 border-b border-[var(--color-outline-variant)] pb-3 overflow-x-auto">
              <button
                onClick={() => { setSelectedKecamatan(null); setActiveReport(null); }}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-colors ${
                  !selectedKecamatan 
                    ? "bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]"
                    : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50"
                }`}
              >
                Semua Wilayah
              </button>
              {["Manyar", "Kebomas", "Gresik Kota"].map((kec) => (
                <button
                  key={kec}
                  onClick={() => { setSelectedKecamatan(kec); setActiveReport(null); }}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-colors ${
                    selectedKecamatan === kec
                      ? "bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]"
                      : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50"
                  }`}
                >
                  {kec}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--color-on-surface-variant)]">search</span>
              <input
                type="text"
                placeholder="Cari deskripsi, jalan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[var(--color-outline-variant)] rounded-xl text-[13px] focus:border-[var(--color-primary)] outline-none bg-[var(--color-surface-bright)]"
              />
            </div>

            {/* Sub-Filters */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-on-surface-variant)] mb-1">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-[var(--color-outline-variant)] rounded-lg text-[12px] outline-none bg-[var(--color-surface-bright)] font-semibold"
                >
                  <option value="All">Semua Kategori</option>
                  <option value="sampah">Sampah</option>
                  <option value="drainase">Drainase</option>
                  <option value="pohon">Pohon Rawan</option>
                  <option value="udara">Pencemaran Udara</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--color-on-surface-variant)] mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-[var(--color-outline-variant)] rounded-lg text-[12px] outline-none bg-[var(--color-surface-bright)] font-semibold"
                >
                  <option value="All">Semua Status</option>
                  <option value="Verifikasi">Verifikasi</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            {/* Results Feed */}
            <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pt-2">
              <p className="text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
                Daftar Laporan ({filteredReports.length})
              </p>
              
              {filteredReports.length === 0 ? (
                <div className="text-center py-12 text-[var(--color-on-surface-variant)] opacity-70">
                  <span className="material-symbols-outlined text-[36px] mb-2 opacity-50">map_find</span>
                  <p className="text-[13px] font-semibold">Tidak ada laporan ditemukan</p>
                </div>
              ) : (
                filteredReports.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setActiveReport(r)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col text-left ${
                      activeReport?.id === r.id
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-xs"
                        : "border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded">
                        {r.kategoriReadable}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === "Selesai"
                          ? "bg-green-100 text-green-700"
                          : r.status === "Proses"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-bold text-[var(--color-on-surface)] line-clamp-1">
                      {r.lokasi.split(",")[0]}
                    </h4>
                    <p className="text-[12px] text-[var(--color-on-surface-variant)] line-clamp-2 mt-1 mb-2">
                      {r.deskripsi}
                    </p>
                    <div className="text-[10px] text-[var(--color-on-surface-variant)] opacity-70 flex justify-between">
                      <span>Oleh: {r.pelapor}</span>
                      <span>{r.createdAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Interactive Visual Map */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[var(--color-outline-variant)] shadow-sm flex flex-col relative h-[500px] lg:h-auto min-h-[500px]">
            
            <h2 className="text-[18px] font-bold font-[family-name:var(--font-plus-jakarta-sans)] text-[var(--color-on-surface)] flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[var(--color-primary)]">my_location</span>
              Peta Kawasan Perkotaan Gresik
            </h2>
            <p className="text-[12px] text-[var(--color-on-surface-variant)] mb-4">
              Klik pada kecamatan untuk memfilter kawasan, atau klik pin untuk melacak aduan secara spasial.
            </p>

            <div className="relative flex-grow w-full flex items-center justify-center bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden shadow-inner select-none">
              
              {/* Core SVG Map */}
              <svg 
                viewBox="0 0 500 400" 
                className="w-full h-full max-h-[420px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="grad-manyar" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d1fae5" />
                    <stop offset="100%" stopColor="#a7f3d0" />
                  </linearGradient>
                  <linearGradient id="grad-kebomas" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dbeafe" />
                    <stop offset="100%" stopColor="#bfdbfe" />
                  </linearGradient>
                  <linearGradient id="grad-gresik-kota" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffedd5" />
                    <stop offset="100%" stopColor="#fed7aa" />
                  </linearGradient>
                </defs>

                {/* District Manyar Path */}
                <path
                  d="M 50,50 L 250,50 L 250,200 L 150,200 L 150,250 L 50,250 Z"
                  fill={selectedKecamatan === "Manyar" ? "#34d399" : "url(#grad-manyar)"}
                  stroke="#10b981"
                  strokeWidth={selectedKecamatan === "Manyar" ? 3 : 1.5}
                  className="cursor-pointer transition-all duration-300 hover:opacity-90"
                  onClick={() => setSelectedKecamatan(selectedKecamatan === "Manyar" ? null : "Manyar")}
                />
                <text x="110" y="120" fill="#065f46" className="text-[12px] font-extrabold pointer-events-none">
                  Kec. Manyar
                </text>

                {/* District Kebomas Path */}
                <path
                  d="M 50,250 L 150,250 L 150,200 L 250,200 L 250,350 L 50,350 Z"
                  fill={selectedKecamatan === "Kebomas" ? "#60a5fa" : "url(#grad-kebomas)"}
                  stroke="#3b82f6"
                  strokeWidth={selectedKecamatan === "Kebomas" ? 3 : 1.5}
                  className="cursor-pointer transition-all duration-300 hover:opacity-90"
                  onClick={() => setSelectedKecamatan(selectedKecamatan === "Kebomas" ? null : "Kebomas")}
                />
                <text x="110" y="300" fill="#1e3a8a" className="text-[12px] font-extrabold pointer-events-none">
                  Kec. Kebomas
                </text>

                {/* District Gresik Kota Path */}
                <path
                  d="M 250,50 L 450,50 L 450,350 L 250,350 Z"
                  fill={selectedKecamatan === "Gresik Kota" ? "#fb923c" : "url(#grad-gresik-kota)"}
                  stroke="#f97316"
                  strokeWidth={selectedKecamatan === "Gresik Kota" ? 3 : 1.5}
                  className="cursor-pointer transition-all duration-300 hover:opacity-90"
                  onClick={() => setSelectedKecamatan(selectedKecamatan === "Gresik Kota" ? null : "Gresik Kota")}
                />
                <text x="310" y="200" fill="#7c2d12" className="text-[12px] font-extrabold pointer-events-none">
                  Kec. Gresik Kota
                </text>

                {/* Map Pins */}
                {filteredReports.map((item) => {
                  const { x, y } = getSvgCoords(item.lat, item.lng);
                  const isHighlighted = activeReport?.id === item.id;
                  
                  // Color depending on status
                  const pinColor = item.status === "Selesai" 
                    ? "#10b981" // green
                    : item.status === "Proses" 
                      ? "#3b82f6" // blue
                      : "#f59e0b"; // orange/yellow

                  return (
                    <g 
                      key={item.id} 
                      className="cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReport(item);
                      }}
                    >
                      {/* Pulse Circle for active report */}
                      {isHighlighted && (
                        <circle
                          cx={x}
                          cy={y}
                          r="16"
                          fill={pinColor}
                          opacity="0.3"
                          className="animate-ping"
                        />
                      )}
                      
                      {/* Main pin marker */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHighlighted ? 9 : 6.5}
                        fill={pinColor}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="transition-all duration-300 group-hover:scale-125"
                      />
                      
                      {/* Inner dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r="2.5"
                        fill="#ffffff"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Reset Map View */}
              {selectedKecamatan && (
                <button
                  onClick={() => setSelectedKecamatan(null)}
                  className="absolute top-4 right-4 bg-white/95 text-[var(--color-primary)] font-bold text-[12px] px-3 py-1.5 rounded-lg border border-[var(--color-outline-variant)] shadow-sm hover:bg-white transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  Reset Filter Kawasan
                </button>
              )}

              {/* Float Flyout Card for Active Report */}
              {activeReport && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-[var(--color-outline-variant)] shadow-lg animate-scale-in flex flex-col md:flex-row gap-4 justify-between items-center text-left">
                  <div className="flex gap-4 items-center w-full md:w-auto">
                    <img 
                      src={activeReport.foto.length > 0 ? activeReport.foto[0] : categoryImages[activeReport.kategori]}
                      alt={activeReport.kategoriReadable}
                      className="w-16 h-16 object-cover rounded-lg border border-[var(--color-outline-variant)] flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] px-2 py-0.5 rounded font-bold uppercase">
                          {activeReport.kategoriReadable}
                        </span>
                        <span className="text-[10px] text-[var(--color-on-surface-variant)] opacity-70">
                          {activeReport.kecamatan}
                        </span>
                      </div>
                      <h3 className="text-[14px] font-bold text-[var(--color-on-surface)] leading-tight line-clamp-1">
                        {activeReport.lokasi.split(",")[0]}
                      </h3>
                      <p className="text-[12px] text-[var(--color-on-surface-variant)] line-clamp-1">
                        {activeReport.deskripsi}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <Link
                      href={`/lacak?id=${activeReport.id}`}
                      className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white text-[12px] font-bold px-4 py-2 rounded-lg shadow-sm transition-all active:scale-95 whitespace-nowrap text-center flex-grow md:flex-grow-0"
                    >
                      Lacak Detail Laporan
                    </Link>
                    <button
                      onClick={() => setActiveReport(null)}
                      className="w-8 h-8 rounded-lg hover:bg-gray-150 flex items-center justify-center border border-[var(--color-outline-variant)] flex-shrink-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
