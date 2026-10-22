
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
          const bagianTanggal = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Makassar',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).formatToParts(new Date());

const nilaiTanggal = Object.fromEntries(
  bagianTanggal
    .filter((bagian) => bagian.type !== 'literal')
    .map((bagian) => [bagian.type, bagian.value])
);

const hariIni = `${nilaiTanggal.year}-${nilaiTanggal.month}-${nilaiTanggal.day}`;

          const jadwalTerdekat = (result.data || [])
            .filter((item) => {
              if (!item.tanggal) return false;
              const tanggal = item.tanggal;
return (
  /^\d{4}-\d{2}-\d{2}$/.test(tanggal) &&
  !Number.isNaN(new Date(`${tanggal}T00:00:00+08:00`).getTime()) &&
  tanggal >= hariIni
);
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
  const url = new URL('https://kua-pancalautang.my.id/jadwal-nikah');

  if (item?.id != null) {
    url.searchParams.set('id', String(item.id));
  }

  const shareUrl = url.toString();
  const message = `${getShareText(item)}\n\nLihat jadwal lengkap: ${shareUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

  async function copyLink(item) {
    const url = new URL('https://kua-pancalautang.my.id/jadwal-nikah');

    if (item?.id != null) {
      url.searchParams.set('id', String(item.id));
    }

    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Salin tautan Jadwal Nikah:', url.toString());
    }
  }
async function sharePage(item) {
    const url = new URL('https://kua-pancalautang.my.id/jadwal-nikah');

    if (item?.id != null) {
      url.searchParams.set('id', String(item.id));
    }

    const shareData = {
      title: 'Jadwal Nikah KUA Panca Lautang',
      text: getShareText(item),
      url: url.toString(),
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
      try {
        await navigator.clipboard.writeText(url.toString());
        window.alert('Tautan jadwal berhasil disalin.');
      } catch {
        window.prompt('Salin tautan Jadwal Nikah:', url.toString());
      }
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
                  <p><strong>Lokasi:</strong> {item.desa || '-'}{item.lokasi ? ' - ' + item.lokasi : ''}</p>
                  <div className="jadwalNikahActions">
                    <button type="button" onClick={() => shareWhatsApp(item)} className="jadwalNikahButton jadwalNikahWhatsApp">WhatsApp</button>
                    <button type="button" onClick={() => copyLink(item)} className="jadwalNikahButton">{copied ? 'Tersalin' : 'Salin Tautan'}</button>
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
          <h3 className="jadwalHomeSubheading">Poster Jadwal Nikah</h3>
          <a className="jadwalHomePosterLink" href="/jadwal-nikah" aria-label="Buka halaman lengkap Jadwal Nikah">
            <img src="/poster/jadwal-nikah.png" alt="Poster Jadwal Nikah KUA Kecamatan Panca Lautang" loading="lazy" />
            <span>Lihat jadwal lengkap</span>
          </a>
        </div>

        <aside className="jadwalHomeInfo">
          <h3 className="jadwalHomeSubheading">Informasi Layanan</h3>
          <div className="jadwalHomeInfoBlock">
            <span className="jadwalHomeInfoIcon" aria-hidden="true">&#x1F4CB;</span>
            <h4>Persiapan dokumen</h4>
            <p>Calon pengantin disarankan memastikan persyaratan administrasi telah lengkap sebelum proses pendaftaran.</p>
          </div>
          <div className="jadwalHomeInfoBlock">
            <span className="jadwalHomeInfoIcon" aria-hidden="true">&#x1F91D;</span>
            <h4>Konsultasi dan bimbingan</h4>
            <p>Untuk informasi layanan, silakan menghubungi atau datang langsung ke KUA Kecamatan Panca Lautang.</p>
          </div>
          <a className="jadwalHomeInfoLink" href="/jadwal-nikah">Buka informasi jadwal <span aria-hidden="true">&#8594;</span></a>
        </aside>
      </div>
    </section>
  );
}
