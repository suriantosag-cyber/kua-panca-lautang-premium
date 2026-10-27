
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "../../../lib/admin-client";

const STATUS = [
  { value: "diajukan", label: "Diajukan" },
  { value: "menunggu_verifikasi", label: "Menunggu verifikasi" },
  { value: "diproses", label: "Diproses" },
  { value: "perlu_perbaikan", label: "Perlu perbaikan" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

const LABEL = Object.fromEntries(
  STATUS.map((item) => [item.value, item.label])
);

function tanggal(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminCekStatusBerkasPage() {
  const [data, setData] = useState([]);
  const [pilihan, setPilihan] = useState(null);
  const [filter, setFilter] = useState("");
  const [cari, setCari] = useState("");
  const [statusBaru, setStatusBaru] = useState("diajukan");
  const [catatanPublik, setCatatanPublik] = useState("");
  const [catatanInternal, setCatatanInternal] = useState("");
  const [loading, setLoading] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState("");

  const muatData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (filter) params.set("status", filter);
      if (cari.trim()) params.set("q", cari.trim());

      const response = await adminFetch(
        `/api/admin/permohonan?${params.toString()}`,
        { cache: "no-store" }
      );
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal memuat permohonan.");
      }

      const daftar = Array.isArray(result.data) ? result.data : [];
      setData(daftar);

      setPilihan((sebelumnya) => {
        if (!sebelumnya) return null;
        return daftar.find((item) => item.id === sebelumnya.id) || null;
      });
    } catch (err) {
      setError(err.message || "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, [filter, cari]);

  useEffect(() => {
    muatData();
  }, [muatData]);

  function pilihPermohonan(item) {
    setPilihan(item);
    setStatusBaru(item.status);
    setCatatanPublik(item.catatan_publik || "");
    setCatatanInternal(item.catatan_internal || "");
    setPesan("");
    setError("");
  }

  async function simpanPerubahan(event) {
    event.preventDefault();
    if (!pilihan || menyimpan) return;

    setMenyimpan(true);
    setPesan("");
    setError("");

    try {
      const response = await adminFetch("/api/admin/permohonan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pilihan.id,
          status: statusBaru,
          catatan_publik: catatanPublik,
          catatan_internal: catatanInternal,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal menyimpan perubahan.");
      }

      setPesan(
        result.warning ||
        result.message ||
        "Perubahan berhasil disimpan."
      );

      await muatData();

      if (result.data) {
        setPilihan(result.data);
        setStatusBaru(result.data.status || statusBaru);
        setCatatanPublik(result.data.catatan_publik || catatanPublik);
        setCatatanInternal(result.data.catatan_internal || catatanInternal);
      }
    } catch (err) {
      setError(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <main className="wrap">
      <header className="header">
        <div>
          <p className="eyebrow">KANTOR URUSAN AGAMA</p>
          <h1>Pengelolaan Permohonan Layanan</h1>
          <p className="sub">
            Tinjau permohonan masyarakat dan perbarui status penanganannya.
          </p>
        </div>
        <Link href="/admin" className="back">← Kembali ke Admin</Link>
      </header>

      <section className="toolbar">
        <label>
          Cari permohonan
          <input
            value={cari}
            onChange={(event) => setCari(event.target.value)}
            placeholder="Nama, nomor HP, atau kode tracking"
          />
        </label>
        <label>
          Filter status
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="">Semua status</option>
            {STATUS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={muatData} disabled={loading}>
          {loading ? "Memuat..." : "Muat ulang"}
        </button>
      </section>

      {error && <p className="notice error">{error}</p>}
      {pesan && <p className="notice success">{pesan}</p>}

      <p className="count">
        {loading ? "Memuat data..." : `${data.length} permohonan ditampilkan`}
      </p>

      <div className="layout">
        <section className="list">
          <h2>Daftar permohonan</h2>
          {!loading && data.length === 0 && (
            <p className="empty">Belum ada permohonan yang cocok.</p>
          )}

          {data.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`item ${pilihan?.id === item.id ? "active" : ""}`}
              onClick={() => pilihPermohonan(item)}
            >
              <span className="itemTop">
                <strong>{item.nama_pemohon}</strong>
                <span className={`status status-${item.status}`}>
                  {LABEL[item.status] || item.status}
                </span>
              </span>
              <span className="code">{item.kode_tracking}</span>
              <span>{item.jenis_layanan}</span>
              <span className="muted">{tanggal(item.created_at)}</span>
            </button>
          ))}
        </section>

        <section className="detail">
          {!pilihan ? (
            <div className="empty detailEmpty">
              <h2>Detail permohonan</h2>
              <p>Pilih permohonan dari daftar untuk melihat detailnya.</p>
            </div>
          ) : (
            <>
              <div className="detailHeading">
                <div>
                  <p className="eyebrow">KODE TRACKING</p>
                  <h2>{pilihan.kode_tracking}</h2>
                </div>
                <span className={`status status-${pilihan.status}`}>
                  {LABEL[pilihan.status] || pilihan.status}
                </span>
              </div>

              <dl className="facts">
                <dt>Nama pemohon</dt><dd>{pilihan.nama_pemohon || "-"}</dd>
                <dt>Nomor HP</dt><dd>{pilihan.nomor_hp || "-"}</dd>
                <dt>Email</dt><dd>{pilihan.email || "-"}</dd>
                <dt>Jenis layanan</dt><dd>{pilihan.jenis_layanan || "-"}</dd>
                <dt>Desa/Kelurahan</dt><dd>{pilihan.desa || "-"}</dd>
                <dt>Tanggal pengajuan</dt><dd>{tanggal(pilihan.created_at)}</dd>
                <dt>Keperluan</dt><dd className="longText">{pilihan.keperluan || "-"}</dd>
                <dt>Catatan pemohon</dt><dd className="longText">{pilihan.catatan_pemohon || "-"}</dd>
              </dl>

              <form onSubmit={simpanPerubahan}>
                <h3>Perbarui penanganan</h3>
                <label>
                  Status permohonan
                  <select
                    value={statusBaru}
                    onChange={(event) => setStatusBaru(event.target.value)}
                    required
                  >
                    {STATUS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Catatan untuk pemohon
                  <textarea
                    value={catatanPublik}
                    onChange={(event) => setCatatanPublik(event.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Informasi yang boleh dilihat pemohon saat cek status"
                  />
                </label>

                <label>
                  Catatan internal petugas
                  <textarea
                    value={catatanInternal}
                    onChange={(event) => setCatatanInternal(event.target.value)}
                    maxLength={2000}
                    rows={3}
                    placeholder="Catatan internal, tidak ditampilkan kepada pemohon"
                  />
                </label>

                <button className="save" type="submit" disabled={menyimpan}>
                  {menyimpan ? "Menyimpan..." : "Simpan perubahan"}
                </button>
              </form>
            </>
          )}
        </section>
      </div>

      <style jsx>{`
        .wrap { max-width: 1240px; margin: 0 auto; padding: 32px 20px 60px; color: #18312b; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 24px; }
        .eyebrow { color: #557568; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; margin: 0 0 8px; }
        h1 { font-size: clamp(25px, 4vw, 36px); line-height: 1.2; margin: 0; }
        .sub { color: #64756f; margin-top: 10px; }
        .back { color: #176b4d; font-weight: 700; text-decoration: none; white-space: nowrap; }
        .toolbar { display: grid; grid-template-columns: minmax(220px, 1fr) minmax(180px, .55fr) auto; gap: 12px; align-items: end; background: #f5f8f6; padding: 16px; border: 1px solid #dfe8e2; border-radius: 14px; }
        label { display: grid; gap: 7px; font-size: 13px; font-weight: 700; margin-bottom: 14px; }
        .toolbar label { margin: 0; }
        input, select, textarea { width: 100%; box-sizing: border-box; padding: 11px 12px; border: 1px solid #cbd8d0; border-radius: 9px; background: white; color: #18312b; font: inherit; }
        button { font: inherit; cursor: pointer; }
        .toolbar button, .save { border: 0; border-radius: 9px; background: #176b4d; color: white; padding: 12px 16px; font-weight: 750; }
        button:disabled { opacity: .6; cursor: wait; }
        .count { color: #64756f; font-size: 13px; margin: 18px 0 10px; }
        .layout { display: grid; grid-template-columns: minmax(280px, .82fr) minmax(0, 1.5fr); gap: 18px; align-items: start; }
        .list, .detail { min-width: 0; border: 1px solid #dfe8e2; border-radius: 14px; padding: 18px; background: white; }
        h2 { font-size: 19px; margin: 0 0 14px; overflow-wrap: anywhere; }
        .item { display: grid; gap: 7px; width: 100%; text-align: left; padding: 13px; border: 1px solid #e0e8e3; border-radius: 10px; background: #fff; margin-top: 10px; color: #18312b; }
        .item.active { border-color: #27815e; background: #f1f8f3; box-shadow: 0 0 0 1px #27815e; }
        .itemTop { display: flex; justify-content: space-between; gap: 8px; align-items: flex-start; flex-wrap: wrap; }
        .code { color: #176b4d; font-size: 12px; font-weight: 800; }
        .muted { color: #6c7d75; font-size: 12px; }
        .status { display: inline-block; border-radius: 99px; padding: 5px 9px; background: #edf1ef; color: #40554b; font-size: 11px; font-weight: 800; }
        .status-selesai { background: #e0f5e8; color: #176b42; }
        .status-ditolak, .status-dibatalkan { background: #ffeded; color: #9e3333; }
        .status-diproses, .status-menunggu_verifikasi { background: #fff3d8; color: #80570c; }
        .detailHeading { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; flex-wrap: wrap; }
        .facts { display: grid; grid-template-columns: minmax(115px, .65fr) minmax(0, 1.35fr); gap: 10px 14px; font-size: 13px; border-top: 1px solid #e6ece8; padding-top: 16px; }
        dt { color: #64756f; }
        dd { margin: 0; font-weight: 600; overflow-wrap: anywhere; }
        .longText { white-space: pre-wrap; }
        form { margin-top: 24px; border-top: 1px solid #e6ece8; padding-top: 20px; }
        h3 { font-size: 17px; margin: 0 0 16px; }
        .save { width: 100%; }
        .notice { border-radius: 10px; padding: 12px 14px; overflow-wrap: anywhere; }
        .error { background: #fff0f0; color: #9b2929; }
        .success { background: #eaf8ef; color: #176b42; }
        .empty { color: #6c7d75; padding: 18px 4px; }
        .detailEmpty { min-height: 120px; }
        @media (max-width: 760px) {
          .header { flex-direction: column; }
          .toolbar, .layout { grid-template-columns: 1fr; }
          .toolbar button { width: 100%; }
          .wrap { padding: 24px 14px 40px; }
          .facts { grid-template-columns: 1fr; gap: 5px; }
          dd { margin-bottom: 9px; }
        }
      `}</style>
    </main>
  );
}
