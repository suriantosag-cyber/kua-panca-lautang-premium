'use client';

import { useEffect, useState } from 'react';

function buatTautanBagikan(item) {
  const url = `https://kua-pancalautang.my.id/kegiatan/${item.id}`;

  const teks = [
    `📢 ${item.nama_kegiatan}`,
    `Penyelenggara: ${item.penyelenggara || '-'}`,
    `Tanggal: ${item.tanggal || '-'}`,
    `Lokasi: ${item.lokasi_lengkap || item.desa || '-'}`,
    '',
    'Baca detail dan lihat foto kegiatan di sini:',
    url,
    '',
    'Kegiatan KUA Panca Lautang'
  ].join('\n');

  return { url, teks };
}
export default function KegiatanPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [kegiatan, setKegiatan] = useState([]);
  const [kegiatanLoading, setKegiatanLoading] = useState(true);

  async function handleBagikan(item) {
    const { teks } = buatTautanBagikan(item);
    const urlWhatsApp =
      `https://wa.me/?text=${encodeURIComponent(teks)}`;

    window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
  }

  async function handleSalinTautan(item) {
    const { url } = buatTautanBagikan(item);

    try {
      await navigator.clipboard.writeText(url);
      alert('Tautan kegiatan berhasil disalin.');
    } catch {
      alert(
        'Gagal menyalin tautan. Silakan salin alamat halaman secara manual.'
      );
    }
  }

  useEffect(() => {
    async function loadKegiatanPublik() {
      try {
        const response = await fetch('/api/kegiatan-publik', {
          cache: 'no-store'
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(
            result.error || 'Gagal mengambil kegiatan yang disetujui.'
          );
        }

        setKegiatan(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setKegiatanLoading(false);
      }
    }

    loadKegiatanPublik();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const form = event.currentTarget;

    try {
      const formData = new FormData();

      formData.append('nama_kegiatan', form.nama_kegiatan.value.trim());
      formData.append('penyelenggara', form.penyelenggara.value.trim());
      formData.append('desa', form.desa.value.trim());
      formData.append(
        'lokasi_lengkap',
        form.lokasi_lengkap.value.trim()
      );
      formData.append('jam_mulai', form.jam_mulai.value);
      formData.append('jam_selesai', form.jam_selesai.value);
      formData.append('tanggal', form.tanggal.value);
      formData.append('kategori', form.kategori.value);
      formData.append('deskripsi', form.deskripsi.value.trim());
      formData.append('narahubung', form.narahubung.value.trim());

      const foto = form.foto.files?.[0];

      if (foto) {
        formData.append('foto', foto);
      }

      const response = await fetch('/api/kegiatan', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Gagal mengirim kegiatan.');
      }

      form.reset();

      setMessage(
        foto
          ? 'Kegiatan dan foto berhasil dikirim. Menunggu verifikasi Admin KUA.'
          : 'Kegiatan berhasil dikirim. Menunggu verifikasi Admin KUA.'
      );
    } catch (error) {
      console.error(error);
      setMessage(`Gagal mengirim kegiatan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section">
      <div className="wrap">
        <div className="sectionHead">
          <div>
            <h1>Kegiatan KUA Panca Lautang</h1>
            <p>
              Informasi kegiatan, pembinaan keagamaan, pelayanan masyarakat,
              dan agenda keagamaan di wilayah Kecamatan Panca Lautang.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h2>Kirim Kegiatan</h2>
          <p>
            Masyarakat, penyuluh, desa, kelurahan, organisasi, dan mitra KUA
            dapat mengirimkan informasi kegiatan untuk diverifikasi oleh Admin
            KUA Panca Lautang.
          </p>

          <div style={{ marginTop: '20px' }}>
            <p><strong>Alur kegiatan:</strong></p>
            <ol>
              <li>Kegiatan dikirim melalui halaman ini.</li>
              <li>Admin KUA melakukan pemeriksaan.</li>
              <li>
                Kegiatan yang disetujui akan ditampilkan kepada masyarakat.
              </li>
            </ol>
          </div>

          <button
            className="btn primary"
            type="button"
            onClick={() => setShowForm(!showForm)}
            style={{ marginTop: '10px' }}
          >
            {showForm ? 'Tutup Formulir' : 'Kirim Kegiatan'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2>Formulir Kegiatan</h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Nama Kegiatan</strong>
                </label>
                <input
                  type="text"
                  name="nama_kegiatan"
                  placeholder="Contoh: Pembinaan Keagamaan Masyarakat"
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Penyelenggara</strong>
                </label>
                <input
                  type="text"
                  name="penyelenggara"
                  placeholder="Nama penyelenggara"
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Desa/Kelurahan</strong>
                </label>
                <input
                  type="text"
                  name="desa"
                  placeholder="Nama Desa/Kelurahan"
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Lokasi Lengkap</strong>
                </label>
                <input
                  type="text"
                  name="lokasi_lengkap"
                  placeholder="Contoh: Masjid Al-Ikhlas, Jalan Poros Bilokka"
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Jam Mulai</strong>
                </label>
                <input
                  type="time"
                  name="jam_mulai"
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Jam Selesai (Opsional)</strong>
                </label>
                <input
                  type="time"
                  name="jam_selesai"
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Tanggal Kegiatan</strong>
                </label>
                <input
                  type="date"
                  name="tanggal"
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Kategori</strong>
                </label>
                <select
                  name="kategori"
                  defaultValue=""
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px'
                  }}
                >
                  <option value="" disabled>
                    Pilih kategori
                  </option>
                  <option value="Penyuluhan">Penyuluhan</option>
                  <option value="Pembinaan Keagamaan">
                    Pembinaan Keagamaan
                  </option>
                  <option value="Kegiatan Sosial">Kegiatan Sosial</option>
                  <option value="Keagamaan">Keagamaan</option>
                  <option value="Pelayanan Masyarakat">
                    Pelayanan Masyarakat
                  </option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Deskripsi Singkat</strong>
                </label>
                <textarea
                  name="deskripsi"
                  rows="5"
                  placeholder="Ceritakan secara singkat kegiatan yang dilaksanakan."
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Nama yang Bisa Dihubungi</strong>
                </label>
                <input
                  type="text"
                  name="narahubung"
                  placeholder="Contoh: Ahmad / Ketua Panitia"
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label>
                  <strong>Foto Kegiatan</strong>
                </label>
                <input
                  type="file"
                  name="foto"
                  accept="image/*"
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>

              <button
                className="btn primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Mengirim...' : 'Kirim Kegiatan'}
              </button>

              {message && (
                <p style={{ marginTop: '16px' }}>
                  {message}
                </p>
              )}
            </form>
          </div>
        )}

        <div className="card">
          <h2>Kegiatan Terbaru</h2>

          <p>
            Kegiatan yang telah diverifikasi dan disetujui Admin KUA
            Panca Lautang.
          </p>

          <div style={{ marginTop: '20px' }}>
            {kegiatanLoading ? (
              <p>Memuat kegiatan...</p>
            ) : kegiatan.length === 0 ? (
              <div
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <strong>Belum ada kegiatan yang ditampilkan.</strong>
                <p style={{ marginBottom: 0 }}>
                  Kegiatan akan muncul setelah diverifikasi dan disetujui
                  Admin KUA.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '18px' }}>
                {kegiatan.map((item) => (
                  <article
                    key={item.id}
                    style={{
                      padding: '20px',
                      borderRadius: '14px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <h3 style={{ marginTop: 0 }}>
                      {item.nama_kegiatan}
                    </h3>

                    {item.foto_url && (
                      <img
                        src={item.foto_url}
                        alt={`Foto kegiatan ${item.nama_kegiatan}`}
                        loading="lazy"
                        style={{
                          display: 'block',
                          width: '100%',
                          maxWidth: '640px',
                          maxHeight: '420px',
                          objectFit: 'contain',
                          objectPosition: 'left center',
                          borderRadius: '12px',
                          marginBottom: '16px',
                          background: '#f1f5f9'
                        }}
                      />
                    )}

                    <p>
                      <strong>Penyelenggara:</strong>{' '}
                      {item.penyelenggara || '-'}
                    </p>

                    <p>
                      <strong>Desa/Kelurahan:</strong> {item.desa || '-'}
                    </p>

                    <p>
                      <strong>Tanggal:</strong> {item.tanggal || '-'}
                    </p>

                    <p>
                      <strong>Kategori:</strong> {item.kategori || '-'}
                    </p>

                    {item.lokasi_lengkap && (
                      <p>
                        <strong>Lokasi lengkap:</strong>{' '}
                        {item.lokasi_lengkap}
                      </p>
                    )}

                    {item.jam_mulai && (
                      <p>
                        <strong>Jam:</strong> {item.jam_mulai}
                        {item.jam_selesai
                          ? `–${item.jam_selesai}`
                          : ''}
                      </p>
                    )}

                    {item.deskripsi && (
                      <p>
                        <strong>Deskripsi:</strong> {item.deskripsi}
                      </p>
                    )}

                    <p style={{ marginBottom: 0 }}>
                      <strong>Narahubung:</strong>{' '}
                      {item.narahubung || '-'}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        marginTop: '16px'
                      }}
                    >
                      <button
                        type="button"
                        className="btn primary"
                        onClick={() => handleBagikan(item)}
                      >
                        Bagikan via WhatsApp
                      </button>

                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleSalinTautan(item)}
                      >
                        Salin Tautan
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
