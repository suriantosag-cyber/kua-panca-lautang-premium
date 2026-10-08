'use client';

import { useEffect, useState } from 'react';

export default function JadwalNikah() {
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
          setJadwal(result.data || []);
        }
      } catch (error) {
        console.error('Gagal mengambil jadwal nikah:', error);
      } finally {
        setLoading(false);
      }
    }

    loadJadwal();
  }, []);

  function formatTanggal(tanggal) {
    if (!tanggal) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${tanggal}T00:00:00`));
  }

  function formatWaktu(waktu) {
    if (!waktu) return '-';
    return `${String(waktu).slice(0, 5)} WITA`;
  }

  return (
    <section className="jadwalNikah">
      <div className="wrap">
        <div className="jadwalNikahCard">
          <div className="jadwalNikahImage">
            <img
              src="/poster/jadwal-nikah.png"
              alt="Jadwal Nikah KUA Panca Lautang"
            />
          </div>

          <div className="jadwalNikahInfo">
            <span className="jadwalNikahLabel">JADWAL NIKAH</span>

            <h2>Jadwal Pernikahan KUA Panca Lautang</h2>

            <p>
              Informasi jadwal akad nikah yang dilaksanakan di wilayah
              pelayanan KUA Panca Lautang.
            </p>

            {loading ? (
              <div className="jadwalNikahDetail">
                <div>
                  <small>Jadwal</small>
                  <strong>Memuat jadwal...</strong>
                </div>
              </div>
            ) : jadwal.length === 0 ? (
              <div className="jadwalNikahDetail">
                <div>
                  <small>Jadwal</small>
                  <strong>Belum ada jadwal nikah</strong>
                </div>
              </div>
            ) : (
              <div className="jadwalNikahDetail">
                {jadwal.map((item) => (
                  <div key={item.id}>
                    <small>{formatTanggal(item.tanggal)}</small>

                    <strong>
                      {item.pengantin}
                    </strong>

                    <div style={{ marginTop: 6 }}>
                      {formatWaktu(item.waktu)}
                    </div>

                    <div style={{ marginTop: 4 }}>
                      {item.desa} — {item.lokasi}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
