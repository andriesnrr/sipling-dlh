"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function BuatLaporanClient() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    kategori: "",
    lokasi: "",
    deskripsi: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = function(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const imageFiles = droppedFiles.filter(file => file.type.startsWith("image/"));
      setFiles(prev => [...prev, ...imageFiles].slice(0, 3));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const imageFiles = selectedFiles.filter(file => file.type.startsWith("image/"));
      setFiles(prev => [...prev, ...imageFiles].slice(0, 3));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kategori || !formData.lokasi || !formData.deskripsi) {
      alert("Mohon lengkapi semua bidang form!");
      return;
    }
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("kategori", formData.kategori);
      data.append("lokasi", formData.lokasi);
      data.append("deskripsi", formData.deskripsi);
      
      files.forEach((file) => {
        data.append("files", file);
      });

      const res = await fetch("/api/laporan/create", {
        method: "POST",
        body: data,
      });

      const resData = await res.json();
      setSubmitting(false);

      if (!res.ok) {
        alert(resData.error || "Gagal mengirimkan aduan.");
      } else {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat mengirim aduan.");
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-24 pb-24 min-h-screen bg-[var(--color-surface-container-low)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] font-[family-name:var(--font-inter)]">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-[32px] leading-[40px] font-bold text-[var(--color-on-surface)] font-[family-name:var(--font-plus-jakarta-sans)] mb-2">Buat Laporan Baru</h1>
          <p className="text-[16px] leading-[24px] text-[var(--color-on-surface-variant)]">Sampaikan permasalahan lingkungan di sekitar Anda agar segera ditindaklanjuti oleh tim kami.</p>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-sm border border-[var(--color-outline-variant)] p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Kategori Laporan */}
            <div className="space-y-2">
              <label className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]" htmlFor="kategori">Kategori Permasalahan</label>
              <div className="relative">
                <select 
                  id="kategori"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none appearance-none bg-[var(--color-surface-bright)] text-[16px] leading-[24px]"
                  required
                >
                  <option value="" disabled>Pilih Kategori</option>
                  <option value="sampah">Penumpukan Sampah</option>
                  <option value="drainase">Drainase / Saluran Air</option>
                  <option value="pohon">Pohon Rawan Tumbang</option>
                  <option value="udara">Pencemaran Udara / Asap</option>
                  <option value="lainnya">Lainnya</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Lokasi */}
            <div className="space-y-2">
              <label className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]" htmlFor="lokasi">Lokasi Kejadian</label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">location_on</span>
                  <input 
                    id="lokasi"
                    name="lokasi"
                    type="text" 
                    value={formData.lokasi}
                    onChange={handleInputChange}
                    placeholder="Tuliskan detail lokasi atau alamat..." 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-surface-bright)] text-[16px] leading-[24px]" 
                    required
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, lokasi: "Jalan Veteran No. 12, Gresik (Lokasi Saya)" }))}
                  className="bg-[var(--color-surface-variant)] hover:bg-[var(--color-surface-dim)] text-[var(--color-on-surface)] px-4 py-3 rounded-xl flex items-center justify-center transition-colors border border-[var(--color-outline-variant)]"
                  title="Gunakan Lokasi Saat Ini"
                >
                  <span className="material-symbols-outlined text-[20px]">my_location</span>
                </button>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <label className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]" htmlFor="deskripsi">Deskripsi Laporan</label>
              <textarea 
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                rows={4}
                placeholder="Jelaskan secara singkat permasalahan yang terjadi..." 
                className="w-full p-4 rounded-xl border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-surface-bright)] text-[16px] leading-[24px] resize-none"
                required
              ></textarea>
            </div>

            {/* Upload Foto */}
            <div className="space-y-2">
              <label className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]">Lampiran Foto</label>
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${dragActive ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-bright)]'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
              >
                <div className="w-16 h-16 bg-[var(--color-surface-variant)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[32px] text-[var(--color-on-surface-variant)]">add_a_photo</span>
                </div>
                <p className="text-[16px] leading-[24px] font-semibold text-[var(--color-on-surface)] mb-1">Unggah foto kejadian</p>
                <p className="text-[14px] leading-[20px] text-[var(--color-on-surface-variant)] mb-4">Tarik & letakkan file di sini atau klik untuk mencari</p>
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}
                  className="bg-[var(--color-surface-container-highest)] hover:bg-[var(--color-surface-dim)] text-[var(--color-on-surface)] px-6 py-2 rounded-lg text-[14px] leading-[20px] font-semibold transition-colors"
                >
                  Pilih File
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange}
                />
              </div>

              {/* File Previews */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[14px] leading-[20px] font-semibold text-[var(--color-on-surface)]">File Terpilih ({files.length}):</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[var(--color-surface-bright)] rounded-xl border border-[var(--color-outline-variant)]">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="material-symbols-outlined text-[var(--color-primary)]">image</span>
                          <span className="text-[14px] leading-[20px] truncate max-w-[120px]">{file.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                          className="text-[var(--color-error)] hover:bg-[var(--color-error)]/5 p-1 rounded-full transition-colors flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[12px] leading-[16px] text-[var(--color-on-surface-variant)] mt-2">Maksimal 3 foto. Format JPG, PNG (Max 5MB/file).</p>
            </div>

            <div className="pt-4 border-t border-[var(--color-outline-variant)]">
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-[16px] leading-[24px] font-bold py-4 rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim Laporan...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    Kirim Laporan
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-[var(--color-surface-container-lowest)] max-w-md w-full rounded-2xl p-6 text-center shadow-xl border border-[var(--color-outline-variant)] animate-scale-in">
            <div className="w-16 h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 className="text-[20px] leading-[28px] font-bold text-[var(--color-on-surface)] mb-2 font-[family-name:var(--font-plus-jakarta-sans)]">Laporan Berhasil Dikirim!</h3>
            <p className="text-[14px] leading-[20px] text-[var(--color-on-surface-variant)] mb-6">Terima kasih atas partisipasi Anda. Laporan Anda telah kami terima dan akan segera diproses oleh tim Dinas Lingkungan Hidup.</p>
            <button 
              type="button" 
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/");
              }}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
