"use client";

import { useState } from "react";
import { updateProfile } from "./actions";

interface ProfilClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    joinDate: string;
  };
  stats: {
    total: number;
    selesay?: number; // fallback spelling if any
    selesai: number;
    proses: number;
    verifikasi: number;
  };
}

export default function ProfilClient({ user, stats }: ProfilClientProps) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // For simplicity, we just update the phone number in our Server Action, 
      // but we can also update name if we want. Let's update phone.
      const result = await updateProfile(phone);
      if (result.success) {
        setMessage({ type: "success", text: "Profil Anda berhasil diperbarui!" });
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Gagal memperbarui profil." });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <main className="pt-24 pb-24 min-h-screen bg-[var(--color-surface-container-low)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] font-[family-name:var(--font-inter)]">
      <div className="container mx-auto max-w-[800px] space-y-8 animate-fade-in">
        
        {/* Header Title */}
        <div>
          <h1 className="text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-bold text-[var(--color-on-surface)] font-[family-name:var(--font-plus-jakarta-sans)] mb-1">
            Profil Saya
          </h1>
          <p className="text-[14px] md:text-[16px] text-[var(--color-on-surface-variant)]">
            Kelola data akun dan pantau ringkasan pengaduan Anda di SIPLING.
          </p>
        </div>

        {/* User Card Row */}
        <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-sm border border-[var(--color-outline-variant)] flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] text-white text-[28px] font-extrabold flex items-center justify-center shadow-inner">
            {getInitials(user.name)}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-[20px] font-bold text-[var(--color-on-surface)] font-[family-name:var(--font-plus-jakarta-sans)]">
              {user.name}
            </h2>
            <p className="text-[14px] text-[var(--color-on-surface-variant)] flex items-center gap-1 justify-center sm:justify-start">
              <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">mail</span>
              {user.email}
            </p>
            <p className="text-[12px] text-[var(--color-on-surface-variant)] opacity-70">
              Anggota sejak: {user.joinDate}
            </p>
          </div>
          <span className="sm:ml-auto px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide uppercase bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]">
            {user.role === "ADMIN" ? "Petugas DLH" : "Warga Pelapor"}
          </span>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-xl border border-[var(--color-outline-variant)] text-center">
            <p className="text-[28px] font-extrabold text-[var(--color-on-surface)]">{stats.total}</p>
            <p className="text-[12px] text-[var(--color-on-surface-variant)] font-semibold">Total Aduan</p>
          </div>
          <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-xl border border-[var(--color-outline-variant)] text-center">
            <p className="text-[28px] font-extrabold text-yellow-600">{stats.verifikasi}</p>
            <p className="text-[12px] text-[var(--color-on-surface-variant)] font-semibold">Verifikasi</p>
          </div>
          <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-xl border border-[var(--color-outline-variant)] text-center">
            <p className="text-[28px] font-extrabold text-blue-600">{stats.proses}</p>
            <p className="text-[12px] text-[var(--color-on-surface-variant)] font-semibold">Diproses</p>
          </div>
          <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-xl border border-[var(--color-outline-variant)] text-center">
            <p className="text-[28px] font-extrabold text-green-600">{stats.selesai}</p>
            <p className="text-[12px] text-[var(--color-on-surface-variant)] font-semibold">Selesai</p>
          </div>
        </div>

        {/* Profile Form Details */}
        <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-sm border border-[var(--color-outline-variant)] space-y-6">
          <h3 className="text-[18px] font-bold text-[var(--color-on-surface)] border-b border-[var(--color-outline-variant)] pb-3 font-[family-name:var(--font-plus-jakarta-sans)] flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--color-primary)]">manage_accounts</span>
            Informasi Akun
          </h3>

          {message && (
            <div className={`p-4 rounded-xl text-[14px] font-semibold border ${
              message.type === "success" 
                ? "bg-green-500/10 text-green-700 border-green-500/20" 
                : "bg-red-500/10 text-red-700 border-red-500/20"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-[var(--color-on-surface-variant)] mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-outline-variant)] outline-none bg-gray-150/70 text-[var(--color-on-surface)] font-medium text-[14px] cursor-not-allowed"
                />
                <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-1 opacity-70">Nama didaftarkan melalui sistem integrasi SIPLING.</p>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[var(--color-on-surface-variant)] mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-outline-variant)] outline-none bg-gray-150/70 text-[var(--color-on-surface)] font-medium text-[14px] cursor-not-allowed"
                />
                <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-1 opacity-70">Alamat email digunakan sebagai kredensial masuk.</p>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[var(--color-on-surface-variant)] mb-1">Nomor Handphone (WhatsApp)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Contoh: 081234567890"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none text-[14px] font-medium transition-colors ${
                    isEditing
                      ? "border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] bg-[var(--color-surface-bright)]"
                      : "border-[var(--color-outline-variant)] bg-gray-150/70 cursor-not-allowed"
                  }`}
                />
                <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-1 opacity-70">Masukkan nomor aktif untuk mempermudah koordinasi petugas lapangan.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-outline-variant)]">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setPhone(user.phone);
                      setIsEditing(false);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-[var(--color-outline-variant)] hover:bg-gray-150 text-[14px] font-bold transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit Nomor Handphone
                </button>
              )}
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}
