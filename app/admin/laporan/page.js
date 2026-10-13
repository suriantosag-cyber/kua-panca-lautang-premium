"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "../../../lib/supabase-browser";

const namaBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function hitungRekap(items, ambilKunci) {
  const hasil = new Map();

  for (const item of items) {
    const kunci = String(ambilKunci(item) || "").trim() || "Belum diisi";
    hasil.set(kunci, (hasil.get(kunci) || 0) + 1);
  }

  return [...hasil.entries()]
    .map(([nama, jumlah]) => ({ nama, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah || a.nama.localeCompare(b.nama));
}

export default function LaporanTahunanPage() {
  const tahunSekarang = new Date().getFullYear();
  const [tahun, setTahun] = useState(tahunSekarang);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    let aktif = true;

    async function periksaSesi() {
      const { data: hasil } = await supabaseBrowser.auth.getSession();
      if (!aktif) return;
      setSiap(Boolean(hasil.session?.access_token));
    }

    periksaSesi();

    return () => {
      aktif = false;
    };
  }, []);

  useEffect(() => {
    if (!siap) {
      setLoading(false);
      return;
    }

    let aktif = true;

    async function muatLaporan() {
      setLoading(true);
      setError("");

      try {
        const { data: hasilSesi, error: errorSesi } =
          await supabaseBrowser.auth.getSession();

        const token = hasilSesi?.session?.access_token;

        if (errorSesi || !token) {
          throw new Error("Sesi Admin tidak ditemukan. Silakan login kembali.");
        }

        const response = await fetch(`/api/laporan-tahunan?tahun=${tahun}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store"
        });

        const hasil = await response.json();

        if (!response.ok || !hasil.ok) {
          throw new Error(hasil.error || "Gagal memuat laporan tahunan.");
        }

        if (aktif) setData(hasil.data || []);
      } catch (err) {
        if (aktif) {
          setData([]);
          setError(err.message || "Terjadi kesalahan saat memuat laporan.");
        }
      } finally {
        if (aktif) setLoading(false);
      }
    }

    muatLaporan();

    return () => {
      aktif = false;
    };
  }, [tahun, siap]);

  const rekapBulan = useMemo(
    () => hitungRekap(data, (item) => {
      const tanggal = new Date(`${item.tanggal}T00:00:00`);
      return Number.isNaN(tanggal.getTime())
        ? "Tanggal tidak valid"
        : namaBulan[tanggal.getMonth()];
    }),
    [data]
  );

  const rekapKategori = useMemo(
    () => hitungRekap(data, (item) => item.kategori),
    [data]
  );

  const rekapDesa = useMemo(
    () => hitungRekap(data, (item) => item.desa),
    [data]
  );

  const desaTerjangkau = new Set(
    data.map((item) => String(item.desa || "").trim()).filter(Boolean)
  ).size;

  const totalBulan = (bulan) => data.filter((item) => {
    const tanggal = new Date(`${item.tanggal}T00:00:00`);
    return !Number.isNaN(tanggal.getTime()) && tanggal.getMonth() === bulan;
  }).length;

  if (!siap && !loading) {
    return (
      <main style={gaya.halaman}>
        <h1>Rekapitulasi Kinerja Tahunan KUA</h1>
        <p>Sesi Admin tidak ditemukan. Silakan login melalui halaman Admin terlebih dahulu.</p>
        <a href="/admin">Kembali ke Admin</a>
      </main>
    );
  }

  return (
    <main style={gaya.halaman}>
      <div style={gaya.kepala} className="no-print">
        <a href="/admin" style={gaya.kembali}>← Kembali ke Admin</a>
        <button onClick={() => window.print()} style={gaya.tombol}>
          Cetak / Simpan PDF
        </button>
      </div>

      <header style={gaya.judul}>
        <p style={gaya.instansi}>KANTOR URUSAN AGAMA KECAMATAN PANCA LAUTANG</p>
        <h1 style={{ margin: "8px 0" }}>Rekapitulasi Kinerja Tahunan</h1>
        <p style={{ margin: 0 }}>Bidang Bimbingan Masyarakat Islam</p>
        <div className="no-print" style={{ marginTop: 18 }}>
          <label htmlFor="pilih-tahun" style={{ marginRight: 10 }}>Tahun laporan</label>
          <select
            id="pilih-tahun"
            value={tahun}
            onChange={(event) => setTahun(Number(event.target.value))}
            style={gaya.pilih}
          >
            {Array.from({ length: Math.max(1, tahunSekarang - 2020 + 2) }, (_, i) =>
              tahunSekarang + 1 - i
            ).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <p style={gaya.catatan}>
          Laporan dihitung dari kegiatan berstatus disetujui dengan tanggal kegiatan pada tahun terpilih.
        </p>
      </header>

      {error && <div role="alert" style={gaya.error}>{error}</div>}

      {loading ? (
        <p>Memuat data laporan...</p>
      ) : (
        <>
          <section style={gaya.kartuGrid}>
            <Kartu judul="Kegiatan disetujui" angka={data.length} />
            <Kartu judul="Desa/kelurahan terjangkau" angka={desaTerjangkau} />
            <Kartu judul="Kategori kegiatan" angka={rekapKategori.length} />
          </section>

          {data.length === 0 && (
            <p style={gaya.catatan}>
              Belum ada kegiatan disetujui yang tercatat untuk tahun {tahun}. Angka nol ini bukan bukti bahwa kegiatan tidak pernah berlangsung; periksa kembali kelengkapan pencatatan.
            </p>
          )}

          <Bagian judul="Rekapitulasi Bulanan">
            <div style={gaya.bulanGrid}>
              {namaBulan.map((nama, index) => (
                <div key={nama} style={gaya.bulanItem}>
                  <span>{nama}</span>
                  <strong>{totalBulan(index)}</strong>
                </div>
              ))}
            </div>
          </Bagian>

          <div style={gaya.duaKolom}>
            <Bagian judul="Rekap Berdasarkan Kategori">
              <TabelRekap items={rekapKategori} />
            </Bagian>
            <Bagian judul="Rekap Berdasarkan Desa/Kelurahan">
              <TabelRekap items={rekapDesa} />
            </Bagian>
          </div>

          <Bagian judul="Rincian Kegiatan Terverifikasi">
            <div style={{ overflowX: "auto" }}>
              <table style={gaya.tabel}>
                <thead>
                  <tr>
                    <th style={gaya.th}>No.</th>
                    <th style={gaya.th}>Tanggal</th>
                    <th style={gaya.th}>Nama Kegiatan</th>
                    <th style={gaya.th}>Penyelenggara</th>
                    <th style={gaya.th}>Kategori</th>
                    <th style={gaya.th}>Desa/Kelurahan</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id}>
                      <td style={gaya.td}>{index + 1}</td>
                      <td style={gaya.td}>{item.tanggal || "—"}</td>
                      <td style={gaya.td}>{item.nama_kegiatan || "—"}</td>
                      <td style={gaya.td}>{item.penyelenggara || "—"}</td>
                      <td style={gaya.td}>{item.kategori || "Belum diisi"}</td>
                      <td style={gaya.td}>{item.desa || "Belum diisi"}</td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={6} style={gaya.td}>Belum ada data kegiatan untuk ditampilkan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Bagian>

          <footer style={gaya.kaki}>
            <p>Dokumen rekapitulasi berdasarkan data kegiatan terverifikasi dalam sistem.</p>
            <p>Dicetak pada: {new Date().toLocaleDateString("id-ID")}</p>
          </footer>
        </>
      )}

      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          body { background: white !important; }
          .no-print { display: none !important; }
          main { max-width: none !important; padding: 0 !important; }
          section, table { break-inside: avoid; }
          thead { display: table-header-group; }
          tr { break-inside: avoid; }
        }
      `}</style>
    </main>
  );
}

function Kartu({ judul, angka }) {
  return (
    <div style={gaya.kartu}>
      <div style={gaya.kartuJudul}>{judul}</div>
      <div style={gaya.angka}>{angka}</div>
    </div>
  );
}

function Bagian({ judul, children }) {
  return (
    <section style={gaya.bagian}>
      <h2 style={gaya.bagianJudul}>{judul}</h2>
      {children}
    </section>
  );
}

function TabelRekap({ items }) {
  return (
    <table style={gaya.tabel}>
      <thead>
        <tr>
          <th style={gaya.th}>Nama</th>
          <th style={gaya.th}>Jumlah</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.nama}>
            <td style={gaya.td}>{item.nama}</td>
            <td style={gaya.td}>{item.jumlah}</td>
          </tr>
        ))}
        {items.length === 0 && (
          <tr><td colSpan={2} style={gaya.td}>Belum ada data.</td></tr>
        )}
      </tbody>
    </table>
  );
}

const gaya = {
  halaman: { maxWidth: 1180, margin: "0 auto", padding: 24, color: "#172033", fontFamily: "Arial, sans-serif" },
  kepala: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 24 },
  kembali: { color: "#155e75", textDecoration: "none" },
  tombol: { padding: "10px 16px", border: 0, borderRadius: 8, background: "#155e75", color: "white", cursor: "pointer" },
  judul: { textAlign: "center", padding: "24px 12px", borderBottom: "2px solid #cbd5e1", marginBottom: 24 },
  instansi: { fontWeight: 700, letterSpacing: 1, fontSize: 13 },
  catatan: { color: "#64748b", fontSize: 13, lineHeight: 1.6 },
  pilih: { padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 },
  error: { padding: 12, border: "1px solid #fecaca", background: "#fef2f2", color: "#991b1b", borderRadius: 8, marginBottom: 16 },
  kartuGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 },
  kartu: { border: "1px solid #dbe3ec", borderRadius: 12, padding: 18, background: "#f8fafc" },
  kartuJudul: { color: "#475569", fontSize: 14 },
  angka: { fontSize: 32, fontWeight: 700, marginTop: 8 },
  bagian: { marginBottom: 26 },
  bagianJudul: { fontSize: 18, borderBottom: "1px solid #cbd5e1", paddingBottom: 9 },
  bulanGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 },
  bulanItem: { display: "flex", justifyContent: "space-between", gap: 8, padding: 10, border: "1px solid #e2e8f0", borderRadius: 8 },
  duaKolom: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 },
  tabel: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", background: "#f1f5f9", padding: 9, border: "1px solid #cbd5e1" },
  td: { padding: 9, border: "1px solid #e2e8f0", verticalAlign: "top" },
  kaki: { marginTop: 36, borderTop: "1px solid #cbd5e1", paddingTop: 12, fontSize: 12, color: "#64748b" }
};
