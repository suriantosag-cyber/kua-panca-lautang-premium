import { createHash } from "node:crypto";
import { isIP } from "node:net";

export async function enforceRateLimit(request, supabase, scope) {
  const ip = request.headers.get("x-real-ip")?.trim();

  // Jangan gunakan satu kunci bersama jika IP tidak tersedia.
  if (!ip || isIP(ip) === 0) {
    return Response.json(
      { ok: false, error: "Layanan sementara tidak tersedia. Silakan coba lagi." },
      { status: 503 }
    );
  }

  const rateKey = createHash("sha256")
    .update(`${scope}:${ip}`)
    .digest("hex");

  try {
    const { data, error } = await supabase.rpc(
      "check_api_rate_limit",
      {
        p_rate_key: rateKey,
        p_max_attempts: 5,
        p_window_seconds: 900,
      }
    );

    if (
      error ||
      !Array.isArray(data) ||
      data.length === 0 ||
      typeof data[0].allowed !== "boolean"
    ) {
      console.error("Rate limiter gagal:", error?.message || "Respons tidak valid");

      return Response.json(
        { ok: false, error: "Layanan sementara tidak tersedia. Silakan coba lagi." },
        { status: 503 }
      );
    }

    if (!data[0].allowed) {
      const retryAfter = Math.max(1, Number(data[0].retry_after) || 1);

      return Response.json(
        { ok: false, error: "Terlalu banyak percobaan. Silakan coba kembali nanti." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    return null;
  } catch (error) {
    console.error("Rate limiter tidak dapat dihubungi:", error?.message);

    return Response.json(
      { ok: false, error: "Layanan sementara tidak tersedia. Silakan coba lagi." },
      { status: 503 }
    );
  }
}
