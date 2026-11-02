import { createClient } from "@supabase/supabase-js";
import { verifyAdminRequest } from "../../../../lib/admin-auth";

const TYPE = "kajian-keluarga-sakinah";
const BUCKET = "website-files";
const FOLDER = "kajian-media";
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Konfigurasi Supabase server belum lengkap.");
  return createClient(url, key, { auth: { persistSession: false } });
}

function jsonError(message, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

function getYouTubeUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] ? url.toString() : "";
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      const id = url.pathname === "/watch"
        ? url.searchParams.get("v")
        : url.pathname.split("/").filter(Boolean).slice(-1)[0];
      return id && /^[\w-]{11}$/.test(id) ? url.toString() : "";
    }
  } catch {}
  return "";
}

export async function GET(request) {
  try {
    const isAdmin = new URL(request.url).searchParams.get("admin") === "1";
    if (isAdmin) {
      const auth = await verifyAdminRequest(request);
      if (!auth.ok) return jsonError(auth.error, auth.status);
    }
    const { data, error } = await getAdminClient()
      .from("content_items")
      .select("id,title,description,content,type,file,image_url,file_path,file_name,file_type,published,created_at,updated_at")
      .eq("type", TYPE)
      .not("file_type", "is", null)
      .order("created_at", { ascending: false });
    if (error) return jsonError(error.message, 500);
    const items = (data || []).filter((item) => isAdmin || item.published !== false).map((item) => ({
      id: item.id,
      title: item.title || "",
      description: item.description || "",
      category: "Dokumentasi Kajian",
      file_type: item.file_type || "image",
      file_url: item.image_url || item.file || "",
      source_url: item.file_type === "youtube" ? (item.file || item.image_url || "") : "",
      file_path: item.file_path || "",
      published: item.published !== false,
      created_at: item.created_at,
    }));
    return Response.json({ ok: true, data: items }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return jsonError(error.message || "Gagal memuat media kajian.", 500);
  }
}

export async function POST(request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) return jsonError(auth.error, auth.status);
  let uploadedPath = "";
  try {
    const form = await request.formData();
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const fileType = String(form.get("file_type") || "");
    const youtubeUrl = String(form.get("source_url") || "").trim();
    const published = form.get("published") !== "false";
    const file = form.get("file");
    if (!title) return jsonError("Judul media wajib diisi.");
    if (title.length > 180 || description.length > 2000) return jsonError("Judul maksimal 180 dan keterangan maksimal 2.000 karakter.");
    let fileUrl = "";
    let filePath = "";
    if (fileType === "youtube") {
      fileUrl = getYouTubeUrl(youtubeUrl);
      if (!fileUrl) return jsonError("Tautan YouTube tidak valid.");
    } else {
      if (!file || typeof file.arrayBuffer !== "function") return jsonError("Pilih file media terlebih dahulu.");
      const allowed = fileType === "image" ? IMAGE_TYPES : fileType === "video" ? VIDEO_TYPES : [];
      const maxSize = fileType === "image" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      if (!allowed.includes(file.type)) return jsonError("Format file tidak didukung. Foto: JPG, PNG, WEBP, GIF. Video: MP4, WEBM, MOV.");
      if (file.size > maxSize) return jsonError(fileType === "image" ? "Ukuran foto maksimal 8 MB." : "Ukuran video maksimal 100 MB.");
      const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-90);
      filePath = `${FOLDER}/${Date.now()}-${crypto.randomUUID()}-${safeName || `media.${ext}`}`;
      const supabase = getAdminClient();
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
      if (uploadError) return jsonError(uploadError.message, 500);
      uploadedPath = filePath;
      fileUrl = supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl;
    }
    const supabase = getAdminClient();
    const { data, error } = await supabase.from("content_items").insert({
      type: TYPE, title, description, content: description,
      file: fileType === "youtube" ? fileUrl : null,
      image_url: fileType === "youtube" ? null : fileUrl,
      file_path: filePath || null,
      file_name: file?.name || null,
      file_type: fileType,
      published,
    }).select("id,title,description,file,image_url,file_path,file_type,published,created_at").single();
    if (error) {
      if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
      return jsonError(error.message, 500);
    }
    return Response.json({ ok: true, data: { ...data, file_url: data.image_url || data.file || "", source_url: data.file_type === "youtube" ? data.file : "" } });
  } catch (error) {
    if (uploadedPath) {
      try { await getAdminClient().storage.from(BUCKET).remove([uploadedPath]); } catch {}
    }
    return jsonError(error.message || "Gagal menyimpan media kajian.", 500);
  }
}

export async function DELETE(request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) return jsonError(auth.error, auth.status);
  try {
    const body = await request.json();
    if (!body.id) return jsonError("ID media tidak ditemukan.");
    const supabase = getAdminClient();
    const { data: item, error: readError } = await supabase.from("content_items")
      .select("id,file_path,type").eq("id", body.id).eq("type", TYPE).not("file_type", "is", null).single();
    if (readError || !item) return jsonError("Media kajian tidak ditemukan.", 404);
    if (item.file_path) {
      if (!item.file_path.startsWith(`${FOLDER}/`)) return jsonError("Lokasi file tidak valid.", 400);
      const { error: storageError } = await supabase.storage.from(BUCKET).remove([item.file_path]);
      if (storageError) return jsonError(storageError.message, 500);
    }
    const { error } = await supabase.from("content_items").delete().eq("id", body.id).eq("type", TYPE).not("file_type", "is", null);
    if (error) return jsonError(error.message, 500);
    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error.message || "Gagal menghapus media kajian.", 500);
  }
}
