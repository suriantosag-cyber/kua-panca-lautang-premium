'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { supabaseBrowser } from '../../lib/supabase-browser';

const PetaMasjid = dynamic(() => import('../components/PetaMasjid'), {
  ssr: false,
  loading: () => <p className="dm-mapLoading">Memuat peta lokasi...</p>,
});

export default function DataMasjidPage() {
  const [dataMasjid, setDataMasjid] = useState([]);
  const [kataKunci, setKataKunci] = useState('');
  const [jenisFilter, setJenisFilter] = useState('semua');
  const [desaFilter, setDesaFilter] = useState('semua');
  const [memuat, setMemuat] = useState(true);
  const [pesanError, setPesanError] = useState('');

  useEffect(() => {
    let aktif = true;
    async function ambilData() {
      const { data, error } = await supabaseBrowser
        .from('data_masjid')
        .select('id, nama, jenis, desa, kecamatan, alamat, keterangan, id_masjid, tipologi, status_tanah, luas_bangunan, tahun_berdiri, nomor_sertifikat, luas_tanah, nomor_simas, status_verifikasi_simas, latitude, longitude')
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
    return () => { aktif = false; };
  }, []);

  const daftarDesa = useMemo(() => [...new Set(
    dataMasjid.map((item) => item.desa?.trim()).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'id')), [dataMasjid]);

  const dataTersaring = useMemo(() => {
    const kata = kataKunci.trim().toLocaleLowerCase('id-ID');
    return dataMasjid.filter((item) => {
      const cocokKata = [
        item.nama, item.jenis, item.desa, item.kecamatan, item.alamat,
        item.id_masjid, item.tipologi, item.status_tanah,
        item.luas_bangunan, item.tahun_berdiri, item.keterangan,
        item.nomor_sertifikat, item.luas_tanah, item.nomor_simas,
        item.status_verifikasi_simas,
      ].map((nilai) => nilai ?? '').join(' ')
        .toLocaleLowerCase('id-ID').includes(kata);
      return cocokKata &&
        (jenisFilter === 'semua' || item.jenis === jenisFilter) &&
        (desaFilter === 'semua' || item.desa?.trim() === desaFilter);
    });
  }, [dataMasjid, kataKunci, jenisFilter, desaFilter]);

  const jumlahMasjid = dataMasjid.filter((item) => item.jenis === 'masjid').length;
  const jumlahMushalla = dataMasjid.filter((item) => item.jenis === 'mushalla').length;
  const jumlahTerverifikasi = dataMasjid.filter(
    (item) => item.status_verifikasi_simas === 'terverifikasi'
  ).length;

  const wilayahTersaring = useMemo(() => {
    const kelompok = new Map();
    dataTersaring.forEach((item) => {
      const desa = item.desa?.trim() || 'Wilayah belum ditentukan';
      if (!kelompok.has(desa)) kelompok.set(desa, []);
      kelompok.get(desa).push(item);
    });
    return Array.from(kelompok, ([wilayah, daftar]) => ({ wilayah, daftar }));
  }, [dataTersaring]);

  function resetFilter() {
    setKataKunci('');
    setJenisFilter('semua');
    setDesaFilter('semua');
  }

  const filterAktif = kataKunci.trim() !== '' ||
    jenisFilter !== 'semua' || desaFilter !== 'semua';

  return (
    <main className="dm-page">
      <section className="section dm-section">
        <div className="wrap">
          <header className="dm-hero">
            <span className="tag">DATA WILAYAH</span>
            <p className="dm-eyebrow">KANTOR URUSAN AGAMA</p>
            <h1>Data Masjid dan Mushalla</h1>
            <p className="dm-intro">
              Informasi rumah ibadah di Kecamatan Panca Lautang,
              Kabupaten Sidenreng Rappang.
            </p>
            <div className="dm-heroMeta">
              <span>Data rumah ibadah</span><span aria-hidden="true">•</span>
              <span>{dataMasjid.length} data tersedia</span>
            </div>
          </header>

          <section className="dm-stats" aria-label="Statistik rumah ibadah">
            <button type="button"
              className={`dm-stat dm-statMasjid ${jenisFilter === 'masjid' ? 'is-active' : ''}`}
              onClick={() => setJenisFilter((v) => v === 'masjid' ? 'semua' : 'masjid')}
              aria-pressed={jenisFilter === 'masjid'}>
              <span className="dm-statIcon" aria-hidden="true">M</span>
              <span className="dm-statLabel">Jumlah Masjid</span>
              <strong>{jumlahMasjid}</strong>
              <span className="dm-statHint">Klik untuk memfilter masjid</span>
            </button>
            <button type="button"
              className={`dm-stat dm-statMushalla ${jenisFilter === 'mushalla' ? 'is-active' : ''}`}
              onClick={() => setJenisFilter((v) => v === 'mushalla' ? 'semua' : 'mushalla')}
              aria-pressed={jenisFilter === 'mushalla'}>
              <span className="dm-statIcon" aria-hidden="true">U</span>
              <span className="dm-statLabel">Jumlah Mushalla</span>
              <strong>{jumlahMushalla}</strong>
              <span className="dm-statHint">Klik untuk memfilter mushalla</span>
            </button>
            <article className="dm-stat dm-statVerified">
              <span className="dm-statIcon" aria-hidden="true">✓</span>
              <span className="dm-statLabel">Terverifikasi SIMAS</span>
              <strong>{jumlahTerverifikasi}</strong>
              <span className="dm-statHint">Dari {dataMasjid.length} data publik</span>
            </article>
          </section>

          <section className="dm-tools" aria-label="Pencarian dan filter">
            <div className="dm-toolsHeading">
              <h2>Temukan Rumah Ibadah</h2>
              <p>Cari berdasarkan nama, lokasi, atau informasi SIMAS.</p>
            </div>
            <div className="dm-filterGrid">
              <div className="dm-field dm-searchField">
                <label htmlFor="dm-search">Pencarian</label>
                <input id="dm-search" type="search" value={kataKunci}
                  onChange={(event) => setKataKunci(event.target.value)}
                  placeholder="Nama masjid, alamat, nomor SIMAS..." />
              </div>
              <div className="dm-field">
                <label htmlFor="dm-desa">Desa / Kelurahan</label>
                <select id="dm-desa" value={desaFilter}
                  onChange={(event) => setDesaFilter(event.target.value)}>
                  <option value="semua">Semua wilayah</option>
                  {daftarDesa.map((desa) => <option key={desa} value={desa}>{desa}</option>)}
                </select>
              </div>
              <div className="dm-field">
                <label htmlFor="dm-jenis">Jenis rumah ibadah</label>
                <select id="dm-jenis" value={jenisFilter}
                  onChange={(event) => setJenisFilter(event.target.value)}>
                  <option value="semua">Semua jenis</option>
                  <option value="masjid">Masjid</option>
                  <option value="mushalla">Mushalla</option>
                </select>
              </div>
            </div>
            <div className="dm-resultBar" aria-live="polite">
              <span>Menampilkan <strong>{dataTersaring.length}</strong> dari <strong>{dataMasjid.length}</strong> rumah ibadah</span>
              {filterAktif && <button type="button" className="dm-reset" onClick={resetFilter}>Reset filter</button>}
            </div>
          </section>

          {memuat ? (
            <div className="dm-message" role="status">Memuat data rumah ibadah...</div>
          ) : pesanError ? (
            <div className="dm-message dm-error" role="alert">
              <h2>Data belum dapat dimuat</h2><p>{pesanError}</p>
              <button type="button" className="btn primary" onClick={() => window.location.reload()}>Muat ulang halaman</button>
            </div>
          ) : dataMasjid.length === 0 ? (
            <div className="dm-message">
              <h2>Data belum tersedia untuk publik</h2>
              <p>Data rumah ibadah akan ditampilkan setelah statusnya diatur menjadi tampil oleh pengelola.</p>
            </div>
          ) : (
            <>
              <PetaMasjid data={dataTersaring} memuat={memuat} />
              {dataTersaring.length === 0 ? (
                <div className="dm-message">
                  <h2>Data tidak ditemukan</h2><p>Coba kata pencarian atau filter wilayah lain.</p>
                  <button type="button" className="btn primary" onClick={resetFilter}>Tampilkan semua data</button>
                </div>
              ) : (
                <section className="dm-directory">
                  <div className="dm-directoryHeading">
                    <span className="tag">DIREKTORI</span>
                    <h2>Daftar Rumah Ibadah</h2>
                    <p>Tabel resmi data rumah ibadah. Geser tabel ke samping untuk melihat seluruh kolom.</p>
                  </div>
                  <div className="dm-tableWrap" role="region" aria-label="Tabel resmi data masjid dan mushalla" tabIndex={0}>
                    <table className="dm-table">
                      <thead>
                        <tr>
                          <th scope="col">NO</th>
                          <th scope="col">KECAMATAN</th>
                          <th scope="col">NAMA MASJID</th>
                          <th scope="col">ID MASJID</th>
                          <th scope="col">TIPOLOGI</th>
                          <th scope="col">ALAMAT</th>
                          <th scope="col">LUAS TANAH</th>
                          <th scope="col">STATUS TANAH</th>
                          <th scope="col">LUAS BANGUNAN</th>
                          <th scope="col">TAHUN BERDIRI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataTersaring.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.kecamatan || 'Panca Lautang'}</td>
                            <td className="dm-tableName">{item.nama || '—'}</td>
                            <td>{item.id_masjid || '—'}</td>
                            <td>{item.tipologi || '—'}</td>
                            <td>
                              {[item.alamat, item.desa].filter(Boolean).join(', ') || '—'}
                            </td>
                            <td>{item.luas_tanah || '—'}</td>
                            <td>{item.status_tanah || '—'}</td>
                            <td>{item.luas_bangunan || '—'}</td>
                            <td>{item.tahun_berdiri || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {wilayahTersaring.map((wilayah) => (
                    <section key={wilayah.wilayah} className="dm-village">
                      <div className="dm-villageHeading">
                        <div className="dm-villageMark" aria-hidden="true">W</div>
                        <div><h3>{wilayah.wilayah}</h3><p>{wilayah.daftar.length} rumah ibadah</p></div>
                      </div>
                      <div className="dm-cardGrid">
                        {wilayah.daftar.map((item) => {
                          const terverifikasi = item.status_verifikasi_simas === 'terverifikasi';
                          const jenis = item.jenis === 'mushalla' ? 'Mushalla' : 'Masjid';
                          const koordinatValid = item.latitude !== null && item.latitude !== '' &&
                            item.longitude !== null && item.longitude !== '' &&
                            Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude)) &&
                            Number(item.latitude) >= -90 && Number(item.latitude) <= 90 &&
                            Number(item.longitude) >= -180 && Number(item.longitude) <= 180;
                          const urlPeta = koordinatValid
                            ? `https://www.google.com/maps?q=${encodeURIComponent(`${item.latitude},${item.longitude}`)}`
                            : null;
                          return (
                            <article className="dm-placeCard" key={item.id}>
                              <div className="dm-placeTop">
                                <span className={`dm-kind ${item.jenis === 'mushalla' ? 'dm-kindMushalla' : 'dm-kindMasjid'}`}>{jenis}</span>
                                <span className={`dm-status ${terverifikasi ? 'dm-statusVerified' : 'dm-statusPending'}`}>
                                  {terverifikasi ? '✓ SIMAS terverifikasi' : '• SIMAS belum terverifikasi'}
                                </span>
                              </div>
                              <h4>{item.nama || 'Nama belum diisi'}</h4>
                              <div className="dm-placeAddress">
                                <span aria-hidden="true">⌖</span>
                                <p>{item.alamat || 'Alamat belum diisi'}{item.desa ? `, ${item.desa}` : ''}</p>
                              </div>
                              {(item.nomor_simas || item.nomor_sertifikat || item.luas_tanah || item.keterangan) && (
                                <div className="dm-details">
                                  {item.nomor_simas && <div className="dm-detailRow"><span>Nomor SIMAS</span><strong>{item.nomor_simas}</strong></div>}
                                  {item.nomor_sertifikat && <div className="dm-detailRow"><span>Sertifikat</span><strong>{item.nomor_sertifikat}</strong></div>}
                                  {item.luas_tanah && <div className="dm-detailRow"><span>Luas tanah</span><strong>{item.luas_tanah}</strong></div>}
                                  {item.keterangan && <p className="dm-description">{item.keterangan}</p>}
                                </div>
                              )}
                              {urlPeta && <a className="dm-mapLink" href={urlPeta} target="_blank" rel="noopener noreferrer">Lihat lokasi di peta <span aria-hidden="true">↗</span></a>}
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </section>
              )}
            </>
          )}

          <footer className="dm-footer">
            <p>Data ditampilkan sesuai status publikasi. Informasi administrasi dan lokasi perlu diperiksa oleh pengelola KUA.</p>
            <Link className="btn primary" href="/">Kembali ke website KUA</Link>
          </footer>
        </div>
      </section>
    </main>
  );
}