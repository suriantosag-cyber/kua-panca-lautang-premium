'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function DetailKegiatanPage() {
  const params = useParams();
  const id = params.id;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDetail() {
      try {
        const response = await fetch('/api/kegiatan-publik', {
          cache: 'no-store'
        });
        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error('Gagal memuat kegiatan.');
        }

        const ditemukan = (result.data || []).find(
          (kegiatan) => kegiatan.id === id
        );

        if (!ditemukan) {
          setError('Kegiatan tidak ditemukan atau belum disetujui Admin KUA.');
          return;
        }

        setItem(ditemukan);
      } catch {
        setError('Kegiatan belum dapat dimuat. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    }

    if (id) loadDetail();
  }, [id]);

  if (loading) {
    return (
      <main className="section">
        <div className="wrap">Memuat detail kegiatan...</div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="section">
        <div className="wrap">
          <h1>Kegiatan</h1>
          <p>{error || 'Kegiatan tidak ditemukan.'}</p>
          <a href="/kegiatan">Kembali ke daftar kegiatan</a>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="wrap">
        <article className="card">
          <h1>{item.nama_kegiatan}</h1>

          {item.foto_url && (
            <img
              src={item.foto_url}
              alt={`Foto kegiatan ${item.nama_kegiatan}`}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '600px',
                objectFit: 'contain',
                borderRadius: '12px',
                marginBottom: '20px'
              }}
            />
          )}

          <p><strong>Penyelenggara:</strong> {item.penyelenggara || '-'}</p>
          <p><strong>Tanggal:</strong> {item.tanggal || '-'}</p>
          <p><strong>Desa/Kelurahan:</strong> {item.desa || '-'}</p>
          <p><strong>Kategori:</strong> {item.kategori || '-'}</p>

          {item.lokasi_lengkap && (
            <p><strong>Lokasi:</strong> {item.lokasi_lengkap}</p>
          )}

          {item.jam_mulai && (
            <p>
              <strong>Jam:</strong> {item.jam_mulai}
              {item.jam_selesai ? `–${item.jam_selesai}` : ''}
            </p>
          )}

          <p><strong>Deskripsi:</strong></p>
          <p>{item.deskripsi || '-'}</p>
          <p><strong>Narahubung:</strong> {item.narahubung || '-'}</p>

          <a className="btn" href="/kegiatan">
            Kembali ke daftar kegiatan
          </a>
        </article>
      </div>
    </main>
  );
}