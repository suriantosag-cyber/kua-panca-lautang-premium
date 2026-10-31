
import { createClient } from "@supabase/supabase-js";
import {
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { enforceRateLimit } from "../../../lib/api-rate-limit";

export const runtime = "nodejs";

const scrypt = promisify(scryptCallback);

function jsonNoStore(body, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store, max-age=0");
  headers.set("Pragma", "no-cache");
  return Response.json(body, { ...init, headers });
}

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

async function verifyPin(pin, storedHash) {
  if (typeof storedHash !== "string") return false;

  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;

  const [salt, expectedHex] = parts;

  if (!/^[a-f0-9]{32}$/i.test(salt)) return false;
  if (!/^[a-f0-9]{128}$/i.test(expectedHex)) return false;

  const actual = Buffer.from(
    await scrypt(pin, salt, 64)
  );
  const expected = Buffer.from(expectedHex, "hex");

  return (
    actual.length === expected.length &&
    timingSafeEqual(actual, expected)
  );
}

export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    const rateLimitResponse = await enforceRateLimit(
      request,
      supabase,
      "cek-status"
    );

    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();

    const kode_tracking =
      typeof body.kode_tracking === "string"
        ? body.kode_tracking.trim().toUpperCase()
        : "";

    const pin =
      typeof body.pin === "string"
        ? body.pin.trim()
        : "";

    if (
      !/^KUA-\d{4}-[A-F0-9]{10}$/.test(kode_tracking) ||
      !/^\d{10}$/.test(pin)
    ) {
      return jsonNoStore(
        {
          ok: false,
          error: "Kode pelacakan atau PIN tidak valid.",
        },
        { status: 400 }
      );
    }



    const { data: permohonan, error } = await supabase
      .from("permohonan_layanan")
      .select(`
        id,
        kode_tracking,
        nama_pemohon,
        jenis_layanan,
        status,
        catatan_publik,
        created_at,
        updated_at,
        selesai_at,
        pin_hash
      `)
      .eq("kode_tracking", kode_tracking)
      .maybeSingle();

    if (error) {
      console.error("Gagal mencari permohonan:", error.message);

      return jsonNoStore(
        { ok: false, error: "Status belum dapat diperiksa. Silakan coba lagi." },
        { status: 500 }
      );
    }

    const validPin =
      permohonan &&
      await verifyPin(pin, permohonan.pin_hash);

    if (!validPin) {
      return jsonNoStore(
        {
          ok: false,
          error: "Kode pelacakan atau PIN tidak valid.",
        },
        { status: 401 }
      );
    }

    const { data: riwayat, error: historyError } = await supabase
      .from("riwayat_permohonan")
      .select("status, catatan_publik, created_at")
      .eq("permohonan_id", permohonan.id)
      .order("created_at", { ascending: true })
      .limit(50);

    if (historyError) {
      console.error("Gagal membaca riwayat:", historyError.message);

      return jsonNoStore(
        { ok: false, error: "Riwayat status belum dapat dimuat." },
        { status: 500 }
      );
    }

    return jsonNoStore({
      ok: true,
      data: {
        kode_tracking: permohonan.kode_tracking,
        nama_pemohon: permohonan.nama_pemohon,
        jenis_layanan: permohonan.jenis_layanan,
        status: permohonan.status,
        catatan_publik: permohonan.catatan_publik,
        created_at: permohonan.created_at,
        updated_at: permohonan.updated_at,
        selesai_at: permohonan.selesai_at,
        riwayat: (riwayat || []).map((item) => ({
          status: item.status,
          catatan_publik: item.catatan_publik,
          created_at: item.created_at,
        })),
      },
    });
  } catch (error) {
    console.error("Kesalahan API cek status:", error.message);

    return jsonNoStore(
      { ok: false, error: "Terjadi kesalahan server saat memeriksa status." },
      { status: 500 }
    );
  }
}
