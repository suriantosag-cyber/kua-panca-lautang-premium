
'use client';

import { useEffect, useState } from 'react';

export default function JadwalNikah() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  function getShareText(item) {
  const siteUrl = 'https://kua-pancalautang.my.id';

  return [
    'Jadwal Nikah KUA Panca Lautang',
    '',
    `Pengantin: ${item.pengantin || '-'}`,
    `Tanggal: ${formatTanggal(item.tanggal)}`,
    `Waktu: ${formatWaktu(item.waktu)}`,
    `Lokasi: ${item.desa || '-'} - ${item.lokasi || '-'}`,
    '',
    'KUA Panca Lautang',
    siteUrl,
  ].join('\n');
}

  function shareWhatsApp(item) {
    const text = encodeURIComponent(getShareText(item));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Gagal menyalin tautan:', error);
    }
  }

  async function sharePage(item) {
    const shareData = {
      title: 'Jadwal Nikah KUA Panca Lautang',
      text: getShareText(item),
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Gagal membagikan:', error);
        }
      }
    } else {
      await copyLink();
    }
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

                    <strong>{item.pengantin}</strong>

                    <div style={{ marginTop: 6 }}>
                      🕐 {formatWaktu(item.waktu)}
                    </div>

                    <div style={{ marginTop: 4 }}>
                      📍 {item.desa || '-'} — {item.lokasi || '-'}
                    </div>

                    <div className="jadwalNikahActions">
                      <button
                        type="button"
                        onClick={() => shareWhatsApp(item)}
                        className="jadwalNikahButton jadwalNikahWhatsApp"
                      >
                        WhatsApp
                      </button>

                      <button
                        type="button"
                        onClick={copyLink}
                        className="jadwalNikahButton"
                      >
                        {copied ? 'Tersalin ✓' : 'Salin Tautan'}
                      </button>

                      <button
                        type="button"
                        onClick={() => sharePage(item)}
                        className="jadwalNikahButton"
                      >
                        Bagikan
                      </button>
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

