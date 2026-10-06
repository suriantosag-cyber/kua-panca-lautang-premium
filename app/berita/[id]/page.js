'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function BeritaDetail() {
  const params = useParams();
const [berita, setBerita] = useState(null);
const [beritaLainnya, setBeritaLainnya] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    fetch('/api/news')
      .then((r) => r.json())
      .then((j) => {
        const item = (j?.data || []).find(
          (x) => String(x.id) === String(params.id)
        );
        setBerita(item || null);
setBeritaLainnya(j?.data || []);
      })
      .catch(() => setBerita(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        Memuat berita...
      </main>
    );
  }

  if (!berita) {
    return (
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        Berita tidak ditemukan.
      </main>
    );
  }

  const blocks = Array.isArray(berita.article_blocks)
    ? berita.article_blocks
    : [];

  return (
    <main className="beritaDetailPage" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px' }}>
      <a
        href="/#berita-kua"
        style={{
          display: 'inline-block',
          marginBottom: 28,
          textDecoration: 'none',
          fontWeight: 600
        }}
      >
        Kembali ke Berita KUA
      </a>

      <article>
        <div
          style={{
            display: 'inline-block',
            padding: '7px 14px',
            borderRadius: 999,
            background: 'rgba(37, 99, 235, 0.10)',
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 700
          }}
        >
          Berita KUA Panca Lautang
        </div>

        <h1
          style={{
            fontSize: 'clamp(30px, 5vw, 48px)',
            lineHeight: 1.15,
            marginBottom: 12
          }}
        >
          {berita.title}
        </h1>

        {berita.published_at && (
          <p style={{ opacity: 0.65, marginBottom: 28 }}>
            {new Date(berita.published_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        )}
<div
  style={{
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    margin: '0 0 28px'
  }}
>
  <div
  style={{
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: '0 0 28px'
  }}
>
  <strong style={{ marginRight: 4 }}>
    Bagikan Berita:
  </strong>

  <button
    onClick={() => {
      const url = window.location.href;
      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          `${berita.title} ${url}`
        )}`,
        '_blank'
      );
    }}
    style={{
      padding: '10px 16px',
      borderRadius: 999,
      border: 'none',
      background: '#25D366',
      color: '#fff',
      fontWeight: 700,
      cursor: 'pointer'
    }}
  >
    WhatsApp
  </button>

  <button
    onClick={() => {
      const url = window.location.href;
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank'
      );
    }}
    style={{
      padding: '10px 16px',
      borderRadius: 999,
      border: 'none',
      background: '#1877F2',
      color: '#fff',
      fontWeight: 700,
      cursor: 'pointer'
    }}
  >
    f Facebook
  </button>

  <button
    onClick={() => {
      const url = window.location.href;
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          berita.title
        )}&url=${encodeURIComponent(url)}`,
        '_blank'
      );
    }}
    style={{
      padding: '10px 16px',
      borderRadius: 999,
      border: 'none',
      background: '#000',
      color: '#fff',
      fontWeight: 700,
      cursor: 'pointer'
    }}
  >
    X
  </button>

  <button
    onClick={async () => {
      const url = window.location.href;

      try {
        await navigator.clipboard.writeText(url);
        alert('Tautan berita berhasil disalin.');
      } catch {
        alert('Gagal menyalin tautan.');
      }
    }}
    style={{
      padding: '10px 16px',
      borderRadius: 999,
      border: '1px solid #ddd',
      background: '#fff',
      color: '#222',
      fontWeight: 700,
      cursor: 'pointer'
    }}
  >
    Salin Link
  </button>
</div>
</div>
        {berita.content && (
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.9,
              whiteSpace: 'pre-wrap',
              marginBottom: 30
            }}
          >
            {berita.content}
          </p>
        )}

        {blocks.map((block, index) => {
          if (block.type === 'image' && block.url) {
            return (
              <div key={index} style={{ margin: '32px 0' }}>
                <img
  src={block.url}
  alt={`Foto berita ${index + 1}`}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'scale(1.03)';
    e.currentTarget.style.boxShadow =
      '0 12px 30px rgba(0,0,0,0.18)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  }}
  style={{
    width: '100%',
    maxHeight: 560,
    objectFit: 'cover',
    borderRadius: 20,
    display: 'block',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  }}
/>
              </div>
            );
          }

          if (block.type === 'text' && block.text) {
            return (
              <p
                key={index}
                style={{
                  fontSize: 18,
                  lineHeight: 1.9,
                  whiteSpace: 'pre-wrap',
                  margin: '28px 0'
                }}
              >
                {block.text}
              </p>
            );
          }

          if (block.type === 'location' && block.text) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    block.text
  )}`;

  return (
    <div
      key={index}
      style={{
        marginTop: 36,
        padding: 22,
        borderRadius: 18,
        background: 'rgba(37, 99, 235, 0.07)',
        border: '1px solid rgba(37, 99, 235, 0.15)'
      }}
    >
      <strong style={{ display: 'block', marginBottom: 8 }}>
        Lokasi Kegiatan
      </strong>

      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 17,
          lineHeight: 1.7,
          color: '#2563eb',
          textDecoration: 'none',
          fontWeight: 600
        }}
      >
        {block.text}
      </a>
    </div>
  );
}

return null;

          return null;
        })}
      </article>
{/* BERITA LAINNYA */}
{Array.isArray(berita?.id) ? null : (
  <section style={{ marginTop: 60 }}>
    <h2
      style={{
        fontSize: 'clamp(24px, 4vw, 34px)',
        marginBottom: 24
      }}
    >
      Berita Lainnya
    </h2>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20
      }}
    >
      {beritaLainnya
        .filter((item) => String(item.id) !== String(berita.id))
        .slice(0, 4)
        .map((item) => {
          const foto =
            Array.isArray(item.article_blocks)
              ? item.article_blocks.find(
                  (block) => block.type === 'image' && block.url
                )?.url
              : item.image_url;

          return (
            <a
              key={item.id}
              href={`/berita/${item.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid rgba(0,0,0,0.10)',
                borderRadius: 18,
                overflow: 'hidden',
                display: 'block'
              }}
            >
              {foto && (
                <img
                  src={foto}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: 120,
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              )}

              <div style={{ padding: 18 }}>
                <h3
                  style={{
                    margin: '0 0 10px',
                    fontSize: 18,
                    lineHeight: 1.4
                  }}
                >
                  {item.title}
                </h3>

                {item.published_at && (
                  <p
                    style={{
                      margin: 0,
                      opacity: 0.65,
                      fontSize: 14
                    }}
                  >
                    Tanggal:{' '}
                    {new Date(item.published_at).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }
                    )}
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
