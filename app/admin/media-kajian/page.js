"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "../../../lib/admin-client";

const blank = { title: "", description: "", file_type: "image", source_url: "", published: true };
const input = { width: "100%", padding: 11, border: "1px solid #d0d5dd", borderRadius: 9, marginTop: 6, marginBottom: 14, boxSizing: "border-box" };

export default function AdminMediaKajianPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await adminFetch("/api/kajian-keluarga-sakinah/media?admin=1", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Gagal memuat media.");
    setItems(result.data || []);
  }

  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);

  function update(key, value) { setForm((old) => ({ ...old, [key]: value })); }

  async function save(event) {
    event.preventDefault();
    setLoading(true); setMessage("");
    try {
      const body = new FormData();
      body.append("title", form.title);
      body.append("description", form.description);
      body.append("file_type", form.file_type);
      body.append("published", String(form.published));
      if (form.file_type === "youtube") body.append("source_url", form.source_url);
      else if (file) body.append("file", file);
      const response = await adminFetch("/api/kajian-keluarga-sakinah/media", { method: "POST", body });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Media gagal disimpan.");
      setForm(blank); setFile(null);
      const picker = document.getElementById("kajian-media-file");
      if (picker) picker.value = "";
      setMessage("Media kajian berhasil disimpan.");
      await load();
    } catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  }

  async function remove(item) {
    if (!window.confirm(`Hapus media "${item.title}"? File media yang dikelola pada folder Kajian juga akan dihapus.`)) return;
    setLoading(true); setMessage("");
    try {
      const response = await adminFetch("/api/kajian-keluarga-sakinah/media", {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Media gagal dihapus.");
      setMessage("Media berhasil dihapus."); await load();
    } catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f3f7f4", padding: "28px 16px 56px", color: "#172033" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <a href="/admin" style={{ color: "#146c43", fontWeight: 700, textDecoration: "none" }}>← Dashboard Admin</a>
        <h1 style={{ margin: "16px 0 6px" }}>Kelola Media Kajian Keluarga Sakinah</h1>
        <p style={{ color: "#667085", marginTop: 0 }}>Kelola dokumentasi foto, video, dan tautan YouTube. Penyimpanan media ini terpisah dari Galeri Berita.</p>
        <form onSubmit={save} style={{ background: "#fff", padding: 24, borderRadius: 16, boxShadow: "0 5px 20px rgba(0,0,0,.05)" }}>
          <h2 style={{ marginTop: 0 }}>Tambah Media</h2>
          <label>Judul media</label>
          <input required maxLength={180} value={form.title} onChange={(e) => update("title", e.target.value)} style={input} placeholder="Contoh: Dokumentasi Bimbingan Keluarga Sakinah" />
          <label>Jenis media</label>
          <select value={form.file_type} onChange={(e) => { update("file_type", e.target.value); setFile(null); }} style={input}>
            <option value="image">Foto (JPG, PNG, WEBP, GIF)</option>
            <option value="video">Video (MP4, WEBM, MOV)</option>
            <option value="youtube">Tautan YouTube</option>
          </select>
          {form.file_type === "youtube" ? <>
            <label>URL YouTube</label>
            <input required type="url" value={form.source_url} onChange={(e) => update("source_url", e.target.value)} style={input} placeholder="https://www.youtube.com/watch?v=..." />
          </> : <>
            <label>File {form.file_type === "image" ? "foto" : "video"}</label>
            <input id="kajian-media-file" required type="file" accept={form.file_type === "image" ? "image/jpeg,image/png,image/webp,image/gif" : "video/mp4,video/webm,video/quicktime"} onChange={(e) => setFile(e.target.files?.[0] || null)} style={input} />
            <p style={{ color: "#667085", fontSize: 13, marginTop: -8 }}>{form.file_type === "image" ? "Maksimal 8 MB." : "Maksimal 100 MB. Untuk video berukuran besar, gunakan tautan YouTube."}</p>
          </>}
          <label>Keterangan</label>
          <textarea rows={3} maxLength={2000} value={form.description} onChange={(e) => update("description", e.target.value)} style={{ ...input, resize: "vertical" }} placeholder="Keterangan singkat dokumentasi..." />
          <label style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} /> Tampilkan di halaman publik
          </label>
          <button disabled={loading} type="submit" style={{ padding: "11px 18px", border: 0, borderRadius: 9, background: "#146c43", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{loading ? "Menyimpan..." : "Simpan Media"}</button>
          {message && <p role="status" style={{ color: "#146c43", fontWeight: 600 }}>{message}</p>}
        </form>
        <section style={{ marginTop: 24, background: "#fff", padding: 24, borderRadius: 16 }}>
          <h2 style={{ marginTop: 0 }}>Daftar Media ({items.length})</h2>
          {items.length === 0 ? <p>Belum ada media Kajian yang dikelola melalui menu ini.</p> : items.map((item) => (
            <article key={item.id} style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px 0", borderBottom: "1px solid #eaecf0", flexWrap: "wrap" }}>
              {item.file_type === "image" && item.file_url && <img src={item.file_url} alt={item.title} style={{ width: 120, height: 76, objectFit: "cover", borderRadius: 8 }} />}
              {item.file_type === "video" && <span style={{ width: 120, height: 76, display: "grid", placeItems: "center", background: "#101828", color: "#fff", borderRadius: 8 }}>VIDEO</span>}
              {item.file_type === "youtube" && <span style={{ width: 120, height: 76, display: "grid", placeItems: "center", background: "#fee4e2", color: "#b42318", borderRadius: 8 }}>YouTube</span>}
              <div style={{ flex: 1, minWidth: 180 }}><strong>{item.title}</strong><p style={{ margin: "5px 0", color: "#667085", fontSize: 13 }}>{item.file_type} · {item.published ? "Terbit" : "Draft"}</p><p style={{ margin: 0, color: "#667085", fontSize: 13 }}>{item.description}</p></div>
              <button type="button" disabled={loading} onClick={() => remove(item)} style={{ padding: "8px 12px", border: 0, borderRadius: 8, background: "#b42318", color: "#fff" }}>Hapus</button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
