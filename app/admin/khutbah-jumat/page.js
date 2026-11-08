"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "../../../lib/admin-client";

const EMPTY_FORM = {
  title: "",
  theme: "",
  khutbah_pertama: "",
  khutbah_kedua: "",
  doa_penutup: "",
  referensi: "[]",
};

const STATUS_LABEL = {
  draft: "Draf",
  pending_review: "Menunggu tinjauan",
  approved: "Disetujui",
  published: "Diterbitkan",
  rejected: "Ditolak",
};

const STATUS_CLASS = {
  draft: "bg-slate-100 text-slate-700",
  pending_review: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  published: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminKhutbahJumat() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminFetch("/api/khutbah-jumat", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal memuat daftar khutbah.");
      }

      setItems(Array.isArray(result.items) ? result.items : []);
    } catch (err) {
      setError(err.message || "Gagal memuat data khutbah.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function startEdit(item) {
    if (!["draft", "rejected"].includes(item.status)) {
      setError("Naskah ini tidak dapat diedit pada status sekarang.");
      return;
    }

    setEditingId(item.id);
    setForm({
      title: item.title || "",
      theme: item.theme || "",
      khutbah_pertama: item.khutbah_pertama || "",
      khutbah_kedua: item.khutbah_kedua || "",
      doa_penutup: item.doa_penutup || "",
      referensi: JSON.stringify(item.referensi || [], null, 2),
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function changeField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function sendAction(action, item, extra = {}) {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await adminFetch("/api/khutbah-jumat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          khutbah_id: item.id,
          ...extra,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Tindakan gagal diproses.");
      }

      const labels = {
        submit_for_review: "Naskah berhasil diajukan untuk ditinjau.",
        approve: "Naskah berhasil disetujui.",
        reject: "Naskah berhasil ditolak.",
        publish: "Naskah berhasil diterbitkan.",
        unpublish: "Publikasi berhasil ditarik.",
      };

      setMessage(labels[action] || "Perubahan berhasil disimpan.");
      if (editingId === item.id) resetForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSave(event) {
    event.preventDefault();

    const item = items.find((entry) => entry.id === editingId);
    if (!item) return;

    let references;

    try {
      references = JSON.parse(form.referensi || "[]");
      if (!Array.isArray(references)) {
        throw new Error("Referensi harus berupa array JSON.");
      }
    } catch (err) {
      setError(err.message || "Format referensi JSON tidak valid.");
      return;
    }

    if (
      !form.title.trim() ||
      !form.theme.trim() ||
      !form.khutbah_pertama.trim() ||
      !form.khutbah_kedua.trim() ||
      !form.doa_penutup.trim()
    ) {
      setError("Semua bagian naskah wajib diisi.");
      return;
    }

    await sendAction("edit", item, {
      title: form.title.trim(),
      theme: form.theme.trim(),
      khutbah_pertama: form.khutbah_pertama,
      khutbah_kedua: form.khutbah_kedua,
      doa_penutup: form.doa_penutup,
      referensi: references,
    });
  }

  async function handleWorkflow(action, item) {
    if (action === "publish" || action === "unpublish") {
      const promptText =
        action === "publish"
          ? "Terbitkan naskah ini untuk pengunjung publik?"
          : "Tarik naskah ini dari halaman publik?";

      if (!window.confirm(promptText)) return;
    }

    if (action === "reject") {
      const reason = window.prompt("Masukkan alasan penolakan:");
      if (reason === null) return;

      if (!reason.trim()) {
        setError("Alasan penolakan wajib diisi.");
        return;
      }

      await sendAction(action, item, {
        review_notes: reason.trim(),
      });
      return;
    }

    await sendAction(action, item, {
      review_notes: reviewNotes.trim() || null,
    });
    setReviewNotes("");
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-800">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            ADMINISTRATOR KUA
          </p>
          <h1 className="mt-1 text-2xl font-bold">
            Kelola Khutbah Jumat
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Kelola draf, tinjau naskah, dan kendalikan penerbitan khutbah.
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

      {editingId && (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Edit Naskah Khutbah</h2>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium">
                Judul khutbah *
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={changeField}
                maxLength={250}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="theme" className="mb-1 block text-sm font-medium">
                Tema *
              </label>
              <input
                id="theme"
                name="theme"
                value={form.theme}
                onChange={changeField}
                maxLength={250}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="khutbah_pertama" className="mb-1 block text-sm font-medium">
                Khutbah pertama *
              </label>
              <textarea
                id="khutbah_pertama"
                name="khutbah_pertama"
                value={form.khutbah_pertama}
                onChange={changeField}
                rows={12}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="khutbah_kedua" className="mb-1 block text-sm font-medium">
                Khutbah kedua *
              </label>
              <textarea
                id="khutbah_kedua"
                name="khutbah_kedua"
                value={form.khutbah_kedua}
                onChange={changeField}
                rows={10}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="doa_penutup" className="mb-1 block text-sm font-medium">
                Doa penutup *
              </label>
              <textarea
                id="doa_penutup"
                name="doa_penutup"
                value={form.doa_penutup}
                onChange={changeField}
                rows={5}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="referensi" className="mb-1 block text-sm font-medium">
                Referensi (format JSON array)
              </label>
              <textarea
                id="referensi"
                name="referensi"
                value={form.referensi}
                onChange={changeField}
                rows={5}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </section>
      )}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Daftar Naskah</h2>
            <p className="text-sm text-slate-600">
              {items.length} naskah tercatat.
            </p>
          </div>
          <button
            type="button"
            onClick={loadItems}
            disabled={loading || saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            Muat Ulang
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-slate-500">
            Memuat daftar khutbah...
          </p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-slate-500">
            Belum ada naskah khutbah. Draf akan muncul setelah proses generator berhasil.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Tema: {item.theme || "-"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Pekan: {item.week_start || "-"} · Bahasa: {item.language || "-"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Dibuat: {item.created_at ? new Date(item.created_at).toLocaleString("id-ID", { timeZone: "Asia/Makassar" }) : "-"}
                    </p>
                    {item.review_notes && (
                      <p className="mt-2 rounded-lg bg-amber-50 p-2 text-sm text-amber-900">
                        Catatan tinjauan: {item.review_notes}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[item.status] || "bg-slate-100 text-slate-700"}`}
                  >
                    {STATUS_LABEL[item.status] || item.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["draft", "rejected"].includes(item.status) && (
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      disabled={saving}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                    >
                      Edit
                    </button>
                  )}

                  {item.status === "draft" && (
                    <button
                      type="button"
                      onClick={() => handleWorkflow("submit_for_review", item)}
                      disabled={saving}
                      className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                    >
                      Ajukan Tinjauan
                    </button>
                  )}

                  {item.status === "pending_review" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleWorkflow("approve", item)}
                        disabled={saving}
                        className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                      >
                        Setujui
                      </button>
                      <button
                        type="button"
                        onClick={() => handleWorkflow("reject", item)}
                        disabled={saving}
                        className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                      >
                        Tolak
                      </button>
                    </>
                  )}

                  {item.status === "approved" && (
                    <button
                      type="button"
                      onClick={() => handleWorkflow("publish", item)}
                      disabled={saving}
                      className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                    >
                      Terbitkan
                    </button>
                  )}

                  {item.status === "published" && (
                    <button
                      type="button"
                      onClick={() => handleWorkflow("unpublish", item)}
                      disabled={saving}
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Tarik Publikasi
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}