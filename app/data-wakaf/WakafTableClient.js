"use client";

import { useMemo, useState } from "react";

function statusLabel(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (["âˆš", "âœ“", "√", "✓", "v"].includes(normalized)) {
    return { text: "Ada", className: "wakaf-status wakaf-yes" };
  }

  if (["x", "×", "Ã—"].includes(normalized)) {
    return { text: "Belum ada", className: "wakaf-status wakaf-no" };
  }

  return { text: "Belum diisi", className: "wakaf-status wakaf-empty" };
}

export default function WakafTableClient({ data }) {
  const [query, setQuery] = useState("");
  const [desa, setDesa] = useState("Semua lokasi");
  const [jenis, setJenis] = useState("Semua peruntukan");
  const villages = useMemo(() => [...new Set(data.map((x) => x.lokasi).filter(Boolean))].sort((a,b) => a.localeCompare(b, "id")), [data]);
  const types = useMemo(() => [...new Set(data.map((x) => x.peruntukan).filter(Boolean))].sort((a,b) => a.localeCompare(b, "id")), [data]);
  const filtered = useMemo(() => data.filter((item) => {
    const haystack = [item.nama,item.lokasi,item.wakif,item.nazhir,item.peruntukan].join(" ").toLowerCase();
    return haystack.includes(query.trim().toLowerCase()) &&
      (desa === "Semua lokasi" || item.lokasi === desa) &&
      (jenis === "Semua peruntukan" || item.peruntukan === jenis);
  }), [data, query, desa, jenis]);

  return <>
    <div className="wakaf-toolbar">
      <input className="wakaf-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama objek, wakif, atau nazhir..." aria-label="Cari data wakaf" />
      <select className="wakaf-select" value={desa} onChange={(e) => setDesa(e.target.value)} aria-label="Filter lokasi">
        <option>Semua lokasi</option>{villages.map((v) => <option key={v}>{v}</option>)}
      </select>
      <select className="wakaf-select" value={jenis} onChange={(e) => setJenis(e.target.value)} aria-label="Filter peruntukan">
        <option>Semua peruntukan</option>{types.map((v) => <option key={v}>{v}</option>)}
      </select>
      <a className="wakaf-download" href="/unduhan/data-objek-wakaf-2026.xlsx" download>Unduh Excel 2026</a>
    </div>
    <div className="wakaf-count">Menampilkan <strong>{filtered.length}</strong> dari {data.length} entri</div>
    <div className="wakaf-table-wrap">
      <table className="wakaf-table">
        <thead><tr><th>No.</th><th>Nama objek wakaf</th><th>Lokasi</th><th>Luas tanah</th><th>Peruntukan</th><th>AIW/APAIW</th><th>Sertifikat</th><th>Wakif</th><th>Nazhir</th></tr></thead>
        <tbody>
          {filtered.map((item) => {
            const aiw = statusLabel(item.aiw);
            const sertifikat = statusLabel(item.sertifikat);
            return <tr key={`${item.no}-${item.nama}`}>
              <td>{item.no}</td><td className="wakaf-name">{item.nama}</td><td>{item.lokasi || "Belum diisi"}</td><td>{item.luas || "Belum diisi"}</td><td>{item.peruntukan || "Belum diisi"}</td>
              <td><span className={aiw.className}>{aiw.text}</span></td><td><span className={sertifikat.className}>{sertifikat.text}</span></td>
              <td>{item.wakif || "Belum diisi"}</td><td>{item.nazhir || "Belum diisi"}</td>
            </tr>;
          })}
          {filtered.length === 0 && <tr><td colSpan={9} className="wakaf-empty-state">Data tidak ditemukan. Ubah kata pencarian atau filter.</td></tr>}
        </tbody>
      </table>
    </div>
    <div className="wakaf-note"><strong>Keterangan status:</strong> tanda centang (✓) ditampilkan sebagai "Ada", tanda silang (X) sebagai "Belum ada", dan kolom kosong sebagai "Belum diisi". Data ditampilkan sesuai berkas Excel sumber; mohon verifikasi kembali sebelum digunakan sebagai dasar administrasi resmi.</div>
  </>;
}
