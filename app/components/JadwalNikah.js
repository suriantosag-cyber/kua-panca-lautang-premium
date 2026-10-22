
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
    const shareUrl = 'https://kua-pancalautang.my.id/jadwal-nikah';
    const message = `${getShareText(item)}\n\nLihat poster jadwal: ${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText('https://kua-pancalautang.my.id/jadwal-nikah');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Salin tautan Jadwal Nikah:', 'https://kua-pancalautang.my.id/jadwal-nikah');
    }
  }

  async function sharePage(item) {
    const shareData = {
      title: 'Jadwal Nikah KUA Panca Lautang',
      text: getShareText(item),
      url: 'https://kua-pancalautang.my.id/jadwal-nikah',
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
    <section id="jadwal-nikah" className="jadwalNikahSeo" aria-labelledby="jadwal-nikah-seo">
      <div className="jadwalHomeHeading">
        <span className="jadwalHomeEyebrow">KUA KECAMATAN PANCA LAUTANG</span>
        <h2 id="jadwal-nikah-seo">Jadwal Nikah Terdekat</h2>
        <p>Informasi akad nikah mendatang di wilayah Kecamatan Panca Lautang.</p>
      </div>

      <div className="jadwalHomeColumns">
        <div className="jadwalHomeList">
          <h3 className="jadwalHomeSubheading">Agenda Akad Nikah</h3>

          {loading ? (
            <p className="jadwalHomeEmpty">Memuat jadwal nikah...</p>
          ) : jadwal.length > 0 ? (
            <div className="jadwalHomeItems">
              {jadwal.map((item) => (
                <article className="jadwalHomeItem" key={item.id}>
                  <p className="jadwalHomeDate">{formatTanggal(item.tanggal)}</p>
                  <h4>{item.pengantin || 'Nama belum tersedia'}</h4>
                  <p><strong>Waktu:</strong> {formatWaktu(item.waktu)}</p>
                  <p><strong>Lokasi:</strong> {item.desa || '-'}{item.lokasi ? ` — ${item.lokasi}` : ''}</p>
                  <div className="jadwalNikahActions">
                    <button type="button" onClick={() => shareWhatsApp(item)} className="jadwalNikahButton jadwalNikahWhatsApp">WhatsApp</button>
                    <button type="button" onClick={copyLink} className="jadwalNikahButton">{copied ? 'Tersalin' : 'Salin Tautan'}</button>
                    <button type="button" onClick={() => sharePage(item)} className="jadwalNikahButton">Bagikan</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="jadwalHomeEmpty">Belum ada jadwal akad nikah mendatang yang tersedia.</p>
          )}
        </div>

        <div className="jadwalHomePoster">
          <div className="jadwalPosterDynamic">
            <div className="jadwalPosterBrand">
              <span className="jadwalPosterEyebrow">KUA KECAMATAN</span>
              <h3>PANCA LAUTANG</h3>
              <p>Melayani dengan Hati, Menuju Keluarga Sakinah</p>
            </div>

            <div className="jadwalPosterTitle">
              <span aria-hidden="true">✦ ☾ ✦</span>
              <h4>Jadwal Nikah</h4>
              <p>Agenda Akad Terdekat</p>
            </div>

            {loading ? (
              <p className="jadwalPosterEmpty">Memuat jadwal nikah...</p>
            ) : jadwal.length > 0 ? (
              <div className="jadwalPosterRows">
                {jadwal.map((item, index) => (
                  <article className="jadwalPosterRow" key={item.id}>
                    <div className="jadwalPosterDate">
                      <span>{new Date(`${item.tanggal}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit' })}</span>
                      <small>{new Date(`${item.tanggal}T00:00:00`).toLocaleDateString('id-ID', { month: 'short' })}</small>
                    </div>
                    <div className="jadwalPosterDetails">
                      <span className="jadwalPosterNumber">JADWAL {String(index + 1).padStart(2, '0')}</span>
                      <strong>{item.pengantin || 'Nama belum tersedia'}</strong>
                      <span>{formatWaktu(item.waktu)}</span>
                      <small>{[item.desa, item.lokasi].filter(Boolean).join(' — ') || 'Lokasi belum ditentukan'}</small>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="jadwalPosterEmpty">Belum ada jadwal akad nikah mendatang.</p>
            )}

            <div className="jadwalPosterFooter">
              Semoga setiap langkah menuju pernikahan mendapatkan ridha Allah SWT.
            </div>
          </div>
          <a className="jadwalHomePosterLink" href="/jadwal-nikah">
            <span>Lihat jadwal lengkap</span>
          </a>
        </div>

        <aside className="jadwalHomeInfo">
          <h3 className="jadwalHomeSubheading">Informasi Layanan</h3>
          <div className="jadwalHomeInfoBlock">
            <span className="jadwalHomeInfoIcon" aria-hidden="true">Dok</span>
            <h4>Persiapan dokumen</h4>
            <p>Calon pengantin disarankan memastikan persyaratan administrasi telah lengkap sebelum proses pendaftaran.</p>
          </div>
          <div className="jadwalHomeInfoBlock">
            <span className="jadwalHomeInfoIcon" aria-hidden="true">Info</span>
            <h4>Konsultasi dan bimbingan</h4>
            <p>Untuk informasi layanan, silakan menghubungi atau datang langsung ke KUA Kecamatan Panca Lautang.</p>
          </div>
          <a className="jadwalHomeInfoLink" href="/jadwal-nikah">Buka informasi jadwal <span aria-hidden="true">→</span></a>
        </aside>
      </div>
    </section>
  );
}
