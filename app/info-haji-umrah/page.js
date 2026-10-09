export const metadata = {
title: "Info Haji dan Umrah | KUA Panca Lautang",
description:
"Pusat informasi dan panduan awal ibadah Haji dan Umrah bagi masyarakat Kecamatan Panca Lautang.",
};

const informasi = [
{
nomor: "01",
judul: "Persiapan Haji",
isi: "Kenali persiapan administrasi, kesehatan, perlengkapan, dan manasik sebelum keberangkatan.",
},
{
nomor: "02",
judul: "Persiapan Umrah",
isi: "Pelajari dokumen perjalanan, tata cara ibadah, dan cara memeriksa legalitas penyelenggara.",
},
{
nomor: "03",
judul: "Informasi Resmi",
isi: "Temukan tautan sumber pemerintah untuk memeriksa persyaratan dan pengumuman terbaru.",
},
];

export default function InfoHajiUmrahPage() {
return ( <main className="section"> <div className="wrap">
<section
className="heroCard"
style={{
padding: "clamp(24px, 5vw, 44px)",
borderRadius: "18px",
background:
"linear-gradient(135deg, #f0fdf4 0%, #ffffff 70%)",
border: "1px solid #d9e7dd",
}}
>
<p
style={{
color: "#16804a",
fontWeight: 800,
letterSpacing: "1.5px",
fontSize: "13px",
}}
>
LAYANAN INFORMASI MASYARAKAT </p>

```
      <h1
        style={{
          color: "#14532d",
          lineHeight: 1.25,
          marginTop: "10px",
        }}
      >
        Info Haji dan Umrah
      </h1>

      <p style={{ lineHeight: 1.9, maxWidth: "720px" }}>
        Selamat datang di pusat informasi Haji dan Umrah KUA Panca
        Lautang. Temukan panduan awal untuk membantu mempersiapkan
        ibadah dengan lebih terarah, aman, dan tertib.
      </p>

      <p style={{ lineHeight: 1.8, maxWidth: "720px" }}>
        Pelajari materi panduan dan periksa ketentuan terbaru melalui
        sumber resmi pemerintah sebelum mengambil keputusan.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        <a
          href="/info-haji-umrah/panduan"
          style={{
            display: "inline-block",
            background: "#166534",
            color: "#ffffff",
            padding: "13px 22px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Baca Panduan Lengkap
	</a>
        <a
          href="#sumber-resmi"
          style={{
            display: "inline-block",
            background: "#ffffff",
            color: "#166534",
            border: "1px solid #166534",
            padding: "12px 20px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Sumber Informasi Resmi
        </a>
      </div>
    </section>

    <section style={{ marginTop: "32px" }}>
      <h2 style={{ color: "#14532d" }}>
        Informasi yang Bisa Dipelajari
      </h2>

      <p style={{ lineHeight: 1.8 }}>
        Pilih topik yang ingin diketahui, lalu buka panduan lengkap
        untuk membaca penjelasannya.
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
        {informasi.map((item) => (
          <a
            key={item.nomor}
            href="/info-haji-umrah/panduan"
            style={{
              display: "block",
              padding: "22px",
              border: "1px solid #d9e7dd",
              borderRadius: "14px",
              background: "#ffffff",
              color: "#24352b",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(22, 101, 52, 0.05)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                color: "#16804a",
                fontWeight: 800,
                fontSize: "13px",
                marginBottom: "10px",
              }}
            >
              PANDUAN {item.nomor}
            </span>

            <h3 style={{ color: "#14532d", marginTop: 0 }}>
              {item.judul}
            </h3>

            <p style={{ lineHeight: 1.8, marginBottom: "10px" }}>
              {item.isi}
            </p>

            <span style={{ color: "#166534", fontWeight: 700 }}>
              Baca materi &rarr;
            </span>
          </a>
        ))}
      </div>
    </section>

    <section id="sumber-resmi" style={{ marginTop: "36px" }}>
      <h2 style={{ color: "#14532d" }}>
        Sumber Informasi Resmi
      </h2>

      <p style={{ lineHeight: 1.8 }}>
        Untuk memastikan ketepatan informasi, periksa langsung
        pengumuman pemerintah karena persyaratan dan jadwal dapat
        berubah.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "18px",
          marginTop: "20px",
        }}
      >
        <article
          className="heroCard"
          style={{ padding: "22px", borderRadius: "14px" }}
        >
          <h3>Kementerian Haji dan Umrah RI</h3>

          <p style={{ lineHeight: 1.8 }}>
            Kunjungi portal kementerian untuk mencari informasi dan
            pengumuman resmi.
          </p>

          <a
            href="https://haji.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "8px",
              background: "#166534",
              color: "#ffffff",
              padding: "11px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Buka Situs Resmi
          </a>
        </article>

        <article
          className="heroCard"
          style={{ padding: "22px", borderRadius: "14px" }}
        >
          <h3>Portal Sulawesi Selatan</h3>

          <p style={{ lineHeight: 1.8 }}>
            Periksa portal wilayah Sulawesi Selatan untuk informasi
            yang relevan bagi masyarakat setempat.
          </p>

          <a
            href="https://sulsel.haji.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "8px",
              background: "#166534",
              color: "#ffffff",
              padding: "11px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Buka Portal Sulsel
          </a>
        </article>
      
      </div>
    </section>

    ```
    <div style={{ marginTop: "32px", marginBottom: "12px" }}>
      <a
        href="/"
        style={{
          display: "inline-block",
          background: "#166534",
          color: "#ffffff",
          padding: "12px 20px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        &larr; Kembali ke Beranda
      </a>
    </div>
  </div>
</main>

);
}

