import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPE = "kajian-keluarga-sakinah";
const BUCKET = "website-files";

function getSupabaseAdmin() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Konfigurasi Supabase server belum lengkap.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function responseError(message, status = 400) {
  return NextResponse.json(
    { ok: false, error: message },
    { status }
  );
}

function cleanText(value, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function validUUID(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

function validYouTubeUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (host === "youtu.be") {
      return /^[\w-]{11}$/.test(url.pathname.slice(1));
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const id =
        url.searchParams.get("v") ||
        url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})/)?.[1];

      return Boolean(id && /^[\w-]{11}$/.test(id));
    }

    return false;
  } catch {
    return false;
  }
}

function validateArticlePayload(body) {
  const title = cleanText(body.title, 200);
  const content =
    typeof body.content === "string" ? body.content.trim() : "";
  const category =
    cleanText(body.category, 100) || "Keluarga Sakinah";
  const excerpt = cleanText(body.excerpt, 5000);
  const published = body.published === true;

  if (!title) {
    return { error: "Judul materi wajib diisi." };
  }

  if (!content) {
    return { error: "Isi materi wajib diisi." };
  }

  if (content.length > 50000) {
    return { error: "Isi materi terlalu panjang (maksimal 50.000 karakter)." };
  }

  return {
    payload: {
      type: TYPE,
      title,
      category,
      excerpt,
      content,
      published,
      status: published ? "published" : "draft",
      updated_at: new Date().toISOString(),
    },
  };
}

function validateMediaPayload(body) {
  const title = cleanText(body.title, 200);
  const description = cleanText(body.description, 5000);
  const category = cleanText(body.category, 100);
  const fileType = cleanText(body.file_type, 20);
  const published = body.published === true;

  if (!title) {
    return { error: "Judul media wajib diisi." };
  }

  if (!["image", "video", "youtube"].includes(fileType)) {
    return { error: "Jenis media tidak valid." };
  }

  const payload = {
    type: TYPE,
    title,
    description,
    category: category || "Kajian Keluarga Sakinah",
    file_type: fileType,
    published,
    status: published ? "published" : "draft",
    updated_at: new Date().toISOString(),
  };

  if (fileType === "youtube") {
    const url = cleanText(body.file_url, 1000);

    if (!validYouTubeUrl(url)) {
      return {
        error: "Tautan YouTube tidak valid. Gunakan URL video YouTube yang sah.",
      };
    }

    payload.file_url = url;
    payload.source_url = url;
    payload.file_path = null;
    payload.file_name = null;
    payload.file_size = null;
    payload.image_url = null;
  } else {
    const fileUrl = cleanText(body.file_url, 2000);
    const filePath = cleanText(body.file_path, 500);
    const fileName = cleanText(body.file_name, 255);
    const fileSize = Number(body.file_size);

    if (
      !fileUrl ||
      !filePath ||
      !filePath.startsWith(`${TYPE}/`) ||
      !fileName
    ) {
      return {
        error: "Berkas belum diunggah melalui fasilitas media.",
      };
    }

    if (!Number.isSafeInteger(fileSize) || fileSize <= 0) {
      return { error: "Ukuran berkas tidak valid." };
    }

    if (fileType === "video" && !/\.mp4$/i.test(fileName)) {
      return { error: "Video harus berformat MP4." };
    }

    if (
      fileType === "image" &&
      !/\.(jpe?g|png|webp|gif)$/i.test(fileName)
    ) {
      return {
        error: "Gambar harus JPG, PNG, WEBP, atau GIF.",
      };
    }

    payload.file_url = fileUrl;
    payload.file_path = filePath;
    payload.file_name = fileName;
    payload.file_size = fileSize;
    payload.image_url = fileType === "image" ? fileUrl : null;
    payload.source_url = null;
  }

  return { payload };
}

function isMediaPayload(body) {
  return Object.prototype.hasOwnProperty.call(body, "file_type");
}

async function requireAdmin(request) {
  const auth = await verifyAdminRequest(request);

  if (!auth.ok) {
    return {
      ok: false,
      response: responseError(auth.error, auth.status),
    };
  }

  return { ok: true };
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const authorization = request.headers.get("authorization") || "";
    const wantsAdmin =
      url.searchParams.get("admin") === "1" ||
      authorization.startsWith("Bearer ");

    if (wantsAdmin) {
      const auth = await requireAdmin(request);
      if (!auth.ok) return auth.response;
    }

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("content_items")
      .select("*")
      .eq("type", TYPE)
      .order("created_at", { ascending: false });

    if (!wantsAdmin) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Kajian GET:", error.message);
      return responseError("Gagal mengambil data kajian.", 500);
    }

    return NextResponse.json({
      ok: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Kajian GET:", error.message);
    return responseError("Terjadi kesalahan pada server.", 500);
  }
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return responseError("Format data tidak valid.");
    }

    const validation = isMediaPayload(body)
      ? validateMediaPayload(body)
      : validateArticlePayload(body);

    if (validation.error) {
      return responseError(validation.error);
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("content_items")
      .insert(validation.payload)
      .select("*")
      .single();

    if (error) {
      console.error("Kajian POST:", error.message);
      return responseError("Gagal menyimpan data kajian.", 500);
    }

    return NextResponse.json(
      { ok: true, data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kajian POST:", error.message);
    return responseError("Terjadi kesalahan pada server.", 500);
  }
}

export async function PUT(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return responseError("Format data tidak valid.");
    }

    const id = cleanText(body.id, 50);

    if (!validUUID(id)) {
      return responseError("ID data kajian tidak valid.");
    }

    const validation = isMediaPayload(body)
      ? validateMediaPayload(body)
      : validateArticlePayload(body);

    if (validation.error) {
      return responseError(validation.error);
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("content_items")
      .update(validation.payload)
      .eq("id", id)
      .eq("type", TYPE)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Kajian PUT:", error.message);
      return responseError("Gagal memperbarui data kajian.", 500);
    }

    if (!data) {
      return responseError("Data kajian tidak ditemukan.", 404);
    }

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error("Kajian PUT:", error.message);
    return responseError("Terjadi kesalahan pada server.", 500);
  }
}

export async function DELETE(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const id = cleanText(body?.id, 50);

    if (!validUUID(id)) {
      return responseError("ID data kajian tidak valid.");
    }

    const supabase = getSupabaseAdmin();

    const { data: item, error: readError } = await supabase
      .from("content_items")
      .select("id,file_path,type")
      .eq("id", id)
      .eq("type", TYPE)
      .maybeSingle();

    if (readError) {
      console.error("Kajian DELETE read:", readError.message);
      return responseError("Gagal memeriksa data kajian.", 500);
    }

    if (!item) {
      return responseError("Data kajian tidak ditemukan.", 404);
    }

    const { error: deleteError } = await supabase
      .from("content_items")
      .delete()
      .eq("id", id)
      .eq("type", TYPE);

    if (deleteError) {
      console.error("Kajian DELETE:", deleteError.message);
      return responseError("Gagal menghapus data kajian.", 500);
    }

    if (
      typeof item.file_path === "string" &&
      item.file_path.startsWith(`${TYPE}/`)
    ) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([item.file_path]);

      if (storageError) {
        console.error(
          "Kajian storage cleanup:",
          storageError.message
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Kajian DELETE:", error.message);
    return responseError("Terjadi kesalahan pada server.", 500);
  }
}
