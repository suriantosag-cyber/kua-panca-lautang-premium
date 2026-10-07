export default function ProfilPage() {
  return (
    <main className="section" style={{ fontSize: "19px" }}>
      <div className="wrap">

        <div className="heroCard">
          <img
            src="/kantor-kua.jpeg"
            alt="Kantor KUA Panca Lautang"
            style={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
              objectPosition: "center 64%",
              borderRadius: "18px"
            }}
          />

          <div style={{ padding: "24px 0" }}>

            <h1>Profil KUA Kecamatan Panca Lautang</h1>

            <p>
              Kantor Urusan Agama (KUA) Kecamatan Panca Lautang merupakan
              unit pelayanan Kementerian Agama yang hadir memberikan
              pelayanan, bimbingan dan pembinaan kehidupan keagamaan
              kepada masyarakat di wilayah Kecamatan Panca Lautang,
              Kabupaten Sidenreng Rappang.
            </p>

            <hr />

            <h2>Gambaran Umum</h2>

            <p>
              KUA Kecamatan Panca Lautang berada di Jalan Poros Wette’E,
              Kecamatan Panca Lautang, Kabupaten Sidenreng Rappang.
              KUA melaksanakan pelayanan keagamaan serta membangun
              kemitraan dengan masyarakat dan berbagai unsur terkait
              dalam mewujudkan kehidupan masyarakat yang religius,
              harmonis dan sejahtera.
            </p>

            <h2>Wilayah Kerja</h2>

            <p>
              Wilayah kerja KUA Kecamatan Panca Lautang meliputi
              10 desa dan kelurahan, yaitu:
            </p>

            <ul>
              <li>Kelurahan Wette’E</li>
              <li>Kelurahan Lajongan</li>
              <li>Kelurahan Bilokka</li>
              <li>Desa Alesalewo</li>
              <li>Desa Lise</li>
              <li>Desa Corawali</li>
              <li>Desa Wanio</li>
              <li>Desa Wanio Timoreng</li>
              <li>Desa Bapangi</li>
              <li>Desa Cenrana</li>
            </ul>

            <h2>Kehidupan Keagamaan</h2>

            <p>
              Masyarakat Kecamatan Panca Lautang memiliki kehidupan
              keagamaan yang terus berkembang. KUA bersama Penyuluh
              Agama Islam dan mitra kerja turut berperan dalam
              pembinaan masyarakat, keluarga, masjid, kegiatan sosial
              keagamaan dan penguatan kerukunan umat beragama.
            </p>

            <h2>Visi</h2>

            <p>
              Terwujudnya KUA Panca Lautang sebagai pusat pelayanan,
              bimbingan dan pemberdayaan umat menuju masyarakat yang
              taat beragama, cerdas, sejahtera, maju dan toleran.
            </p>

            <h2>Misi</h2>

            <ol>
              <li>
                Memberikan pelayanan kepenghuluan secara cepat,
                tepat dan profesional.
              </li>
              <li>
                Melaksanakan pembinaan calon pengantin dan keluarga
                menuju keluarga sakinah.
              </li>
              <li>
                Mendukung pembinaan dan penguatan jaminan produk halal.
              </li>
              <li>
                Melaksanakan pembinaan imam, pengurus masjid,
                penyuluh dan unsur keagamaan masyarakat.
              </li>
              <li>
                Mendorong pemberdayaan zakat dan kegiatan sosial
                keagamaan di tingkat kecamatan.
              </li>
              <li>
                Meningkatkan pelayanan ibadah sosial dan kemitraan
                umat.
              </li>
            </ol>

            <h2>Sarana dan Prasarana</h2>

            <p>
              KUA Kecamatan Panca Lautang memiliki gedung pelayanan
              yang digunakan untuk mendukung kegiatan administrasi,
              pelayanan masyarakat, pembinaan dan kegiatan keagamaan.
              Sarana pelayanan terus diarahkan agar memberikan
              kenyamanan dan kemudahan bagi masyarakat.
            </p>

            <h2>Tugas dan Fungsi</h2>

            <p>
              Dalam melaksanakan pelayanan kepada masyarakat,
              KUA Kecamatan Panca Lautang menjalankan berbagai
              fungsi pelayanan dan pembinaan, antara lain:
            </p>

            <ul>
              <li>Pelayanan dan administrasi pernikahan dan rujuk.</li>
              <li>Pembinaan keluarga sakinah.</li>
              <li>Pembinaan kehidupan keagamaan masyarakat.</li>
              <li>Pembinaan dan pelayanan wakaf.</li>
              <li>Pembinaan zakat dan ibadah sosial.</li>
              <li>Pembinaan masjid dan kemitraan umat.</li>
              <li>Pelayanan konsultasi dan informasi keagamaan.</li>
              <li>Pembinaan calon pengantin.</li>
              <li>Koordinasi kegiatan keagamaan di wilayah kecamatan.</li>
            </ul>

            <h2>Layanan Utama KUA</h2>

            <p>
              KUA Kecamatan Panca Lautang menyediakan berbagai layanan
              administratif dan pembinaan keagamaan untuk membantu masyarakat
              memperoleh informasi dan pelayanan secara mudah, jelas dan transparan.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
                marginTop: "24px",
                marginBottom: "36px"
              }}
            >
              <div
                style={{
                  padding: "24px",
                  borderRadius: "18px",
                  background: "rgba(0,0,0,.04)",
                  border: "1px solid rgba(0,0,0,.08)"
                }}
              >
                <h3>💍 Layanan Pernikahan (Nikah & Rujuk)</h3>
                <p>
                  Informasi persyaratan pendaftaran nikah, baik di KUA maupun
                  di luar KUA, alur prosedur pendaftaran, informasi biaya resmi
                  (PNBP), integrasi layanan SIMKAH serta informasi jadwal dan
                  kuota pendaftaran.
                </p>
              </div>

              <div
                style={{
                  padding: "24px",
                  borderRadius: "18px",
                  background: "rgba(0,0,0,.04)",
                  border: "1px solid rgba(0,0,0,.08)"
                }}
              >
                <h3>🕌 Layanan Kemasjidan</h3>
                <p>
                  Informasi prosedur dan persyaratan penerbitan ID Nasional
                  Masjid dan Mushala melalui layanan SIMAS, serta informasi
                  dan panduan arah kiblat.
                </p>
              </div>

              <div
                style={{
                  padding: "24px",
                  borderRadius: "18px",
                  background: "rgba(0,0,0,.04)",
                  border: "1px solid rgba(0,0,0,.08)"
                }}
              >
                <h3>🟢 Layanan Produk Halal</h3>
                <p>
                  Informasi alur pengurusan sertifikasi halal, termasuk jalur
                  Self Declare bagi pelaku UMKM serta informasi mengenai
                  Pendamping Proses Produk Halal (P3H).
                </p>
              </div>

              <div
                style={{
                  padding: "24px",
                  borderRadius: "18px",
                  background: "rgba(0,0,0,.04)",
                  border: "1px solid rgba(0,0,0,.08)"
                }}
              >
                <h3>🤲 Zakat, Wakaf & Ibadah Sosial</h3>
                <p>
                  Informasi dan pembinaan terkait sertifikasi tanah wakaf,
                  konsultasi zakat, pembinaan muallaf serta rekomendasi dan
                  informasi layanan lembaga keagamaan.
                </p>
              </div>
            </div>
            <h2>Profil Penyuluh Agama Islam</h2>

<p>
  Penyuluh Agama Islam merupakan bagian penting dalam
  pelayanan KUA Kecamatan Panca Lautang. Penyuluh hadir
  di tengah masyarakat untuk memberikan bimbingan,
  penyuluhan dan pendampingan dalam berbagai bidang
  kehidupan keagamaan.
</p>

<p>
  Kegiatan penyuluhan mencakup pembinaan keluarga,
  kehidupan beragama, pendidikan keagamaan, pembinaan
  masyarakat, kegiatan masjid, pemberdayaan umat serta
  penguatan kerukunan dan kepedulian sosial.
</p>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginTop: "28px",
    marginBottom: "32px"
  }}
>

  <div
    style={{
      padding: "20px",
      borderRadius: "18px",
      background: "rgba(0,0,0,.04)",
      textAlign: "center"
    }}
  >
    <img
      src="/profil-penyuluh/alimuddin-akib.jpeg"
      alt="Alimuddin Akib, S.HI"
      style={{
        width: "180px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "50%",
        marginBottom: "16px"
      }}
    />

    <h3>ALIMUDDIN AKIB, S.HI</h3>

    <p>
      Penyuluh Agama Islam KUA Kecamatan Panca Lautang.
      Bertugas di wilayah Bilokka, Kecamatan Panca Lautang.
    </p>

    <a
      href="https://wa.me/6285299613107"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: "8px",
        padding: "10px 18px",
        borderRadius: "10px",
        textDecoration: "none",
        background: "#25D366",
        color: "#fff",
        fontWeight: "600"
      }}
    >
      WhatsApp
    </a>
  </div>

  <div
    style={{
      padding: "20px",
      borderRadius: "18px",
      background: "rgba(0,0,0,.04)",
      textAlign: "center"
    }}
  >
    <img
      src="/profil-penyuluh/hamsiah.jpeg"
      alt="Hamsiah, S.Pd.I"
      style={{
        width: "180px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "50%",
        marginBottom: "16px"
      }}
    />

    <h3>HAMSIAH, S.Pd.I</h3>

    <p>
      Penyuluh Agama Islam KUA Kecamatan Panca Lautang.
      Bertugas di wilayah Bilokka, Kecamatan Panca Lautang.
    </p>

    <a
      href="https://wa.me/6282341932361"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: "8px",
        padding: "10px 18px",
        borderRadius: "10px",
        textDecoration: "none",
        background: "#25D366",
        color: "#fff",
        fontWeight: "600"
      }}
    >
      WhatsApp
    </a>
  </div>

  <div
    style={{
      padding: "20px",
      borderRadius: "18px",
      background: "rgba(0,0,0,.04)",
      textAlign: "center"
    }}
  >
    <img
      src="/profil-penyuluh/surianto-s-ag.jpg"
      alt="Surianto, S.Ag"
      style={{
        width: "180px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "50%",
        marginBottom: "16px"
      }}
    />

    <h3>SURIANTO, S.Ag</h3>

    <p> Penyuluh Agama Islam KUA Kecamatan Panca Lautang. Bertugas di wilayah Bilokka, Kecamatan Panca Lautang.</p>

    <a
      href="https://wa.me/6282132244214"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: "8px",
        padding: "10px 18px",
        borderRadius: "10px",
        textDecoration: "none",
        background: "#25D366",
        color: "#fff",
        fontWeight: "600"
      }}
    >
      WhatsApp
    </a>
  </div>

  <div
    style={{
      padding: "20px",
      borderRadius: "18px",
      background: "rgba(0,0,0,.04)",
      textAlign: "center"
    }}
  >
    <img
      src="/profil-penyuluh/syamsiah-s-hi.jpeg"
      alt="Syamsiah, S.HI"
      style={{
        width: "180px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "50%",
        marginBottom: "16px"
      }}
    />

    <h3>SYAMSIAH, S.HI</h3>

    <p> Penyuluh Agama Islam KUA Kecamatan Panca Lautang. Bertugas di wilayah Bilokka, Kecamatan Panca Lautang.</p>

    <a
      href="https://wa.me/6285319319266"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: "8px",
        padding: "10px 18px",
        borderRadius: "10px",
        textDecoration: "none",
        background: "#25D366",
        color: "#fff",
        fontWeight: "600"
      }}
    >
      WhatsApp
    </a>
  </div>

  <div
    style={{
      padding: "20px",
      borderRadius: "18px",
      background: "rgba(0,0,0,.04)",
      textAlign: "center"
    }}
  >
    <img
      src="/profil-penyuluh/ishar.jpeg"
      alt="Ishar"
      style={{
        width: "180px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "50%",
        marginBottom: "16px"
      }}
    />

    <h3>ISHAR</h3>

    <p>
      Penyuluh Agama Islam KUA Kecamatan Panca Lautang.
      Bertugas di wilayah Bilokka, Kecamatan Panca Lautang.
    </p>

    <a
      href="https://wa.me/6282345432230"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: "8px",
        padding: "10px 18px",
        borderRadius: "10px",
        textDecoration: "none",
        background: "#25D366",
        color: "#fff",
        fontWeight: "600"
      }}
    >
      WhatsApp
    </a>
  </div>

</div>

<h2>Komitmen Pelayanan</h2>
            <p>
              KUA Kecamatan Panca Lautang berkomitmen memberikan
              pelayanan yang mudah, ramah, transparan dan
              bertanggung jawab. Website ini menjadi salah satu
              sarana informasi untuk mendekatkan layanan KUA kepada
              masyarakat.
            </p>

            <div
              style={{
                marginTop: "28px",
                padding: "20px",
                borderRadius: "16px",
                background: "rgba(0,0,0,.04)"
              }}
            >
              <strong>KUA Kecamatan Panca Lautang</strong>
              <p style={{ marginBottom: 0 }}>
                Melayani masyarakat dengan pelayanan keagamaan
                yang mudah, ramah dan bermanfaat.
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}












