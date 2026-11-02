export const metadata = {
  title: "Layanan Kemasjidan & Arah Kiblat | KUA Panca Lautang",
  description:
    "Informasi awal layanan rekomendasi pembangunan masjid dan pengukuran arah kiblat bagi masyarakat Kecamatan Panca Lautang.",
  alternates: {
    canonical: "/layanan/kemasjidan",
  },
};

const hijau = "#14532d";
const hijauTerang = "#166534";

const kartu = {
  padding: "22px",
  border: "1px solid #d9e7dd",
  borderRadius: "16px",
  background: "#ffffff",
};

const tombolUtama = {
  display: "inline-block",
  background: hijauTerang,
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 700,
};

const layanan = [
  {
    nomor: "01",
    judul: "Rekomendasi Pembangunan Masjid",
    deskripsi:
      "Informasi awal bagi masyarakat atau pengurus yang merencanakan pembangunan masjid dan ingin berkonsultasi mengenai persyaratan serta proses rekomendasi sesuai ketentuan yang berlaku.",
    dokumen: [
      "Identitas pemohon atau pengurus yang bertanggung jawab.",
      "Alamat dan lokasi rencana pembangunan masjid.",
      "Informasi status tanah serta dokumen pendukung yang tersedia.",
      "Informasi awal mengenai rencana pembangunan dan kebutuhan rekomendasi.",
    ],
  },
  {
    nomor: "02",
    judul: "Pengukuran Arah Kiblat",
    deskripsi:
      "Permohonan informasi dan konsultasi pengukuran arah kiblat untuk masjid atau musala, termasuk rumah ibadah baru. Pelaksanaan dan jadwal perlu dikonfirmasi terlebih dahulu kepada petugas.",
    dokumen: [
      "Nama dan alamat masjid atau musala.",
      "Nama serta nomor kontak pengurus atau pemohon.",
      "Lokasi yang akan diukur dan titik yang dapat diakses petugas.",
      "Usulan waktu pelaksanaan untuk dikonfirmasi bersama petugas.",
    ],
  },
];

export default function LayananKemasjidanPage() {
  return (
    <main className="section">
      <div className="wrap">
        <section
          className="heroCard"
          style={{
            padding: "clamp(24px, 5vw, 44px)",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #f0fdf4, #ffffff)",
            border: "1px solid #d9e7dd",
          }}
        >
          <p
            style={{
              color: hijauTerang,
              fontWeight: 800,
              letterSpacing: "0.08em",
              marginTop: 0,
            }}
          >
            KUA KECAMATAN PANCA LAUTANG
          </p>
          <h1
            style={{
              color: hijau,
              lineHeight: 1.2,
              marginTop: "8px",
            }}
          >
            Layanan Kemasjidan &amp; Arah Kiblat
          </h1>
          <p style={{ lineHeight: 1.9, maxWidth: "760px" }}>
            Pusat informasi awal bagi masyarakat dan pengurus masjid atau
            musala di Kecamatan Panca Lautang untuk memperoleh panduan
            permohonan rekomendasi pembangunan masjid dan pengukuran arah
            kiblat.
          </p>
          <a href="/ajukan-layanan" style={tombolUtama}>
            Ajukan Layanan
          </a>
          <a
            href="/cek-status-berkas"
            style={{
              ...tombolUtama,
              marginLeft: "10px",
              background: "#ffffff",
              color: hijau,
              border: "1px solid #166534",
            }}
          >
            Cek Status Berkas
          </a>
        </section>

        <section style={{ marginTop: "36px" }}>
          <h2 style={{ color: hijau }}>Pilihan Layanan</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
              gap: "18px",
              marginTop: "18px",
            }}
          >
            {layanan.map((item) => (
              <article key={item.nomor} style={kartu}>
                <p
                  style={{
                    color: hijauTerang,
                    fontWeight: 800,
                    marginBottom: "8px",
                  }}
                >
                  LAYANAN {item.nomor}
                </p>
                <h3 style={{ color: hijau, lineHeight: 1.4 }}>
                  {item.judul}
                </h3>
                <p style={{ lineHeight: 1.8 }}>{item.deskripsi}</p>
                <h4 style={{ color: hijau }}>Persiapan awal</h4>
                <ul style={{ lineHeight: 1.8, paddingLeft: "22px" }}>
                  {item.dokumen.map((dokumen) => (
                    <li key={dokumen}>{dokumen}</li>
                  ))}
                </ul>
                <p style={{ lineHeight: 1.8, fontSize: "0.94rem" }}>
                  Daftar di atas merupakan panduan awal, bukan daftar
                  persyaratan resmi yang mengikat. Persyaratan final,
                  kewenangan, dan jadwal perlu dikonfirmasi kepada KUA.
                </p>
                <a href="/ajukan-layanan" style={tombolUtama}>
                  Buka Formulir Pengajuan
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            ...kartu,
            marginTop: "28px",
            background: "#f9fafb",
          }}
        >
          <h2 style={{ color: hijau }}>Alur Pengajuan</h2>
          <ol style={{ lineHeight: 1.9, paddingLeft: "22px" }}>
            <li>Pilih layanan yang sesuai dengan kebutuhan.</li>
            <li>
              Buka formulir pengajuan dan pilih jenis layanan yang sesuai.
            </li>
            <li>
              Simpan kode pelacakan dan PIN yang diberikan setelah pengajuan
              berhasil.
            </li>
            <li>
              Periksa perkembangan permohonan melalui menu Cek Status Berkas.
            </li>
            <li>
              Ikuti arahan petugas jika ada dokumen atau informasi yang perlu
              dilengkapi.
            </li>
          </ol>
        </section>

        <aside
          style={{
            marginTop: "24px",
            padding: "20px",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            lineHeight: 1.8,
          }}
        >
          <strong>Catatan penting:</strong> halaman ini merupakan pusat
          informasi awal dan bukan penerbitan otomatis rekomendasi atau
          sertifikat arah kiblat. Ketentuan, kewenangan, dokumen, jadwal,
          serta kemungkinan biaya resmi harus dikonfirmasi kepada KUA.
          Jangan menganggap layanan bebas biaya sebelum ketentuannya
          dipastikan.
        </aside>

        <div style={{ marginTop: "28px" }}>
          <a href="/" style={tombolUtama}>
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </main>
  );
}
