"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "../../../lib/admin-client";

const FORM_KOSONG = {
  nama: "",
  jenis: "masjid",
  desa: "",
  alamat: "",
  keterangan: "",
  status: "menunggu",
};

const STATUS = {
  menunggu: "Menunggu",
  tampil: "Tampil di website",
  ditolak: "Ditolak",
};

export default function AdminDataMasjidPage() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(FORM_KOSONG);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("semua");
  const [cari, setCari] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState("");

  const muatData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminFetch("/api/data-masjid", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal memuat data.");
      }

      setData(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || "Gagal memuat data. Silakan login kembali.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muatData();
  }, [muatData]);

  function ubahForm(e) {
    setForm((sebelumnya) => ({
      ...sebelumnya,
      [e.target.name]: e.target.value,
    }));
  }

  function mulaiEdit(item) {
    setEditingId(item.id);
    setForm({
      nama: item.nama || "",
      jenis: item.jenis || "masjid",
      desa: item.desa || "",
      alamat: item.alamat || "",
      keterangan: item.keterangan || "",
      status: item.status || "menunggu",
    });
    setPesan("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function batalEdit() {
    setEditingId(null);
    setForm(FORM_KOSONG);
    setPesan("");
    setError("");
  }

  async function simpan(e) {
    e.preventDefault();
    setSaving(true);
    setPesan("");
    setError("");

    try {
      const response = await adminFetch("/api/data-masjid", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { id: editingId, ...form } : form
        ),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Data gagal disimpan.");
      }

      setPesan(editingId ? "Perubahan data berhasil disimpan." : "Data baru berhasil ditambahkan.");
      setForm(FORM_KOSONG);
      setEditingId(null);
      await muatData();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function hapus(item) {
    if (!window.confirm(`Hapus ${item.nama}? Data yang dihapus tidak dapat dipulihkan.`)) {
      return;
    }

    setPesan("");
    setError("");

    try {
      const response = await adminFetch("/api/data-masjid", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Data gagal dihapus.");
      }

      setPesan("Data berhasil dihapus.");
      if (editingId === item.id) batalEdit();
      await muatData();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menghapus.");
    }
  }

  const hasil = data.filter((item) => {
    const cocokStatus = filter === "semua" || item.status === filter;
    const kata = cari.trim().toLowerCase();
    const cocokCari =
      !kata ||
      [item.nama, item.desa, item.alamat, item.jenis]
        .some((nilai) => (nilai || "").toLowerCase().includes(kata));

    return cocokStatus && cocokCari;
  });

  const jumlahTampil = data.filter((item) => item.status === "tampil").length;
  const jumlahMenunggu = data.filter((item) => item.status === "menunggu").length;

  const kartu = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 18,
  };

  const labelStyle = {
    display: "block",
    fontWeight: 600,
    marginBottom: 6,
    color: "#334155",
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    fontSize: 14,
    boxSizing: "border-box",
    background: "#fff",
    color: "#172033",
  };

  const tombol = {
    border: 0,
    borderRadius: 8,
    padding: "10px 15px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f1f5f9", padding: "24px 16px 48px", color: "#172033" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <a href="/admin" style={{ color: "#166534", textDecoration: "none", fontWeight: 600 }}>
          ← Kembali ke Dashboard Admin
        </a>

        <header style={{ margin: "20px 0 24px" }}>
          <p style={{ color: "#15803d", fontWeight: 700, marginBottom: 6 }}>
            ADMIN KUA PANCA LAUTANG
          </p>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", margin: "0 0 8px" }}>
            Data Masjid &amp; Mushalla
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Tambah, perbaiki, dan atur data yang ditampilkan di website publik.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 22 }}>
          <div style={kartu}>
            <div style={{ color: "#64748b", fontSize: 13 }}>Total data</div>
            <strong style={{ display: "block", fontSize: 28, marginTop: 6 }}>{data.length}</strong>
          </div>
          <div style={kartu}>
            <div style={{ color: "#64748b", fontSize: 13 }}>Tampil di website</div>
            <strong style={{ display: "block", fontSize: 28, marginTop: 6, color: "#15803d" }}>{jumlahTampil}</strong>
          </div>
          <div style={kartu}>
            <div style={{ color: "#64748b", fontSize: 13 }}>Menunggu pemeriksaan</div>
            <strong style={{ display: "block", fontSize: 28, marginTop: 6, color: "#b45309" }}>{jumlahMenunggu}</strong>
          </div>
        </div>

        {pesan && (
          <div role="status" style={{ ...kartu, marginBottom: 16, color: "#166534", borderColor: "#86efac" }}>
            {pesan}
          </div>
        )}
        {error && (
          <div role="alert" style={{ ...kartu, marginBottom: 16, color: "#b91c1c", borderColor: "#fca5a5" }}>
            {error}
          </div>
        )}

        <section style={{ ...kartu, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0, fontSize: 21 }}>
            {editingId ? "Edit Data" : "Tambah Masjid atau Mushalla"}
          </h2>

          <form onSubmit={simpan}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              <div>
                <label htmlFor="nama" style={labelStyle}>Nama masjid/mushalla *</label>
                <input id="nama" name="nama" value={form.nama} onChange={ubahForm} required maxLength={200} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="jenis" style={labelStyle}>Jenis *</label>
                <select id="jenis" name="jenis" value={form.jenis} onChange={ubahForm} style={inputStyle}>
                  <option value="masjid">Masjid</option>
                  <option value="mushalla">Mushalla</option>
                </select>
              </div>
              <div>
                <label htmlFor="desa" style={labelStyle}>Desa/Kelurahan *</label>
                <input id="desa" name="desa" value={form.desa} onChange={ubahForm} required maxLength={150} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="alamat" style={labelStyle}>Alamat</label>
                <input id="alamat" name="alamat" value={form.alamat} onChange={ubahForm} maxLength={500} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="status" style={labelStyle}>Status publikasi</label>
                <select id="status" name="status" value={form.status} onChange={ubahForm} style={inputStyle}>
                  <option value="menunggu">Menunggu</option>
                  <option value="tampil">Tampil di website</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
              <div>
                <label htmlFor="keterangan" style={labelStyle}>Keterangan</label>
                <textarea id="keterangan" name="keterangan" value={form.keterangan} onChange={ubahForm} rows={3} maxLength={2000} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <button type="submit" disabled={saving} style={{ ...tombol, background: saving ? "#94a3b8" : "#166534", color: "#fff" }}>
                {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Data"}
              </button>
              {editingId && (
                <button type="button" onClick={batalEdit} style={{ ...tombol, background: "#e2e8f0", color: "#334155" }}>
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section style={kartu}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontSize: 21 }}>Daftar Data</h2>
            <button type="button" onClick={muatData} disabled={loading} style={{ ...tombol, background: "#e2e8f0", color: "#334155" }}>
              {loading ? "Memuat..." : "↻ Muat Ulang"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, margin: "18px 0" }}>
            <input aria-label="Cari data" placeholder="Cari nama atau desa..." value={cari} onChange={(e) => setCari(e.target.value)} style={inputStyle} />
            <select aria-label="Filter status" value={filter} onChange={(e) => setFilter(e.target.value)} style={inputStyle}>
              <option value="semua">Semua status</option>
              <option value="menunggu">Menunggu</option>
              <option value="tampil">Tampil di website</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>

          {loading ? (
            <p>Memuat data masjid dan mushalla...</p>
          ) : hasil.length === 0 ? (
            <p style={{ color: "#64748b" }}>Tidak ada data yang sesuai.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {hasil.map((item) => (
                <article key={item.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 0, flex: "1 1 220px" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ background: "#dcfce7", color: "#166534", borderRadius: 20, padding: "4px 9px", fontSize: 12, fontWeight: 700 }}>
                          {item.jenis === "mushalla" ? "Mushalla" : "Masjid"}
                        </span>
                        <span style={{ background: item.status === "tampil" ? "#dcfce7" : item.status === "ditolak" ? "#fee2e2" : "#fef3c7", color: item.status === "tampil" ? "#166534" : item.status === "ditolak" ? "#991b1b" : "#92400e", borderRadius: 20, padding: "4px 9px", fontSize: 12, fontWeight: 700 }}>
                          {STATUS[item.status] || item.status}
                        </span>
                      </div>
                      <h3 style={{ margin: "0 0 6px", fontSize: 18, overflowWrap: "anywhere" }}>{item.nama}</h3>
                      <p style={{ margin: "0 0 5px", color: "#475569" }}>Desa: {item.desa}</p>
                      {item.alamat && <p style={{ margin: "0 0 5px", color: "#64748b" }}>Alamat: {item.alamat}</p>}
                      {item.keterangan && <p style={{ margin: "8px 0 0", color: "#64748b", whiteSpace: "pre-wrap" }}>{item.keterangan}</p>}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" onClick={() => mulaiEdit(item)} style={{ ...tombol, background: "#dbeafe", color: "#1d4ed8" }}>Edit</button>
                      <button type="button" onClick={() => hapus(item)} style={{ ...tombol, background: "#fee2e2", color: "#b91c1c" }}>Hapus</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <p style={{ marginTop: 16, fontSize: 13, color: "#64748b" }}>
            Menampilkan {hasil.length} dari {data.length} data.
          </p>
        </section>
      </div>
    </main>
  );
}
