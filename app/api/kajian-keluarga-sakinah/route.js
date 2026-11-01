import { createClient } from "@supabase/supabase-js";
import { verifyAdminRequest } from "../../../lib/admin-auth";

const TYPE = "kajian-keluarga-sakinah";

function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Konfigurasi Supabase server belum lengkap.");
  return createClient(url, key, { auth: { persistSession: false } });
}

function jsonError(message, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

export async function GET(request) {
  try {
    const isAdmin = new URL(request.url).searchParams.get("admin") === "1";
    if (isAdmin) {
      const auth = await verifyAdminRequest(request);
      if (!auth.ok) return jsonError(auth.error, auth.status);
    }

    const supabase = getAdminClient();
    let query = supabase
      .from("content_items")
      .select("id,title,excerpt,content,category,published,status,created_at,updated_at")
      .eq("type", TYPE)
      .order("created_at", { ascending: false });

    if (!isAdmin) query = query.eq("published", true);

    const { data, error } = await query;
    if (error) return jsonError(error.message, 500);
    return Response.json({ ok: true, data: data || [] });
  } catch (error) {
    return jsonError(error.message || "Gagal memuat materi.", 500);
  }
}

export async function POST(request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) return jsonError(auth.error, auth.status);

  try {
    const body = await request.json();
    if (!body.title?.trim()) return jsonError("Judul materi wajib diisi.");
    if (!body.content?.trim()) return jsonError("Isi materi wajib diisi.");

    const published = body.published === true;
    const { data, error } = await getAdminClient()
      .from("content_items")
      .insert({
        type: TYPE,
        title: body.title.trim(),
        category: (body.category || "Keluarga Sakinah").trim(),
        excerpt: (body.excerpt || "").trim(),
        content: body.content.trim(),
        published,
        status: published ? "published" : "draft",
      })
      .select("id,title,excerpt,content,category,published,status,created_at,updated_at")
      .single();

    if (error) return jsonError(error.message, 500);
    return Response.json({ ok: true, data });
  } catch (error) {
    return jsonError(error.message || "Gagal menyimpan materi.", 500);
  }
}

export async function PUT(request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) return jsonError(auth.error, auth.status);

  try {
    const body = await request.json();
    if (!body.id) return jsonError("ID materi tidak ditemukan.");
    if (!body.title?.trim()) return jsonError("Judul materi wajib diisi.");
    if (!body.content?.trim()) return jsonError("Isi materi wajib diisi.");

    const published = body.published === true;
    const { data, error } = await getAdminClient()
      .from("content_items")
      .update({
        title: body.title.trim(),
        category: (body.category || "Keluarga Sakinah").trim(),
        excerpt: (body.excerpt || "").trim(),
        content: body.content.trim(),
        published,
        status: published ? "published" : "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .eq("type", TYPE)
      .select("id,title,excerpt,content,category,published,status,created_at,updated_at")
      .single();

    if (error) return jsonError(error.message, 500);
    return Response.json({ ok: true, data });
  } catch (error) {
    return jsonError(error.message || "Gagal memperbarui materi.", 500);
  }
}

export async function DELETE(request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) return jsonError(auth.error, auth.status);

  try {
    const body = await request.json();
    if (!body.id) return jsonError("ID materi tidak ditemukan.");

    const { error } = await getAdminClient()
      .from("content_items")
      .delete()
      .eq("id", body.id)
      .eq("type", TYPE);

    if (error) return jsonError(error.message, 500);
    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error.message || "Gagal menghapus materi.", 500);
  }
}
