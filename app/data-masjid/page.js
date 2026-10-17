
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

const wilayahMasjid = [
  {
    wilayah: 'Desa Corawali',
    lokasi: 'Ibu Kota Kecamatan Panca Lautang',
    daftar: [
      { nama: 'Masjid Baiturrahmah', lokasi: 'Corawali' },
      { nama: 'Masjid Al-Ikhlas', lokasi: 'Corawali' },
      { nama: "Masjid & Ponpes Tahfizul Qur'an Ar-Rayyan", lokasi: 'Corawali' },
    ],
  },
  {
    wilayah: 'Wanio dan Wanio Timoreng',
    lokasi: 'Termasuk Dusun Maniangsalo, Cakkaleng, dan Sabbang',
    daftar: [
      { nama: 'Masjid Nurul Yaqin', lokasi: 'Dusun Maniangsalo, Wanio' },
      { nama: 'Masjid Nurul Huda', lokasi: 'Wanio Timoreng' },
      { nama: 'Masjid Nurul Amin', lokasi: 'Wanio' },
      { nama: 'Masjid Nurul Falah', lokasi: 'Wanio' },
      { nama: 'Masjid Al-Rahmah', lokasi: 'Cakkaleng, Wanio Timoreng' },
      { nama: 'Masjid Nurul Hidayah', lokasi: 'Wanio' },
      { nama: 'Mushalla Al-Madon', lokasi: 'Dusun Sabbang, Wanio' },
    ],
  },
  {
    wilayah: 'Desa Bapangi',
    lokasi: 'Termasuk wilayah Padaelo',
    daftar: [
      { nama: 'Masjid Al-Muttahida / Al-Muttahidah', lokasi: 'Padaelo, Bapangi' },
      { nama: 'Masjid Nurul Ilahi', lokasi: 'Bapangi' },
      { nama: 'Masjid Quba', lokasi: 'Bapangi' },
      { nama: 'Masjid Al-Muhajirin', lokasi: 'Bapangi' },
      { nama: 'Masjid Darussalam', lokasi: 'Jl. Poros Soppeng, Kel. Bapangi' },
    ],
  },
  {
    wilayah: 'Desa Lise',
    lokasi: 'Termasuk Dusun II Amessangeng',
    daftar: [
      { nama: 'Masjid Babul Jannah', lokasi: 'Dusun II Amessangeng, Lise' },
      { nama: 'Masjid Nurul Iman', lokasi: 'Lise' },
      { nama: 'Masjid Nurul Huda', lokasi: 'Lise' },
      { nama: 'Masjid Al Muhajirin', lokasi: 'Lise' },
    ],
  },
  {
    wilayah: 'Desa Alesalewo',
    lokasi: 'Nama wilayah juga ditulis Alessalewo pada daftar awal',
    daftar: [
      { nama: 'Masjid Babul Khaerat', lokasi: 'Alesalewo' },
      { nama: 'Masjid Taqwa', lokasi: 'Alesalewo' },
      { nama: 'Masjid Nurul Taqwa', lokasi: 'Alesalewo' },
    ],
  },
  {
    wilayah: 'Bilokka, Wette’e, dan Lajonga',
    lokasi: 'Wilayah lainnya',
    daftar: [
      { nama: 'Masjid Al-Hazard', lokasi: 'Jalan Poros Soppeng, Bilokka' },
      { nama: 'Masjid Nurul Hidayah', lokasi: 'Wette’e' },
      { nama: 'Masjid Nurul Falah', lokasi: 'Wette’e' },
      { nama: 'Masjid Nurussalam', lokasi: 'Lajonga' },
    ],
  },
];

export default function DataMasjidPage() {
  const [kataKunci, setKataKunci] = useState('');
  const [jenisFilter, setJenisFilter] = useState('semua');

  const wilayahTersaring = useMemo(() => {
    const kata = kataKunci.trim().toLocaleLowerCase('id-ID');

    return wilayahMasjid
      .map((wilayah) => ({
        ...wilayah,
        daftar: wilayah.daftar.filter((item) => {
          const cocokKata =
            `${item.nama} ${item.lokasi} ${wilayah.wilayah}`
              .toLocaleLowerCase('id-ID')
              .includes(kata);

          const cocokJenis =
            jenisFilter === 'semua' ||
            (jenisFilter === 'masjid' &&
              item.nama.startsWith('Masjid ')) ||
            (jenisFilter === 'mushalla' &&
              item.nama.startsWith('Mushalla '));

          return cocokKata && cocokJenis;
        }),
      }))
      .filter((wilayah) => wilayah.daftar.length > 0);
  }, [kataKunci, jenisFilter]);

  const jumlahMasjid = wilayahMasjid.reduce(
    (total, wilayah) =>
      total +
      wilayah.daftar.filter((item) =>
        item.nama.startsWith('Masjid ')
      ).length,
    0
  );

  const jumlahMushalla = wilayahMasjid.reduce(
    (total, wilayah) =>
      total +
      wilayah.daftar.filter((item) =>
        item.nama.startsWith('Mushalla ')
      ).length,
    0
  );

  const pilihFilter = (jenis) => {
    setJenisFilter((sebelumnya) =>
      sebelumnya === jenis ? 'semua' : jenis
    );
  };

  return (
    <main>
      <section className="section">
        <div className="wrap">
          <div className="sectionHead">
            <div>
              <span className="tag">DATA WILAYAH</span>
              <h1
                style={{
                  margin: '14px 0 8px',
                  fontSize: 'clamp(28px, 5vw, 42px)',
                }}
              >
                Daftar Masjid dan Mushalla
              </h1>
              <p>
                Kecamatan Panca Lautang, Kabupaten Sidenreng Rappang.
              </p>
            </div>
          </div>

          <div className="grid3" style={{ marginBottom: 28 }}>
            <button
              type="button"
              className="card"
              onClick={() => pilihFilter('masjid')}
              aria-pressed={jenisFilter === 'masjid'}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                font: 'inherit',
                color: 'inherit',
                border:
                  jenisFilter === 'masjid'
                    ? '2px solid var(--primary)'
                    : undefined,
              }}
            >
              <div className="icon" aria-hidden="true">🕌</div>
              <h3>{jumlahMasjid} Masjid</h3>
              <p>Nama yang tercatat dalam daftar awal.</p>
              <span>
                {jenisFilter === 'masjid'
                  ? 'Filter aktif — klik untuk tampilkan semua'
                  : 'Klik untuk melihat daftar masjid'}
              </span>
            </button>

            <button
              type="button"
              className="card"
              onClick={() => pilihFilter('mushalla')}
              aria-pressed={jenisFilter === 'mushalla'}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                font: 'inherit',
                color: 'inherit',
                border:
                  jenisFilter === 'mushalla'
                    ? '2px solid var(--primary)'
                    : undefined,
              }}
            >
              <div className="icon" aria-hidden="true">🌙</div>
              <h3>{jumlahMushalla} Mushalla</h3>
              <p>Nama yang tercatat dalam daftar awal.</p>
              <span>
                {jenisFilter === 'mushalla'
                  ? 'Filter aktif — klik untuk tampilkan semua'
                  : 'Klik untuk melihat daftar mushalla'}
              </span>
            </button>

            <article className="card">
              <div className="icon" aria-hidden="true">📋</div>
              <h3>Data sementara</h3>
              <p>
                Perlu verifikasi sebelum ditetapkan sebagai data resmi.
              </p>
            </article>
          </div>

          <label
            htmlFor="cari-masjid"
            style={{
              display: 'block',
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Cari nama masjid atau wilayah
          </label>

          <input
            id="cari-masjid"
            type="search"
            value={kataKunci}
            onChange={(event) => setKataKunci(event.target.value)}
            placeholder="Contoh: Baiturrahmah, Wanio, Bapangi..."
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              border: '1px solid var(--line)',
              marginBottom: 28,
              fontSize: 16,
            }}
          />

          {jenisFilter !== 'semua' && (
            <p>
              Menampilkan:{' '}
              <strong>
                {jenisFilter === 'masjid' ? 'Masjid saja' : 'Mushalla saja'}
              </strong>
              {' — '}
              <button
                type="button"
                onClick={() => setJenisFilter('semua')}
              >
                Tampilkan semua
              </button>
            </p>
          )}

          {wilayahTersaring.length === 0 ? (
            <p role="status">
              Tidak ada masjid atau mushalla yang cocok dengan pencarian.
            </p>
          ) : (
            wilayahTersaring.map((wilayah) => (
              <section
                key={wilayah.wilayah}
                style={{ marginBottom: 30 }}
              >
                <div className="sectionHead">
                  <div>
                    <h2 style={{ fontSize: 24, margin: 0 }}>
                      {wilayah.wilayah}
                    </h2>
                    <p>{wilayah.lokasi}</p>
                  </div>
                </div>

                <div className="grid3">
                  {wilayah.daftar.map((item) => (
                    <article
                      className="card"
                      key={`${item.nama}-${item.lokasi}`}
                    >
                      <h3>{item.nama}</h3>
                      <p>📍 {item.lokasi}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}

          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            Catatan: daftar ini disusun dari informasi awal yang diberikan
            kepada KUA. Nama, ejaan, lokasi, dan jumlah rumah ibadah perlu
            dikonfirmasi kembali sebelum dipublikasikan sebagai data resmi.
          </p>

          <p style={{ marginTop: 24 }}>
            <Link className="btn primary" href="/">
              ← Kembali ke website KUA
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
