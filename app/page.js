'use client';

import { useEffect, useState } from 'react';

const features = [
  ['🕌','Kegiatan','Informasi kegiatan penyuluhan, pembinaan keagamaan, dan agenda masyarakat.'],
  ['📚','Materi Dakwah','Materi ringkas yang mudah dibaca untuk keluarga dan masyarakat.'],
  ['📄','Laporan Kegiatan','Dokumentasi dan laporan kegiatan penyuluhan tersusun rapi.'],
];

export default function Home() {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [adminNews, setAdminNews] = useState([]);
  
  useEffect(() => {
  fetch('/api/news', { cache: 'no-store' })
    .then(r => r.json())
    .then(setNews)
    .catch(() => setNews({ ok: false }))
    .finally(() => setLoading(false));

  fetch('/api/news')
    .then(r => r.json())
    .then(result => {
      if (result.ok) {
        setAdminNews(result.data || []);
      }
    })
    .catch(() => setAdminNews([]));

  fetch('/api/gallery')
    .then(r => r.json())
    .then(result => {
      if (result.ok) {
        setGallery(result.data || []);
      }
    })
    .catch(() => setGallery([]));
}, []);
  return <>
    <header className="top">
      <div className="wrap nav">
        <a href="#beranda" className="brand"><span className="brandmark">☪</span><span>KUA Panca Lautang<small>Penyuluh Agama Islam</small></span></a>
        <nav className="navlinks">
          <a href="#profil">Profil</a><a href="#kegiatan">Kegiatan</a><a href="#berita">Berita</a><a href="#materi">Materi</a><a href="#galeri">Galeri</a><a href="#kontak">Kontak</a>
        </nav>
      </div>
    </header>

    <main>
      <section id="beranda" className="hero">
        <div className="wrap heroGrid">
          <div>
            <span className="eyebrow"><span className="pulse"/> Portal Informasi KUA Panca Lautang</span>
            <h1>Pelayanan yang <span>dekat</span> dengan masyarakat.</h1>
            <p>Website baru yang bersih, cepat, dan responsif untuk informasi Penyuluh Agama Islam, kegiatan, materi dakwah, laporan, galeri, serta satu berita terbaru Kementerian Agama setiap hari.</p>
            <div className="actions"><a className="btn primary" href="#berita">📰 Berita Kemenag Hari Ini</a><a className="btn" href="#kontak">📞 Hubungi Kami</a></div>
          </div>
          <div className="heroCard"><div className="heroBadge">KUA PANCA LAUTANG • SIDRAP</div><div className="mosque"><div className="tower left"/><div className="tower right"/><div className="dome"/><div className="minaret"/></div></div>
        </div>
      </section>

      <section id="profil" className="section">
        <div className="wrap profile">
          <div className="profileMain"><div className="avatar">👤</div><h3>Profil Penyuluh</h3><p>Ruang informasi untuk memperkenalkan Penyuluh Agama Islam, bidang pembinaan, layanan masyarakat, dan aktivitas penyuluhan di wilayah Panca Lautang.</p><a className="btn primary" href="#kontak">Lihat informasi layanan</a></div>
          <div className="card"><div className="sectionHead"><div><h2>Ruang layanan</h2><p>Konten utama disusun sederhana agar mudah ditemukan dari HP maupun komputer.</p></div></div><div className="list"><div className="listItem"><div className="icon">🤝</div><div><b>Pendampingan masyarakat</b><span>Konsultasi dan pembinaan keagamaan sesuai ruang layanan Penyuluh.</span></div></div><div className="listItem"><div className="icon">📅</div><div><b>Agenda & kegiatan</b><span>Temukan kegiatan yang sedang berjalan dan dokumentasi program.</span></div></div><div className="listItem"><div className="icon">📖</div><div><b>Materi yang praktis</b><span>Materi dakwah dibuat singkat, jelas, dan mudah dibagikan.</span></div></div></div></div>
        </div>
      </section>

      <section id="kegiatan" className="section" style={{paddingTop:0}}><div className="wrap"><div className="sectionHead"><div><h2>Kegiatan</h2><p>Program dan aktivitas penyuluhan untuk masyarakat.</p></div></div><div className="grid3">{features.map(([i,t,d])=><article className="card" key={t}><div className="icon">{i}</div><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

      <section id="berita" className="section news">
  <div className="wrap">

    <div className="sectionHead">
      <div>
        <h2>Berita & Informasi</h2>
        <p>
          Berita kegiatan KUA Panca Lautang dan informasi terbaru
          Kementerian Agama Republik Indonesia.
        </p>
      </div>
    </div>

    {/* BERITA YANG DITAMBAHKAN DARI ADMIN */}
    {adminNews.length > 0 && (
      <div>
        {adminNews.map((item) => (
          <article className="newsCard" key={item.id}>
            <div>
              <span className="tag">Berita KUA Panca Lautang</span>

              <h3>{item.title}</h3>

              <p>
                {item.content}
              </p>

              <div className="newsDate">
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : ''}
              </div>
            </div>
          </article>
        ))}
      </div>
    )}

    {/* BERITA KEMENAG */}
    <article className="newsCard">
      <div>
        {loading ? (
          <>
            <span className="tag">Memuat berita</span>
            <h3>Sedang mengambil berita terbaru dari Kemenag…</h3>
            <p>Mohon tunggu sebentar.</p>
          </>
        ) : (
          <>
            <span className="tag">Kemenag RI</span>

            <h3>
              {news?.title || 'Berita Kemenag sedang diperbarui'}
            </h3>

            <p>
              Sumber:{' '}
              {news?.source ||
                'Kementerian Agama Republik Indonesia'}
            </p>

            <div className="newsDate">
              {news?.date || 'Pembaruan otomatis setiap hari'}
            </div>
          </>
        )}
      </div>

      {news?.url && (
        <a
          className="newsBtn"
          href={news.url}
          target="_blank"
          rel="noreferrer"
        >
          Baca di Kemenag ↗
        </a>
      )}
    </article>

  </div>
</section>

      <section id="materi" className="section"><div className="wrap"><div className="sectionHead"><div><h2>Materi Dakwah</h2><p>Ruang untuk materi pilihan yang bermanfaat bagi keluarga dan masyarakat.</p></div></div><div className="grid3"><div className="card"><div className="icon">💍</div><h3>Pernikahan & keluarga</h3><p>Materi seputar persiapan pernikahan, keluarga sakinah, dan pembinaan pasangan.</p></div><div className="card"><div className="icon">🕋</div><h3>Ibadah & akhlak</h3><p>Materi keagamaan singkat yang relevan untuk pembinaan sehari-hari.</p></div><div className="card"><div className="icon">🌱</div><h3>Moderasi & kemasyarakatan</h3><p>Materi tentang kerukunan, kepedulian sosial, dan kehidupan bermasyarakat.</p></div></div></div></section>

      <section id="galeri" className="section" style={{paddingTop:0}}>
  <div className="wrap">
    <div className="sectionHead">
      <div>
        <h2>Galeri</h2>
        <p>Dokumentasi kegiatan KUA Panca Lautang.</p>
      </div>
    </div>
    <div className="gallery">
      {gallery.length > 0 ? gallery.map((item, index) => (
        <div className={`photo ${index === 0 ? 'big' : ''}`} key={item.path || item.name}>
          <img
            src={item.url}
            alt={item.name || 'Dokumentasi kegiatan KUA'}
            style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
          />
        </div>
      )) : (
        <div className="photo big">
          <span>?? Belum ada foto galeri</span>
        </div>
      )}
    </div>
  </div>
</section>

      <section id="kontak" className="section"><div className="wrap"><div className="sectionHead"><div><h2>Kontak</h2><p>Informasi kontak resmi dapat dilengkapi setelah data layanan final.</p></div></div><div className="contact"><div className="contactCard"><div className="icon">📍</div><h3>KUA Kecamatan Panca Lautang</h3><p style={{color:'var(--muted)',lineHeight:1.7}}>Panca Lautang, Kabupaten Sidenreng Rappang, Sulawesi Selatan.</p></div><div className="contactCard"><div className="icon">🌐</div><h3>Website</h3><p style={{color:'var(--muted)',lineHeight:1.7}}>kua-pancalautang.my.id</p><a className="btn primary" href="https://kua-pancalautang.my.id" target="_blank" rel="noreferrer">Buka domain ↗</a></div></div></div></section>
    </main>

    <footer><div className="wrap footer"><div><b>☪ KUA Panca Lautang</b><div><small>Penyuluh Agama Islam • Website informasi masyarakat</small></div></div><small>© 2026 KUA Panca Lautang</small></div></footer>
  </>;
}



