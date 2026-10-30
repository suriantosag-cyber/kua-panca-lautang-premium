export const metadata = {
  title: "Layanan Muallaf | KUA Panca Lautang",
  description:
    "Panduan konsultasi, pendampingan, dan informasi administrasi layanan muallaf di KUA Kecamatan Panca Lautang.",
};

const sectionStyle = {
  padding: "22px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  marginBottom: "20px",
  lineHeight: 1.8,
};

export default function LayananMuallafPage() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "32px 20px 60px",
        color: "#1e293b",
      }}
    >
      <a
        href="/profil"
        style={{
          color: "#047857",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        ← Kembali ke Profil KUA
      </a>

      <header
        style={{
          marginTop: "24px",
          marginBottom: "28px",
          padding: "30px 24px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #ecfdf5, #eff6ff)",
          border: "1px solid #bbf7d0",
        }}
      >
        <p
          style={{
            color: "#047857",
            fontWeight: 700,
            letterSpacing: "1px",
            fontSize: "13px",
          }}
        >
          KANTOR URUSAN AGAMA
        </p>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 36px)", margin: "8px 0 12px" }}>
          Panduan Layanan Muallaf
        </h1>
        <p style={{ margin: 0, lineHeight: 1.8 }}>
          Informasi konsultasi, pendampingan keislaman, dan administrasi
          Piagam Masuk Islam di KUA Kecamatan Panca Lautang.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ color: "#047857", marginTop: 0 }}>
          1. Konsultasi dan Pendampingan
        </h2>
        <p>
          Masyarakat yang ingin memeluk agama Islam dapat berkonsultasi
          dengan petugas KUA mengenai proses pengucapan dua kalimat syahadat,
          pendampingan, serta pembinaan keislaman sesuai kebutuhan.
        </p>
        <p style={{ marginBottom: 0 }}>
          Silakan menghubungi atau datang ke KUA Kecamatan Panca Lautang
          untuk memperoleh arahan mengenai pelayanan yang sesuai.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ color: "#047857", marginTop: 0 }}>
          2. Prosedur Pelayanan
        </h2>
        <ol style={{ paddingLeft: "22px" }}>
          <li>Sampaikan kebutuhan pelayanan kepada petugas KUA.</li>
          <li>Konsultasikan proses syahadat dan pendampingan yang diperlukan.</li>
          <li>Ikuti arahan petugas mengenai pencatatan dan administrasi.</li>
          <li>Konfirmasikan persyaratan penerbitan Piagam Masuk Islam kepada petugas yang berwenang.</li>
        </ol>
        <p style={{ marginBottom: 0, color: "#475569" }}>
          Persyaratan dan prosedur dapat dikonfirmasi langsung kepada petugas
          agar sesuai dengan ketentuan yang berlaku.
        </p>
      </section>

      <section
        style={{
          ...sectionStyle,
          background: "linear-gradient(135deg, #eff6ff, #f0f9ff)",
          borderColor: "#bfdbfe",
          borderLeft: "5px solid #2563eb",
        }}
      >
        <h2 style={{ color: "#1d4ed8", marginTop: 0 }}>
          3. Piagam Masuk Islam Tahun 2026
        </h2>
        <p>
          Informasi mengenai pengurusan piagam, dokumen pendukung, dan
          mekanisme penerbitan dapat diperoleh dari petugas KUA yang
          berwenang.
        </p>
        <div
          style={{
            padding: "14px",
            borderRadius: "10px",
            background: "#ffffff",
            border: "1px solid #bfdbfe",
          }}
        >
          <strong style={{ color: "#1d4ed8" }}>Informasi dokumen</strong>
          <p style={{ marginBottom: 0 }}>
            Berkas PDF resmi belum tersedia pada halaman ini. Silakan
            menghubungi petugas KUA untuk memperoleh informasi tentang
            penerbitan piagam. Dokumen resmi hanya dapat digunakan setelah
            diterbitkan atau disahkan oleh pihak yang berwenang.
          </p>
        </div>
      </section>

      <section
        style={{
          ...sectionStyle,
          background: "linear-gradient(135deg, #f5f3ff, #eef2ff)",
          borderColor: "#ddd6fe",
          borderLeft: "5px solid #7c3aed",
        }}
      >
        <h2 style={{ color: "#5b21b6", marginTop: 0 }}>
          4. Informasi Kelembagaan Keagamaan
        </h2>
        <p style={{ marginBottom: 0 }}>
          Untuk konsultasi awal terkait administrasi kelembagaan keagamaan,
          silakan menyampaikan kebutuhan kepada petugas KUA agar memperoleh
          arahan sesuai kewenangan dan ketentuan yang berlaku.
        </p>
      </section>

      <p style={{ textAlign: "center", marginTop: "28px" }}>
        <a
          href="/profil"
          style={{
            display: "inline-flex",
            padding: "12px 20px",
            borderRadius: "999px",
            background: "#047857",
            color: "#ffffff",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Kembali ke Profil KUA
        </a>
      </p>
    </main>
  );
}