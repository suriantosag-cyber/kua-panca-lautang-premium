
export const metadata = {
  title: 'Pusat Unduhan',
  description:
    'Tautan dokumen persiapan dan sumber resmi persyaratan layanan KUA Panca Lautang.',
};

const downloads = [
  {
    title: 'Contoh Lembar Persiapan Surat Pengantar Nikah',
    description:
      'Lembar bantu untuk menyiapkan data sebelum mengurus surat resmi di desa atau kelurahan. Ini bukan formulir resmi pemerintah dan tidak menggantikan dokumen yang diterbitkan desa atau kelurahan.',
    href: '/formulir/contoh-surat-pengantar-nikah.html',
    label: 'Buka / Cetak Lembar Contoh',
    type: 'DOKUMEN CONTOH',
    color: '#0f766e',
    background: '#ecfdf5',
    external: false,
  },
  {
    title: 'Prosedur dan Persyaratan Pendaftaran Nikah',
    description:
      'Panduan resmi Ditjen Bimas Islam mengenai alur pendaftaran dan dokumen awal yang perlu disiapkan.',
    href: 'https://bimasislam.kemenag.go.id/info-nikah/prosedur',
    label: 'Buka Panduan Resmi',
    type: 'PANDUAN RESMI',
    color: '#1d4ed8',
    background: '#eff6ff',
    external: true,
  },
  {
    title: 'Pendaftaran Nikah melalui SIMKAH',
    description:
      'Portal resmi untuk memulai pendaftaran nikah secara daring dan mengikuti petunjuk yang tersedia.',
    href: 'https://simkah4.kemenag.go.id',
    label: 'Buka Portal SIMKAH',
    type: 'LAYANAN DIGITAL',
    color: '#0f766e',
    background: '#ecfdf5',
    external: true,
  },
  {
    title: 'FAQ Resmi Bimas Islam',
    description:
      'Jawaban resmi untuk pertanyaan seputar biaya, pendaftaran, dan layanan perkawinan.',
    href: 'https://simbi.kemenag.go.id/faq',
    label: 'Baca FAQ Resmi',
    type: 'INFORMASI LAYANAN',
    color: '#7c3aed',
    background: '#f5f3ff',
    external: true,
  },
];

export default function UnduhanPage() {
  return (
    <main
      style={{
        background: 'linear-gradient(180deg, #eaf4fb 0%, #f8fafc 100%)',
        color: '#334155',
        padding: 'clamp(24px, 5vw, 52px) 0',
        fontSize: '17px',
        minHeight: '70vh',
      }}
    >
      <div className="wrap">
        <section
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 12px 40px rgba(15, 61, 101, 0.10)',
            border: '1px solid #dbe7ef',
          }}
        >
          <header
            style={{
              background: 'linear-gradient(135deg, #123d65 0%, #087e75 100%)',
              padding: 'clamp(26px, 5vw, 44px)',
              color: '#ffffff',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '7px 12px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1.5px',
              }}
            >
              DOKUMEN DAN PANDUAN
            </span>

            <h1
              style={{
                color: '#ffffff',
                fontSize: 'clamp(30px, 5vw, 42px)',
                lineHeight: 1.2,
                margin: '18px 0 12px',
                fontWeight: 800,
              }}
            >
              Pusat Unduhan
            </h1>

            <p
              style={{
                color: '#e7f5ff',
                lineHeight: 1.8,
                maxWidth: '720px',
                margin: 0,
              }}
            >
              Temukan dokumen persiapan, panduan pendaftaran nikah, dan tautan
              layanan resmi Kementerian Agama. Pilih sumber yang sesuai dengan
              kebutuhan Anda.
            </p>
          </header>

          <div style={{ padding: 'clamp(20px, 4vw, 36px)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))',
                gap: '20px',
              }}
            >
              {downloads.map((item, index) => (
                <article
                  key={item.href}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '24px',
                    borderRadius: '18px',
                    background: '#ffffff',
                    border: '1px solid #dbe4ee',
                    borderTop: `4px solid ${item.color}`,
                    boxShadow: '0 5px 18px rgba(15, 61, 101, 0.06)',
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: item.background,
                      color: item.color,
                      fontSize: '22px',
                      fontWeight: 800,
                      marginBottom: '18px',
                    }}
                    aria-hidden="true"
                  >
                    {index === 0 ? '↓' : index === 1 ? '≡' : index === 2 ? '↗' : '?'}
                  </div>

                  <span
                    style={{
                      color: item.color,
                      background: item.background,
                      borderRadius: '6px',
                      padding: '5px 8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.7px',
                      marginBottom: '12px',
                    }}
                  >
                    {item.type}
                  </span>

                  <h2
                    style={{
                      color: '#123d65',
                      fontSize: '20px',
                      lineHeight: 1.45,
                      fontWeight: 800,
                      margin: '0 0 12px',
                    }}
                  >
                    {item.title}
                  </h2>

                  <p
                    style={{
                      color: '#475569',
                      lineHeight: 1.8,
                      fontSize: '15px',
                      margin: '0 0 24px',
                      flexGrow: 1,
                    }}
                  >
                    {item.description}
                  </p>

                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: item.color,
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 800,
                      lineHeight: 1.5,
                      textAlign: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    {item.label} <span aria-hidden="true">→</span>
                  </a>
                </article>
              ))}
            </div>

            <aside
              style={{
                marginTop: '28px',
                padding: '20px',
                borderRadius: '14px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderLeft: '5px solid #2563eb',
              }}
            >
              <h2
                style={{
                  color: '#1e40af',
                  fontSize: '17px',
                  fontWeight: 800,
                  margin: '0 0 8px',
                }}
              >
                Catatan Penting
              </h2>
              <p
                style={{
                  color: '#334155',
                  fontSize: '14px',
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Dokumen contoh hanya membantu persiapan data. Format resmi,
                tanda tangan, pengesahan, dan persyaratan akhir tetap mengikuti
                ketentuan instansi yang berwenang. Periksa informasi terbaru
                melalui SIMKAH atau petugas KUA Kecamatan Panca Lautang.
              </p>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
