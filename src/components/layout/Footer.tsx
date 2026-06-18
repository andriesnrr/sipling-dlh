import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="bg-[var(--color-inverse-surface)] text-[var(--color-inverse-on-surface)] py-[48px] px-[16px] md:px-[32px]">
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
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                <span className="material-symbols-outlined">public</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                <span className="material-symbols-outlined">alternate_email</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[14px] leading-[20px] font-bold mb-6 font-[family-name:var(--font-inter)]">Tautan Cepat</h4>
            <ul className="space-y-4 text-[14px] leading-[20px] opacity-70 font-[family-name:var(--font-inter)]">
              <li><Link href="/bantuan" className="hover:text-[var(--color-primary-fixed-dim)] transition-colors">Cara Melapor</Link></li>
              <li><Link href="/peta" className="hover:text-[var(--color-primary-fixed-dim)] transition-colors">Peta Sebaran Laporan</Link></li>
              <li><Link href="/statistik" className="hover:text-[var(--color-primary-fixed-dim)] transition-colors">Statistik Layanan</Link></li>
              <li><Link href="/bantuan" className="hover:text-[var(--color-primary-fixed-dim)] transition-colors">Pusat Bantuan</Link></li>
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
        <Link href="/" className="flex flex-col items-center justify-center bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] rounded-full px-4 py-1 active:scale-95 duration-200">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[12px] leading-[16px] font-medium font-[family-name:var(--font-inter)]">Home</span>
        </Link>
        <Link href="/laporan" className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 rounded-full px-4 py-1 active:scale-95 duration-200">
          <span className="material-symbols-outlined">assignment</span>
          <span className="text-[12px] leading-[16px] font-medium font-[family-name:var(--font-inter)]">Laporan</span>
        </Link>
        <Link href="/peta" className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 rounded-full px-4 py-1 active:scale-95 duration-200">
          <span className="material-symbols-outlined">map</span>
          <span className="text-[12px] leading-[16px] font-medium font-[family-name:var(--font-inter)]">Peta</span>
        </Link>
        <Link href="/profil" className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 rounded-full px-4 py-1 active:scale-95 duration-200">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[12px] leading-[16px] font-medium font-[family-name:var(--font-inter)]">Profil</span>
        </Link>
      </nav>
    </>
  );
}
