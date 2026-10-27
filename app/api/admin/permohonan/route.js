
import { createClient } from "@supabase/supabase-js";
import { verifyAdminRequest } from "../../../../lib/admin-auth.js";

export const runtime = "nodejs";

const STATUS_VALID = [
  "diajukan",
  "menunggu_verifikasi",
  "diproses",
  "perlu_perbaikan",
  "selesai",
  "ditolak",
  "dibatalkan",
];

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

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function GET(request) {
  const auth = await verifyAdminRequest(request);

  if (!auth.ok) {
    return Response.json(
      { ok: false, error: auth.error },
      { status: auth.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const search = cleanText(searchParams.get("q") || "", 100);

    if (status && !STATUS_VALID.includes(status)) {
      return Response.json(
        { ok: false, error: "Filter status tidak valid." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("permohonan_layanan")
      .select(`
        id,
        kode_tracking,
        nama_pemohon,
        nomor_hp,
        email,
        jenis_layanan,
        keperluan,
        desa,
        catatan_pemohon,
        status,
        catatan_publik,
        catatan_internal,
        created_at,
        updated_at,
        selesai_at
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      const escaped = search.replace(/[,%()]/g, "");
      if (escaped) {
        query = query.or(
          `kode_tracking.ilike.%${escaped}%,nama_pemohon.ilike.%${escaped}%,nomor_hp.ilike.%${escaped}%`
        );
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Gagal mengambil permohonan:", error.message);
      return Response.json(
        { ok: false, error: "Daftar permohonan belum dapat dimuat." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, data: data || [] });
  } catch (error) {
    console.error("Kesalahan API admin permohonan:", error.message);
    return Response.json(
      { ok: false, error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  const auth = await verifyAdminRequest(request);

  if (!auth.ok) {
    return Response.json(
      { ok: false, error: auth.error },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json();
    const id = cleanText(body.id, 50);
    const status = cleanText(body.status, 40);
    const catatan_publik = cleanText(body.catatan_publik, 1000);
    const catatan_internal = cleanText(body.catatan_internal, 2000);

    if (!id || !STATUS_VALID.includes(status)) {
      return Response.json(
        { ok: false, error: "ID permohonan atau status tidak valid." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: sebelumnya, error: cariError } = await supabase
      .from("permohonan_layanan")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (cariError) {
      console.error("Gagal mencari permohonan:", cariError.message);
      return Response.json(
        { ok: false, error: "Permohonan belum dapat diperiksa." },
        { status: 500 }
      );
    }

    if (!sebelumnya) {
      return Response.json(
        { ok: false, error: "Permohonan tidak ditemukan." },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    const { data: updated, error: updateError } = await supabase
      .from("permohonan_layanan")
      .update({
        status,
        catatan_publik: catatan_publik || null,
        catatan_internal: catatan_internal || null,
        updated_at: now,
        selesai_at: status === "selesai" ? now : null,
      })
      .eq("id", id)
      .select(`
        id,
        kode_tracking,
        nama_pemohon,
        status,
        catatan_publik,
        catatan_internal,
        updated_at,
        selesai_at
      `)
      .single();

    if (updateError) {
      console.error("Gagal memperbarui permohonan:", updateError.message);
      return Response.json(
        { ok: false, error: "Status permohonan gagal diperbarui." },
        { status: 500 }
      );
    }

    const statusBerubah = sebelumnya.status !== status;

    if (statusBerubah || catatan_publik) {
      const { error: historyError } = await supabase
        .from("riwayat_permohonan")
        .insert({
          permohonan_id: id,
          status,
          catatan_publik: catatan_publik || null,
          petugas_email: auth.user.email || null,
        });

      if (historyError) {
        console.error("Gagal menyimpan riwayat:", historyError.message);

        return Response.json(
          {
            ok: true,
            warning:
              "Status tersimpan, tetapi riwayat belum berhasil ditambahkan. Periksa database sebelum mengulangi perubahan.",
            data: updated,
          },
          { status: 200 }
        );
      }
    }

    return Response.json({
      ok: true,
      message: "Permohonan berhasil diperbarui.",
      data: updated,
    });
  } catch (error) {
    console.error("Kesalahan pembaruan permohonan:", error.message);
    return Response.json(
      { ok: false, error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
