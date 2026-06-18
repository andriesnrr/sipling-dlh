export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--color-surface)] z-[100] transition-opacity duration-300">
      <div className="flex flex-col items-center space-y-4">
        {/* Modern Material Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--color-primary-fixed)] opacity-25"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[var(--color-primary)] animate-spin"></div>
        </div>
        
        {/* Logo and Label */}
        <div className="flex items-center gap-1.5 pt-2">
          <span className="material-symbols-outlined text-[var(--color-primary)] text-[20px] animate-pulse">eco</span>
          <span className="text-[20px] font-bold text-[var(--color-primary)] font-[family-name:var(--font-plus-jakarta-sans)] tracking-wide">
            SIPLING
          </span>
        </div>
        
        <p className="text-[14px] font-medium text-[var(--color-on-surface-variant)] animate-pulse font-[family-name:var(--font-inter)]">
          Menghubungkan ke layanan...
        </p>
      </div>
    </div>
  );
}
