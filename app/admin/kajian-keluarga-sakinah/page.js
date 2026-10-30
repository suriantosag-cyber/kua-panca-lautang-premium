
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "../../../lib/admin-client";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "Kajian Keluarga Sakinah",
  file_type: "image",
  file_url: "",
  file_path: "",
  file_name: "",
  file_size: "",
  published: false,
};

function getYouTubeId(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.slice(1);
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      return (
        url.searchParams.get("v") ||
        url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})/)?.[1] ||
        ""
      );
    }
  } catch {}

  return "";
}

export default function AdminKajianKeluargaSakinah() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminFetch(
        "/api/kajian-keluarga-sakinah?admin=1",
        { cache: "no-store" }
      );
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal memuat daftar media.");
      }

      setItems(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || "Gagal memuat media.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function changeField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setSelectedFile(null);
    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "Kajian Keluarga Sakinah",
      file_type: item.file_type || "image",
      file_url: item.file_url || "",
      file_path: item.file_path || "",
      file_name: item.file_name || "",
      file_size: item.file_size || "",
      published: item.published === true,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSelectedFile(null);
    setMessage("");
    setError("");
  }

  async function uploadSelectedFile() {
    if (!selectedFile) {
      if (
        editingId &&
        form.file_type !== "youtube" &&
        form.file_url &&
        form.file_path
      ) {
        return {
          file_url: form.file_url,
          file_path: form.file_path,
          file_name: form.file_name,
          file_size: form.file_size,
        };
      }

      throw new Error("Pilih berkas media terlebih dahulu.");
    }

    const data = new FormData();
    data.append("file", selectedFile);

    const response = await adminFetch(
      "/api/kajian-keluarga-sakinah/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Unggah media gagal.");
    }

    return {
      file_url: result.data.url,
      file_path: result.data.path,
      file_name: result.data.name,
      file_size: result.data.size,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      let mediaFields = {};

      if (form.file_type === "youtube") {
        mediaFields = { file_url: form.file_url.trim() };
      } else {
        mediaFields = await uploadSelectedFile();
      }

      const payload = {
        ...form,
        ...mediaFields,
        file_size:
          form.file_type === "youtube"
            ? null
            : Number(mediaFields.file_size),
      };

      const response = await adminFetch(
        "/api/kajian-keluarga-sakinah",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            ...(editingId ? { id: editingId } : {}),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal menyimpan media.");
      }

      const successMessage = editingId
        ? "Media berhasil diperbarui."
        : "Media berhasil ditambahkan.";
      resetForm();
      setMessage(successMessage);
      await loadItems();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Hapus media "${item.title}"? Tindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await adminFetch(
        "/api/kajian-keluarga-sakinah",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal menghapus media.");
      }

      setMessage("Media berhasil dihapus.");
      if (editingId === item.id) resetForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menghapus media.");
    }
  }

  const imageOrVideo = form.file_type !== "youtube";

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-800">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            ADMINISTRATOR KUA
          </p>
          <h1 className="mt-1 text-2xl font-bold">
            Media Kajian Keluarga Sakinah
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Kelola gambar, video MP4, dan tautan YouTube.
          </p>
        </div>

        <Link
          href="/admin"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Kembali ke Admin
        </Link>
      </div>

      {message && (
        <div role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">
          {editingId ? "Edit Media" : "Tambah Media"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Judul media *
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={changeField}
              maxLength={200}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={changeField}
              rows={3}
              maxLength={5000}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium">
                Kategori
              </label>
              <input
                id="category"
                name="category"
                value={form.category}
                onChange={changeField}
                maxLength={100}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="file_type" className="mb-1 block text-sm font-medium">
                Jenis media *
              </label>
              <select
                id="file_type"
                name="file_type"
                value={form.file_type}
                onChange={(event) => {
                  changeField(event);
                  setSelectedFile(null);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="image">Gambar</option>
                <option value="video">Video MP4</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
          </div>

          {imageOrVideo ? (
            <div>
              <label htmlFor="mediaFile" className="mb-1 block text-sm font-medium">
                Berkas {form.file_type === "image" ? "gambar" : "video"} *
              </label>
              <input
                id="mediaFile"
                type="file"
                accept={
                  form.file_type === "image"
                    ? "image/jpeg,image/png,image/webp,image/gif"
                    : "video/mp4,.mp4"
                }
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] || null)
                }
                required={!editingId || !form.file_path}
                className="block w-full rounded-lg border border-slate-300 p-2"
              />
              <p className="mt-1 text-xs text-slate-500">
                Maksimal 50 MB. Format gambar JPG, PNG, WEBP, GIF; video MP4.
                {editingId && form.file_name && !selectedFile
                  ? ` Berkas saat ini: ${form.file_name}.`
                  : ""}
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor="file_url" className="mb-1 block text-sm font-medium">
                URL video YouTube *
              </label>
              <input
                id="file_url"
                name="file_url"
                type="url"
                value={form.file_url}
                onChange={changeField}
                placeholder="https://www.youtube.com/watch?v=..."
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={changeField}
              className="h-4 w-4"
            />
            Terbitkan agar tampil di halaman publik
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Media"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold"
              >
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Daftar Media</h2>
          <button
            type="button"
            onClick={loadItems}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
          >
            Muat Ulang
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-slate-500">Memuat media...</p>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Belum ada media tambahan. Media yang sudah diterbitkan akan tampil
            di halaman publik setelah komponen publik dipasang.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => {
              const youtubeId =
                item.file_type === "youtube"
                  ? getYouTubeId(item.file_url || item.source_url || "")
                  : "";

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  {item.file_type === "image" && item.file_url && (
                    <img
                      src={item.file_url}
                      alt={item.title}
                      className="h-52 w-full object-cover"
                    />
                  )}

                  {item.file_type === "video" && item.file_url && (
                    <video
                      src={item.file_url}
                      controls
                      preload="metadata"
                      className="h-52 w-full bg-black object-contain"
                    />
                  )}

                  {youtubeId && (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                      title={item.title}
                      loading="lazy"
                      allowFullScreen
                      className="aspect-video w-full"
                    />
                  )}

                  <div className="space-y-2 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                        {item.file_type}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          item.published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.published ? "Terbit" : "Draf"}
                      </span>
                    </div>

                    <h3 className="font-bold">{item.title}</h3>
                    {item.description && (
                      <p className="whitespace-pre-wrap text-sm text-slate-600">
                        {item.description}
                      </p>
                    )}

                    <p className="text-xs text-slate-500">
                      {item.category || "Kajian Keluarga Sakinah"}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

