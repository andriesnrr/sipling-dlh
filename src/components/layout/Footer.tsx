"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Footer() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlaceholderClick = (e: React.MouseEvent, featureName: string) => {
    e.preventDefault();
    alert(`Fitur "${featureName}" sedang dalam tahap pengembangan Dinas Lingkungan Hidup.`);
  };

  const getTabStyle = (path: string, exact = false) => {
    const isActive = mounted && pathname
      ? (exact ? pathname === path : pathname.startsWith(path))
      : false;

    return {
      isActive,
      container: "flex flex-col items-center justify-center w-16 py-1 active:scale-95 duration-200 cursor-pointer decoration-none select-none",
      iconWrapper: isActive
        ? "w-12 h-8 rounded-full bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] flex items-center justify-center transition-all duration-200"
        : "w-12 h-8 rounded-full hover:bg-[var(--color-surface-variant)]/50 text-[var(--color-on-surface-variant)] flex items-center justify-center transition-all duration-200",
      label: isActive
        ? "text-[12px] leading-[16px] font-bold text-[var(--color-primary)] mt-1 font-[family-name:var(--font-inter)] transition-colors duration-200"
        : "text-[12px] leading-[16px] font-medium text-[var(--color-on-surface-variant)] mt-1 font-[family-name:var(--font-inter)] transition-colors duration-200"
    };
  };

  return (
    <>
      <footer className="bg-[var(--color-inverse-surface)] text-[var(--color-inverse-on-surface)] py-[48px] px-[16px] md:px-[32px] mb-20 md:mb-0">
        <div className="container mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[var(--color-primary-fixed-dim)] text-[24px]">eco</span>
              <span className="text-[24px] leading-[32px] font-bold font-[family-name:var(--font-plus-jakarta-sans)]">SIPLING</span>
            </div>
            <p className="text-[14px] leading-[20px] opacity-70 max-w-md mb-6 leading-relaxed font-[family-name:var(--font-inter)]">
              Sistem Informasi Pelayanan Lingkungan (SIPLING) adalah platform digital resmi yang dikelola oleh Dinas Lingkungan Hidup untuk memudahkan warga melaporkan berbagai masalah lingkungan di wilayah perkotaan secara cepat, transparan, dan akuntabel.
            </p>
            <div className="flex gap-4">
              <div 
                onClick={(e) => handlePlaceholderClick(e, "Portal Publik DLH")}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">public</span>
              </div>
              <div 
                onClick={(e) => handlePlaceholderClick(e, "Email Resmi DLH")}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">alternate_email</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[14px] leading-[20px] font-bold mb-6 font-[family-name:var(--font-inter)]">Tautan Cepat</h4>
            <ul className="space-y-4 text-[14px] leading-[20px] opacity-70 font-[family-name:var(--font-inter)]">
              <li><a href="#" onClick={(e) => handlePlaceholderClick(e, "Cara Melapor")} className="hover:text-[var(--color-primary-fixed-dim)] transition-colors">Cara Melapor</a></li>
              <li><Link href="/peta" className="hover:text-[var(--color-primary-fixed-dim)] transition-colors">Peta Sebaran Laporan</Link></li>
              <li><a href="#" onClick={(e) => handlePlaceholderClick(e, "Statistik Layanan")} className="hover:text-[var(--color-primary-fixed-dim)] transition-colors">Statistik Layanan</a></li>
              <li><a href="#" onClick={(e) => handlePlaceholderClick(e, "Pusat Bantuan")} className="hover:text-[var(--color-primary-fixed-dim)] transition-colors">Pusat Bantuan</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[14px] leading-[20px] font-bold mb-6 font-[family-name:var(--font-inter)]">Kontak Kami</h4>
            <ul className="space-y-4 text-[14px] leading-[20px] opacity-70 font-[family-name:var(--font-inter)]">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
                Jl. Lingkungan No. 123, Pusat Pemerintahan, Kota Baru
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">call</span>
                (021) 555-0123
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">mail</span>
                kontak@sipling.go.id
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-[1200px] mt-16 pt-8 border-t border-white/10 text-center text-[12px] leading-[16px] opacity-50 font-[family-name:var(--font-inter)]">
          <p>© 2024 Dinas Lingkungan Hidup. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-[var(--color-surface-container-lowest)] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-xl border-t border-[var(--color-outline-variant)]">
        {(() => {
          const homeStyle = getTabStyle("/", true);
          return (
            <Link href="/" className={homeStyle.container}>
              <div className={homeStyle.iconWrapper}>
                <span className="material-symbols-outlined">home</span>
              </div>
              <span className={homeStyle.label}>Home</span>
            </Link>
          );
        })()}
        {(() => {
          const laporanStyle = getTabStyle("/laporan");
          return (
            <Link href="/laporan" className={laporanStyle.container}>
              <div className={laporanStyle.iconWrapper}>
                <span className="material-symbols-outlined">assignment</span>
              </div>
              <span className={laporanStyle.label}>Laporan</span>
            </Link>
          );
        })()}
        {(() => {
          const petaStyle = getTabStyle("/peta");
          return (
            <Link href="/peta" className={petaStyle.container}>
              <div className={petaStyle.iconWrapper}>
                <span className="material-symbols-outlined">map</span>
              </div>
              <span className={petaStyle.label}>Peta</span>
            </Link>
          );
        })()}
        {(() => {
          const profilStyle = getTabStyle("/profil");
          return (
            <Link href="/profil" className={profilStyle.container}>
              <div className={profilStyle.iconWrapper}>
                <span className="material-symbols-outlined">person</span>
              </div>
              <span className={profilStyle.label}>Profil</span>
            </Link>
          );
        })()}
      </nav>
    </>
  );
}
