import Link from "next/link";
import { auth } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="fixed top-0 z-50 w-full bg-[var(--color-surface)] shadow-sm h-16">
      <div className="container mx-auto max-w-[1200px] h-full flex justify-between items-center px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--color-primary)] text-[24px]">eco</span>
          <span className="text-[24px] leading-[32px] font-bold text-[var(--color-primary)] font-[family-name:var(--font-plus-jakarta-sans)]">SIPLING</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/" className="text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors px-3 py-2 rounded-lg text-[14px] leading-[20px] font-[family-name:var(--font-inter)] font-semibold">
            Beranda
          </Link>
          <Link href="/lacak" className="text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors px-3 py-2 rounded-lg text-[14px] leading-[20px] font-[family-name:var(--font-inter)] font-semibold">
            Lacak Laporan
          </Link>
          {isLoggedIn ? (
            <>
              {!isAdmin && (
                <>
                  <Link href="/laporan" className="text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors px-3 py-2 rounded-lg text-[14px] leading-[20px] font-[family-name:var(--font-inter)] font-semibold">
                    Laporan Saya
                  </Link>
                  <Link href="/laporan/buat" className="text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-colors px-3 py-2 rounded-lg text-[14px] leading-[20px] font-[family-name:var(--font-inter)] font-bold">
                    Buat Laporan
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link href="/admin" className="text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-colors px-3 py-2 rounded-lg text-[14px] leading-[20px] font-[family-name:var(--font-inter)] font-bold">
                  Admin Panel
                </Link>
              )}
            </>
          ) : (
            <Link href="/auth" className="text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-colors px-3 py-2 rounded-lg text-[14px] leading-[20px] font-[family-name:var(--font-inter)] font-bold">
              Masuk / Daftar
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <span className="hidden lg:inline text-[13px] font-semibold text-[var(--color-on-surface-variant)] bg-[var(--color-surface-variant)]/60 px-3 py-1.5 rounded-lg">
              {session?.user?.name}
            </span>
          )}
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <Link 
              href="/auth" 
              className="material-symbols-outlined text-[var(--color-on-surface-variant)] p-2 hover:bg-[var(--color-surface-variant)] rounded-full transition-all flex items-center justify-center cursor-pointer"
              title="Masuk akun"
            >
              login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
