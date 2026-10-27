export const metadata = {
  title: "Layanan Halal SEHATI | KUA Panca Lautang",
  description:
    "Informasi sertifikasi halal gratis, persiapan UMKM, alur pengajuan dan pendampingan PPH di Kecamatan Panca Lautang.",
};

const cards = [
  {
    n: "01",
    title: "Siapkan identitas usaha",
    text: "Persiapkan identitas pelaku usaha dan NIB. Periksa apakah skala usaha dan jenis produk memenuhi kriteria program.",
  },
  {
    n: "02",
    title: "Lengkapi data produk",
    text: "Siapkan nama dan foto produk, daftar bahan, asal bahan, serta keterangan proses produksi.",
  },
  {
    n: "03",
    title: "Ajukan melalui SIHALAL",
    text: "Ikuti petunjuk pengajuan di sistem resmi BPJPH dan lengkapi dokumen sesuai jalur sertifikasi yang berlaku.",
  },
  {
    n: "04",
    title: "Ikuti proses pendampingan",
    text: "Jika memenuhi jalur self declare, ikuti verifikasi dan validasi Pendamping PPH serta tahapan penetapan sesuai ketentuan.",
  },
];

const green = "#166534";
const darkGreen = "#14532d";

const cardStyle = {
  padding: "22px",
  border: "1px solid #d9e7dd",
  borderRadius: "16px",
  background: "#ffffff",
};

const primaryLink = {
  display: "inline-block",
  background: green,
  color: "#ffffff",
  padding: "13px 20px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 800,
};

const secondaryLink = {
  display: "inline-block",
  background: "#ffffff",
  color: green,
  border: "1px solid #166534",
  padding: "12px 20px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 700,
};

export default function LayananHalalPage() {
  return (
    <main className="section">
      <div className="wrap">
        <section
          className="heroCard"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
            alignItems: "center",
            gap: "28px",
            padding: "clamp(24px, 5vw, 44px)",
            borderRadius: "22px",
            background:
              "linear-gradient(135deg, #f0fdf4 0%, #ffffff 65%, #fefce8 100%)",
            border: "1px solid #d9e7dd",
          }}
        >
          <div>
            <p
              style={{
                color: "#16804a",
                fontWeight: 800,
                letterSpacing: "1.3px",
                fontSize: "13px",
              }}
            >
              INFORMASI DAN PENDAMPINGAN UMKM
            </p>
            <h1
              style={{
                color: darkGreen,
                lineHeight: 1.2,
                fontSize: "clamp(30px, 4vw, 44px)",
              }}
            >
              Layanan Sertifikasi Halal Gratis (SEHATI)
            </h1>
            <p style={{ lineHeight: 1.9 }}>
              KUA Panca Lautang menyediakan informasi awal bagi pelaku usaha
              mikro dan kecil yang ingin memahami proses sertifikasi halal
              dan mencari pendampingan Proses Produk Halal (PPH).
            </p>
            <p style={{ lineHeight: 1.9 }}>
              Fasilitas gratis mengikuti kriteria, kuota, dan ketentuan
              resmi yang berlaku. Pengajuan tidak otomatis menjamin
              kelayakan atau penerbitan sertifikat.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "22px",
              }}
            >
              <a
                href="https://ptsp.halal.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                style={primaryLink}
              >
                Buka SIHALAL ↗
              </a>
              <a href="#alur" style={secondaryLink}>
                Pelajari Alur
              </a>
            </div>
          </div>

          <div
            style={{
              minHeight: "260px",
              padding: "28px",
              borderRadius: "20px",
              background:
                "linear-gradient(155deg, #14532d, #166534 65%, #0f3d25)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              aria-hidden="true"
              style={{ fontSize: "64px", marginBottom: "12px" }}
            >
              ✓
            </div>
            <p
              style={{
                color: "#fde68a",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "2px",
              }}
            >
              DUKUNG UMKM HALAL
            </p>
            <h2 style={{ color: "#ffffff", lineHeight: 1.4 }}>
              Kenali Persyaratan, Ikuti Proses Resmi
            </h2>
            <p style={{ color: "#ecfdf5", lineHeight: 1.8 }}>
              Persiapkan usaha dengan informasi yang tepat dan pendampingan
              sesuai ketentuan.
            </p>
          </div>
        </section>

        <section style={{ marginTop: "36px" }}>
          <h2 style={{ color: darkGreen }}>Persiapan dan Alur Pengajuan</h2>
          <p style={{ lineHeight: 1.9 }}>
            Persyaratan berbeda menurut jalur sertifikasi dan karakteristik
            produk. Berikut gambaran persiapan awal bagi pelaku UMKM.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
              gap: "18px",
              marginTop: "20px",
            }}
          >
            {cards.map((item) => (
              <article key={item.n} style={cardStyle}>
                <span style={{ color: green, fontWeight: 800 }}>
                  TAHAP {item.n}
                </span>
                <h3 style={{ color: darkGreen }}>{item.title}</h3>
                <p style={{ lineHeight: 1.8, marginBottom: 0 }}>
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="alur" style={{ marginTop: "40px" }}>
          <h2 style={{ color: darkGreen }}>Pendampingan PPH</h2>
          <div
            style={{
              ...cardStyle,
              background: "#f0fdf4",
            }}
          >
            <p style={{ lineHeight: 1.9 }}>
              Pendamping PPH membantu pelaku usaha memahami persyaratan
              serta menjalankan pendampingan dan verifikasi sesuai
              kewenangannya. Penetapan kehalalan dan penerbitan sertifikat
              tetap melalui proses resmi pihak berwenang.
            </p>
            <p style={{ lineHeight: 1.9 }}>
              UMKM di Kecamatan Panca Lautang dapat menghubungi KUA setempat
              untuk menanyakan informasi pendampingan dan ketersediaan
              layanan. Petugas, kuota, dan mekanisme layanan perlu
              dikonfirmasi terlebih dahulu.
            </p>
          </div>
        </section>

        <section style={{ marginTop: "36px" }}>
          <h2 style={{ color: darkGreen }}>Sumber Informasi Resmi</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
              gap: "18px",
              marginTop: "18px",
            }}
          >
            <article style={cardStyle}>
              <h3 style={{ color: darkGreen }}>SIHALAL BPJPH</h3>
              <p style={{ lineHeight: 1.8 }}>
                Akses sistem resmi untuk mengikuti petunjuk pengajuan
                sertifikasi halal.
              </p>
              <a
                href="https://ptsp.halal.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                style={primaryLink}
              >
                Buka SIHALAL ↗
              </a>
            </article>
            <article style={cardStyle}>
              <h3 style={{ color: darkGreen }}>Portal BPJPH</h3>
              <p style={{ lineHeight: 1.8 }}>
                Periksa informasi, pengumuman, dan ketentuan program
                sertifikasi halal terbaru.
              </p>
              <a
                href="https://bpjph.halal.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                style={secondaryLink}
              >
                Buka BPJPH ↗
              </a>
            </article>
          </div>
        </section>

        <aside
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            lineHeight: 1.8,
          }}
        >
          <strong>Catatan:</strong> halaman ini merupakan pusat informasi
          awal, bukan portal penerbitan sertifikat. Persyaratan, kuota, dan
          jalur pengajuan dapat berubah. Pastikan informasi terbaru
          dikonfirmasi melalui BPJPH atau pendamping PPH yang berwenang.
        </aside>

        <div style={{ marginTop: "28px" }}>
          <a href="/" style={primaryLink}>
            ← Kembali ke Beranda
          </a>
        </div>
      </div>
    </main>
  );
}
