'use client';

export default function JadwalNikah() {
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

            <div className="jadwalNikahDetail">
              <div>
                <small>Tanggal</small>
                <strong>Menunggu jadwal</strong>
              </div>
              <div>
                <small>Waktu</small>
                <strong>Menunggu jadwal</strong>
              </div>
              <div>
                <small>Lokasi</small>
                <strong>KUA Panca Lautang</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
