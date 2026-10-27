
const faqItems = [
  {
    q: 'Berapa biaya nikah di KUA dan di luar KUA?',
    a: 'Akad nikah di kantor KUA pada hari dan jam kerja dikenai tarif Rp0. Akad nikah di luar kantor KUA dan/atau di luar hari dan jam kerja dikenai tarif PNBP Rp600.000. Pembayaran dilakukan melalui kanal pembayaran resmi sesuai kode billing, bukan diserahkan kepada petugas. Ketentuan tarif Rp0 untuk kondisi khusus berlaku jika persyaratan peraturan dipenuhi.',
  },
  {
    q: 'Apa saja dokumen awal untuk mendaftar nikah?',
    a: 'Persyaratan dapat berbeda sesuai keadaan calon pengantin. Dokumen awal umumnya meliputi surat pengantar nikah dari desa/kelurahan, fotokopi KTP, Kartu Keluarga, akta kelahiran, pasfoto sesuai ketentuan, dan dokumen tambahan jika diperlukan. Periksa daftar terbaru melalui SIMKAH dan konfirmasikan kepada KUA tempat akad akan dilaksanakan.',
  },
  {
    q: 'Bagaimana jika saksi berhalangan hadir?',
    a: 'Segera hubungi petugas KUA atau penghulu sebelum hari akad. Saksi pengganti harus memenuhi ketentuan agama dan peraturan yang berlaku. Petugas KUA akan menjelaskan pilihan yang sesuai.',
  },
  {
    q: 'Bagaimana cara memperoleh Kartu Nikah Digital?',
    a: 'Bagi pengguna SIMKAH yang mendaftar secara daring, Kartu Nikah Digital dapat diakses melalui akun SIMKAH Catin setelah tahapan yang diminta diselesaikan. Pengantin lama atau yang belum memiliki akun dapat membawa Buku Nikah asli ke KUA tempat akad untuk verifikasi dan bantuan petugas.',
  },
  {
    q: 'Berapa lama proses penerbitan Kartu Nikah Digital?',
    a: 'Waktu penyelesaian bergantung pada verifikasi data dan kondisi layanan. Ikuti petunjuk pada akun SIMKAH atau hubungi KUA tempat akad. Jika terdapat ketidaksesuaian data, siapkan Buku Nikah asli untuk pemeriksaan.',
  },
  {
    q: 'Apakah pendaftaran nikah bisa dilakukan secara online?',
    a: 'Pendaftaran dapat dimulai melalui portal resmi SIMKAH di https://simkah4.kemenag.go.id. Isi data dengan benar, unggah dokumen yang diminta, simpan bukti pendaftaran, lalu ikuti arahan KUA untuk verifikasi berkas.',
  },
  {
    q: 'Bagaimana mengecek status permohonan layanan KUA?',
    a: 'Gunakan menu Cek Status Berkas pada website KUA Panca Lautang. Masukkan kode pelacakan dan PIN yang diberikan saat mengajukan permohonan. Jaga kerahasiaan PIN.',
  },
  {
    q: 'Apakah layanan administrasi KUA dipungut biaya?',
    a: 'Biaya mengikuti ketentuan resmi untuk jenis layanan terkait. Tarif Rp600.000 berlaku untuk layanan nikah/rujuk di luar kantor dan/atau di luar jam kerja sesuai ketentuan PNBP. Untuk layanan administrasi lain, tanyakan kepada petugas KUA dan minta dasar tarif tertulis jika ada biaya yang disebutkan.',
  },
];

export const metadata = {
  title: 'FAQ — Pertanyaan Umum',
  description: 'Jawaban atas pertanyaan umum tentang layanan perkawinan dan administrasi KUA Panca Lautang.',
};

export default function FAQPage() {
  return (
    <main style={{
      background: 'linear-gradient(180deg, #eaf4fb 0%, #f7fafc 100%)',
      color: '#243447',
      minHeight: '70vh',
      padding: 'clamp(24px, 5vw, 56px) 16px',
      fontSize: '16px'
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <header style={{
          background: 'linear-gradient(135deg, #123d65 0%, #087e75 100%)',
          color: '#ffffff',
          borderRadius: '22px',
          padding: 'clamp(24px, 5vw, 44px)',
          boxShadow: '0 12px 30px rgba(18, 61, 101, .16)',
          marginBottom: '26px'
        }}>
          <div style={{
            display: 'inline-block',
            background: '#d5f5e8',
            color: '#116b58',
            padding: '7px 12px',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '.08em',
            marginBottom: '12px'
          }}>
            PUSAT INFORMASI MASYARAKAT
          </div>
          <h1 style={{
            color: '#ffffff',
            fontSize: 'clamp(28px, 5vw, 42px)',
            lineHeight: 1.2,
            margin: '0 0 14px',
            fontWeight: 800
          }}>
            Pertanyaan yang Sering Diajukan
          </h1>
          <p style={{
            color: '#f0fdfa',
            fontSize: '17px',
            lineHeight: 1.8,
            margin: 0
          }}>
            Temukan jawaban ringkas seputar pendaftaran nikah, biaya resmi,
            dokumen, dan layanan KUA Kecamatan Panca Lautang.
          </p>
          <div style={{
            marginTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {['Pendaftaran Nikah', 'Biaya Resmi', 'Dokumen', 'Layanan KUA'].map((label) => (
              <span key={label} style={{
                border: '1px solid rgba(255,255,255,.35)',
                background: 'rgba(255,255,255,.12)',
                color: '#ffffff',
                borderRadius: '999px',
                padding: '7px 11px',
                fontSize: '13px',
                fontWeight: 600
              }}>
                {label}
              </span>
            ))}
          </div>
        </header>

        <div style={{ display: 'grid', gap: '14px' }}>
          {faqItems.map((item, index) => (
            <details key={item.q} style={{
              background: '#ffffff',
              border: '1px solid #d5e3ed',
              borderLeft: '5px solid #087e75',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(18, 61, 101, .06)'
            }}>
              <summary style={{
                cursor: 'pointer',
                listStylePosition: 'inside',
                padding: '19px 20px',
                background: '#ffffff',
                color: '#123d65',
                fontWeight: 750,
                fontSize: '16px',
                lineHeight: 1.7
              }}>
                <span style={{
                  display: 'inline-block',
                  background: '#e0f2fe',
                  color: '#075985',
                  borderRadius: '8px',
                  padding: '3px 8px',
                  marginRight: '8px',
                  fontSize: '13px'
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.q}
              </summary>
              <div style={{
                borderTop: '1px solid #e2edf3',
                background: '#f8fbfd',
                padding: '18px 22px 22px',
                color: '#334155',
                lineHeight: 1.9,
                fontSize: '16px'
              }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <aside style={{
          marginTop: '26px',
          background: '#fff7df',
          border: '1px solid #f4dfa0',
          borderRadius: '14px',
          padding: '18px 20px',
          color: '#854d0e',
          lineHeight: 1.8
        }}>
          <strong>Perlu bantuan lebih lanjut?</strong>
          <p style={{ margin: '6px 0 0' }}>
            Untuk memastikan persyaratan terbaru, silakan konfirmasi kepada petugas KUA Kecamatan Panca Lautang.
          </p>
        </aside>

        <footer style={{
          marginTop: '24px',
          padding: '18px',
          borderTop: '1px solid #d5e3ed',
          color: '#475569',
          lineHeight: 2
        }}>
          <strong style={{ color: '#123d65' }}>Sumber informasi resmi</strong>
          <div>
            <a href="https://simbi.kemenag.go.id/faq" target="_blank" rel="noreferrer"
              style={{ color: '#075985', fontWeight: 700 }}>
              FAQ Bimas Islam Kemenag
            </a>
          </div>
          <div>
            <a href="https://bimasislam.kemenag.go.id/info-nikah/prosedur" target="_blank" rel="noreferrer"
              style={{ color: '#075985', fontWeight: 700 }}>
              Prosedur Nikah Resmi
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
