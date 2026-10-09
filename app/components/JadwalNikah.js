
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
          const hariIni = new Date();
          hariIni.setHours(0, 0, 0, 0);

          const jadwalTerdekat = (result.data || [])
            .filter((item) => {
              if (!item.tanggal) return false;
              const tanggal = new Date(`${item.tanggal}T00:00:00`);
              return !Number.isNaN(tanggal.getTime()) && tanggal >= hariIni;
            })
            .sort((a, b) => {
              const tanggalA = `${a.tanggal}T${a.waktu || '00:00'}`;
              const tanggalB = `${b.tanggal}T${b.waktu || '00:00'}`;
              return tanggalA.localeCompare(tanggalB);
            })
            .slice(0, 4);

          setJadwal(jadwalTerdekat);
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
    return new Date(`${tanggal}T00:00:00`).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function formatWaktu(waktu) {
    return waktu ? `${waktu} WITA` : 'Waktu belum ditentukan';
  }

  function getShareText(item) {
    return [
      'JADWAL NIKAH KUA PANCA LAUTANG',
      '',
      `Calon pengantin: ${item.pengantin || '-'}`,
      `Tanggal: ${formatTanggal(item.tanggal)}`,
      `Waktu: ${formatWaktu(item.waktu)}`,
      `Lokasi: ${item.desa || '-'} - ${item.lokasi || '-'}`,
      '',
      'Informasi KUA Panca Lautang.',
    ].join('\n');
  }

  async function shareWhatsApp(item) {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareText(item))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Salin tautan halaman ini:', window.location.href);
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
        <div className="jadwalNikahCard jadwalNikahCardResmi">
          <header className="jadwalNikahHeader">
            <div className="jadwalNikahIcon" aria-hidden="true">
              <span>â–¦</span>
            </div>
            <span className="jadwalNikahLabel">LAYANAN INFORMASI</span>
            <h2>Jadwal Nikah</h2>
            <p>KANTOR URUSAN AGAMA KECAMATAN PANCA LAUTANG</p>
            <div className="jadwalNikahOrnamen" aria-hidden="true" />
          </header>

          <div className="jadwalNikahInfo">
            <p className="jadwalNikahIntro">
              Informasi jadwal akad nikah terdekat di wilayah pelayanan
              KUA Panca Lautang.
            </p>

            {loading ? (
              <div className="jadwalNikahEmpty">Memuat jadwal nikah...</div>
            ) : jadwal.length === 0 ? (
              <div className="jadwalNikahEmpty">
                Belum ada jadwal nikah yang akan datang.
              </div>
            ) : (
              <div className="jadwalNikahDetail jadwalNikahGrid">
                {jadwal.map((item) => (
                  <article className="jadwalNikahItem" key={item.id}>
                    <small>{formatTanggal(item.tanggal)}</small>
                    <strong>{item.pengantin || 'Nama belum tersedia'}</strong>
                    <div className="jadwalNikahMeta">
                      <span>Waktu</span>
                      <b>{formatWaktu(item.waktu)}</b>
                    </div>
                    <div className="jadwalNikahMeta">
                      <span>Lokasi</span>
                      <b>{item.desa || '-'} - {item.lokasi || '-'}</b>
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
                        {copied ? 'Tersalin' : 'Salin Tautan'}
                      </button>
                      <button
                        type="button"
                        onClick={() => sharePage(item)}
                        className="jadwalNikahButton"
                      >
                        Bagikan
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

