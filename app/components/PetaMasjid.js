'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';

function koordinatValid(item) {
  const lat = Number(item.latitude);
  const lon = Number(item.longitude);

  return (
    item.latitude !== null &&
    item.latitude !== '' &&
    item.longitude !== null &&
    item.longitude !== '' &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
}

function SesuaikanTampilan({ data }) {
  const map = useMap();

  useEffect(() => {
    const titik = data.map((item) => [
      Number(item.latitude),
      Number(item.longitude)
    ]);

    if (titik.length === 1) {
      map.setView(titik[0], 15);
    } else if (titik.length > 1) {
      map.fitBounds(titik, {
        padding: [30, 30],
        maxZoom: 14
      });
    }
  }, [data, map]);

  return null;
}
export default function PetaMasjid({ data = [], memuat = false }) {
  const bertitik = data.filter(koordinatValid);

  return (
    <section style={{ margin: '28px 0 36px' }}>
      <div style={{ marginBottom: 14 }}>
        <span className="tag">PETA LOKASI</span>
        <h2 style={{ fontSize: 24, margin: '10px 0 6px' }}>
          Peta Masjid dan Mushalla
        </h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
          Penanda peta hanya ditampilkan untuk rumah ibadah yang memiliki
          koordinat valid.
        </p>
      </div>

      <div style={{
        height: 420,
        width: '100%',
        overflow: 'hidden',
        borderRadius: 18,
        border: '1px solid var(--line)',
        zIndex: 0
      }}>
        <MapContainer
          center={[-3.95, 119.80]}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />          <SesuaikanTampilan data={bertitik} />


          {bertitik.map((item) => (
            <CircleMarker
              key={item.id}
              center={[Number(item.latitude), Number(item.longitude)]}
              radius={8}
              pathOptions={{
                color: item.jenis === 'mushalla' ? '#b7791f' : '#176b45',
                fillOpacity: 0.85
              }}
            >
              <Popup>
                <strong>{item.nama}</strong>
                <br />
                {item.jenis === 'mushalla' ? 'Mushalla' : 'Masjid'}
                <br />
                Desa: {item.desa || 'Belum diisi'}
                {item.alamat ? <><br />{item.alamat}</> : null}
                {item.nomor_simas ? <><br />Nomor SIMAS: {item.nomor_simas}</> : null}
                <br />
                Status SIMAS: {
                  item.status_verifikasi_simas === 'terverifikasi'
                    ? 'Terverifikasi'
                    : 'Belum diverifikasi'
                }
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <p role="status" style={{
        marginTop: 12,
        color: 'var(--muted)',
        lineHeight: 1.7
      }}>
        {memuat
          ? 'Sedang memuat data rumah ibadah...'
          : bertitik.length === 0
            ? 'Belum ada koordinat valid untuk ditampilkan pada peta. Data rumah ibadah tetap tersedia pada daftar di bawah.'
            : `${bertitik.length} penanda lokasi ditampilkan berdasarkan data koordinat yang tersedia.`}
      </p>
    </section>
  );
}
