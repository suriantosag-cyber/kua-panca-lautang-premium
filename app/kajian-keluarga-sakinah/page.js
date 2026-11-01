import KajianMediaPublik from "./KajianMediaPublik";
import styles from "./page.module.css";

export const metadata = {
  title: {
    absolute: "Kajian Keluarga Sakinah: Materi dan Edukasi Keluarga | KUA Panca Lautang",
  },
  description:
    "Baca artikel edukasi keluarga sakinah, pengasuhan Islami, komunikasi suami istri, penyelesaian konflik, dan panduan membangun rumah tangga harmonis. Dilengkapi video edukasi dan materi bimbingan keluarga dari KUA Panca Lautang.",
  alternates: {
    canonical: "/kajian-keluarga-sakinah",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kua-pancalautang.my.id/kajian-keluarga-sakinah",
    siteName: "KUA Panca Lautang",
    title: "Kajian Keluarga Sakinah: Edukasi dan Bimbingan Keluarga",
    description:
      "Temukan artikel, video edukasi, dan panduan membangun keluarga sakinah, harmonis, serta penuh kasih sayang dari KUA Panca Lautang.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kajian Keluarga Sakinah | Edukasi Keluarga KUA Panca Lautang",
    description:
      "Artikel dan video edukasi tentang komunikasi pasangan, pengasuhan Islami, serta membangun rumah tangga harmonis.",
  },
};

const kajian = [
  {
    kategori: "Komunikasi Pasangan",
    judul: "Membangun Komunikasi yang Menenangkan",
    ringkasan:
      "Belajar mendengarkan, menyampaikan perasaan dengan santun, dan membicarakan perbedaan tanpa merendahkan pasangan.",
    langkah: [
      "Pilih waktu yang tepat untuk berbicara.",
      "Dengarkan pasangan tanpa langsung menyela atau menghakimi.",
      "Sampaikan kebutuhan dengan jelas dan bahasa yang baik.",
      "Sepakati langkah yang realistis dan evaluasi bersama.",
    ],
    durasi: "5 menit baca",
  },
  {
    kategori: "Resolusi Konflik",
    judul: "Menghadapi Perselisihan secara Bijaksana",
    ringkasan:
      "Perselisihan perlu ditangani dengan tenang, mengutamakan keadilan, dan berfokus pada penyelesaian masalah.",
    langkah: [
      "Berhenti sejenak ketika emosi meningkat.",
      "Bahas masalah yang sedang terjadi, bukan menyerang pribadi.",
      "Cari solusi yang mempertimbangkan kebutuhan kedua pihak.",
      "Jika diperlukan, mintalah bantuan petugas atau tenaga profesional yang kompeten.",
    ],
    durasi: "6 menit baca",
  },
  {
    kategori: "Parenting Islami",
    judul: "Mendidik Anak dengan Kasih Sayang dan Keteladanan",
    ringkasan:
      "Pengasuhan yang baik memadukan kasih sayang, batasan yang sehat, perlindungan, dan contoh perilaku sehari-hari.",
    langkah: [
      "Luangkan waktu untuk mendengarkan cerita anak.",
      "Tunjukkan kejujuran, tanggung jawab, dan sopan santun melalui teladan.",
      "Berikan arahan sesuai usia tanpa penghinaan atau kekerasan.",
      "Dampingi penggunaan teknologi dan lingkungan pergaulan anak.",
    ],
    durasi: "5 menit baca",
  },
  {
    kategori: "Keluarga Sakinah",
    judul: "Merawat Keharmonisan dalam Kehidupan Sehari-hari",
    ringkasan:
      "Keharmonisan tumbuh melalui tanggung jawab bersama, perhatian yang konsisten, ibadah, dan kesediaan memperbaiki diri.",
    langkah: [
      "Biasakan saling menghargai dan mengucapkan terima kasih.",
      "Bicarakan pembagian tanggung jawab rumah tangga.",
      "Kelola keuangan keluarga secara terbuka dan realistis.",
      "Jaga privasi keluarga serta cari bantuan saat masalah sulit diatasi.",
    ],
    durasi: "5 menit baca",
  },
];

const media = [
  {
    jenis: "Video Edukasi",
    judul: "Konsep Keluarga Sakinah",
    keterangan:
      "Materi pengantar tentang konsep keluarga sakinah dari pelatihan Pintar Kemenag.",
    videoId: "wIplHTxmvqM",
  },
  {
    jenis: "Video Edukasi",
    judul: "Peran dan Tanggung Jawab Keluarga",
    keterangan:
      "Materi edukasi tentang peran dan tanggung jawab anggota keluarga dalam perkawinan.",
    videoId: "NsF2jfhNMNg",
  },
  {
    jenis: "Video Edukasi",
    judul: "Pengelolaan Keuangan dalam Perkawinan",
    keterangan:
      "Materi edukasi tentang pengelolaan keuangan dalam kehidupan rumah tangga.",
    videoId: "F3kUSStjY4E",
  },
];

export default function KajianKeluargaSakinahPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>SAHABAT KELUARGA KUA PANCA LAUTANG</p>
        <h1>Kajian Keluarga Sakinah</h1>
        <h2>Cinta dan Rasa Nyaman: Merawat Hati, Menguatkan Keluarga</h2>
        <p className={styles.lead}>
          Selamat datang di ruang Sahabat KUA Panca Lautang. Di sini, setiap
          keluarga dan calon pasangan dapat bertanya, berbagi cerita, belajar,
          serta menemukan inspirasi untuk membangun rumah tangga yang harmonis.
          Mari merawat cinta dengan komunikasi yang baik, saling memahami,
          menghargai kekurangan, dan menjalankan tanggung jawab bersama.
          KUA hadir bukan hanya sebagai tempat mengurus pernikahan, tetapi juga
          sebagai sahabat dalam perjalanan kehidupan keluarga.
        </p>
        <p className={styles.lead}>
          <strong>Cinta Menyatukan, Rasa Nyaman Menguatkan, Keluarga Sakinah Membahagiakan.</strong>
        </p>
        <div className={styles.heroActions}>
          <a className={styles.primaryLink} href="#artikel-kajian">
            Baca Artikel
          </a>
          <a className={styles.secondaryLink} href="/bimbingan-perkawinan">
            Materi Bimbingan Perkawinan
          </a>
        </div>
      </section>

      <section className={styles.section} id="artikel-kajian">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>BELAJAR DAN BERTUMBUH</p>
          <h2>Artikel Kajian</h2>
          <p>
            Panduan praktis untuk pasangan, orang tua, calon pengantin,
            dan masyarakat yang ingin membangun keluarga yang lebih baik.
          </p>
        </div>

        <div className={styles.articleGrid}>
          {kajian.map((item, index) => (
            <article className={styles.articleCard} key={item.judul}>
              <span className={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className={styles.category}>{item.kategori}</p>
              <h3>{item.judul}</h3>
              <p className={styles.summary}>{item.ringkasan}</p>
              <details className={styles.details}>
                <summary>Baca panduan</summary>
                <ol>
                  {item.langkah.map((langkah) => (
                    <li key={langkah}>{langkah}</li>
                  ))}
                </ol>
              </details>
              <p className={styles.readingTime}>{item.durasi}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.mediaSection}`} id="podcast-video">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>BELAJAR DALAM BERBAGAI FORMAT</p>
          <h2>Podcast dan Video Edukasi</h2>
          <p>
            Konten audio dan video dapat melengkapi artikel agar materi lebih
            mudah dipelajari kapan saja.
          </p>
        </div>

        <div className={styles.mediaGrid}>
          {media.map((item) => (
            <article className={styles.mediaCard} key={item.videoId}>
              <span className={styles.mediaIcon} aria-hidden="true">
                {item.jenis === "Podcast Penyuluh" ? "♪" : "▶"}
              </span>
              <p className={styles.category}>{item.jenis}</p>
              <h3>{item.judul}</h3>
              <p>{item.keterangan}</p>
              <div className={styles.videoFrame}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${item.videoId}`}
                  title={item.judul}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <a
                className={styles.videoSource}
                href={`https://www.youtube.com/watch?v=${item.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka sumber video di YouTube
              </a>
            </article>
          ))}
        </div>
      </section>
      <div className={styles.gallerySection}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>MEDIA DARI PENGELOLA</p>
          <h2>Galeri Kajian Keluarga Sakinah</h2>
          <p>
            Dokumentasi foto dan video edukasi yang diterbitkan oleh
            pengelola KUA Panca Lautang.
          </p>
        </div>
        <KajianMediaPublik />
      </div>
      <section className={styles.help}>
        <p className={styles.eyebrow}>BUTUH PENDAMPINGAN?</p>
        <h2>Jangan ragu mencari bantuan yang tepat</h2>
        <p>
          Untuk persoalan perkawinan dan keluarga yang membutuhkan pembahasan
          lebih lanjut, hubungi KUA Kecamatan Panca Lautang. Jika terdapat
          kekerasan atau ancaman keselamatan, utamakan keselamatan dan cari
          bantuan dari layanan berwenang.
        </p>
        <a className={styles.primaryLink} href="/bimbingan-perkawinan">
          Buka Materi Bimbingan Perkawinan
        </a>
      </section>
    </main>
  );
}
