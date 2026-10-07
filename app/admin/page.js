"use client";

import { useEffect, useState } from "react";
import { supabaseKegiatan } from "../kegiatan/supabase-kegiatan";
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [articleBlocks, setArticleBlocks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [gallery, setGallery] = useState([]);
const [kegiatan, setKegiatan] = useState([]);
  const [kegiatanLoading, setKegiatanLoading] = useState(false);
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);

  async function updateKegiatanStatus(id, status) {
    const yakin = window.confirm(
      status === 'disetujui'
        ? 'Setujui kegiatan ini?'
        : 'Tolak kegiatan ini?'
    );

    if (!yakin) {
      return;
    }

    setKegiatanLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/kegiatan', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status })
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Gagal mengubah status kegiatan.');
      }

      setMessage(
        status === 'disetujui'
          ? 'Kegiatan berhasil disetujui.'
          : 'Kegiatan berhasil ditolak.'
      );

      await loadKegiatan();
    } catch (error) {
      console.error(error);
      setMessage(`Gagal mengubah status kegiatan: ${error.message}`);
    } finally {
      setKegiatanLoading(false);
    }
  }

  async function loadKegiatan() {
    setKegiatanLoading(true);

    try {
      const response = await fetch('/api/kegiatan', {
        cache: 'no-store'
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Gagal mengambil kegiatan.');
      }

      setKegiatan(result.data || []);
    } catch (error) {
      console.error(error);
      setMessage(`Gagal mengambil kegiatan: ${error.message}`);
    } finally {
      setKegiatanLoading(false);
    }
  }
  async function loadGallery() {
    try {
      const response = await fetch("/api/gallery");
      const result = await response.json();

      if (result.ok) {
        setGallery(result.data || []);
      }
    } catch {
      setMessage("Gagal mengambil galeri.");
    }
  }

  async function uploadGallery() {
    if (!galleryFile) {
      alert("Pilih foto terlebih dahulu.");
      return;
    }

    setGalleryLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", galleryFile);

      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setMessage(result.error || "Gagal mengunggah foto.");
        return;
      }

      setMessage("Foto berhasil diunggah.");
      setGalleryFile(null);

      const input = document.getElementById("gallery-file");
      if (input) input.value = "";

      await loadGallery();
    } catch {
      setMessage("Gagal terhubung ke server Galeri.");
    } finally {
      setGalleryLoading(false);
    }
  }

  async function deleteGallery(path) {
    const yakin = window.confirm("Yakin ingin menghapus foto ini?");

    if (!yakin) {
      return;
    }

    setGalleryLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setMessage(result.error || "Gagal menghapus foto.");
        return;
      }

      setMessage("Foto berhasil dihapus.");
      await loadGallery();
    } catch {
      setMessage("Gagal terhubung ke server Galeri.");
    } finally {
      setGalleryLoading(false);
    }
  }

  async function loadNews() {
    try {
      const response = await fetch("/api/news");
      const result = await response.json();

      if (result.ok) {
        setNews(result.data || []);
      } else {
        setMessage(result.error || "Gagal mengambil berita.");
      }
    } catch {
      setMessage("Gagal terhubung ke server.");
    }
  }

  useEffect(() => {
  if (loggedIn) {
    loadNews();
    loadGallery();
    loadKegiatan();
  }
  }, [loggedIn]);

  function login(e) {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      setLoggedIn(true);
      setMessage("");
    } else {
      alert("Username atau password salah.");
    }
  }
  function addArticleBlock(type) {
    setArticleBlocks((prev) => [
      ...prev,
      type === "image"
        ? { type: "image", url: "" }
        : type === "location"
          ? { type: "location", text: "" }
          : { type: "text", text: "" },
    ]);
  }

  function removeArticleBlock(index) {
    setArticleBlocks((prev) => prev.filter((_, i) => i !== index));
  }

  function updateArticleBlock(index, value) {
    setArticleBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...block, ...value } : block)),
    );
  }

  function resetForm() {
    setTitle("");
    setContent("");
    setArticleBlocks([]);
    setEditingId(null);
  }

  async function saveNews(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Judul berita wajib diisi.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const method = editingId ? "PUT" : "POST";

      const response = await fetch("/api/news", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          title,
          content,
          article_blocks: articleBlocks,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setMessage(result.error || "Gagal menyimpan berita.");
        return;
      }

      setMessage(
        editingId
          ? "Berita berhasil diperbarui."
          : "Berita berhasil ditambahkan.",
      );

      resetForm();
      await loadNews();
    } catch {
      setMessage("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  function editNews(item) {
    setEditingId(item.id);
    setTitle(item.title || "");
    setContent(item.content || "");
    setArticleBlocks(
      Array.isArray(item.article_blocks) ? item.article_blocks : [],
    );
    setMessage("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteNews(id) {
    const yakin = window.confirm("Yakin ingin menghapus berita ini?");

    if (!yakin) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/news", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setMessage(result.error || "Gagal menghapus berita.");
        return;
      }

      setMessage("Berita berhasil dihapus.");
      await loadNews();
    } catch {
      setMessage("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  if (!loggedIn) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f7f5",
          padding: 20,
        }}
      >
        <form
          onSubmit={login}
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#fff",
            padding: 32,
            borderRadius: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          }}
        >
          {" "}
          <h1>Admin KUA Panca Lautang</h1>
          <p style={{ color: "#667085" }}>
            Masuk untuk mengelola berita dan berkas.
          </p>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{
              width: "100%",
              padding: 12,
              margin: "8px 0 18px",
              border: "1px solid #d0d5dd",
              borderRadius: 10,
              boxSizing: "border-box",
            }}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: "100%",
              padding: 12,
              margin: "8px 0 20px",
              border: "1px solid #d0d5dd",
              borderRadius: 10,
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 13,
              border: 0,
              borderRadius: 10,
              background: "#146c43",
                display: "inline-block",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Masuk Admin
          </button>
        </form>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7f5",
        padding: 30,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {" "}
        <h1>Dashboard Admin</h1>
        <p style={{ color: "#667085" }}>KUA Panca Lautang - Kelola Berita</p>
        <section
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 5px 20px rgba(0,0,0,.06)",
            marginTop: 24,
          }}
        >
          <h2>{editingId ? "Edit Berita" : "Tambah Berita"}</h2>

          <form onSubmit={saveNews}>
            <label>Judul Berita</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul berita"
              style={{
                width: "100%",
                padding: 12,
                margin: "8px 0 18px",
                border: "1px solid #d0d5dd",
                borderRadius: 10,
                boxSizing: "border-box",
              }}
            />

            <label>Isi Berita</label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis isi berita..."
              rows={8}
              style={{
                width: "100%",
                padding: 12,
                margin: "8px 0 18px",
                border: "1px solid #d0d5dd",
                borderRadius: 10,
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 20px",
                border: 0,
                borderRadius: 10,
                background: "#146c43",
                display: "inline-block",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading
                ? "Menyimpan..."
                : editingId
                  ? "Simpan Perubahan"
                  : "Tambah Berita"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  marginLeft: 10,
                  padding: "12px 20px",
                  border: "1px solid #d0d5dd",
                  borderRadius: 10,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Batal Edit
              </button>
            )}
            <div
              style={{
                marginTop: 24,
                marginBottom: 24,
                padding: 20,
                border: "1px solid #ddd",
                borderRadius: 16,
              }}
            >
              <h3>Isi Berita Berurutan</h3>
              <p style={{ color: "#666" }}>
                Susun berita dengan paragraf dan foto sesuai urutan.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                <button type="button" onClick={() => addArticleBlock("text")}>
                  + Tambah Paragraf
                </button>
                <button type="button" onClick={() => addArticleBlock("image")}>
                  + Tambah Foto
                </button>
                <button type="button" onClick={() => addArticleBlock("location")}>
                  + Tambah Lokasi
                </button>
              </div>

              {articleBlocks.map((block, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: 16,
                    padding: 16,
                    border: "1px solid #ddd",
                    borderRadius: 12,
                  }}
                >
                  <strong>
                    {block.type === "image" ? "Foto" : "Paragraf"} {index + 1}
</strong>

                    {block.type === "image" ? (
                      <div style={{ marginTop: 12 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                          Pilih foto dari komputer
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append("file", file);
                            try {
                              const response = await fetch("/api/gallery", {
                                method: "POST",
                                body: formData,
                              });
                              const result = await response.json();
                              if (!response.ok || !result.ok) {
                                setMessage(result.error || "Gagal upload foto artikel.");
                                return;
                              }
                              updateArticleBlock(index, { url: result.data?.url || "" });
                              setMessage("Foto artikel berhasil diupload.");
                            } catch {
                              setMessage("Gagal terhubung ke server foto.");
                            }
                          }}
                        />
                        {block.url && (
                          <img
                            src={block.url}
                            alt="Foto artikel"
                            style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 12, marginTop: 12 }}
                          />
                        )}

<div
  contentEditable
  suppressContentEditableWarning
  onPaste={async (e) => {
    const items = e.clipboardData?.items || [];

    for (const item of items) {
      if (!item.type.startsWith("image/")) continue;

      const file = item.getAsFile();
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/gallery", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
          setMessage(result.error || "Gagal upload foto artikel.");
          return;
        }

        updateArticleBlock(index, {
          url: result.data?.url || "",
        });

        setMessage("Foto dari clipboard berhasil ditempel.");
      } catch {
        setMessage("Gagal mengupload foto dari clipboard.");
      }

      break;
    }
  }}
  style={{
    marginTop: 12,
    padding: 18,
    border: "2px dashed #bbb",
    borderRadius: 12,
    minHeight: 60,
    cursor: "text",
    color: "#666",
  }}
>
  Tempel foto dari Word di sini (Ctrl + V)
</div>
                      </div>
                    ) : block.type === "location" ? (
                      <textarea
                        value={block.text || ""}
                        onChange={(e) => updateArticleBlock(index, { text: e.target.value })}
                        placeholder="Tulis lokasi berita..."
                        rows={3}
                        style={{ width: "100%", marginTop: 10 }}
                      />
                    ) : (
                      <textarea
                        value={block.text || ""}
                        onChange={(e) => updateArticleBlock(index, { text: e.target.value })}
                        placeholder="Tulis paragraf berita..."
                        rows={4}
                        style={{ width: "100%", marginTop: 10 }}
                      />
                    )}

                  <button
                    type="button"
                    onClick={() => removeArticleBlock(index)}
                    style={{ marginTop: 10 }}
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </form>

          {message && (
            <p
              style={{
                marginTop: 18,
                padding: 12,
                background: "#f0fdf4",
                borderRadius: 10,
              }}
            >
              {message}
            </p>
          )}
        </section>
        <section
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 5px 20px rgba(0,0,0,.06)",
            marginTop: 24,
          }}
        >
          <h2>Daftar Berita</h2>

          {news.length === 0 ? (
            <p style={{ color: "#667085" }}>Belum ada berita.</p>
          ) : (
            news.map((item) => (
              <article
                key={item.id}
                style={{
                  borderBottom: "1px solid #eaecf0",
                  padding: "18px 0",
                }}
              >
                <h3>{item.title}</h3>

                <p
                  style={{
                    color: "#667085",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {item.content || "Tidak ada isi berita."}
                </p>

                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => editNews(item)}
                    style={{
                      padding: "8px 14px",
                      border: 0,
                      borderRadius: 8,
                      background: "#146c43",
                display: "inline-block",
                      color: "#fff",
                      marginRight: 8,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteNews(item.id)}
                    style={{
                      padding: "8px 14px",
                      border: 0,
                      borderRadius: 8,
                      background: "#b42318",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
      <section
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 5px 20px rgba(0,0,0,.06)",
          marginTop: 24,
        }}
      >
        <h2>Kegiatan Menunggu Verifikasi</h2>

        <div style={{ marginTop: 16 }}>
          {kegiatanLoading ? (
            <p>Memuat kegiatan...</p>
          ) : kegiatan.length === 0 ? (
            <p>Tidak ada kegiatan yang menunggu verifikasi.</p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {kegiatan.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 16,
                    background: "#fafafa",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>{item.nama_kegiatan}</h3>

                  <p>
                    <strong>Penyelenggara:</strong> {item.penyelenggara}
                  </p>

                  <p>
                    <strong>Desa/Kelurahan:</strong> {item.desa}
                  </p>

                  <p>
                    <strong>Tanggal:</strong> {item.tanggal}
                  </p>

                  <p>
                    <strong>Kategori:</strong> {item.kategori}
                  </p>

                  <p>
                    <strong>Narahubung:</strong> {item.narahubung}
                  </p>

                  {item.deskripsi && (
                    <p>
                      <strong>Deskripsi:</strong> {item.deskripsi}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        updateKegiatanStatus(item.id, "disetujui")
                      }
                      disabled={kegiatanLoading}
                      style={{
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      Setujui
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateKegiatanStatus(item.id, "ditolak")
                      }
                      disabled={kegiatanLoading}
                      style={{
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <h2>Galeri Dokumentasi</h2>

        <div style={{ marginTop: 16 }}>
          <input
            id="gallery-file"
            type="file"
            accept="image/*"
            onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
          />

          <button
            type="button"
            onClick={editingGallery ? editGallery : uploadGallery}
            disabled={galleryLoading}
            style={{
              marginLeft: 10,
              padding: "9px 16px",
              border: 0,
              borderRadius: 8,
              background: "#146c43",
                display: "inline-block",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {galleryLoading
              ? "Memproses..."
              : editingGallery
                ? "Simpan Perubahan"
                : "Upload Foto"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          {gallery.length === 0 ? (
            <p style={{ color: "#667085" }}>Belum ada foto galeri.</p>
          ) : (
            gallery.map((item) => (
              <div key={item.path}>
                <img
                  src={item.url}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />

                <button
                  type="button"
                  onClick={() => deleteGallery(item.path)}
                  disabled={galleryLoading}

                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: "8px 12px",
                    border: 0,
                    borderRadius: 8,
                    background: "#b42318",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Hapus Foto
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}








