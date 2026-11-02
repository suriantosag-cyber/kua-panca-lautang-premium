'use client';

import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from 'react-leaflet';

// Batas pemeriksaan awal agar titik yang sangat jauh
// dari wilayah Panca Lautang tidak mengacaukan tampilan peta.
// Titik di luar batas tetap tersimpan di database.
function koordinatValid(item) {
  if (
    item.latitude === null ||
    item.latitude === '' ||
    item.longitude === null ||
    item.longitude === ''
  ) {
    return false;
  }

  const lat = Number(item.latitude);
  const lon = Number(item.longitude);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -4.20 &&
    lat <= -3.85 &&
    lon >= 119.65 &&
    lon <= 120.00
  );
}

function SesuaikanTampilan({ data }) {
  const map = useMap();

  useEffect(() => {
    // Jika belum ada titik yang lolos pemeriksaan,
    // pertahankan tampilan awal di sekitar Panca Lautang.
    if (data.length === 0) {
      map.setView([-4.05, 119.82], 11);
      return;
    }

    const titik = data.map((item) => [
      Number(item.latitude),
      Number(item.longitude)
    ]);

    if (titik.length === 1) {
      map.setView(titik[0], 15);
    } else {
      map.fitBounds(titik, {
        padding: [30, 30],
        maxZoom: 14
      });
    }
  }, [data, map]);

  return null;
}

export default function PetaMasjid({
  data = [],
  memuat = false
}) {
  const bertitik = data.filter(koordinatValid);
  const koordinatTidakDitampilkan = data.length - bertitik.length;

  return (
    <section style={{ margin: '28px 0 36px' }}>
      <div style={{ marginBottom: 14 }}>
        <span className="tag">PETA LOKASI</span>
        <h2 style={{ fontSize: 24, margin: '10px 0 14px' }}>
          Peta Masjid dan Mushalla
        </h2>
      </div>

      <div
        style={{
          height: 420,
          width: '100%',
          overflow: 'hidden',
          borderRadius: 18,
          border: '1px solid var(--line)',
          zIndex: 0
        }}
      >
        <MapContainer
          center={[-4.05, 119.82]}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <SesuaikanTampilan data={bertitik} />

          {bertitik.map((item) => (
            <CircleMarker
              key={item.id}
              center={[
                Number(item.latitude),
                Number(item.longitude)
              ]}
              radius={8}
              pathOptions={{
                color:
                  item.jenis === 'mushalla'
                    ? '#b7791f'
                    : '#176b45',
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
                {item.nomor_simas ? (
                  <>
                    <br />
                    Nomor SIMAS: {item.nomor_simas}
                  </>
                ) : null}
                <br />
                Status SIMAS:{' '}
                {item.status_verifikasi_simas === 'terverifikasi'
                  ? 'Terverifikasi'
                  : 'Belum diverifikasi'}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <p
        role="status"
        style={{
          marginTop: 12,
          color: 'var(--muted)',
          lineHeight: 1.7
        }}
      >
        {memuat
          ? 'Sedang memuat data rumah ibadah...'
          : bertitik.length === 0
            ? 'Belum ada koordinat dalam batas tampilan peta. Data rumah ibadah tetap tersedia pada daftar di bawah.'
            : `${bertitik.length} penanda lokasi ditampilkan pada peta.`}
        {!memuat && koordinatTidakDitampilkan > 0
          ? ` ${koordinatTidakDitampilkan} data belum ditampilkan pada peta karena koordinat kosong atau berada di luar batas pemeriksaan.`
          : ''}
      </p>
    </section>
  );
}
