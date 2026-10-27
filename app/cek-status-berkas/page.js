
"use client";

import { useState } from "react";

const labelStatus = {
  diajukan: "Pengajuan Diterima",
  menunggu_verifikasi: "Menunggu Verifikasi",
  diproses: "Sedang Diproses",
  perlu_perbaikan: "Perlu Perbaikan Berkas",
  selesai: "Selesai",
  ditolak: "Pengajuan Ditolak",
  dibatalkan: "Pengajuan Dibatalkan",
};

function formatTanggal(value) {
  if (!value) return "-";

  const tanggal = new Date(value);

  if (Number.isNaN(tanggal.getTime())) return "-";

  return tanggal.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Makassar",
  });
}

export default function CekStatusBerkasPage() {
  const [kode, setKode] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasil, setHasil] = useState(null);

  async function periksa(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHasil(null);

    try {
      const response = await fetch("/api/cek-status-berkas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kode_tracking: kode.trim().toUpperCase(),
          pin: pin.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error || "Status berkas belum dapat diperiksa."
        );
      }

      setHasil(result.data);
    } catch (err) {
      setError(
        err.message || "Terjadi kesalahan. Silakan coba kembali."
      );
    } finally {
      setLoading(false);
    }
  }

  function statusClass(status) {
    if (status === "selesai") return "status-selesai";
    if (status === "ditolak" || status === "dibatalkan") {
      return "status-akhir";
    }
    if (status === "perlu_perbaikan") return "status-perbaikan";
    return "status-proses";
  }

  return (
    <main className="cek-wrap">
      <header className="cek-hero">
        <span className="cek-eyebrow">KANTOR URUSAN AGAMA</span>
        <h1>Cek Status Berkas</h1>
        <p>
          Pantau perkembangan permohonan layanan KUA Panca Lautang
          tanpa harus datang langsung ke kantor.
        </p>
      </header>

      <section className="cek-card">
        <h2>Masukkan Data Pelacakan</h2>
        <p className="cek-muted">
          Gunakan kode pelacakan dan PIN yang diterima saat pengajuan.
        </p>

        <form onSubmit={periksa}>
          <label htmlFor="kode-tracking">Kode pelacakan</label>
          <input
            id="kode-tracking"
            type="text"
            value={kode}
            onChange={(e) => setKode(e.target.value.toUpperCase())}
            placeholder="Contoh: KUA-2026-ABCDEF1234"
            maxLength={30}
            autoCapitalize="characters"
            autoComplete="off"
            required
          />

          <label htmlFor="pin-berkas">PIN rahasia</label>
          <input
            id="pin-berkas"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="Masukkan 10 digit PIN"
            maxLength={10}
            autoComplete="off"
            required
          />

          {error && (
            <div className="cek-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Memeriksa..." : "Periksa Status"}
          </button>
        </form>

        {hasil && (
          <section className="cek-result" aria-live="polite">
            <div className="cek-result-heading">
              <span>STATUS PERMOHONAN</span>
              <h2>{hasil.jenis_layanan}</h2>
              <span className={`cek-badge ${statusClass(hasil.status)}`}>
                {labelStatus[hasil.status] || hasil.status}
              </span>
            </div>

            <div className="cek-detail">
              <div>
                <span>Kode pelacakan</span>
                <strong>{hasil.kode_tracking}</strong>
              </div>
              <div>
                <span>Nama pemohon</span>
                <strong>{hasil.nama_pemohon}</strong>
              </div>
              <div>
                <span>Tanggal pengajuan</span>
                <strong>{formatTanggal(hasil.created_at)}</strong>
              </div>
              <div>
                <span>Pembaruan terakhir</span>
                <strong>{formatTanggal(hasil.updated_at)}</strong>
              </div>
              {hasil.selesai_at && (
                <div>
                  <span>Tanggal selesai</span>
                  <strong>{formatTanggal(hasil.selesai_at)}</strong>
                </div>
              )}
            </div>

            {hasil.catatan_publik && (
              <div className="cek-note">
                <strong>Informasi dari petugas</strong>
                <p>{hasil.catatan_publik}</p>
              </div>
            )}

            <h3>Riwayat Perkembangan</h3>

            {hasil.riwayat?.length ? (
              <ol className="cek-timeline">
                {hasil.riwayat.map((item, index) => (
                  <li key={`${item.created_at}-${index}`}>
                    <span className="cek-dot" />
                    <div>
                      <strong>
                        {labelStatus[item.status] || item.status}
                      </strong>
                      <time>{formatTanggal(item.created_at)}</time>
                      {item.catatan_publik && (
                        <p>{item.catatan_publik}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="cek-muted">
                Belum ada riwayat perkembangan yang tersedia.
              </p>
            )}

            <button
              type="button"
              className="cek-reset"
              onClick={() => {
                setHasil(null);
                setPin("");
              }}
            >
              Periksa Berkas Lain
            </button>
          </section>
        )}
      </section>

      <p className="cek-footnote">
        Jaga kerahasiaan PIN Anda. Jika mengalami kendala, silakan
        menghubungi Kantor Urusan Agama Kecamatan Panca Lautang.
      </p>

      <p className="cek-back">
        Belum mengajukan layanan?{" "}
        <a href="/ajukan-layanan">Ajukan permohonan di sini</a>
      </p>

      <style jsx>{`
        .cek-wrap {
          max-width: 800px;
          margin: 0 auto;
          padding: 36px 18px 60px;
          color: #17352d;
        }
        .cek-hero {
          text-align: center;
          padding: 24px 0 30px;
        }
        .cek-eyebrow {
          color: #17765a;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
        }
        .cek-hero h1 {
          margin: 12px 0;
          font-size: clamp(28px, 5vw, 40px);
        }
        .cek-hero p {
          max-width: 600px;
          margin: 0 auto;
          color: #61736c;
          line-height: 1.7;
        }
        .cek-card {
          padding: clamp(20px, 4vw, 34px);
          border: 1px solid #dce9e2;
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 12px 38px rgba(24, 68, 49, .07);
        }
        .cek-card > h2 {
          margin: 0 0 8px;
          font-size: 22px;
        }
        .cek-muted {
          color: #61736c;
          font-size: 14px;
          line-height: 1.65;
        }
        form {
          display: grid;
          gap: 10px;
          margin-top: 22px;
        }
        label {
          margin-top: 8px;
          font-size: 14px;
          font-weight: 700;
        }
        input {
          width: 100%;
          min-width: 0;
          padding: 13px;
          border: 1px solid #cbdad1;
          border-radius: 10px;
          background: #fff;
          color: #17352d;
          font: inherit;
        }
        input:focus {
          outline: 2px solid #2c8b69;
          outline-offset: 1px;
        }
        form button, .cek-reset {
          margin-top: 12px;
          padding: 14px;
          border: 0;
          border-radius: 10px;
          background: #176b50;
          color: white;
          font: inherit;
          font-weight: 750;
          cursor: pointer;
        }
        form button:disabled {
          opacity: .65;
          cursor: wait;
        }
        .cek-error {
          padding: 12px;
          border-radius: 9px;
          background: #fff0f0;
          color: #9b2222;
          font-size: 14px;
        }
        .cek-result {
          margin-top: 30px;
          padding-top: 25px;
          border-top: 1px solid #dce9e2;
        }
        .cek-result-heading {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .cek-result-heading > span:first-child {
          color: #61736c;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }
        .cek-result-heading h2 {
          margin: 0;
          font-size: 21px;
        }
        .cek-badge {
          display: inline-block;
          padding: 7px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 750;
        }
        .status-proses {
          background: #e8f1ff;
          color: #2457a7;
        }
        .status-selesai {
          background: #e1f6e8;
          color: #176b3b;
        }
        .status-perbaikan {
          background: #fff2d8;
          color: #86550a;
        }
        .status-akhir {
          background: #ffebeb;
          color: #a32b2b;
        }
        .cek-detail {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin: 22px 0;
        }
        .cek-detail > div {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 13px;
          border-radius: 10px;
          background: #f4f8f5;
          overflow-wrap: anywhere;
        }
        .cek-detail span {
          color: #61736c;
          font-size: 12px;
        }
        .cek-detail strong {
          font-size: 14px;
        }
        .cek-note {
          margin: 20px 0;
          padding: 15px;
          border-left: 4px solid #2c8b69;
          border-radius: 8px;
          background: #f1f7f3;
        }
        .cek-note p {
          margin-bottom: 0;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }
        .cek-result h3 {
          margin: 28px 0 18px;
        }
        .cek-timeline {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .cek-timeline li {
          position: relative;
          display: flex;
          gap: 13px;
          padding-bottom: 23px;
        }
        .cek-timeline li:not(:last-child)::before {
          content: "";
          position: absolute;
          left: 6px;
          top: 15px;
          bottom: 0;
          width: 2px;
          background: #dce9e2;
        }
        .cek-dot {
          flex: 0 0 14px;
          width: 14px;
          height: 14px;
          margin-top: 3px;
          border: 3px solid #2c8b69;
          border-radius: 50%;
          background: #fff;
          z-index: 1;
        }
        .cek-timeline li > div {
          min-width: 0;
        }
        .cek-timeline time {
          display: block;
          margin-top: 5px;
          color: #61736c;
          font-size: 12px;
        }
        .cek-timeline p {
          margin: 7px 0 0;
          color: #425b50;
          font-size: 14px;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }
        .cek-reset {
          width: 100%;
          background: #edf5f0;
          color: #176b50;
        }
        .cek-footnote, .cek-back {
          margin: 20px 4px 0;
          color: #61736c;
          text-align: center;
          font-size: 13px;
          line-height: 1.7;
        }
        .cek-back a {
          color: #176b50;
          font-weight: 750;
        }
        @media (max-width: 520px) {
          .cek-detail {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
