import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

export async function GET(request) {
  const auth = await verifyAdminRequest(request);

  if (!auth.ok) {
    return responseError(auth.error, auth.status);
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("khutbah_jumat")
      .select("*")
      .order("week_start", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      items: data || [],
    });
  } catch (error) {
    console.error("GET khutbah Jumat:", error);
    return responseError(
      "Gagal memuat data khutbah Jumat.",
      500
    );
  }
}

export async function PATCH(request) {
  const auth = await verifyAdminRequest(request);

  if (!auth.ok) {
    return responseError(auth.error, auth.status);
  }

  try {
    const body = await request.json();

    const allowedActions = [
      "edit",
      "submit_for_review",
      "approve",
      "reject",
      "publish",
      "unpublish",
    ];

    if (!allowedActions.includes(body.action)) {
      return responseError("Tindakan tidak valid.");
    }

    if (
      typeof body.khutbah_id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.khutbah_id)
    ) {
      return responseError("ID khutbah tidak valid.");
    }

    if (
      body.action === "edit" &&
      body.referensi !== undefined &&
      !Array.isArray(body.referensi)
    ) {
      return responseError("Referensi harus berupa array.");
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.rpc(
      "manage_khutbah_jumat",
      {
        p_action: body.action,
        p_khutbah_id: body.khutbah_id,
        p_actor_id: auth.user.id,
        p_title: typeof body.title === "string" ? body.title : null,
        p_theme: typeof body.theme === "string" ? body.theme : null,
        p_khutbah_pertama:
          typeof body.khutbah_pertama === "string"
            ? body.khutbah_pertama
            : null,
        p_khutbah_kedua:
          typeof body.khutbah_kedua === "string"
            ? body.khutbah_kedua
            : null,
        p_doa_penutup:
          typeof body.doa_penutup === "string"
            ? body.doa_penutup
            : null,
        p_referensi: Array.isArray(body.referensi)
          ? body.referensi
          : null,
        p_review_notes:
          typeof body.review_notes === "string"
            ? body.review_notes
            : null,
      }
    );

    if (error) {
      console.error("RPC manage khutbah Jumat:", error);
      return responseError(error.message, 400);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("PATCH khutbah Jumat:", error);

    return responseError(
      "Permintaan pengelolaan khutbah gagal diproses.",
      500
    );
  }
}