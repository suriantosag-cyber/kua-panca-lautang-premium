'use client';
import TanyaAnto from './components/TanyaAnto';
import JadwalNikah from './components/JadwalNikah';
import StatistikLayanan from './components/StatistikLayanan';
import { useEffect, useState } from 'react';

const features = [
  ['PR','Kegiatan','Informasi kegiatan KUA, penyuluhan, pembinaan masyarakat, dan agenda keagamaan.','/kegiatan','Lihat Kegiatan'],
  ['MD','Materi Dakwah','Panduan ibadah, khutbah, akhlak mulia, moderasi beragama, dan materi pembinaan masyarakat.','/materi-dakwah','Buka Materi'],
  ['LK','Dokumentasi Kegiatan','Dokumentasi kegiatan masyarakat ditampilkan melalui galeri website.','#galeri','Lihat Galeri'],
];

export default function Home() {
  const [news, setNews] = useState(null);
  const [kemenagNews, setKemenagNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [kegiatan, setKegiatan] = useState([]);
 const [pengumuman, setPengumuman] = useState(null);
const [selectedGallery, setSelectedGallery] = useState(null);

  useEffect(() => {
    fetch('/api/kemenag').then(r => r.json()).then(j => setKemenagNews((j?.data || []).slice(0, 2))).catch(() => setKemenagNews([]));

    fetch('/api/news').then(r => r.json()).then(j => setNews(j?.data || [])).catch(() => setNews([])).finally(() => setLoading(false));
    fetch('/api/gallery').then(r => r.json()).then(result => { if (result.ok) setGallery(result.data || []); }).catch(() => setGallery([]));
    fetch('/api/kegiatan-publik').then(r => r.json()).then(result => { if (result.ok) setKegiatan((result.data || []).slice(0, 3)); }).catch(() => setKegiatan([]));
    fetch('/api/pengumuman', { cache: 'no-store' })
      .then(r => r.json())
      .then(result => {
        if (result.ok && result.data) setPengumuman(result.data);
      })
      .catch(() => {});
  }, []);

  const newsImageUrls = new Set(
    (news || []).flatMap((item) => [
      item?.image_url,
      ...(item?.article_blocks || [])
        .filter((block) => block?.type === 'image')
        .map((block) => block?.url)
    ].filter(Boolean))
  );

  const visibleGallery = gallery.filter((item, index, arr) => {
    if (!item?.url) return false;
    if (newsImageUrls.has(item.url)) return false;

    return arr.findIndex((other) => other?.url === item.url) === index;
  });


  return <>


    <main>

<div className="kemenagTicker">
  <a className="kemenagTickerLabel" href="/info-haji-umrah">
  INFO HAJI & UMRAH
</a>
  <div className="kemenagTickerTrack">
    <div className="kemenagTickerMove">
      {kemenagNews.map((item) => (
        <a key={item.url} href={item.url} target="_blank" rel="noreferrer">
          {item.title}
        </a>
      ))}
    </div>
  </div>
</div>
{pengumuman?.aktif !== false && pengumuman && (
  <div className="pengumumanTicker">
    <div className="pengumumanTickerLabel">
      <span aria-hidden="true">[INFO]</span> {pengumuman.judul || 'PENGUMUMAN KUA PANCA LAUTANG'}
    </div>
    <div className="pengumumanTickerTrack">
      <div className="pengumumanTickerMove">
        <span>{pengumuman.isi} &nbsp; - Melayani dengan sepenuh hati.</span>
      </div>
    </div>
  </div>
)}

      <section id="beranda" className="hero">
        <div className="wrap heroGrid">
          <div>
            <span className="eyebrow"><span className="pulse"/> Portal Informasi KUA Panca Lautang</span>
            <h1>Pelayanan yang <span>dekat</span> dengan masyarakat.</h1>
            <p>Portal informasi dan layanan KUA Kecamatan Panca Lautang yang memudahkan masyarakat menemukan informasi administrasi KUA, layanan perkawinan, penyuluhan dan pembinaan keagamaan, kegiatan masyarakat, serta berita Kementerian Agama.</p>
            <div className="actions"><a className="btn primary" href="#kemenag">Berita Kemenag Hari Ini</a><a className="btn" href="#kontak">Hubungi Kami</a></div>
          </div>
          <div className="heroCard"><div className="heroBadge">KUA PANCA LAUTANG - SIDRAP</div><img src="/kantor-kua.jpeg" alt="Kantor KUA Panca Lautang" style={{width:"100%",height:"280px",objectFit:"cover",borderRadius:"18px"}} /></div>
        </div>
      </section>

      <StatistikLayanan />

      <JadwalNikah />

            <section id="profil" className="section" style={{padding:"42px 0"}}>
        <div className="wrap">
          <div className="sectionHead">
            <div>
              <h2>Layanan KUA</h2>
              <p>Akses informasi dan layanan KUA Panca Lautang dengan mudah.</p>
            </div>
          </div>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,240px),1fr))",
            gap:16
          }}>
            <article className="card">
              <div className="icon">01</div>
              <h3>Pendaftaran Nikah dan Rujuk</h3>
              <p>Panduan awal administrasi dan pencatatan pernikahan.</p>
              <a className="btn primary" href="https://simkah4.kemenag.go.id/"
                 target="_blank" rel="noreferrer" style={{marginTop:14}}>
                Buka SIMKAH Resmi
              </a>
              <details style={{marginTop:14}}>
                <summary style={{cursor:"pointer",fontWeight:700}}>
                  Persyaratan dan alur pendaftaran
                </summary>
                <div style={{fontSize:13,lineHeight:1.8}}>
                  <b>Checklist dokumen</b>
                  <ul>
                    <li>KTP dan Kartu Keluarga calon pengantin.</li>
                    <li>Surat pengantar atau dokumen persyaratan desa/kelurahan.</li>
                    <li>Akta kelahiran atau dokumen pendukung jika dipersyaratkan.</li>
                    <li>Pasfoto sesuai ketentuan.</li>
                    <li>Akta cerai atau surat kematian pasangan terdahulu jika relevan.</li>
                    <li>Surat rekomendasi nikah jika diperlukan.</li>
                  </ul>
                  <p>Persyaratan merupakan panduan awal. Konfirmasikan dokumen dan batas waktu kepada petugas KUA.</p>
                  <b>Alur singkat</b>
                  <ol>
                    <li>Siapkan dokumen dan konfirmasikan persyaratan.</li>
                    <li>Ikuti pendaftaran melalui SIMKAH atau KUA.</li>
                    <li>Lengkapi dan periksa berkas.</li>
                    <li>Ikuti jadwal dan arahan petugas.</li>
                  </ol>
                </div>
              </details>
            </article>

            <article className="card">
              <div className="icon">02</div>
              <h3>Konsultasi Keagamaan</h3>
              <p>Konsultasi, pembinaan masjid, majelis taklim, zakat, wakaf, dan kehidupan keluarga.</p>
              <a className="btn primary" href="#kontak" style={{marginTop:14}}>
                Hubungi KUA
              </a>
            </article>

            <article className="card">
              <div className="icon">03</div>
              <h3>Bimbingan Keluarga Sakinah</h3>
              <p>Persiapan calon pengantin, komunikasi pasangan, dan pembinaan keluarga.</p>
              <a className="btn primary" href="/bimbingan-perkawinan" style={{marginTop:14}}>
                Buka Panduan
              </a>
            </article>

            <article className="card">
              <div className="icon">04</div>
              <h3>Bimbingan Remaja (BRUS)</h3>
              <p>Edukasi akhlak, pergaulan sehat, tanggung jawab, dan kesiapan masa depan.</p>
              <a className="btn primary" href="/brus" style={{marginTop:14}}>
                Buka Materi BRUS
              </a>
            </article>
          </div>
        </div>
      </section>


      <section id="kegiatan" className="section" style={{paddingTop:0}}><div className="wrap"><div className="sectionHead"><div><h2>Kegiatan</h2><p>Program dan aktivitas penyuluhan untuk masyarakat.</p></div></div><div className="grid3">{features.map(([i,t,d,link,label])=><article className="card" key={t}><div className="icon">{i}</div><h3>{t}</h3><p>{d}</p><a className="btn primary" href={link} style={{marginTop:10}}>{label}</a></article>)}</div>{kegiatan.length > 0 && <><div style={{marginTop:24}}><h3>Kegiatan Terbaru</h3></div><div className="grid3">{kegiatan.map((item)=><article className="card" key={item.id}><h3>{item.nama_kegiatan}</h3><p><b>{item.penyelenggara}</b> · {item.desa}</p><p>{item.deskripsi || "Kegiatan KUA Panca Lautang."}</p><small>{item.tanggal} · {item.kategori}</small></article>)}</div><div style={{marginTop:20}}><a className="btn primary" href="/kegiatan">Lihat Semua Kegiatan</a></div></>}</div></section>

      <section id="berita" className="section news">
  <div className="wrap">
    <div className="sectionHead">
      <div>
        <h2>Berita &amp; Informasi Terbaru</h2>
        <p>Informasi terkini dari KUA Panca Lautang dan Kementerian Agama Republik Indonesia.</p>
        <a href="/berita" className="homeNewsAllLink">Lihat semua berita KUA →</a>
      </div>
    </div>

    {((news || []).length === 0 && (kemenagNews || []).length === 0) ? (
      <article className="homeCombinedNewsCard">
        <span className="tag">{loading ? "MEMUAT BERITA" : "INFORMASI"}</span>
        <h3>{loading ? "Sedang mengambil berita terbaru..." : "Belum ada berita terbaru"}</h3>
        <p>{loading ? "Mohon tunggu sebentar." : "Berita akan tampil setelah tersedia dari sumber terkait."}</p>
      </article>
    ) : (
      <div className="homeCombinedNewsGrid">
        {(news || []).slice(0, 2).map((item) => (
          <article className="homeCombinedNewsCard" key={`kua-${item.id}`}>
            {(item.image_url || item.article_blocks?.find((block) => block.type === "image")?.url) && (
              <div className="homeCombinedNewsImage">
                <img
                  src={item.image_url || item.article_blocks?.find((block) => block.type === "image")?.url}
                  alt={item.title || "Foto berita KUA Panca Lautang"}
                />
              </div>
            )}

            <span className="homeCombinedNewsTag">BERITA KUA</span>
            <h3>{item.title}</h3>

            {item.content && (
              <p className="homeCombinedNewsExcerpt">{item.content}</p>
            )}

            <a className="homeCombinedNewsButton" href={`/berita/${item.id}`}>
              Baca berita lengkap
            </a>
          </article>
        ))}

        {(kemenagNews || []).slice(0, 2).map((item, index) => (
          <article className="homeCombinedNewsCard" key={`kemenag-${item.url || index}`}>
            <div className="homeCombinedNewsMeta">
              <span className="homeCombinedNewsTag">KEMENAG RI</span>
              <span>{item.date}</span>
            </div>

            <div className="homeCombinedNewsIcon">K</div>
            <h3>{item.title}</h3>

            {item.excerpt && (
              <p className="homeCombinedNewsExcerpt">{item.excerpt}</p>
            )}

            <a
              className="homeCombinedNewsButton"
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              Baca berita selengkapnya
            </a>
          </article>
        ))}
      </div>
    )}
  </div>
</section>

    <section id="galeri" className="section" style={{paddingTop:0}}>
  <div className="wrap">
    <div className="sectionHead">
      <div>
        <h2>Galeri</h2>
        <p>Dokumentasi kegiatan KUA Panca Lautang.</p>
      </div>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 24
    }}>
      {visibleGallery.length > 0 ? (
        visibleGallery.map((item) => (
          <div
            key={item.path || item.name}
            style={{
              borderRadius: 22,
              overflow: 'hidden',
              background: '#fff'
            }}
          ><button
  type="button"
  onClick={() => setSelectedGallery(item)}
  style={{
    border: 0,
    padding: 0,
    margin: 0,
    background: 'transparent',
    cursor: 'pointer',
    width: '100%',
    display: 'block'
  }}
>
  <img
    src={item.url}
    alt={item.name || 'Dokumentasi kegiatan KUA'}
    style={{
      width: '100%',
      height: 260,
      objectFit: 'cover',
      display: 'block'
    }}
  />
</button>
          </div>
        ))
      ) : (
        <div className="card">
          Belum ada foto galeri
        </div>
      )}
    </div>
    </div>
    </section>
    
<section id="kontak" className="section">
  <div className="wrap">
    <div className="sectionHead">
      <div>
        <h2>Kontak</h2>
        <p>Informasi kontak resmi dapat dilengkapi setelah data layanan final.</p>
      </div>
    </div>

    <div className="contact">
      <div className="contactCard">
        <div className="icon">LOK</div>
        <h3>KUA Kecamatan Panca Lautang</h3>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Panca Lautang, Kabupaten Sidenreng Rappang, Sulawesi Selatan.
        </p>
        <a
          className="btn primary"
          
href="https://www.google.com/maps/search/?api=1&query=KUA%20Panca%20Lautang%2C%20Panca%20Lautang%2C%20Sidenreng%20Rappang%2C%20Sulawesi%20Selatan"

          target="_blank"
          rel="noreferrer"
        >
          Buka di Google Maps
        </a>
      </div>

      <div className="contactCard">
        <div className="icon">WEB</div>
        <h3>Website</h3>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          kua-pancalautang.my.id
        </p>
        <a
          className="btn primary"
          href="https://kua-pancalautang.my.id"
          target="_blank"
          rel="noreferrer"
        >
          Buka domain
        </a>
      </div>
    </div>

    <div
      style={{
        marginTop: 24,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid var(--border, #e2e8f0)",
      }}
    >
      <iframe
        title="Peta Lokasi KUA Kecamatan Panca Lautang"
        
src="https://maps.google.com/maps?q=KUA%20Panca%20Lautang%2C%20Panca%20Lautang%2C%20Sidenreng%20Rappang%2C%20Sulawesi%20Selatan&output=embed"

        width="100%"
        height="380"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  </div>
</section>
</main>

<section
  id="disclaimer"
  className="section"
  style={{ paddingTop: "0" }}
>
  <div className="wrap">
    <div
      className="card"
      style={{
        borderLeft: "4px solid #64748b",
        background: "#f8fafc",
        padding: "24px",
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: "20px" }}>
        DISCLAIMER
      </h2>
      <p style={{ lineHeight: 1.8, color: "#475569" }}>
        Situs web ini merupakan Portal Informasi Swadaya yang
        dikelola oleh Penyuluh Agama Islam KUA Kecamatan Panca
        Lautang sebagai media dakwah, penyebaran informasi, dan
        dokumentasi kegiatan masyarakat.
      </p>
      <p style={{ lineHeight: 1.8, color: "#475569", marginBottom: 0 }}>
        Situs ini bukan pengganti sistem administrasi resmi
        Kementerian Agama. Untuk pendaftaran nikah resmi dan
        keperluan administrasi hukum negara, silakan mengakses{" "}
        <a
          href="https://simkah4.kemenag.go.id"
          target="_blank"
          rel="noreferrer"
          style={{ fontWeight: 600, color: "#0f766e" }}
        >
          SIMKAH Kementerian Agama Republik Indonesia
        </a>{" "}
        atau menghubungi Kantor Kementerian Agama Kabupaten
        Sidenreng Rappang (Sidrap).
      </p>
    </div>
  </div>
</section>

{selectedGallery && (
  <div
    onClick={() => setSelectedGallery(null)}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: 900,
        width: '100%',
        background: '#fff',
        borderRadius: 22,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <button type="button" onClick={() => { const i = gallery.findIndex(x => x.path === selectedGallery.path); setSelectedGallery(gallery[(i - 1 + gallery.length) % gallery.length]); }} style={{position:"absolute",left:12,top:"50%",zIndex:3,border:0,borderRadius:"50%",width:48,height:48,fontSize:28,cursor:"pointer"}}>&lsaquo;</button>
      <button type="button" onClick={() => { const i = gallery.findIndex(x => x.path === selectedGallery.path); setSelectedGallery(gallery[(i + 1) % gallery.length]); }} style={{position:"absolute",right:12,top:"50%",zIndex:3,border:0,borderRadius:"50%",width:48,height:48,fontSize:28,cursor:"pointer"}}>&rsaquo;</button>
      <button
        type="button"
        onClick={() => setSelectedGallery(null)}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          border: 0,
          borderRadius: '50%',
          width: 40,
          height: 40,
          fontSize: 24,
          cursor: 'pointer'
        }}
      >
        X
      </button>

      <img
        src={selectedGallery.url}
        alt={selectedGallery.name || 'Foto Galeri'}
        style={{
          width: '100%',
          maxHeight: '60vh',
          objectFit: 'contain',
          display: 'block',
          background: '#111'
        }}
      />

      <div style={{ padding: 16, background: '#fff', color: '#111', textAlign: 'center' }}>
        <strong>
          {(selectedGallery.name || 'Dokumentasi kegiatan KUA Panca Lautang').replace(/^\d+-/, '').replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')}
        </strong>
      </div>
    </div>
  </div>
)}
<TanyaAnto />
  </>;
}
