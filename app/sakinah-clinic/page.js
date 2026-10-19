export const metadata = {
  title: "Sakinah Clinic | KUA Panca Lautang",
  description:
    "Ruang edukasi kesiapan menikah, keluarga sakinah, dan konsultasi awal bagi remaja serta calon pengantin di Panca Lautang.",
};

const topics = [
  {
    number: "01",
    title: "Kesiapan Mental dan Emosional",
    description:
      "Kenali kesiapan diri, kemampuan mengelola emosi, komunikasi yang sehat, tanggung jawab, serta cara menyelesaikan perbedaan tanpa kekerasan.",
  },
  {
    number: "02",
    title: "Mencegah Perkawinan Usia Anak",
    description:
      "Pahami pentingnya pendidikan, kematangan fisik dan psikologis, serta perlindungan hak anak. Di Indonesia, usia minimum perkawinan adalah 19 tahun bagi laki-laki dan perempuan; dispensasi hanya melalui proses pengadilan sesuai ketentuan hukum.",
  },
  {
    number: "03",
    title: "Kesehatan Reproduksi",
    description:
      "Pelajari informasi dasar tentang kesehatan reproduksi, persetujuan, batasan diri, dan perlindungan dari kekerasan. Untuk pertanyaan atau pemeriksaan kesehatan, hubungi tenaga kesehatan yang kompeten.",
  },
  {
    number: "04",
    title: "Membangun Keluarga Sakinah",
    description:
      "Pelajari dasar komunikasi pasangan, saling menghormati, pembagian tanggung jawab, pengelolaan keuangan, dan membangun rumah tangga yang aman.",
  },
];

export default function SakinahClinicPage() {
  return (
    <main className="section">
      <div className="wrap" style={{ maxWidth: 900 }}>
        <a className="btn" href="/">← Kembali ke Beranda</a>

        <header style={{ margin: "28px 0 32px" }}>
          <span className="icon">SC</span>
          <h1 style={{ marginTop: 16 }}>Sakinah Clinic</h1>
          <h2>Konsultasi Remaja dan Pranikah</h2>
          <p>
            Ruang edukasi untuk membantu remaja dan calon pengantin memahami
            kesiapan diri, hubungan yang sehat, serta persiapan membangun
            keluarga sakinah.
          </p>
        </header>

        <section className="card" style={{ marginBottom: 24 }}>
          <h2>Belajar dan Persiapkan Diri</h2>
          <p>
            Menikah membutuhkan kesiapan, tanggung jawab, komunikasi, dan
            pemahaman terhadap hak serta kewajiban pasangan. Tidak perlu
            terburu-buru mengambil keputusan besar tanpa informasi yang cukup.
          </p>
        </section>

        <section aria-label="Topik edukasi" style={{ display: "grid", gap: 16 }}>
          {topics.map((topic) => (
            <article className="card" key={topic.number}>
              <div className="icon">{topic.number}</div>
              <h2>{topic.title}</h2>
              <p>{topic.description}</p>
            </article>
          ))}
        </section>

        <section className="card" style={{ marginTop: 24 }}>
          <h2>Butuh Informasi atau Pendampingan?</h2>
          <p>
            Untuk informasi bimbingan pranikah dan pembinaan keluarga,
            masyarakat dapat menghubungi atau datang ke KUA Kecamatan
            Panca Lautang melalui kontak resmi yang tersedia di situs ini.
          </p>
          <a className="btn primary" href="/#kontak">
            Lihat Kontak KUA
          </a>
          <p style={{ marginTop: 16, fontSize: 13 }}>
            Mohon jangan mengirimkan kata sandi, identitas pribadi, atau
            rincian sensitif melalui ruang publik. Informasi yang memerlukan
            penanganan khusus sebaiknya disampaikan secara langsung kepada
            petugas yang berwenang. Jika menghadapi bahaya atau kekerasan,
            segera cari bantuan orang dewasa tepercaya atau layanan darurat
            yang berwenang.
          </p>
        </section>

        <p style={{ marginTop: 24, fontSize: 13 }}>
          Materi ini merupakan edukasi umum, bukan pengganti konsultasi
          profesional. Kegiatan bersama Puskesmas atau tenaga kesehatan
          hanya akan diumumkan setelah koordinasi dan kerja sama dikonfirmasi.
        </p>
      </div>
    </main>
  );
}
