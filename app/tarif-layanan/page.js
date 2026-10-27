
export const metadata = {
  title: 'Tarif Layanan Nikah dan Rujuk',
  description: 'Informasi transparan tarif PNBP nikah dan rujuk sesuai ketentuan yang berlaku.',
};

const feeItems = [
  {
    title: 'Akad nikah di kantor KUA',
    price: 'Rp0',
    note: 'Berlaku apabila akad dilaksanakan di kantor KUA pada hari dan jam kerja operasional.',
    accent: '#15803d',
    soft: '#dcfce7',
  },
  {
    title: 'Akad nikah di luar kantor KUA dan/atau di luar jam kerja',
    price: 'Rp600.000',
    note: 'Tarif Penerimaan Negara Bukan Pajak (PNBP), sesuai ketentuan yang berlaku.',
    accent: '#075985',
    soft: '#e0f2fe',
  },
];

const headingStyle = {
  color: '#123d65',
  fontWeight: 800,
  lineHeight: 1.4,
};

const linkStyle = {
  color: '#075985',
  fontWeight: 700,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
};

export default function TarifLayananPage() {
  return (
    <main style={{
      background: 'linear-gradient(180deg, #eaf4fb 0%, #f7fafc 100%)',
      color: '#334155',
      minHeight: '70vh',
      padding: 'clamp(24px, 5vw, 56px) 16px',
      fontSize: '17px',
      lineHeight: 1.8,
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{
          background: 'linear-gradient(135deg, #123d65 0%, #087e75 100%)',
          color: '#ffffff',
          borderRadius: '22px',
          padding: 'clamp(24px, 5vw, 42px)',
          boxShadow: '0 12px 30px rgba(18, 61, 101, .16)',
          marginBottom: '24px',
        }}>
          <span style={{
            display: 'inline-block',
            color: '#116b58',
            background: '#d5f5e8',
            padding: '6px 12px',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '.08em',
            marginBottom: '12px',
          }}>
            TRANSPARANSI BIAYA
          </span>
          <h1 style={{
            color: '#ffffff',
            fontSize: 'clamp(28px, 5vw, 42px)',
            lineHeight: 1.25,
            fontWeight: 800,
            margin: '0 0 14px',
          }}>
            Tarif Layanan Nikah dan Rujuk
          </h1>
          <p style={{ color: '#f0fdfa', margin: 0, lineHeight: 1.9 }}>
            Informasi tarif disajikan untuk membantu masyarakat memahami biaya
            resmi sebelum menggunakan layanan KUA Kecamatan Panca Lautang.
          </p>
        </header>

        <section aria-label="Daftar tarif resmi" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '18px',
          margin: '24px 0',
        }}>
          {feeItems.map((item) => (
            <article key={item.title} style={{
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #d5e3ed',
              borderTop: `5px solid ${item.accent}`,
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 5px 18px rgba(18, 61, 101, .07)',
            }}>
              <span style={{
                display: 'inline-block',
                color: item.accent,
                background: item.soft,
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '13px',
                fontWeight: 800,
                marginBottom: '12px',
              }}>
                TARIF RESMI
              </span>
              <h2 style={{
                ...headingStyle,
                fontSize: '21px',
                margin: '0 0 12px',
              }}>
                {item.title}
              </h2>
              <p style={{
                color: item.accent,
                fontSize: 'clamp(32px, 5vw, 42px)',
                lineHeight: 1.25,
                fontWeight: 900,
                margin: '12px 0',
              }}>
                {item.price}
              </p>
              <p style={{ color: '#475569', lineHeight: 1.85, marginBottom: 0 }}>
                {item.note}
              </p>
            </article>
          ))}
        </section>

        <section style={{
          background: '#ffffff',
          color: '#334155',
          border: '1px solid #d5e3ed',
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 30px)',
          marginTop: '22px',
          boxShadow: '0 5px 18px rgba(18, 61, 101, .05)',
        }}>
          <h2 style={{ ...headingStyle, fontSize: '25px', marginTop: 0 }}>
            Ketentuan Penting
          </h2>
          <ul style={{ color: '#334155', paddingLeft: '24px', lineHeight: 1.9 }}>
            <li>Tarif Rp600.000 merupakan PNBP dan harus dibayar melalui kanal pembayaran resmi sesuai kode billing.</li>
            <li>Jangan menyerahkan pembayaran tidak resmi kepada petugas. Simpan bukti pembayaran.</li>
            <li>Tarif Rp0 untuk nikah di luar kantor bagi calon pengantin yang memenuhi kondisi khusus hanya dapat diberikan setelah syarat dan prosedur resmi dipenuhi, misalnya ketentuan bagi calon pengantin tidak mampu atau korban keadaan kahar/bencana.</li>
            <li>Informasi pada halaman ini merupakan ringkasan. Konfirmasikan rincian dan kelayakan kondisi khusus kepada KUA sebelum hari akad.</li>
          </ul>
        </section>

        <section style={{
          background: '#ffffff',
          color: '#334155',
          border: '1px solid #d5e3ed',
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 30px)',
          marginTop: '18px',
        }}>
          <h2 style={{ ...headingStyle, fontSize: '25px', marginTop: 0 }}>
            Dasar dan Sumber Resmi
          </h2>
          <ul style={{ paddingLeft: '24px', lineHeight: 2.1 }}>
            <li>
              <a style={linkStyle} href="https://simbi.kemenag.go.id/faq" target="_blank" rel="noreferrer">
                FAQ resmi Bimas Islam — biaya nikah
              </a>
            </li>
            <li>
              <a style={linkStyle} href="https://bimasislam.kemenag.go.id/info-nikah/prosedur" target="_blank" rel="noreferrer">
                Prosedur nikah — Ditjen Bimas Islam
              </a>
            </li>
            <li>
              <a style={linkStyle} href="https://jdih.kemenag.go.id/regulation/peraturan-menteri-agama-nomor-14-tahun-2024-tentang-persyaratan-dan-tata-cara-pengenaan-tarif-atas-jenis-penerimaan-negara-bukan-pajak-nol-rupiah-atas-jasa-layanan-nikah-atau-rujuk-di-luar-ka" target="_blank" rel="noreferrer">
                PMA Nomor 14 Tahun 2024 — ketentuan tarif Rp0 untuk kondisi tertentu
              </a>
            </li>
          </ul>
        </section>

        <p style={{
          color: '#475569',
          fontSize: '14px',
          textAlign: 'center',
          marginTop: '24px',
        }}>
          KUA Kecamatan Panca Lautang · Informasi layanan untuk masyarakat
        </p>
      </div>
    </main>
  );
}
