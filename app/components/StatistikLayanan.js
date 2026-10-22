'use client';

import { useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';

export default function StatistikLayanan() {
  const sectionRef = useRef(null);
  const [terlihat, setTerlihat] = useState(false);
  const [jumlahMasjid, setJumlahMasjid] = useState(null);

  useEffect(() => {
    let aktif = true;

    async function ambilJumlahMasjid() {
      const { count, error } = await supabaseBrowser
        .from('data_masjid')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'tampil');

      if (!aktif) return;

      if (error) {
        console.error('Gagal mengambil statistik masjid:', error.message);
        setJumlahMasjid(null);
      } else {
        setJumlahMasjid(count ?? 0);
      }
    }

    ambilJumlahMasjid();

    return () => {
      aktif = false;
    };
  }, []);

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

  const statistik = [
    {
      ikon: '\u{1F54C}',
      judul: 'Data Masjid',
      keterangan: 'Informasi rumah ibadah di wilayah Panca Lautang',
      nilai:
        jumlahMasjid === null
          ? 'Memuat data...'
          : `${jumlahMasjid} rumah ibadah terverifikasi`,
      href: '/data-masjid',
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
            <p>
              Informasi layanan dan pembinaan masyarakat KUA Kecamatan
              Panca Lautang.
            </p>
          </div>
        </div>

        <div className="statistikGrid">
          {statistik.map((item, index) => {
            const isiKartu = (
              <>
                <span className="statistikIkon" aria-hidden="true">
                  {item.ikon}
                </span>
                <h3>{item.judul}</h3>
                <p>{item.keterangan}</p>
                <strong>{item.nilai}</strong>
              </>
            );

            return (
              <a
                className="statistikCard statistikCardLink"
                href={item.href}
                key={item.judul}
                style={{ '--urutan-statistik': index }}
              >
                {isiKartu}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
