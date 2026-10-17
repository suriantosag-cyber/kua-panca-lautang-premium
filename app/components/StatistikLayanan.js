'use client';

import { useEffect, useRef, useState } from 'react';


const statistik = [
  {
    ikon: '\u{1F54C}',
    judul: 'Data Masjid',
    keterangan: 'Informasi rumah ibadah di wilayah Panca Lautang',
    nilai: 'Data menyusul',
    href: null,
  },
  {
    ikon: '\u{1F48D}',
    judul: 'Layanan Nikah',
    keterangan: 'Informasi dan jadwal pelayanan pernikahan',
    nilai: 'Lihat jadwal',
    href: '#jadwal-nikah',
  },
  {
    ikon: '\u{1F91D}',
    judul: 'Penyuluh Agama',
    keterangan: 'Informasi pembinaan dan layanan keagamaan',
    nilai: 'Lihat profil',
    href: '#profil',
  },
];

export default function StatistikLayanan() {
  const sectionRef = useRef(null);
  const [terlihat, setTerlihat] = useState(false);

  useEffect(() => {
    const elemen = sectionRef.current;
    if (!elemen) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTerlihat(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTerlihat(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(elemen);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`statistikLayanan section${terlihat ? ' statistikTerlihat' : ''}`}
      aria-labelledby="judul-statistik-layanan"
    >
      <div className="wrap">
        <div className="sectionHead">
          <div>
            <h2 id="judul-statistik-layanan">Statistik Layanan Digital</h2>
            <p>Informasi layanan dan pembinaan masyarakat KUA Kecamatan Panca Lautang.</p>
          </div>
        </div>


<div className="statistikGrid">
  {statistik.map((item, index) => {
    const isiKartu = (
      <>
        <span className="statistikIkon" aria-hidden="true">{item.ikon}</span>
        <h3>{item.judul}</h3>
        <p>{item.keterangan}</p>
        <strong>{item.nilai}</strong>
      </>
    );

    return item.href ? (
      <a
        className="statistikCard statistikCardLink"
        href={item.href}
        key={item.judul}
        style={{ '--urutan-statistik': index }}
      >
        {isiKartu}
      </a>
    ) : (
      <article
        className="statistikCard"
        key={item.judul}
        style={{ '--urutan-statistik': index }}
      >
        {isiKartu}
      </article>
    );
  })}
</div>
      </div>
    </section>
  );
}
