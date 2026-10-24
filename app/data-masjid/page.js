'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '../../lib/supabase-browser';

export default function DataMasjidPage() {
  const [dataMasjid, setDataMasjid] = useState([]);
  const [kataKunci, setKataKunci] = useState('');
  const [jenisFilter, setJenisFilter] = useState('semua');
  const [memuat, setMemuat] = useState(true);
  const [pesanError, setPesanError] = useState('');

  useEffect(() => {
    let aktif = true;

    async function ambilData() {
      const { data, error } = await supabaseBrowser
        .from('data_masjid')
        .select('id, nama, jenis, desa, alamat, keterangan, nomor_sertifikat, luas_tanah, nomor_simas, status_verifikasi_simas, latitude, longitude')
        .eq('status', 'tampil')
        .order('desa')
        .order('nama');

      if (!aktif) return;

      if (error) {
        console.error('Gagal mengambil data masjid:', error.message);
        setPesanError('Data belum dapat dimuat. Silakan coba lagi nanti.');
      } else {
        setDataMasjid(data || []);
      }

      setMemuat(false);
    }

    ambilData();

    return () => {
      aktif = false;
    };
  }, []);

  const dataTersaring = useMemo(() => {
    const kata = kataKunci.trim().toLocaleLowerCase('id-ID');

    return dataMasjid.filter((item) => {
      const cocokKata = [
        item.nama,
        item.desa,
        item.alamat || '',
        item.keterangan || '',
        item.nomor_sertifikat || '',
        item.luas_tanah || '',
        item.nomor_simas || '',
        item.status_verifikasi_simas || '',
        item.latitude ?? '',
        item.longitude ?? '',
      ]
        .join(' ')
        .toLocaleLowerCase('id-ID')
        .includes(kata);

      return cocokKata &&
        (jenisFilter === 'semua' || item.jenis === jenisFilter);
    });
  }, [dataMasjid, kataKunci, jenisFilter]);

  const jumlahMasjid = dataMasjid.filter(
    (item) => item.jenis === 'masjid'
  ).length;

  const jumlahMushalla = dataMasjid.filter(
    (item) => item.jenis === 'mushalla'
  ).length;

  const wilayahTersaring = useMemo(() => {
    const kelompok = new Map();

    dataTersaring.forEach((item) => {
      const desa = item.desa || 'Wilayah belum ditentukan';
      if (!kelompok.has(desa)) kelompok.set(desa, []);
      kelompok.get(desa).push(item);
    });

    return Array.from(kelompok, ([desa, daftar]) => ({
      wilayah: desa,
      daftar,
    }));
  }, [dataTersaring]);

  const pilihFilter = (jenis) => {
    setJenisFilter((sebelumnya) =>
      sebelumnya === jenis ? 'semua' : jenis
    );
  };

  const gayaFilter = (aktif) => ({
    cursor: 'pointer',
    textAlign: 'left',
    font: 'inherit',
    color: 'inherit',
    border: aktif ? '2px solid var(--primary)' : undefined,
  });

  return (
    <main>
      <section className="section">
        <div className="wrap">
          <div className="sectionHead">
            <div>
              <span className="tag">DATA WILAYAH</span>
              <h1 style={{
                margin: '14px 0 8px',
                fontSize: 'clamp(28px, 5vw, 42px)',
              }}>
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
              style={gayaFilter(jenisFilter === 'masjid')}
            >
              <div className="icon" aria-hidden="true">🕌</div>
              <h3>{jumlahMasjid} Masjid</h3>
              <p>Masjid yang sudah ditampilkan kepada publik.</p>
              <span>Klik untuk memfilter masjid</span>
            </button>

            <button
              type="button"
              className="card"
              onClick={() => pilihFilter('mushalla')}
              aria-pressed={jenisFilter === 'mushalla'}
              style={gayaFilter(jenisFilter === 'mushalla')}
            >
              <div className="icon" aria-hidden="true">🌙</div>
              <h3>{jumlahMushalla} Mushalla</h3>
              <p>Mushalla yang sudah ditampilkan kepada publik.</p>
              <span>Klik untuk memfilter mushalla</span>
            </button>

            <article className="card">
              <div className="icon" aria-hidden="true">📋</div>
              <h3>{dataMasjid.length} Data tampil</h3>
              <p>Jumlah data rumah ibadah yang sudah diverifikasi.</p>
            </article>
          </div>

          <label
            htmlFor="cari-masjid"
            style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}
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
              Filter aktif: <strong>{jenisFilter}</strong>{' '}
              <button type="button" onClick={() => setJenisFilter('semua')}>
                Tampilkan semua
              </button>
            </p>
          )}

          {memuat ? (
            <p role="status">Memuat data dari database...</p>
          ) : pesanError ? (
            <p role="alert">{pesanError}</p>
          ) : dataMasjid.length === 0 ? (
            <article className="card">
              <h2>Data belum tersedia untuk publik</h2>
              <p>
                Data awal sudah disiapkan, tetapi masih menunggu verifikasi
                sebelum ditampilkan di website.
              </p>
            </article>
          ) : dataTersaring.length === 0 ? (
            <p role="status">
              Tidak ada masjid atau mushalla yang cocok dengan pencarian.
            </p>
          ) : (
            wilayahTersaring.map((wilayah) => (
              <section key={wilayah.wilayah} style={{ marginBottom: 30 }}>
                <div className="sectionHead">
                  <div>
                    <h2 style={{ fontSize: 24, margin: 0 }}>
                      {wilayah.wilayah}
                    </h2>
                    <p>{wilayah.daftar.length} rumah ibadah</p>
                  </div>
                </div>

                <div className="grid3">
                  {wilayah.daftar.map((item) => (
                    <article className="card" key={item.id}>
                      <h3>{item.nama}</h3>
                      <p>📍 {item.alamat || item.desa}</p>
                      {item.nomor_sertifikat && (
                        <p>Nomor sertifikat: {item.nomor_sertifikat}</p>
                      )}
                      {item.luas_tanah && (
                        <p>Luas tanah: {item.luas_tanah}</p>
                      )}
                      {item.nomor_simas && (
                        <p>Nomor SIMAS: {item.nomor_simas}</p>
                      )}
                      <p>
                        Status SIMAS: {
                          item.status_verifikasi_simas === 'terverifikasi'
                            ? 'Terverifikasi'
                            : 'Belum diverifikasi'
                        }
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}

          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            Data yang ditampilkan mengikuti status verifikasi. Nama dan
            lokasi rumah ibadah perlu diperiksa oleh pengelola KUA.
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
