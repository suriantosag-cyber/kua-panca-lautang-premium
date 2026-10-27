
import { createClient } from "@supabase/supabase-js";
import { randomInt, randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import { enforceRateLimit } from "../../../lib/api-rate-limit";

export const runtime = "nodejs";

const scrypt = promisify(scryptCallback);

function getSupabaseAdmin() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Konfigurasi database server belum lengkap.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function hashPin(pin) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(pin, salt, 64);

  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

function cleanText(value, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    const rateLimitResponse = await enforceRateLimit(
      request,
      supabase,
      "permohonan"
    );

    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();

    // Honeypot sederhana untuk menyaring bot formulir.
    if (cleanText(body.website, 200)) {
      return Response.json(
        { ok: false, error: "Pengajuan tidak dapat diproses." },
        { status: 400 }
      );
    }

    const nama_pemohon = cleanText(body.nama_pemohon, 120);
    const nomor_hp = cleanText(body.nomor_hp, 30);
    const email = cleanText(body.email, 254).toLowerCase();
    const jenis_layanan = cleanText(body.jenis_layanan, 120);
    const keperluan = cleanText(body.keperluan, 2000);
    const desa = cleanText(body.desa, 100);
    const catatan_pemohon = cleanText(body.catatan_pemohon, 1000);

    if (
      !nama_pemohon ||
      !nomor_hp ||
      !jenis_layanan ||
      !keperluan
    ) {
      return Response.json(
        {
          ok: false,
          error:
            "Nama, nomor HP, jenis layanan, dan keperluan wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!/^[0-9+().\-\s]{8,30}$/.test(nomor_hp)) {
      return Response.json(
        { ok: false, error: "Format nomor HP tidak valid." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { ok: false, error: "Format email tidak valid." },
        { status: 400 }
      );
    }


    const pin = String(randomInt(0, 10_000_000_000)).padStart(10, "0");
    const pin_hash = await hashPin(pin);

    let permohonan = null;
    let insertError = null;

    // Coba ulang jika kode pelacakan kebetulan sudah digunakan.
    for (let attempt = 0; attempt < 3; attempt++) {
      const kode_tracking =
        `KUA-${new Date().getFullYear()}-${randomBytes(5)
          .toString("hex")
          .toUpperCase()}`;

      const result = await supabase
        .from("permohonan_layanan")
        .insert({
          kode_tracking,
          pin_hash,
          nama_pemohon,
          nomor_hp,
          email: email || null,
          jenis_layanan,
          keperluan,
          desa: desa || null,
          catatan_pemohon: catatan_pemohon || null,
          status: "diajukan",
        })
        .select("id, kode_tracking, status, created_at")
        .single();

      if (!result.error) {
        permohonan = result.data;
        insertError = null;
        break;
      }

      insertError = result.error;

      if (result.error.code !== "23505") break;
    }

    if (!permohonan) {
      console.error("Gagal menyimpan pengajuan:", insertError?.message);

      return Response.json(
        { ok: false, error: "Pengajuan belum dapat disimpan. Silakan coba lagi." },
        { status: 500 }
      );
    }

    const { error: historyError } = await supabase
      .from("riwayat_permohonan")
      .insert({
        permohonan_id: permohonan.id,
        status: "diajukan",
        catatan_publik: "Pengajuan diterima dan menunggu pemeriksaan petugas.",
      });

    if (historyError) {
      console.error("Gagal menyimpan riwayat pengajuan:", historyError.message);

      // Hindari menyisakan pengajuan tanpa riwayat awal.
      await supabase
        .from("permohonan_layanan")
        .delete()
        .eq("id", permohonan.id);

      return Response.json(
        { ok: false, error: "Pengajuan belum dapat diselesaikan. Silakan coba lagi." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        ok: true,
        message: "Pengajuan berhasil diterima.",
        data: {
          kode_tracking: permohonan.kode_tracking,
          pin,
          status: permohonan.status,
          created_at: permohonan.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kesalahan API permohonan:", error.message);

    return Response.json(
      { ok: false, error: "Terjadi kesalahan server saat memproses pengajuan." },
      { status: 500 }
    );
  }
}
