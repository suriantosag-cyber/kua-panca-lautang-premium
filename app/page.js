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
const [selectedGallery, setSelectedGallery] = useState(null);

  useEffect(() => {
    fetch('/api/kemenag').then(r => r.json()).then(j => setKemenagNews((j?.data || []).slice(0, 2))).catch(() => setKemenagNews([]));

    fetch('/api/news').then(r => r.json()).then(j => setNews(j?.data || [])).catch(() => setNews([])).finally(() => setLoading(false));
    fetch('/api/gallery').then(r => r.json()).then(result => { if (result.ok) setGallery(result.data || []); }).catch(() => setGallery([]));
    fetch('/api/kegiatan-publik').then(r => r.json()).then(result => { if (result.ok) setKegiatan((result.data || []).slice(0, 3)); }).catch(() => setKegiatan([]));
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
<div className="pengumumanTicker">
  <div className="pengumumanTickerLabel">
    <span aria-hidden="true">[INFO]</span> PENGUMUMAN KUA PANCA LAUTANG
  </div>
  <div className="pengumumanTickerTrack">
    <div className="pengumumanTickerMove">
      <span>
        Mohon pastikan dokumen persyaratan lengkap sebelum mengurus
        layanan di KUA. &nbsp;  - Melayani dengan sepenuh hati.
      </span>
    </div>
  </div>
</div>


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

      <section id="profil" className="section">
        <div className="wrap profile">
          <div className="profileMain"><div className="avatar">PAI</div><h3>Profil Penyuluh</h3><p>Ruang informasi untuk memperkenalkan Penyuluh Agama Islam, bidang pembinaan, layanan masyarakat, dan aktivitas penyuluhan di wilayah Panca Lautang.</p><a className="btn primary" href="#kontak">Lihat informasi layanan</a></div>

<div className="card">
  <div className="sectionHead">
    <div>
      <h2>Ruang Layanan KUA</h2>
      <p>Layanan administrasi dan pembinaan keagamaan untuk masyarakat Panca Lautang.</p>
    </div>
  </div>

  
<div className="list">
  <div className="listItem">
    <div className="icon">01</div>
    <div>
      <b>Pendaftaran Nikah dan Rujuk</b>
      <span>
        Panduan awal untuk calon pengantin dan masyarakat yang
        membutuhkan informasi pencatatan pernikahan.
      </span>

      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a
          className="btn primary"
          href="https://simkah4.kemenag.go.id/"
          target="_blank"
          rel="noreferrer"
        >
          Buka SIMKAH Resmi
        </a>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 16,
          background: "#f0f8f4",
          borderRadius: 14
        }}
      >
        <b>Checklist Persiapan Dokumen</b>
        <ul style={{ margin: "10px 0 0 18px", padding: 0, fontSize: 13, lineHeight: 1.8 }}>
          <li>KTP dan Kartu Keluarga calon pengantin.</li>
          <li>Surat atau formulir persyaratan dari desa/kelurahan, termasuk N1–N4 jika dipersyaratkan sesuai ketentuan dan kondisi calon pengantin.</li>
          <li>Akta kelahiran atau dokumen pendukung jika dipersyaratkan.</li>
          <li>Pasfoto sesuai ketentuan yang berlaku.</li>
          <li>Dokumen tambahan sesuai keadaan, misalnya akta cerai atau surat kematian pasangan terdahulu jika relevan.</li>
          <li>Surat rekomendasi nikah jika diperlukan karena lokasi pencatatan berbeda wilayah.</li>
        </ul>
        <p style={{ margin: "12px 0 0", fontSize: 12, lineHeight: 1.7, color: "#38534a" }}>
          Daftar ini merupakan panduan awal, bukan daftar final untuk semua kondisi.
          Konfirmasikan persyaratan, dokumen rujuk, dan batas waktu pendaftaran
          kepada petugas KUA sebelum mengurus berkas.
        </p>
      </div>

      <div style={{ marginTop: 16 }}>
        <b>Alur Singkat</b>
        <ol style={{ margin: "8px 0 0 18px", padding: 0, fontSize: 13, lineHeight: 1.8 }}>
          <li>Siapkan dokumen dan konfirmasikan persyaratan kepada petugas.</li>
          <li>Ikuti petunjuk pendaftaran nikah melalui SIMKAH resmi atau petugas KUA. Pastikan data dan dokumen diisi sesuai petunjuk yang berlaku.</li>
          <li>Lengkapi dokumen dan ikuti pemeriksaan berkas dari petugas.</li>
          <li>Ikuti jadwal dan arahan layanan yang telah dikonfirmasi.</li>
        </ol>
      </div>
    </div>
  </div>

  <div className="listItem">
    <div className="icon">02</div>
    <div>
      <b>Konsultasi dan Pembinaan Keagamaan</b>
      <span>
        Layanan konsultasi dan pembinaan bagi masyarakat meliputi konsultasi
        keagamaan, bimbingan pranikah, pembinaan masjid dan majelis taklim,
        serta informasi zakat dan wakaf. Masyarakat dapat menghubungi atau
        datang ke KUA untuk menanyakan prosedur dan jadwal layanan yang tersedia.
        Konsultasi masalah keluarga akan diarahkan kepada petugas yang sesuai
        dengan tetap memperhatikan privasi.
      </span>
      <div style={{ marginTop: 10 }}>
        <a className="btn primary" href="#kontak">
          Lihat Informasi Kontak
        </a>
      </div>
    </div>
  </div>

  <div className="listItem">
    <div className="icon">03</div>
    <div>
      <b>Bimbingan Perkawinan dan Keluarga Sakinah</b>
      <span>
        Pelajari persiapan calon pengantin, komunikasi pasangan,
        tanggung jawab keluarga, dan pengelolaan rumah tangga.
      </span>
      <div style={{ marginTop: 10 }}>
        <a className="btn primary" href="/bimbingan-perkawinan">
          Buka Panduan Bimbingan
        </a>
      </div>
    </div>
  </div>

  <div className="listItem">
    <div className="icon">04</div>
    <div>
      <b>Profil dan Layanan Penyuluh Agama</b>
      <span>
        Informasi mengenai peran penyuluh, kegiatan pembinaan,
        dan wilayah layanan akan ditampilkan setelah data petugas
        diverifikasi.
      </span>
      <div style={{ marginTop: 10 }}>
        <a className="btn primary" href="/profil">
          Lihat Profil KUA
        </a>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  </section>


      <section id="kegiatan" className="section" style={{paddingTop:0}}><div className="wrap"><div className="sectionHead"><div><h2>Kegiatan</h2><p>Program dan aktivitas penyuluhan untuk masyarakat.</p></div></div><div className="grid3">{features.map(([i,t,d,link,label])=><article className="card" key={t}><div className="icon">{i}</div><h3>{t}</h3><p>{d}</p><a className="btn primary" href={link} style={{marginTop:10}}>{label}</a></article>)}</div>{kegiatan.length > 0 && <><div style={{marginTop:24}}><h3>Kegiatan Terbaru</h3></div><div className="grid3">{kegiatan.map((item)=><article className="card" key={item.id}><h3>{item.nama_kegiatan}</h3><p><b>{item.penyelenggara}</b> Ã‚Â· {item.desa}</p><p>{item.deskripsi || "Kegiatan KUA Panca Lautang."}</p><small>{item.tanggal} Ã‚Â· {item.kategori}</small></article>)}</div><div style={{marginTop:20}}><a className="btn primary" href="/kegiatan">Lihat Semua Kegiatan</a></div></>}</div></section>

      <section id="berita" className="section news">
        <div className="wrap">
          <div className="sectionHead">
            <div>
              <h2>Berita Terbaru KUA Panca Lautang</h2>
              <p>Berita dan informasi terbaru yang dikelola langsung melalui Admin KUA Panca Lautang.</p>
            </div>
          </div>

          {loading ? (
            <article className="newsCard">
              <div>
                <span className="tag">Memuat berita</span>
                <h3>Sedang mengambil berita terbaru...</h3>
                <p>Mohon tunggu sebentar.</p>
              </div>
            </article>
          ) : !news || news.length === 0 ? (
            <article className="newsCard">
              <div>
                <span className="tag">Informasi</span>
                <h3>Belum ada berita</h3>
                <p>Berita terbaru akan tampil setelah ditambahkan melalui Admin Panel.</p>
              </div>
            </article>
          ) : (
            <div className="grid3">
              {news.map((item) => (
                <article className={`card newsCard ${item.id === news[0]?.id ? "featuredNewsCard" : ""}`} key={item.id}>
                  {(item.image_url || item.article_blocks?.find((block) => block.type === 'image')?.url) && (
                    <div style={{margin:'-1px -1px 18px',borderRadius:'16px 16px 0 0',overflow:'hidden'}}>
                      <img
                        src={item.image_url || item.article_blocks?.find((block) => block.type === 'image')?.url}
                        alt={item.title || 'Foto berita KUA Panca Lautang'}
                        style={{width:'100%',height:'145px',objectFit:'cover',display:'block'}}
                      />
                    </div>
                  )}

                  <span className="tag">Berita KUA</span>

                  <h3>{item.title}</h3>

                  {item.content && (
                    <p style={{
                      whiteSpace:'pre-line',
                      lineHeight:1.7,
                      display:'-webkit-box',
                      WebkitLineClamp:4,
                      WebkitBoxOrient:'vertical',
                      overflow:'hidden'
                    }}>
                      {item.content}
                    </p>
                  )}

                  <div style={{marginTop:'16px'}}>
                    <a
                      className="newsBtn"
                      href={`/berita/${item.id}`}
                    >
                      Baca berita lengkap
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="kemenag" className="section">
  <div className="wrap">
    <div className="sectionHead">
      <div>
        <h2>Berita Terbaru Kementerian Agama</h2>
        <p>Dua berita terbaru dari Kementerian Agama Republik Indonesia.</p>
      </div>
    </div>

    {kemenagNews.length === 0 ? (
  <div className="card">
    <h3>Berita Kemenag sedang diperbarui</h3>
    <p>Silakan coba kembali beberapa saat lagi.</p>
  </div>
) : (
  <div className="kemenagNewsGrid">
    {kemenagNews.map((item, index) => (
      <article className="kemenagNewsCard" key={item.url || index}>
        <div className="kemenagNewsTop">
          <span className="kemenagNewsTag">KEMENAG RI</span>
          <span className="kemenagNewsDate">{item.date}</span>
        </div>

        <div className="kemenagNewsIcon">K</div>

        <h3>{item.title}</h3>

        {item.excerpt && (
          <p>{item.excerpt}</p>
        )}

        <a
          className="kemenagNewsButton"
          href={item.url}
          target="_blank"
          rel="noreferrer"
        >
          Baca berita selengkapnya ?
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

    <footer><div className="wrap footer"><div><b>KUA Panca Lautang</b><div><small>Penyuluh Agama Islam - Website informasi masyarakat</small></div></div><small>(c) 2026 KUA Panca Lautang</small></div></footer>
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
