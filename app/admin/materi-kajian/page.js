"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "../../../lib/admin-client";

const blank = { title: "", category: "Keluarga Sakinah", excerpt: "", content: "", published: false };
const inputStyle = { width: "100%", padding: 12, border: "1px solid #d0d5dd", borderRadius: 10, boxSizing: "border-box", marginTop: 6, marginBottom: 16 };

export default function AdminMateriKajianPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadItems() {
    try {
      const response = await adminFetch("/api/kajian-keluarga-sakinah?admin=1", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Gagal memuat materi.");
      setItems(result.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => { loadItems(); }, []);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function reset() {
    setForm(blank);
    setEditingId(null);
  }

  async function save(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await adminFetch("/api/kajian-keluarga-sakinah", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingId }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Materi gagal disimpan.");
      setMessage(form.published ? "Materi berhasil disimpan dan diterbitkan." : "Materi berhasil disimpan sebagai draft.");
      reset();
      await loadItems();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      category: item.category || "Keluarga Sakinah",
      excerpt: item.excerpt || "",
      content: item.content || "",
      published: item.published === true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!window.confirm("Yakin ingin menghapus materi ini?")) return;
    setLoading(true);
    try {
      const response = await adminFetch("/api/kajian-keluarga-sakinah", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Materi gagal dihapus.");
      setMessage("Materi berhasil dihapus.");
      await loadItems();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f3f7f4", padding: "28px 16px 56px", color: "#172033" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <a href="/admin" style={{ color: "#146c43", fontWeight: 700, textDecoration: "none" }}>← Kembali ke Dashboard Admin</a>
        <h1 style={{ marginBottom: 6 }}>Kelola Materi Kajian Keluarga Sakinah</h1>
        <p style={{ color: "#667085", marginTop: 0 }}>Tulis materi langsung di sini. Materi berstatus Terbit akan tampil di halaman publik.</p>

        <form onSubmit={save} style={{ background: "#fff", padding: 24, borderRadius: 16, boxShadow: "0 5px 20px rgba(0,0,0,.05)" }}>
          <h2>{editingId ? "Edit Materi" : "Tambah Materi Baru"}</h2>
          <label>Judul Materi</label>
          <input required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Contoh: Antara Cinta dan Rasa Nyaman" style={inputStyle} />
          <label>Kategori</label>
          <select value={form.category} onChange={(e) => update("category", e.target.value)} style={inputStyle}>
            {["Keluarga Sakinah", "Bimbingan Catin", "Komunikasi Pasangan", "Parenting Islami", "Fikih Keluarga", "Resolusi Konflik", "Akhlak Keluarga", "Lainnya"].map((value) => <option key={value}>{value}</option>)}
          </select>
          <label>Ringkasan Materi</label>
          <textarea rows={3} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="Ringkasan singkat untuk kartu materi..." style={{ ...inputStyle, resize: "vertical" }} />
          <label>Isi Materi Lengkap</label>
          <textarea required rows={14} value={form.content} onChange={(e) => update("content", e.target.value)} placeholder="Ketik atau tempel materi lengkap di sini..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
          <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} />
            Terbitkan materi agar tampil di halaman publik
          </label>
          <button disabled={loading} type="submit" style={{ padding: "12px 20px", border: 0, borderRadius: 10, background: "#146c43", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{loading ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Materi"}</button>
          {editingId && <button type="button" onClick={reset} style={{ marginLeft: 10, padding: "12px 20px", border: "1px solid #d0d5dd", borderRadius: 10, background: "#fff" }}>Batal Edit</button>}
          {message && <p role="status" style={{ marginTop: 16, color: "#146c43", fontWeight: 600 }}>{message}</p>}
        </form>

        <section style={{ marginTop: 24, background: "#fff", padding: 24, borderRadius: 16, boxShadow: "0 5px 20px rgba(0,0,0,.05)" }}>
          <h2>Daftar Materi ({items.length})</h2>
          {items.length === 0 ? <p>Belum ada materi yang dimasukkan.</p> : items.map((item) => (
            <article key={item.id} style={{ padding: "18px 0", borderBottom: "1px solid #eaecf0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div><small style={{ color: "#667085" }}>{item.category || "Keluarga Sakinah"}</small><h3 style={{ margin: "5px 0" }}>{item.title}</h3></div>
                <strong style={{ color: item.published ? "#15803d" : "#a16207" }}>{item.published ? "Terbit" : "Draft"}</strong>
              </div>
              <p style={{ color: "#667085", whiteSpace: "pre-wrap" }}>{item.excerpt || (item.content || "").slice(0, 180)}</p>
              <button type="button" onClick={() => edit(item)} style={{ padding: "8px 14px", border: 0, borderRadius: 8, background: "#146c43", color: "#fff", marginRight: 8 }}>Edit</button>
              <button type="button" disabled={loading} onClick={() => remove(item.id)} style={{ padding: "8px 14px", border: 0, borderRadius: 8, background: "#b42318", color: "#fff" }}>Hapus</button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
