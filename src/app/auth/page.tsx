"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan kata sandi harus diisi.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Email atau kata sandi salah.");
        setLoading(false);
      } else {
        // Success
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem saat masuk.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Nama, email, dan kata sandi harus diisi.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal.");
      } else {
        alert("Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.");
        setActiveTab("login");
        // Keep credentials in form to make signin easy
        setName("");
        setPhone("");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem saat mendaftar.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-inter)] text-[var(--color-on-surface)] bg-[var(--color-surface)] relative overflow-hidden">
      {/* Top Auth Shell */}
      <header className="w-full h-16 flex items-center px-[var(--spacing-margin-mobile)] bg-[var(--color-surface)] shadow-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-[1200px] w-full flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
            <h1 className="text-[24px] leading-[32px] font-[family-name:var(--font-plus-jakarta-sans)] text-[var(--color-primary)] font-bold tracking-tight">SIPLING</h1>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-[var(--spacing-margin-mobile)] relative z-10">
        {/* Atmospheric Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-12 -left-12 w-48 h-48 bg-[var(--color-secondary)]/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="w-full max-w-md z-10">
          {/* Brand Intro */}
          <div className="mb-[24px] text-center md:text-left">
            <h2 className="text-[28px] leading-[36px] md:text-[32px] md:leading-[40px] font-bold font-[family-name:var(--font-plus-jakarta-sans)] text-[var(--color-primary)] mb-[4px]">Pelayanan Lingkungan Hidup</h2>
            <p className="text-[var(--color-on-surface-variant)] text-[16px] leading-[24px]">Masuk untuk melaporkan dan memantau kualitas lingkungan di sekitar Anda.</p>
          </div>

          {/* Auth Container Card */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden border border-[var(--color-outline-variant)] glass-card">
            {/* Tab Headers */}
            <div className="flex border-b border-[var(--color-outline-variant)]">
              <button 
                className={`flex-1 py-4 text-[14px] leading-[20px] font-semibold text-center transition-all ${activeTab === 'login' ? 'tab-active' : 'tab-inactive'}`}
                onClick={() => { setActiveTab('login'); setError(""); }}
              >
                Masuk
              </button>
              <button 
                className={`flex-1 py-4 text-[14px] leading-[20px] font-semibold text-center transition-all ${activeTab === 'register' ? 'tab-active' : 'tab-inactive'}`}
                onClick={() => { setActiveTab('register'); setError(""); }}
              >
                Daftar Akun
              </button>
            </div>
            
            <div className="p-[24px]">
              {/* Error Alert Box */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)] text-[var(--color-error)] text-[14px] leading-[20px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="form-transition space-y-[16px]">
                  <div className="space-y-[4px]">
                    <label className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]" htmlFor="login-email">Email</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">mail</span>
                      <input 
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all text-[16px] leading-[24px] bg-[var(--color-surface-bright)]" 
                        id="login-email" 
                        placeholder="nama@email.com" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-[4px]">
                    <div className="flex justify-between items-center">
                      <label className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]" htmlFor="login-password">Kata Sandi</label>
                      <a className="text-[12px] leading-[16px] font-medium text-[var(--color-secondary)] hover:underline" href="#">Lupa Sandi?</a>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">lock</span>
                      <input 
                        className="w-full pl-11 pr-12 py-3 rounded-lg border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all text-[16px] leading-[24px] bg-[var(--color-surface-bright)]" 
                        id="login-password" 
                        placeholder="••••••••" 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]" 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-[14px] leading-[20px] font-semibold py-4 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-[24px] disabled:opacity-50 disabled:cursor-not-allowed" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <span>Masuk ke Akun</span>
                        <span className="material-symbols-outlined text-[20px]">login</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="form-transition space-y-[16px]">
                  <div className="space-y-[4px]">
                    <label className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]" htmlFor="reg-name">Nama Lengkap</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">person</span>
                      <input 
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all text-[16px] leading-[24px] bg-[var(--color-surface-bright)]" 
                        id="reg-name" 
                        placeholder="Sesuai KTP" 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-[4px]">
                    <label className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]" htmlFor="reg-email">Email</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">mail</span>
                      <input 
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all text-[16px] leading-[24px] bg-[var(--color-surface-bright)]" 
                        id="reg-email" 
                        placeholder="nama@email.com" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-[4px]">
                    <label className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]" htmlFor="reg-phone">Nomor HP</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">call</span>
                      <input 
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all text-[16px] leading-[24px] bg-[var(--color-surface-bright)]" 
                        id="reg-phone" 
                        placeholder="08xxxxxxxxxx" 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-[4px]">
                    <label className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]" htmlFor="reg-password">Kata Sandi</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">lock</span>
                      <input 
                        className="w-full pl-11 pr-12 py-3 rounded-lg border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all text-[16px] leading-[24px] bg-[var(--color-surface-bright)]" 
                        id="reg-password" 
                        placeholder="Minimal 8 karakter" 
                        type={showRegPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]" 
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                      >
                        <span className="material-symbols-outlined">{showRegPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 pt-[4px]">
                    <input className="mt-1 rounded border-[var(--color-outline-variant)] text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]" id="terms" type="checkbox" required />
                    <label className="text-[14px] leading-[20px] text-[var(--color-on-surface-variant)]" htmlFor="terms">Saya menyetujui <a className="text-[var(--color-secondary)] hover:underline" href="#">Syarat &amp; Ketentuan</a> serta Kebijakan Privasi yang berlaku.</label>
                  </div>
                  
                  <button 
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-[14px] leading-[20px] font-semibold py-4 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-[24px] disabled:opacity-50 disabled:cursor-not-allowed" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Mendaftarkan...
                      </>
                    ) : (
                      <>
                        <span>Daftar Akun Baru</span>
                        <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Social/Government Link Login */}
          <div className="mt-[24px] flex flex-col items-center gap-[16px]">
            <div className="flex items-center w-full gap-[16px]">
              <div className="h-[1px] bg-[var(--color-outline-variant)] flex-grow"></div>
              <span className="text-[12px] leading-[16px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-widest">Atau masuk dengan</span>
              <div className="h-[1px] bg-[var(--color-outline-variant)] flex-grow"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-[16px] w-full">
              <button className="flex items-center justify-center gap-[8px] py-3 px-4 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-surface-variant)] transition-colors active:bg-[var(--color-surface-dim)]">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="text-[14px] leading-[20px] font-semibold">Google</span>
              </button>
              <button className="flex items-center justify-center gap-[8px] py-3 px-4 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-surface-variant)] transition-colors active:bg-[var(--color-surface-dim)]">
                <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                <span className="text-[14px] leading-[20px] font-semibold">ID Pemerintah</span>
              </button>
            </div>
          </div>

          {/* Support Footer */}
          <footer className="mt-[48px] text-center">
            <p className="text-[12px] leading-[16px] font-medium text-[var(--color-on-surface-variant)] mb-[4px]">Butuh bantuan teknis?</p>
            <div className="flex justify-center gap-[24px]">
              <a className="text-[var(--color-primary)] text-[14px] leading-[20px] font-semibold hover:underline flex items-center gap-1" href="#">
                <span className="material-symbols-outlined text-[18px]">contact_support</span> Bantuan
              </a>
              <a className="text-[var(--color-primary)] text-[14px] leading-[20px] font-semibold hover:underline flex items-center gap-1" href="#">
                <span className="material-symbols-outlined text-[18px]">shield</span> Keamanan
              </a>
            </div>
          </footer>
        </div>
      </main>

      {/* Visual Polish: Asymmetric Decor */}
      <div className="fixed bottom-0 right-0 p-8 pointer-events-none opacity-10 hidden md:block">
        <span className="material-symbols-outlined text-[240px] text-[var(--color-primary)]">psychiatry</span>
      </div>
    </div>
  );
}
