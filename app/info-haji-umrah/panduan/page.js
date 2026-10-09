
const topics = [
  {
    title: "1. Memulai persiapan Haji",
    intro: "Persiapan yang baik membantu calon jemaah menjalani perjalanan ibadah dengan lebih tenang.",
    points: [
      ["Pelajari alur ibadah", "Pahami tahapan ibadah Haji dan ikuti bimbingan manasik dari pembimbing yang kompeten."],
      ["Siapkan dokumen", "Periksa kelengkapan identitas, dokumen perjalanan, dan persyaratan sesuai ketentuan resmi."],
      ["Rencanakan kebutuhan", "Susun daftar perlengkapan pribadi, kebutuhan sehari-hari, dan kontak penting."]
    ]
  },
  {
    title: "2. Menjaga kesehatan sebelum berangkat",
    intro: "Kondisi fisik yang terjaga membantu jemaah menghadapi aktivitas ibadah dan perjalanan.",
    points: [
      ["Lakukan pemeriksaan kesehatan", "Konsultasikan kondisi kesehatan dan obat yang digunakan kepada tenaga kesehatan."],
      ["Bangun kebiasaan sehat", "Jaga pola makan, cukup minum, tidur teratur, dan aktivitas fisik sesuai kemampuan."],
      ["Ikuti arahan petugas", "Penuhi pemeriksaan, vaksinasi, dan persyaratan kesehatan sesuai aturan resmi yang berlaku."]
    ]
  },
  {
    title: "3. Memahami manasik Haji",
    intro: "Jangan merasa harus menguasai semua materi sekaligus. Pelajari sedikit demi sedikit dan ulangi bagian penting.",
    points: [
      ["Kenali urutan ibadah", "Pelajari rukun, wajib, dan rangkaian pelaksanaan Haji melalui bimbingan manasik."],
      ["Catat hal yang belum dipahami", "Bawa catatan atau buku panduan agar pertanyaan dapat disampaikan kepada pembimbing."],
      ["Utamakan sumber tepercaya", "Jangan hanya mengandalkan pesan berantai atau potongan video tanpa sumber yang jelas."]
    ]
  },
  {
    title: "4. Persiapan Umrah",
    intro: "Umrah memerlukan persiapan ilmu, dokumen, kesehatan, dan pemahaman perjalanan.",
    points: [
      ["Pahami rangkaian Umrah", "Pelajari ihram, tawaf, sa'i, dan tahallul bersama pembimbing yang kompeten."],
      ["Periksa layanan perjalanan", "Pastikan penyelenggara dan informasi perjalanan sesuai ketentuan resmi."],
      ["Atur perlengkapan", "Siapkan pakaian, alas kaki yang nyaman, obat pribadi sesuai arahan tenaga kesehatan, dan dokumen penting."]
    ]
  },
  {
    title: "5. Adab, keselamatan, dan kebersamaan",
    intro: "Menjaga diri sekaligus menghormati orang lain merupakan bagian penting dalam perjalanan ibadah.",
    points: [
      ["Jaga kebersihan dan ketertiban", "Buang sampah pada tempatnya, patuhi arahan petugas, dan hormati jemaah lain."],
      ["Tetap bersama rombongan", "Kenali pembimbing, titik berkumpul, serta cara menghubungi petugas bila terpisah."],
      ["Jaga barang pribadi", "Simpan dokumen dan barang berharga dengan aman serta waspadai informasi atau tawaran yang mencurigakan."]
    ]
  },
  {
    title: "6. Informasi resmi dan bantuan",
    intro: "Ketentuan perjalanan dapat berubah. Pastikan informasi penting diperiksa kembali melalui kanal resmi.",
    points: [
      ["Periksa pengumuman pemerintah", "Gunakan situs resmi untuk memperoleh informasi terbaru tentang layanan dan persyaratan."],
      ["Tanyakan kepada petugas", "Untuk masalah dokumen, kesehatan, atau jadwal, mintalah penjelasan dari pihak yang berwenang."],
      ["Waspadai informasi palsu", "Periksa tanggal, sumber, dan alamat situs sebelum meneruskan informasi kepada orang lain."]
    ]
  }
];

const green = "#166534";
const paleGreen = "#f0fdf4";

export default function PanduanHajiUmrahPage() {
  return (
    <main style={{ background: "#f8faf8", minHeight: "100vh", padding: "28px 16px 48px", color: "#24352b" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <a
          href="/info-haji-umrah"
          style={{ color: green, textDecoration: "none", fontWeight: 700, fontSize: "14px" }}
        >
          ← Kembali ke Info Haji & Umrah
        </a>

        <header style={{
          marginTop: "22px",
          padding: "clamp(24px, 5vw, 44px)",
          borderRadius: "22px",
          background: "linear-gradient(135deg, #14532d, #15803d)",
          color: "#ffffff"
        }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            padding: "7px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}>
            PANDUAN JEMAAH
          </div>
          <h1 style={{
            fontSize: "clamp(30px, 5vw, 44px)",
            lineHeight: 1.15,
            margin: "18px 0 14px",
            letterSpacing: "-0.8px"
          }}>
            Menjadi Tamu Allah, Persiapkan dengan Ilmu
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.85, margin: 0, color: "#ecfdf5", maxWidth: "680px" }}>
            Perjalanan ibadah yang baik dimulai dari persiapan yang matang.
            Mari pelajari panduan Haji dan Umrah secara bertahap, dengan hati
            yang tenang dan informasi yang tepercaya.
          </p>
        </header>

        <section style={{
          marginTop: "22px",
          background: "#ffffff",
          padding: "22px",
          border: "1px solid #e2e8e2",
          borderRadius: "18px"
        }}>
          <h2 style={{ fontSize: "20px", margin: "0 0 8px", color: green }}>
            Mulai dari sini
          </h2>
          <p style={{ margin: "0 0 16px", lineHeight: 1.8, color: "#526158" }}>
            Tidak perlu membaca semuanya sekaligus. Pilih topik yang sedang
            dibutuhkan, kemudian buka bagian panduannya.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
            {topics.map((topic, index) => (
              <a
                key={topic.title}
                href={`#topik-${index + 1}`}
                style={{
                  display: "block",
                  padding: "13px 14px",
                  borderRadius: "12px",
                  background: paleGreen,
                  border: "1px solid #dcfce7",
                  color: green,
                  textDecoration: "none",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  fontWeight: 700
                }}
              >
                {topic.title} <span aria-hidden="true">↘</span>
              </a>
            ))}
          </div>
        </section>

        <section style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "25px", color: "#173b27", marginBottom: "8px" }}>
            Panduan langkah demi langkah
          </h2>
          <p style={{ color: "#647067", lineHeight: 1.8, marginTop: 0 }}>
            Buka setiap bagian untuk membaca penjelasan dan tips praktisnya.
          </p>

          {topics.map((topic, index) => (
            <details
              id={`topik-${index + 1}`}
              key={topic.title}
              open={index === 0}
              style={{
                marginBottom: "13px",
                background: "#ffffff",
                border: "1px solid #dfe7df",
                borderRadius: "15px",
                overflow: "hidden",
                scrollMarginTop: "20px"
              }}
            >
              <summary style={{
                padding: "19px 20px",
                cursor: "pointer",
                color: green,
                fontSize: "17px",
                fontWeight: 700,
                lineHeight: 1.5
              }}>
                {topic.title}
              </summary>
              <div style={{ padding: "0 20px 20px" }}>
                <p style={{ lineHeight: 1.85, color: "#526158", marginTop: 0 }}>
                  {topic.intro}
                </p>
                {topic.points.map(([heading, description]) => (
                  <div key={heading} style={{
                    borderLeft: "3px solid #86c99a",
                    paddingLeft: "14px",
                    marginTop: "18px"
                  }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#234b31" }}>
                      {heading}
                    </h3>
                    <p style={{ margin: 0, lineHeight: 1.85, color: "#526158" }}>
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </section>

        <aside style={{
          marginTop: "28px",
          background: "#ecfdf5",
          border: "1px solid #bbf7d0",
          borderRadius: "16px",
          padding: "22px"
        }}>
          <h2 style={{ margin: "0 0 10px", fontSize: "20px", color: green }}>
            Catatan penting untuk jemaah
          </h2>
          <p style={{ margin: 0, lineHeight: 1.85, color: "#365743" }}>
            Panduan ini merupakan bahan edukasi umum. Persyaratan, jadwal,
            layanan, dan ketentuan keberangkatan harus dikonfirmasi melalui
            kanal resmi pemerintah atau petugas yang berwenang.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "18px" }}>
            <a
              href="https://haji.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: green,
                color: "#ffffff",
                padding: "12px 17px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "14px"
              }}
            >
              Portal Haji Resmi ↗
            </a>
            <a
              href="https://sulsel.haji.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#ffffff",
                color: green,
                padding: "12px 17px",
                border: "1px solid #86c99a",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "14px"
              }}
            >
              Portal Haji Sulsel ↗
            </a>
          </div>
        </aside>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <a
            href="/info-haji-umrah"
            style={{
              display: "inline-block",
              background: green,
              color: "#ffffff",
              padding: "13px 22px",
              borderRadius: "11px",
              textDecoration: "none",
              fontWeight: 700
            }}
          >
            ← Kembali ke Info Haji & Umrah
          </a>
        </div>

        <p style={{
          margin: "24px 0 0",
          textAlign: "center",
          color: "#7a867d",
          fontSize: "12px",
          lineHeight: 1.7
        }}>
          Informasi umum untuk membantu jemaah mempersiapkan perjalanan ibadah.
          Selalu periksa ketentuan resmi terbaru.
        </p>
      </div>
    </main>
  );
}