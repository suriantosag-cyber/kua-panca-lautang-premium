'use client';

import { useEffect, useState } from 'react';

export default function JadwalNikahLengkap({ selectedId = '' }) {
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
          const data = (result.data || [])
            .filter((item) => {
              if (!item.tanggal) return false;
              return !Number.isNaN(
                new Date(`${item.tanggal}T00:00:00`).getTime()
              );
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

  function tanggalHariIni() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Makassar',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());

    const nilai = Object.fromEntries(
      parts
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, part.value])
    );

    return `${nilai.year}-${nilai.month}-${nilai.day}`;
  }

  function tanggalLengkap(tanggal) {
    return new Date(`${tanggal}T00:00:00`).toLocaleDateString('id-ID', {
      timeZone: 'Asia/Makassar',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function bagikan(item) {
    const url = new URL('https://kua-pancalautang.my.id/jadwal-nikah');

    if (item?.id != null) {
      url.searchParams.set('id', String(item.id));
    }

    const teks = [
      'JADWAL NIKAH KUA PANCA LAUTANG',
      '',
      `Calon pengantin: ${item.pengantin || '-'}`,
      `Tanggal: ${tanggalLengkap(item.tanggal)}`,
      `Waktu: ${item.waktu ? `${item.waktu} WITA` : 'Belum ditentukan'}`,
      `Desa: ${item.desa || '-'}`,
      `Lokasi: ${item.lokasi || '-'}`,
      '',
      `Lihat jadwal ini: ${url.toString()}`,
    ].join('\n');

    window.open(
      `https://wa.me/?text=${encodeURIComponent(teks)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  const hariIni = tanggalHariIni();

  const agendaMendatang = jadwal.filter(
    (item) => item.tanggal >= hariIni
  );

  const jadwalPilihan = selectedId
    ? jadwal.find((item) => String(item.id) === String(selectedId)) || null
    : agendaMendatang[0] || null;

  const idTidakDitemukan = Boolean(selectedId) && !jadwalPilihan;

  const agendaBerikutnya = agendaMendatang
    .filter((item) => {
      if (!jadwalPilihan) return true;

      const waktuItem = `${item.tanggal}T${item.waktu || '00:00'}`;
      const waktuPilihan =
        `${jadwalPilihan.tanggal}T${jadwalPilihan.waktu || '00:00'}`;

      return waktuItem > waktuPilihan;
    })
    .slice(0, 1);

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
          <div className="jadwalLengkapOrnamen" aria-hidden="true">
            ✦ ☾ ✦
          </div>

          <p className="jadwalLengkapLabel">
            {selectedId
              ? 'JADWAL YANG DIBAGIKAN'
              : 'AGENDA AKAD TERDEKAT'}
          </p>

          {loading ? (
            <p className="jadwalLengkapEmpty">
              Memuat jadwal akad nikah...
            </p>
          ) : jadwalPilihan ? (
            <>
              <h2>
                {jadwalPilihan.pengantin || 'Nama pengantin belum tersedia'}
              </h2>
              <div className="jadwalLengkapTanggal">
                {tanggalLengkap(jadwalPilihan.tanggal)}
              </div>
              <div className="jadwalLengkapWaktu">
                {jadwalPilihan.waktu
                  ? `${jadwalPilihan.waktu} WITA`
                  : 'Waktu belum ditentukan'}
              </div>
              <p className="jadwalLengkapLokasi">
                {[jadwalPilihan.desa, jadwalPilihan.lokasi]
                  .filter(Boolean)
                  .join(' — ') || 'Lokasi belum ditentukan'}
              </p>
              <button
                type="button"
                className="jadwalLengkapShare"
                onClick={() => bagikan(jadwalPilihan)}
              >
                Bagikan jadwal via WhatsApp
              </button>
            </>
          ) : (
            <p className="jadwalLengkapEmpty">
              {idTidakDitemukan
                ? 'Jadwal pada tautan ini tidak ditemukan. Silakan periksa kembali tautan atau pilih agenda dari daftar.'
                : 'Belum ada jadwal akad nikah mendatang yang tersedia.'}
            </p>
          )}

          <footer>Melayani dengan Hati, Menuju Keluarga Sakinah</footer>
        </div>
      </div>

      {!selectedId && (
        <div className="jadwalLengkapAgenda">
          <h2>Agenda Akad Berikutnya</h2>

          {loading ? (
            <p>Memuat agenda...</p>
          ) : agendaBerikutnya.length > 0 ? (
            <div className="jadwalLengkapDaftar">
              {agendaBerikutnya.map((item, index) => (
                <article
                  className="jadwalLengkapItem"
                  key={item.id || `${item.tanggal}-${index}`}
                >
                  <div className="jadwalLengkapNomor">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3>
                      {item.pengantin || 'Nama pengantin belum tersedia'}
                    </h3>
                    <p>{tanggalLengkap(item.tanggal)}</p>
                    <p>
                      {item.waktu
                        ? `${item.waktu} WITA`
                        : 'Waktu belum ditentukan'}
                    </p>
                    <p>
                      {[item.desa, item.lokasi]
                        .filter(Boolean)
                        .join(' — ') || 'Lokasi belum ditentukan'}
                    </p>
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
      )}
    </section>
  );
}


