import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ShareBerita from "./ShareBerita";
import "./berita-detail.css";

export const dynamic = "force-dynamic";

async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) throw new Error("Konfigurasi Supabase belum tersedia.");

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
      <figure className="beritaInlineImage" key={index}>
        <img
          src={block.url}
          alt={block.alt || `Foto berita ${index + 1}`}
          loading="lazy"
        />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
  }

  if (block.type === "text" && block.text) {
    return <p className="beritaTextBlock" key={index}>{block.text}</p>;
  }

  if (block.type === "location" && block.text) {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(block.text)}`;
    return (
      <aside className="beritaLocation" key={index}>
        <strong>Lokasi Kegiatan</strong>
        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
          {block.text}
        </a>
      </aside>
    );
  }

  return null;
}

export default async function BeritaDetail({ params }) {
  const { id } = await params;
  const berita = await getBerita(id);
  if (!berita) notFound();

  const beritaLainnya = await getBeritaLainnya(berita.id);
  const blocks = Array.isArray(berita.article_blocks) ? berita.article_blocks : [];

  return (
    <main className="beritaDetailPage">
      <a className="beritaBreadcrumb" href="/#berita">
        <span aria-hidden="true">←</span> Kembali ke Berita KUA
      </a>

      <article>
        <header className="beritaArticleHeader">
          <span className="beritaEyebrow">Informasi Resmi · KUA Panca Lautang</span>
          <h1 className="beritaArticleTitle">{berita.title}</h1>
          <div className="beritaMeta">
            <span>KUA Panca Lautang</span>
            {berita.published_at && (
              <>
                <span className="beritaMetaDot" aria-hidden="true">•</span>
                <time dateTime={berita.published_at}>{formatTanggal(berita.published_at)}</time>
              </>
            )}
          </div>
        </header>

        <ShareBerita title={berita.title} />

        {berita.image_url && (
          <figure className="beritaHero">
            <img
              src={berita.image_url}
              alt={`Foto utama: ${berita.title}`}
              fetchPriority="high"
            />
          </figure>
        )}

        <div className="beritaArticleBody">
          {berita.content && <p className="beritaLead">{berita.content}</p>}
          {blocks.map((block, index) => renderBlock(block, index))}
        </div>
      </article>

      {beritaLainnya.length > 0 && (
        <section className="beritaRelated" aria-labelledby="berita-related-title">
          <div className="beritaRelatedHeading">
            <h2 id="berita-related-title">Berita Lainnya</h2>
            <p>Informasi dan kegiatan KUA Panca Lautang</p>
          </div>
          <div className="beritaRelatedGrid">
            {beritaLainnya.map((item) => {
              const foto =
                (Array.isArray(item.article_blocks)
                  ? item.article_blocks.find(
                      (block) => block.type === "image" && block.url
                    )?.url
                  : null) || item.image_url;

              return (
                <a className="beritaRelatedCard" key={item.id} href={`/berita/${item.id}`}>
                  {foto && <img src={foto} alt="" loading="lazy" />}
                  <div className="beritaRelatedCardContent">
                    <h3>{item.title}</h3>
                    {item.published_at && (
                      <time dateTime={item.published_at}>{formatTanggal(item.published_at)}</time>
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
