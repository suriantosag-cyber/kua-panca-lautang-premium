'use client';

import { useState } from 'react';

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
export default function KegiatanClient({ initialKegiatan = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [kegiatan] = useState(initialKegiatan);
  const [kegiatanLoading] = useState(false);

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

        <div className="card kegiatan-submit" style={{ marginBottom: '24px' }}>
          <div>
            <h2>Kirim Kegiatan</h2>
            <p>
              Kirim dokumentasi kegiatan untuk diperiksa dan diverifikasi Admin KUA.
              Kegiatan yang disetujui akan ditampilkan kepada masyarakat.
            </p>
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

        <section className="kegiatan-list">
          <div className="kegiatan-list-heading">
            <div>
              <h2>Kegiatan Terbaru</h2>
              <p>Kegiatan yang telah diverifikasi dan disetujui Admin KUA Panca Lautang.</p>
            </div>
            <span>{kegiatan.length} kegiatan</span>
          </div>

          <div>
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
              <div className="kegiatan-grid">
                {kegiatan.map((item) => (
                  <article className="kegiatan-card" key={item.id}>
                    {item.foto_url ? (
                      <img
                        className="kegiatan-card-image"
                        src={item.foto_url}
                        alt={`Foto kegiatan ${item.nama_kegiatan}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="kegiatan-card-placeholder">Dokumentasi Kegiatan</div>
                    )}

                    <div className="kegiatan-card-content">
                      <span className="kegiatan-card-category">{item.kategori || 'Kegiatan KUA'}</span>
                      <h3>{item.nama_kegiatan}</h3>
                      <p className="kegiatan-card-meta">
                        {item.tanggal || 'Tanggal belum dicantumkan'}
                        {item.desa ? ` · ${item.desa}` : ''}
                      </p>
                      {item.deskripsi && <p className="kegiatan-card-excerpt">{item.deskripsi}</p>}

                      <div className="kegiatan-card-actions">
                        <a className="btn primary" href={`/kegiatan/${item.id}`}>Baca selengkapnya</a>
                        <button type="button" className="btn" onClick={() => handleBagikan(item)} aria-label={`Bagikan ${item.nama_kegiatan}`}>Bagikan</button>
                        <button type="button" className="btn" onClick={() => handleSalinTautan(item)}>Salin tautan</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .kegiatan-submit {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }
        .kegiatan-submit h2, .kegiatan-list-heading h2 { margin: 0 0 6px; }
        .kegiatan-submit p, .kegiatan-list-heading p { margin: 0; color: #64748b; }
        .kegiatan-list { margin-top: 8px; }
        .kegiatan-list-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }
        .kegiatan-list-heading span {
          flex: 0 0 auto;
          padding: 6px 10px;
          border-radius: 999px;
          background: #eef5f0;
          color: #24583d;
          font-size: 12px;
          font-weight: 700;
        }
        .kegiatan-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .kegiatan-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 4px 16px rgba(15, 23, 42, .05);
        }
        .kegiatan-card-image, .kegiatan-card-placeholder {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          background: #f1f5f9;
        }
        .kegiatan-card-placeholder {
          display: grid;
          place-items: center;
          color: #64748b;
          font-size: 13px;
        }
        .kegiatan-card-content { padding: 14px; }
        .kegiatan-card-category {
          display: inline-block;
          margin-bottom: 7px;
          color: #28704b;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .kegiatan-card h3 {
          margin: 0 0 8px;
          font-size: 16px;
          line-height: 1.4;
        }
        .kegiatan-card-meta {
          margin: 0 0 9px;
          color: #64748b;
          font-size: 12px;
        }
        .kegiatan-card-excerpt {
          display: -webkit-box;
          overflow: hidden;
          margin: 0 0 12px;
          color: #475569;
          font-size: 13px;
          line-height: 1.5;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
        .kegiatan-card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        .kegiatan-card-actions :global(.btn) {
          padding: 8px 11px;
          font-size: 12px;
        }
        @media (min-width: 900px) {
          .kegiatan-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
          .kegiatan-card-content { padding: 17px; }
        }
        @media (max-width: 520px) {
          .kegiatan-grid { gap: 10px; }
          .kegiatan-card-content { padding: 10px; }
          .kegiatan-card h3 { font-size: 14px; }
          .kegiatan-card-actions { flex-direction: column; }
          .kegiatan-card-actions :global(.btn) { width: 100%; text-align: center; }
          .kegiatan-submit { align-items: flex-start; flex-direction: column; }
          .kegiatan-list-heading { align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}
