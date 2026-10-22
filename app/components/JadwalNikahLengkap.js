'use client';

import { useEffect, useState } from 'react';

export default function JadwalNikahLengkap() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJadwal() {
      try {
        const response = await fetch('/api/jadwal-nikah', {
          cache: 'no-store',
        });
        const result = await response.json();

        if (response.ok && result.ok) {
          const hariIni = new Date();
          hariIni.setHours(0, 0, 0, 0);

          const data = (result.data || [])
            .filter((item) => {
              if (!item.tanggal) return false;
              const tanggal = new Date(`${item.tanggal}T00:00:00`);
              return !Number.isNaN(tanggal.getTime()) && tanggal >= hariIni;
            })
            .sort((a, b) => {
              const waktuA = `${a.tanggal}T${a.waktu || '00:00'}`;
              const waktuB = `${b.tanggal}T${b.waktu || '00:00'}`;
              return waktuA.localeCompare(waktuB);
            });

          setJadwal(data);
        }
      } catch (error) {
        console.error('Gagal mengambil jadwal nikah:', error);
      } finally {
        setLoading(false);
      }
    }

    loadJadwal();
  }, []);

  function tanggalLengkap(tanggal) {
    return new Date(`${tanggal}T00:00:00`).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function bagikan(item) {
    const teks = [
      'JADWAL NIKAH KUA PANCA LAUTANG',
      '',
      `Calon pengantin: ${item.pengantin || '-'}`,
      `Tanggal: ${tanggalLengkap(item.tanggal)}`,
      `Waktu: ${item.waktu ? `${item.waktu} WITA` : 'Belum ditentukan'}`,
      `Desa: ${item.desa || '-'}`,
      `Lokasi: ${item.lokasi || '-'}`,
      '',
      'https://kua-pancalautang.my.id/jadwal-nikah',
    ].join('\n');

    window.open(
      `https://wa.me/?text=${encodeURIComponent(teks)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  const terdekat = jadwal[0];

  return (
    <section className="jadwalLengkapPage">
      <header className="jadwalLengkapHeading">
        <span>KANTOR URUSAN AGAMA</span>
        <h1>Jadwal Nikah</h1>
        <p>Kecamatan Panca Lautang · Kabupaten Sidenreng Rappang</p>
      </header>

      <div className="jadwalLengkapPoster">
        <div className="jadwalLengkapIlustrasi">
          <img
            src="/poster/poster-pengantin.png"
            alt="Ilustrasi pengantin Muslim dengan busana hijau dan emas"
          />
        </div>

        <div className="jadwalLengkapData">
          <div className="jadwalLengkapOrnamen" aria-hidden="true">✦ ☾ ✦</div>
          <p className="jadwalLengkapLabel">AGENDA AKAD TERDEKAT</p>

          {loading ? (
            <p className="jadwalLengkapEmpty">Memuat jadwal akad nikah...</p>
          ) : terdekat ? (
            <>
              <h2>{terdekat.pengantin || 'Nama pengantin belum tersedia'}</h2>
              <div className="jadwalLengkapTanggal">{tanggalLengkap(terdekat.tanggal)}</div>
              <div className="jadwalLengkapWaktu">
                {terdekat.waktu ? `${terdekat.waktu} WITA` : 'Waktu belum ditentukan'}
              </div>
              <p className="jadwalLengkapLokasi">
                {[terdekat.desa, terdekat.lokasi].filter(Boolean).join(' — ') ||
                  'Lokasi belum ditentukan'}
              </p>
              <button
                type="button"
                className="jadwalLengkapShare"
                onClick={() => bagikan(terdekat)}
              >
                Bagikan jadwal via WhatsApp
              </button>
            </>
          ) : (
            <p className="jadwalLengkapEmpty">
              Belum ada jadwal akad nikah mendatang yang tersedia.
            </p>
          )}

          <footer>Melayani dengan Hati, Menuju Keluarga Sakinah</footer>
        </div>
      </div>

      <div className="jadwalLengkapAgenda">
        <h2>Agenda Akad Berikutnya</h2>
        {loading ? (
          <p>Memuat agenda...</p>
        ) : jadwal.length > 0 ? (
          <div className="jadwalLengkapDaftar">
            {jadwal.map((item, index) => (
              <article className="jadwalLengkapItem" key={item.id || `${item.tanggal}-${index}`}>
                <div className="jadwalLengkapNomor">{String(index + 1).padStart(2, '0')}</div>
                <div>
                  <h3>{item.pengantin || 'Nama pengantin belum tersedia'}</h3>
                  <p>{tanggalLengkap(item.tanggal)}</p>
                  <p>{item.waktu ? `${item.waktu} WITA` : 'Waktu belum ditentukan'}</p>
                  <p>{[item.desa, item.lokasi].filter(Boolean).join(' — ') || 'Lokasi belum ditentukan'}</p>
                </div>
                <button type="button" onClick={() => bagikan(item)}>
                  Bagikan
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p>Belum ada agenda yang dapat ditampilkan.</p>
        )}
      </div>
    </section>
  );
}

