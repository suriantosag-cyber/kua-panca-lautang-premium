'use client';
import TanyaAnto from './components/TanyaAnto';
import { useEffect, useState } from 'react';

const features = [
  ['ðŸ•Œ','Kegiatan','Informasi kegiatan penyuluhan, pembinaan keagamaan, dan agenda masyarakat.'],
  ['ðŸ“š','Materi Dakwah','Materi ringkas yang mudah dibaca untuk keluarga dan masyarakat.'],
  ['ðŸ“„','Laporan Kegiatan','Dokumentasi dan laporan kegiatan penyuluhan tersusun rapi.'],
];

export default function Home() {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch('/api/news').then(r => r.json()).then(j => setNews(j?.data || [])).catch(() => setNews([])).finally(() => setLoading(false));
    fetch('/api/gallery').then(r => r.json()).then(result => { if (result.ok) setGallery(result.data || []); }).catch(() => setGallery([]));
  }, []);

  return <>
    <header className="top">
      <div className="wrap nav">
        <a href="#beranda" className="brand"><span className="brandmark">â˜ª</span><span>KUA Panca Lautang<small>Penyuluh Agama Islam</small></span></a>
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
            <div className="actions"><a className="btn primary" href="#berita">ðŸ“° Berita Kemenag Hari Ini</a><a className="btn" href="#kontak">ðŸ“ž Hubungi Kami</a></div>
          </div>
          <div className="heroCard"><div className="heroBadge">KUA PANCA LAUTANG â€¢ SIDRAP</div><div className="mosque"><div className="tower left"/><div className="tower right"/><div className="dome"/><div className="minaret"/></div></div>
        </div>
      </section>

      <section id="profil" className="section">
        <div className="wrap profile">
          <div className="profileMain"><div className="avatar">ðŸ‘¤</div><h3>Profil Penyuluh</h3><p>Ruang informasi untuk memperkenalkan Penyuluh Agama Islam, bidang pembinaan, layanan masyarakat, dan aktivitas penyuluhan di wilayah Panca Lautang.</p><a className="btn primary" href="#kontak">Lihat informasi layanan</a></div>
          <div className="card"><div className="sectionHead"><div><h2>Ruang layanan</h2><p>Konten utama disusun sederhana agar mudah ditemukan dari HP maupun komputer.</p></div></div><div className="list"><div className="listItem"><div className="icon">ðŸ¤</div><div><b>Pendampingan masyarakat</b><span>Konsultasi dan pembinaan keagamaan sesuai ruang layanan Penyuluh.</span></div></div><div className="listItem"><div className="icon">ðŸ“…</div><div><b>Agenda & kegiatan</b><span>Temukan kegiatan yang sedang berjalan dan dokumentasi program.</span></div></div><div className="listItem"><div className="icon">ðŸ“–</div><div><b>Materi yang praktis</b><span>Materi dakwah dibuat singkat, jelas, dan mudah dibagikan.</span></div></div></div></div>
        </div>
      </section>

      <section id="kegiatan" className="section" style={{paddingTop:0}}><div className="wrap"><div className="sectionHead"><div><h2>Kegiatan</h2><p>Program dan aktivitas penyuluhan untuk masyarakat.</p></div></div><div className="grid3">{features.map(([i,t,d])=><article className="card" key={t}><div className="icon">{i}</div><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

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
                <article className="card newsCard" key={item.id}>
                  {item.image_url && (
                    <div style={{margin:'-1px -1px 18px',borderRadius:'16px 16px 0 0',overflow:'hidden'}}>
                      <img
                        src={item.image_url}
                        alt={item.title || 'Foto berita KUA Panca Lautang'}
                        style={{width:'100%',height:'210px',objectFit:'cover',display:'block'}}
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
                      Baca selengkapnya →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="materi" className="section"><div className="wrap"><div className="sectionHead"><div><h2>Materi Dakwah</h2><p>Ruang untuk materi pilihan yang bermanfaat bagi keluarga dan masyarakat.</p></div></div><div className="grid3"><div className="card"><div className="icon">ðŸ’</div><h3>Pernikahan & keluarga</h3><p>Materi seputar persiapan pernikahan, keluarga sakinah, dan pembinaan pasangan.</p></div><div className="card"><div className="icon">ðŸ•‹</div><h3>Ibadah & akhlak</h3><p>Materi keagamaan singkat yang relevan untuk pembinaan sehari-hari.</p></div><div className="card"><div className="icon">ðŸŒ±</div><h3>Moderasi & kemasyarakatan</h3><p>Materi tentang kerukunan, kepedulian sosial, dan kehidupan bermasyarakat.</p></div></div></div></section>

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

      <section id="kontak" className="section"><div className="wrap"><div className="sectionHead"><div><h2>Kontak</h2><p>Informasi kontak resmi dapat dilengkapi setelah data layanan final.</p></div></div><div className="contact"><div className="contactCard"><div className="icon">ðŸ“</div><h3>KUA Kecamatan Panca Lautang</h3><p style={{color:'var(--muted)',lineHeight:1.7}}>Panca Lautang, Kabupaten Sidenreng Rappang, Sulawesi Selatan.</p></div><div className="contactCard"><div className="icon">ðŸŒ</div><h3>Website</h3><p style={{color:'var(--muted)',lineHeight:1.7}}>kua-pancalautang.my.id</p><a className="btn primary" href="https://kua-pancalautang.my.id" target="_blank" rel="noreferrer">Buka domain â†—</a></div></div></div></section>
    </main>

    <footer><div className="wrap footer"><div><b>â˜ª KUA Panca Lautang</b><div><small>Penyuluh Agama Islam â€¢ Website informasi masyarakat</small></div></div><small>Â© 2026 KUA Panca Lautang</small></div></footer>

<TanyaAnto />
  </>;
}




