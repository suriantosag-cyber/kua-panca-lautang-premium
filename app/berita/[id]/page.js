import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ShareBerita from "./ShareBerita";

export const dynamic = "force-dynamic";

async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Konfigurasi Supabase belum tersedia.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}

function formatTanggal(value) {
  if (!value) return null;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Makassar"
  }).format(new Date(value));
}

async function getBerita(id) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("news")
    .select("id, title, content, image_url, article_blocks, published_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil detail berita:", error.message);
    return null;
  }

  return data;
}

async function getBeritaLainnya(id) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("news")
    .select("id, title, image_url, article_blocks, published_at")
    .neq("id", id)
    .order("published_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Gagal mengambil berita lainnya:", error.message);
    return [];
  }

  return data || [];
}

function renderBlock(block, index) {
  if (!block || typeof block !== "object") return null;

  if (block.type === "image" && block.url) {
    return (
      <figure key={index} style={{ margin: "32px 0" }}>
        <img
          src={block.url}
          alt={block.alt || `Foto berita ${index + 1}`}
          loading="lazy"
          style={{
            width: "100%",
            maxHeight: 560,
            objectFit: "cover",
            borderRadius: 20,
            display: "block"
          }}
        />
        {block.caption && (
          <figcaption style={{ marginTop: 8, color: "#64748b", fontSize: 14 }}>
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "text" && block.text) {
    return (
      <p
        key={index}
        style={{
          fontSize: 18,
          lineHeight: 1.9,
          whiteSpace: "pre-wrap",
          margin: "28px 0"
        }}
      >
        {block.text}
      </p>
    );
  }

  if (block.type === "location" && block.text) {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(block.text)}`;
    return (
      <div
        key={index}
        style={{
          marginTop: 36,
          padding: 22,
          borderRadius: 18,
          background: "rgba(37, 99, 235, 0.07)",
          border: "1px solid rgba(37, 99, 235, 0.15)"
        }}
      >
        <strong style={{ display: "block", marginBottom: 8 }}>
          Lokasi Kegiatan
        </strong>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          {block.text}
        </a>
      </div>
    );
  }

  return null;
}

export default async function BeritaDetail({ params }) {
  const { id } = await params;
  const berita = await getBerita(id);

  if (!berita) notFound();

  const beritaLainnya = await getBeritaLainnya(berita.id);
  const blocks = Array.isArray(berita.article_blocks)
    ? berita.article_blocks
    : [];

  return (
    <main
      className="beritaDetailPage"
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "40px 20px 80px"
      }}
    >
      <a
        href="/#berita"
        style={{
          display: "inline-block",
          marginBottom: 28,
          textDecoration: "none",
          fontWeight: 600
        }}
      >
        Kembali ke Berita KUA
      </a>

      <article>
        <div
          style={{
            display: "inline-block",
            padding: "7px 14px",
            borderRadius: 999,
            background: "rgba(37, 99, 235, 0.10)",
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 700
          }}
        >
          Berita KUA Panca Lautang
        </div>

        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 48px)",
            lineHeight: 1.15,
            marginBottom: 12
          }}
        >
          {berita.title}
        </h1>

        {berita.published_at && (
          <p style={{ opacity: 0.65, marginBottom: 28 }}>
            {formatTanggal(berita.published_at)}
          </p>
        )}

        <ShareBerita title={berita.title} />

        {berita.image_url && (
          <figure style={{ margin: "0 0 30px" }}>
            <img
              src={berita.image_url}
              alt={`Foto utama: ${berita.title}`}
              fetchPriority="high"
              style={{
                width: "100%",
                maxHeight: 560,
                objectFit: "cover",
                borderRadius: 20,
                display: "block"
              }}
            />
          </figure>
        )}

        {berita.content && (
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.9,
              whiteSpace: "pre-wrap",
              marginBottom: 30
            }}
          >
            {berita.content}
          </p>
        )}

        {blocks.map((block, index) => renderBlock(block, index))}
      </article>

      {beritaLainnya.length > 0 && (
        <section style={{ marginTop: 60 }}>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 34px)",
              marginBottom: 24
            }}
          >
            Berita Lainnya
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20
            }}
          >
            {beritaLainnya.map((item) => {
              const foto =
                (Array.isArray(item.article_blocks)
                  ? item.article_blocks.find(
                      (block) => block.type === "image" && block.url
                    )?.url
                  : null) || item.image_url;

              return (
                <a
                  key={item.id}
                  href={`/berita/${item.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid rgba(0,0,0,0.10)",
                    borderRadius: 18,
                    overflow: "hidden",
                    display: "block"
                  }}
                >
                  {foto && (
                    <img
                      src={foto}
                      alt={item.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  )}
                  <div style={{ padding: 18 }}>
                    <h3
                      style={{
                        margin: "0 0 10px",
                        fontSize: 18,
                        lineHeight: 1.4
                      }}
                    >
                      {item.title}
                    </h3>
                    {item.published_at && (
                      <p style={{ margin: 0, opacity: 0.65, fontSize: 14 }}>
                        Tanggal: {formatTanggal(item.published_at)}
                      </p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
