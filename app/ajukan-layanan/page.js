
"use client";

import { useState } from "react";

const jenisLayanan = [
  "Pendaftaran Nikah",
  "Bimbingan Perkawinan",
  "Konsultasi Keluarga",
  "Konsultasi Keagamaan",
  "Wakaf",
  "Bimbingan Remaja Usia Sekolah (BRUS)",
  "Informasi Haji dan Umrah",
  "Administrasi KUA Lainnya",
];

export default function AjukanLayananPage() {
  const [form, setForm] = useState({
    nama_pemohon: "",
    nomor_hp: "",
    email: "",
    jenis_layanan: "",
    keperluan: "",
    desa: "",
    catatan_pemohon: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasil, setHasil] = useState(null);
  const [tersalin, setTersalin] = useState(false);

  function ubah(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function kirim(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHasil(null);
    setTersalin(false);

    try {
      const response = await fetch("/api/permohonan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Pengajuan belum berhasil.");
      }

      setHasil(result.data);
      setForm({
        nama_pemohon: "",
        nomor_hp: "",
        email: "",
        jenis_layanan: "",
        keperluan: "",
        desa: "",
        catatan_pemohon: "",
        website: "",
      });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function salinBukti() {
    if (!hasil) return;

    const teks = [
      "BUKTI PENGAJUAN LAYANAN KUA PANCA LAUTANG",
      `Kode pelacakan: ${hasil.kode_tracking}`,
      `PIN: ${hasil.pin}`,
      `Status: ${hasil.status}`,
      `Tanggal: ${new Date(hasil.created_at).toLocaleString("id-ID")}`,
      "",
      "Simpan kode dan PIN ini untuk memeriksa status pengajuan.",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(teks);
      setTersalin(true);
    } catch {
      setError("Penyalinan otomatis gagal. Silakan catat kode dan PIN secara manual.");
    }
  }

  return (
    <main className="ajukan-wrap">
      <section className="ajukan-hero">
        <span className="ajukan-label">KANTOR URUSAN AGAMA</span>
        <h1>Pengajuan Layanan KUA</h1>
        <p>
          Ajukan kebutuhan layanan KUA Panca Lautang secara daring dan
          simpan kode pelacakan untuk memantau perkembangannya.
        </p>
      </section>

      {hasil ? (
        <section className="ajukan-card" aria-live="polite">
          <div className="ajukan-success">✓</div>
          <h2>Pengajuan Berhasil Diterima</h2>
          <p>
            Simpan kedua informasi berikut. PIN diperlukan bersama kode
            pelacakan untuk memeriksa status berkas.
          </p>

          <div className="bukti-field">
            <span>Kode pelacakan</span>
            <strong>{hasil.kode_tracking}</strong>
          </div>
          <div className="bukti-field">
            <span>PIN rahasia</span>
            <strong>{hasil.pin}</strong>
          </div>
          <div className="bukti-field">
            <span>Status awal</span>
            <strong>Diajukan</strong>
          </div>

          <p className="ajukan-warning">
            Penting: catat atau salin kode dan PIN sekarang. PIN tidak
            ditampilkan kembali setelah halaman ini ditinggalkan.
          </p>

          <button className="ajukan-btn" type="button" onClick={salinBukti}>
            {tersalin ? "Bukti Tersalin" : "Salin Bukti Pengajuan"}
          </button>
          <a className="ajukan-link-btn" href="/cek-status-berkas">
            Periksa Status Berkas
          </a>
          <button
            className="ajukan-reset"
            type="button"
            onClick={() => setHasil(null)}
          >
            Kembali ke Formulir
          </button>
        </section>
      ) : (
        <form className="ajukan-card" onSubmit={kirim}>
          <h2>Formulir Permohonan</h2>
          <p className="ajukan-muted">
            Isi data dengan benar. Kolom bertanda * wajib diisi.
          </p>

          {error && (
            <div className="ajukan-error" role="alert">{error}</div>
          )}

          <div className="ajukan-grid">
            <label>
              Nama lengkap *
              <input
                name="nama_pemohon"
                value={form.nama_pemohon}
                onChange={ubah}
                maxLength={120}
                autoComplete="name"
                required
              />
            </label>

            <label>
              Nomor HP/WhatsApp *
              <input
                name="nomor_hp"
                value={form.nomor_hp}
                onChange={ubah}
                type="tel"
                maxLength={30}
                autoComplete="tel"
                placeholder="Contoh: 081234567890"
                required
              />
            </label>

            <label>
              Email (opsional)
              <input
                name="email"
                value={form.email}
                onChange={ubah}
                type="email"
                maxLength={254}
                autoComplete="email"
              />
            </label>

            <label>
              Desa/Kelurahan
              <input
                name="desa"
                value={form.desa}
                onChange={ubah}
                maxLength={100}
                placeholder="Nama desa/kelurahan"
              />
            </label>

            <label className="ajukan-full">
              Jenis layanan *
              <select
                name="jenis_layanan"
                value={form.jenis_layanan}
                onChange={ubah}
                required
              >
                <option value="">Pilih jenis layanan</option>
                {jenisLayanan.map((jenis) => (
                  <option key={jenis} value={jenis}>{jenis}</option>
                ))}
              </select>
            </label>

            <label className="ajukan-full">
              Keperluan permohonan *
              <textarea
                name="keperluan"
                value={form.keperluan}
                onChange={ubah}
                maxLength={2000}
                rows={4}
                placeholder="Jelaskan layanan yang dibutuhkan."
                required
              />
            </label>

            <label className="ajukan-full">
              Catatan tambahan (opsional)
              <textarea
                name="catatan_pemohon"
                value={form.catatan_pemohon}
                onChange={ubah}
                maxLength={1000}
                rows={3}
                placeholder="Informasi tambahan bila diperlukan."
              />
            </label>

            <div className="ajukan-honeypot" aria-hidden="true">
              <label>
                Website
                <input
                  name="website"
                  value={form.website}
                  onChange={ubah}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>
          </div>

          <p className="ajukan-privacy">
            Gunakan data yang benar. Jangan masukkan kata sandi, PIN
            pribadi lain, atau informasi sensitif yang tidak diperlukan.
          </p>

          <button className="ajukan-btn" type="submit" disabled={loading}>
            {loading ? "Mengirim Pengajuan..." : "Kirim Permohonan"}
          </button>
          <a className="ajukan-secondary-link" href="/cek-status-berkas">
            Sudah mengajukan? Cek status berkas
          </a>
        </form>
      )}

      <style jsx>{`
        .ajukan-wrap {
          max-width: 900px;
          margin: 0 auto;
          padding: 36px 18px 64px;
          color: #17352d;
        }
        .ajukan-hero {
          padding: 28px 4px;
          text-align: center;
        }
        .ajukan-label {
          color: #17765a;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
        }
        .ajukan-hero h1 {
          margin: 12px 0;
          font-size: clamp(28px, 5vw, 42px);
          line-height: 1.2;
        }
        .ajukan-hero p, .ajukan-card > p {
          color: #61736c;
          line-height: 1.7;
        }
        .ajukan-hero p {
          max-width: 650px;
          margin: 0 auto;
        }
        .ajukan-card {
          padding: clamp(20px, 4vw, 36px);
          border: 1px solid #dce9e2;
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 12px 38px rgba(24, 68, 49, .07);
        }
        .ajukan-card h2 {
          margin: 0 0 8px;
          font-size: 23px;
        }
        .ajukan-muted {
          margin: 0 0 24px;
          font-size: 14px;
        }
        .ajukan-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }
        .ajukan-grid label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          font-weight: 650;
        }
        .ajukan-full {
          grid-column: 1 / -1;
        }
        .ajukan-grid input, .ajukan-grid select,
        .ajukan-grid textarea {
          width: 100%;
          min-width: 0;
          padding: 12px 13px;
          border: 1px solid #cbdad1;
          border-radius: 10px;
          background: #fff;
          color: #17352d;
          font: inherit;
          font-weight: 400;
        }
        .ajukan-grid input:focus, .ajukan-grid select:focus,
        .ajukan-grid textarea:focus {
          outline: 2px solid #2c8b69;
          outline-offset: 1px;
        }
        .ajukan-grid textarea {
          resize: vertical;
        }
        .ajukan-privacy, .ajukan-warning {
          padding: 12px 14px;
          border-radius: 10px;
          background: #f1f7f3;
          font-size: 13px;
          line-height: 1.65;
        }
        .ajukan-warning {
          background: #fff5dd;
          color: #744d0a !important;
        }
        .ajukan-btn, .ajukan-link-btn {
          display: block;
          width: 100%;
          padding: 14px 18px;
          border: 0;
          border-radius: 11px;
          background: #176b50;
          color: #fff;
          text-align: center;
          font: inherit;
          font-weight: 750;
          text-decoration: none;
          cursor: pointer;
        }
        .ajukan-btn:disabled {
          opacity: .65;
          cursor: wait;
        }
        .ajukan-secondary-link, .ajukan-reset {
          display: block;
          margin: 16px auto 0;
          color: #176b50;
          text-align: center;
          font: inherit;
          font-size: 14px;
        }
        .ajukan-reset {
          padding: 8px;
          border: 0;
          background: transparent;
          cursor: pointer;
        }
        .ajukan-error {
          margin: 14px 0;
          padding: 12px;
          border-radius: 10px;
          background: #fff0f0;
          color: #9b2222;
          font-size: 14px;
        }
        .ajukan-success {
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          margin-bottom: 16px;
          border-radius: 50%;
          background: #e3f5e9;
          color: #176b50;
          font-size: 26px;
          font-weight: 800;
        }
        .bukti-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin: 14px 0;
          padding: 14px;
          border: 1px solid #dce9e2;
          border-radius: 10px;
          overflow-wrap: anywhere;
        }
        .bukti-field span {
          color: #61736c;
          font-size: 13px;
        }
        .bukti-field strong {
          font-size: 19px;
          letter-spacing: .4px;
        }
        .ajukan-honeypot {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .ajukan-grid {
            grid-template-columns: 1fr;
          }
          .ajukan-full {
            grid-column: auto;
          }
        }
      `}</style>
    </main>
  );
}
