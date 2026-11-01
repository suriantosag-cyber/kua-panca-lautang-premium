import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getKegiatan(id) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Konfigurasi Supabase server belum tersedia untuk detail kegiatan.');
    return null;
  }

  try {
    const supabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    const { data, error } = await supabase
      .from('kegiatan')
      .select('id, nama_kegiatan, penyelenggara, desa, tanggal, kategori, deskripsi, narahubung, foto_url, created_at')
      .eq('id', id)
      .eq('status', 'disetujui')
      .maybeSingle();

    if (error) {
      console.error('Gagal mengambil detail kegiatan:', error.message);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Kesalahan saat memuat detail kegiatan:', error);
    return null;
  }
}

function formatTanggal(value) {
  if (!value) return 'Tanggal belum dicantumkan';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Makassar'
  }).format(date);
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await getKegiatan(id);

  if (!item) {
    return {
      title: 'Kegiatan tidak ditemukan | KUA Panca Lautang',
      robots: { index: false, follow: true }
    };
  }

  const title = `${item.nama_kegiatan} | KUA Panca Lautang`;
  const description = (item.deskripsi || `Dokumentasi kegiatan ${item.nama_kegiatan} di wilayah kerja KUA Panca Lautang.`)
    .replace(/\s+/g, ' ')
    .slice(0, 155);

  return {
    title,
    description,
    alternates: {
      canonical: `https://kua-pancalautang.my.id/kegiatan/${item.id}`
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://kua-pancalautang.my.id/kegiatan/${item.id}`,
      images: item.foto_url ? [{ url: item.foto_url, alt: `Foto kegiatan ${item.nama_kegiatan}` }] : []
    },
    twitter: {
      card: item.foto_url ? 'summary_large_image' : 'summary',
      title,
      description,
      images: item.foto_url ? [item.foto_url] : []
    }
  };
}

export default async function DetailKegiatanPage({ params }) {
  const { id } = await params;
  const item = await getKegiatan(id);

  if (!item) notFound();

  return (
    <main className="section">
      <div className="wrap">
        <article className="kegiatan-detail">
          <a className="kegiatan-back" href="/kegiatan">← Kembali ke daftar kegiatan</a>

          <header className="kegiatan-detail-header">
            <span className="kegiatan-detail-eyebrow">Dokumentasi Kegiatan · KUA Panca Lautang</span>
            <h1>{item.nama_kegiatan}</h1>
            <p className="kegiatan-detail-date">{formatTanggal(item.tanggal)}{item.desa ? ` · ${item.desa}` : ''}</p>
          </header>

          {item.foto_url && (
            <figure className="kegiatan-detail-figure">
              <img
                src={item.foto_url}
                alt={`Dokumentasi ${item.nama_kegiatan}`}
                fetchPriority="high"
              />
              <figcaption>Dokumentasi kegiatan {item.nama_kegiatan} di wilayah kerja KUA Panca Lautang.</figcaption>
            </figure>
          )}

          <div className="kegiatan-detail-body">
            <dl className="kegiatan-detail-facts">
              <div><dt>Penyelenggara</dt><dd>{item.penyelenggara || 'Tidak dicantumkan'}</dd></div>
              <div><dt>Tanggal</dt><dd>{formatTanggal(item.tanggal)}</dd></div>
              <div><dt>Desa/Kelurahan</dt><dd>{item.desa || 'Tidak dicantumkan'}</dd></div>
              <div><dt>Kategori</dt><dd>{item.kategori || 'Kegiatan KUA'}</dd></div>
            </dl>

            <section className="kegiatan-detail-description">
              <h2>Tentang Kegiatan</h2>
              <p>{item.deskripsi || 'Informasi deskripsi kegiatan belum tersedia.'}</p>
            </section>

            {item.narahubung && (
              <p className="kegiatan-detail-contact"><strong>Narahubung:</strong> {item.narahubung}</p>
            )}
          </div>

          <footer className="kegiatan-detail-footer">
            <a className="btn primary" href="/kegiatan">Lihat kegiatan lainnya</a>
          </footer>
        </article>
      </div>

      <style>{`
        .kegiatan-detail {
          max-width: 980px;
          margin: 0 auto;
          padding: clamp(18px, 4vw, 42px);
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 8px 30px rgba(15, 23, 42, .06);
        }
        .kegiatan-back { display: inline-block; margin-bottom: 26px; color: #286344; font-weight: 650; text-decoration: none; }
        .kegiatan-detail-header { max-width: 820px; margin: 0 auto 26px; text-align: center; }
        .kegiatan-detail-eyebrow { color: #28704b; font-size: 12px; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; }
        .kegiatan-detail-header h1 { margin: 10px 0; color: #173d2c; font-size: clamp(26px, 4vw, 40px); line-height: 1.2; }
        .kegiatan-detail-date { margin: 0; color: #64748b; }
        .kegiatan-detail-figure { margin: 0 auto 28px; max-width: 850px; }
        .kegiatan-detail-figure img { display: block; width: 100%; max-height: 560px; aspect-ratio: 16 / 9; object-fit: contain; border-radius: 14px; background: #f1f5f9; }
        .kegiatan-detail-figure figcaption { margin-top: 8px; color: #64748b; font-size: 12px; text-align: center; }
        .kegiatan-detail-body { max-width: 790px; margin: 0 auto; }
        .kegiatan-detail-facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 0 0 30px; }
        .kegiatan-detail-facts div { padding: 14px; border-radius: 12px; background: #f8fafc; }
        .kegiatan-detail-facts dt { margin-bottom: 4px; color: #64748b; font-size: 12px; }
        .kegiatan-detail-facts dd { margin: 0; color: #1e293b; font-weight: 650; }
        .kegiatan-detail-description h2 { margin-bottom: 10px; color: #173d2c; font-size: 22px; }
        .kegiatan-detail-description p { color: #334155; font-size: 16px; line-height: 1.85; white-space: pre-line; }
        .kegiatan-detail-contact { margin-top: 24px; }
        .kegiatan-detail-footer { display: flex; justify-content: center; margin-top: 28px; padding-top: 22px; border-top: 1px solid #e2e8f0; }
        @media (max-width: 560px) {
          .kegiatan-detail { padding: 18px 14px; border-radius: 14px; }
          .kegiatan-detail-facts { grid-template-columns: 1fr 1fr; gap: 8px; }
          .kegiatan-detail-facts div { padding: 10px; }
          .kegiatan-detail-facts dd { font-size: 13px; }
          .kegiatan-detail-description p { font-size: 15px; }
        }
      `}</style>
    </main>
  );
}
