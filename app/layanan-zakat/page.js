
import ZakatCalculator from './components/ZakatCalculator';

export const metadata = {
  title: 'Layanan Zakat | KUA Panca Lautang',
  description:
    'Panduan zakat fitrah, zakat mal, penghasilan, emas, perdagangan dan pertanian, dilengkapi kalkulator simulasi zakat serta informasi konsultasi bagi masyarakat Panca Lautang.',
  alternates: {
    canonical: '/layanan-zakat',
  },
};

const hijau = '#14532d';
const hijauTerang = '#166534';

const kartu = {
  padding: 22,
  border: '1px solid #d9e7dd',
  borderRadius: 16,
  background: '#ffffff',
};

const jenisZakat = [
  {
    nomor: '01',
    judul: 'Zakat Fitrah',
    deskripsi:
      'Zakat yang berkaitan dengan akhir Ramadan dan Idulfitri. Besaran makanan pokok atau nilai uang mengikuti ketetapan resmi yang berlaku.',
    poin: [
      'Dihitung berdasarkan jumlah jiwa.',
      'Perhatikan waktu pembayaran yang sesuai ketentuan.',
      'Gunakan nilai resmi untuk wilayah dan tahun terkait.',
    ],
  },
  {
    nomor: '02',
    judul: 'Zakat Penghasilan',
    deskripsi:
      'Panduan zakat atas penghasilan dari pekerjaan atau profesi sesuai ketentuan yang dirujuk.',
    poin: [
      'Catat penghasilan yang menjadi dasar perhitungan.',
      'Periksa nisab dan metode perhitungan.',
      'Acuan kadar umum yang digunakan adalah 2,5%.',
    ],
  },
  {
    nomor: '03',
    judul: 'Zakat Emas dan Tabungan',
    deskripsi:
      'Penilaian emas, simpanan, dan harta sejenis dengan memperhatikan nisab, haul, serta karakter harta.',
    poin: [
      'Periksa nilai harta yang dimiliki.',
      'Pastikan nisab menggunakan acuan yang tepat.',
      'Tinjau haul dan kewajiban lain yang relevan.',
    ],
  },
  {
    nomor: '04',
    judul: 'Zakat Perdagangan',
    deskripsi:
      'Panduan awal bagi pemilik usaha untuk mengidentifikasi aset dagang, kas, dan kewajiban yang diperhitungkan.',
    poin: [
      'Siapkan pencatatan usaha yang akurat.',
      'Bedakan aset usaha dan aset pribadi.',
      'Konfirmasikan dasar perhitungan kepada lembaga zakat.',
    ],
  },
  {
    nomor: '05',
    judul: 'Zakat Pertanian',
    deskripsi:
      'Zakat hasil pertanian yang mempertimbangkan jenis hasil panen, nisab, dan metode pengairan.',
    poin: [
      'Catat jenis serta jumlah hasil panen.',
      'Periksa nisab hasil pertanian yang berlaku.',
      'Kadar umum dapat berbeda menurut metode pengairan.',
    ],
  },
  {
    nomor: '06',
    judul: 'Penerima Zakat',
    deskripsi:
      'Zakat disalurkan kepada golongan yang berhak menerimanya sesuai ketentuan syariat.',
    poin: [
      'Fakir dan miskin.',
      'Amil, mualaf, dan riqab.',
      'Gharimin, fisabilillah, dan ibnu sabil.',
    ],
  },
];

const faq = [
  {
    tanya: 'Apa perbedaan zakat fitrah dan zakat mal?',
    jawab:
      'Zakat fitrah berkaitan dengan Ramadan dan Idulfitri, sedangkan zakat mal berkaitan dengan harta tertentu yang memenuhi persyaratan zakat.',
  },
  {
    tanya: 'Apakah kalkulator ini menetapkan kewajiban zakat?',
    jawab:
      'Tidak. Kalkulator memberikan simulasi awal. Penetapan perlu mempertimbangkan jenis harta, nisab, haul bila berlaku, serta ketentuan resmi.',
  },
  {
    tanya: 'Di mana saya dapat membayar zakat?',
    jawab:
      'Masyarakat dapat mencari BAZNAS atau Lembaga Amil Zakat yang memiliki izin resmi. Periksa identitas lembaga dan saluran pembayaran sebelum bertransaksi.',
  },
  {
    tanya: 'Apakah nilai zakat fitrah selalu sama setiap tahun?',
    jawab:
      'Tidak. Nilai uang dapat berubah berdasarkan ketetapan resmi dan wilayah. Gunakan informasi untuk tahun pembayaran yang bersangkutan.',
  },
  {
    tanya: 'Bagaimana jika saya belum yakin menghitung zakat?',
    jawab:
      'Siapkan catatan harta atau penghasilan, kemudian konsultasikan kepada BAZNAS, LAZ resmi, atau petugas yang kompeten di bidang zakat.',
  },
];

export default function LayananZakatPage() {
  return (
    <main className="section">
      <div className="wrap">
        <section
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
            alignItems: 'center',
            gap: 28,
            padding: 'clamp(24px, 5vw, 44px)',
            borderRadius: 22,
            background:
              'linear-gradient(135deg, #f0fdf4 0%, #ffffff 65%, #fefce8 100%)',
            border: '1px solid #d9e7dd',
          }}
        >
          <div>
            <p
              style={{
                color: hijauTerang,
                fontWeight: 800,
                letterSpacing: 1.3,
                fontSize: 13,
              }}
            >
              INFORMASI DAN EDUKASI KEAGAMAAN
            </p>
            <h1
              style={{
                color: hijau,
                lineHeight: 1.2,
                fontSize: 'clamp(30px, 4vw, 44px)',
              }}
            >
              Layanan Zakat
            </h1>
            <p style={{ lineHeight: 1.9 }}>
              Pusat informasi zakat bagi masyarakat Kecamatan Panca Lautang,
              Kabupaten Sidenreng Rappang. Pelajari jenis zakat, persyaratan,
              simulasi perhitungan, dan cara menemukan lembaga penyalur resmi.
            </p>
            <p style={{ lineHeight: 1.9 }}>
              Gunakan informasi ini sebagai panduan awal. Ketentuan nisab,
              haul, dan besaran pembayaran perlu disesuaikan dengan sumber
              resmi yang berlaku.
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 22,
              }}
            >
              <a href="#kalkulator" style={tombolUtama}>
                Hitung Simulasi Zakat
              </a>
              <a href="#panduan" style={tombolSekunder}>
                Lihat Panduan
              </a>
            </div>
          </div>

          <div
            style={{
              minHeight: 260,
              padding: 28,
              borderRadius: 20,
              background:
                'linear-gradient(155deg, #14532d, #166534 65%, #0f3d25)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div aria-hidden="true" style={{ fontSize: 60 }}>
              ✦
            </div>
            <p
              style={{
                color: '#fde68a',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              ZAKAT DAN KEPEDULIAN
            </p>
            <h2 style={{ color: '#ffffff', lineHeight: 1.4 }}>
              Tunaikan dengan Ilmu dan Amanah
            </h2>
            <p style={{ color: '#ecfdf5', lineHeight: 1.8 }}>
              Pahami ketentuannya dan pastikan penyaluran melalui saluran
              yang dapat dipercaya.
            </p>
          </div>
        </section>

        <section id="panduan" style={{ marginTop: 38 }}>
          <h2 style={{ color: hijau }}>Panduan Jenis Zakat</h2>
          <p style={{ lineHeight: 1.9 }}>
            Pilih topik yang sesuai dengan kebutuhan Anda. Setiap jenis zakat
            mempunyai ketentuan dan dasar perhitungan yang berbeda.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 18,
              marginTop: 22,
            }}
          >
            {jenisZakat.map((item) => (
              <article key={item.nomor} style={kartu}>
                <span style={{ color: hijauTerang, fontWeight: 800 }}>
                  PANDUAN {item.nomor}
                </span>
                <h3 style={{ color: hijau }}>{item.judul}</h3>
                <p style={{ lineHeight: 1.8 }}>{item.deskripsi}</p>
                <ul style={{ lineHeight: 1.9, paddingLeft: 20 }}>
                  {item.poin.map((poin) => (
                    <li key={poin}>{poin}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <ZakatCalculator />

        <section id="penerima" style={{ marginTop: 38 }}>
          <div style={kartu}>
            <h2 style={{ color: hijau }}>Delapan Golongan Penerima Zakat</h2>
            <p style={{ lineHeight: 1.9 }}>
              Berdasarkan QS. At-Taubah ayat 60, golongan penerima zakat
              meliputi fakir, miskin, amil, mualaf, riqab, gharimin,
              fisabilillah, dan ibnu sabil. Penerapan pada kasus tertentu
              perlu mengikuti ketentuan syariat dan pengelolaan zakat yang
              berlaku.
            </p>
          </div>
        </section>

        <section id="faq" style={{ marginTop: 38 }}>
          <h2 style={{ color: hijau }}>Pertanyaan yang Sering Diajukan</h2>
          <div style={{ display: 'grid', gap: 14 }}>
            {faq.map((item) => (
              <details key={item.tanya} style={kartu}>
                <summary
                  style={{
                    cursor: 'pointer',
                    color: hijau,
                    fontWeight: 800,
                    lineHeight: 1.7,
                  }}
                >
                  {item.tanya}
                </summary>
                <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
                  {item.jawab}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section id="konsultasi" style={{ marginTop: 38 }}>
          <div
            style={{
              ...kartu,
              background: '#f0fdf4',
            }}
          >
            <h2 style={{ color: hijau }}>Konsultasi dan Informasi Resmi</h2>
            <p style={{ lineHeight: 1.9 }}>
              Untuk pertanyaan yang memerlukan penilaian khusus, siapkan data
              yang relevan dan hubungi lembaga pengelola zakat resmi.
              Pastikan kanal konsultasi sesuai dengan kebutuhan Anda.
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 18,
              }}
            >
              <a
                href="https://baznas.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                style={tombolUtama}
              >
                Situs Resmi BAZNAS ↗
              </a>
              <a
                href="https://kemenag.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                style={tombolSekunder}
              >
                Kementerian Agama ↗
              </a>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, marginTop: 18 }}>
              Halaman ini merupakan sarana edukasi. KUA tidak otomatis
              menerima atau menyalurkan dana zakat melalui halaman ini.
              Verifikasi lembaga dan ketentuan pembayaran sebelum bertransaksi.
            </p>
          </div>
        </section>

        <p
          style={{
            marginTop: 28,
            color: '#57534e',
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          Informasi umum: nisab, haul, kadar, dan metode perhitungan dapat
          berbeda menurut jenis harta dan keputusan resmi. Periksa kembali
          acuan terbaru sebelum menjadikan hasil simulasi sebagai dasar
          pembayaran zakat.
        </p>
      </div>
    </main>
  );
}

const tombolUtama = {
  display: 'inline-block',
  background: '#166534',
  color: '#ffffff',
  padding: '13px 20px',
  borderRadius: 10,
  textDecoration: 'none',
  fontWeight: 800,
};

const tombolSekunder = {
  display: 'inline-block',
  background: '#ffffff',
  color: '#166534',
  border: '1px solid #166534',
  padding: '12px 20px',
  borderRadius: 10,
  textDecoration: 'none',
  fontWeight: 700,
};
