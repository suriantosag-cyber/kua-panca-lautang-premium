
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { verifyAdminRequest } from "../../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "website-files";
const FOLDER = "kajian-keluarga-sakinah";
const MAX_SIZE = 50 * 1024 * 1024;

const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function jsonError(message, status = 400) {
  return NextResponse.json(
    { ok: false, error: message },
    { status }
  );
}

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

export async function POST(request) {
  const auth = await verifyAdminRequest(request);

  if (!auth.ok) {
    return jsonError(auth.error, auth.status);
  }

  let uploadedPath = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (
      !file ||
      typeof file.arrayBuffer !== "function" ||
      typeof file.name !== "string"
    ) {
      return jsonError("Pilih berkas gambar atau video terlebih dahulu.");
    }

    if (file.size <= 0 || file.size > MAX_SIZE) {
      return jsonError("Ukuran berkas harus lebih dari 0 dan maksimal 50 MB.");
    }

    const originalName = file.name.trim();
    const extension = originalName.split(".").pop()?.toLowerCase();

    let mimeType;
    let safeExtension;

    if (
      file.type === "video/mp4" &&
      extension === "mp4"
    ) {
      mimeType = "video/mp4";
      safeExtension = "mp4";
    } else if (
      IMAGE_TYPES[file.type] &&
      (extension === IMAGE_TYPES[file.type] || (file.type === "image/jpeg" && extension === "jpeg"))
    ) {
      mimeType = file.type;
      safeExtension = IMAGE_TYPES[file.type];
    } else {
      return jsonError(
        "Format yang diizinkan: JPG, PNG, WEBP, GIF, dan MP4."
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    if (bytes.length !== file.size) {
      return jsonError("Berkas tidak terbaca dengan benar.");
    }

    // Pemeriksaan signature dasar untuk mencegah ekstensi/MIME palsu.
    const validSignature =
      mimeType === "image/jpeg"
        ? bytes.length >= 3 &&
          bytes[0] === 0xff &&
          bytes[1] === 0xd8 &&
          bytes[2] === 0xff
        : mimeType === "image/png"
        ? bytes.subarray(0, 8).equals(
            Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
          )
        : mimeType === "image/gif"
        ? ["GIF87a", "GIF89a"].includes(
            bytes.subarray(0, 6).toString("ascii")
          )
        : mimeType === "image/webp"
        ? bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
          bytes.subarray(8, 12).toString("ascii") === "WEBP"
        : mimeType === "video/mp4"
        ? bytes.length >= 12 &&
          bytes.subarray(4, 8).toString("ascii") === "ftyp"
        : false;

    if (!validSignature) {
      return jsonError("Isi berkas tidak sesuai dengan format yang dipilih.");
    }

    const supabase = getSupabaseAdmin();
    const filename = `${randomUUID()}.${safeExtension}`;
    uploadedPath = `${FOLDER}/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(uploadedPath, bytes, {
        contentType: mimeType,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Kajian media upload:", uploadError.message);
      return jsonError("Gagal mengunggah berkas ke penyimpanan.", 500);
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(uploadedPath);

    return NextResponse.json({
      ok: true,
      data: {
        name: filename,
        path: uploadedPath,
        url: publicData.publicUrl,
        size: file.size,
        mimeType,
      },
    });
  } catch (error) {
    console.error("Kajian media upload:", error.message);
    return jsonError("Terjadi kesalahan saat mengunggah berkas.", 500);
  }
}



