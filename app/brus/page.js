export const metadata = {
  title: "Bimbingan Remaja Usia Sekolah (BRUS) | KUA Panca Lautang",
  description:
    "Materi Bimbingan Remaja Usia Sekolah dari KUA Kecamatan Panca Lautang tentang akhlak, pergaulan sehat, literasi digital, tanggung jawab, dan perencanaan masa depan.",
};

const materi = [
  {
    judul: "1. Mengenali Potensi dan Jati Diri",
    pengantar:
      "Masa remaja merupakan kesempatan untuk mengenali kemampuan, membangun karakter, dan belajar mengambil keputusan yang bertanggung jawab.",
    poin: [
      {
        subjudul: "Kenali kelebihan dan hal yang perlu dikembangkan",
        isi: "Hargai keunikan diri, temukan minat yang positif, dan jadikan kekurangan sebagai kesempatan untuk belajar. Tidak perlu mengukur harga diri hanya berdasarkan penampilan atau perbandingan dengan teman.",
      },
      {
        subjudul: "Bangun kebiasaan baik",
        isi: "Latih disiplin, kejujuran, tanggung jawab, rasa hormat, dan kepedulian. Kebiasaan kecil yang dilakukan secara konsisten membantu membentuk karakter.",
      },
    ],
  },
  {
    judul: "2. Akhlak Mulia dan Nilai Keagamaan",
    pengantar:
      "Nilai agama dan akhlak dapat menjadi pedoman untuk memperlakukan diri sendiri dan orang lain dengan baik.",
    poin: [
      {
        subjudul: "Hormati orang tua, guru, dan sesama",
        isi: "Biasakan berbicara santun, mendengarkan pendapat, menepati janji, serta meminta maaf ketika melakukan kesalahan.",
      },
      {
        subjudul: "Latih kepedulian dan tanggung jawab",
        isi: "Tunjukkan kepedulian melalui bantuan yang wajar, sikap adil, dan kesediaan menjaga lingkungan. Berani mengakui kesalahan merupakan bagian dari kedewasaan.",
      },
    ],
  },
  {
    judul: "3. Pergaulan Sehat dan Batasan Diri",
    pengantar:
      "Pertemanan yang sehat membuat seseorang merasa dihargai, aman, dan didukung untuk berkembang menjadi lebih baik.",
    poin: [
      {
        subjudul: "Pilih lingkungan pertemanan yang positif",
        isi: "Bertemanlah dengan orang yang saling menghargai, mendukung pendidikan, dan tidak memaksa melakukan hal yang bertentangan dengan nilai serta keselamatan diri.",
      },
      {
        subjudul: "Berani mengatakan tidak",
        isi: "Kamu berhak menolak ajakan yang membuat tidak nyaman atau membahayakan. Jika menghadapi tekanan, ancaman, pelecehan, atau kekerasan, carilah bantuan orang dewasa tepercaya, guru, orang tua, atau petugas yang berwenang.",
      },
      {
        subjudul: "Hormati batasan dan persetujuan",
        isi: "Jangan memaksa, mengintimidasi, menyentuh, atau menyebarkan informasi pribadi orang lain tanpa izin. Perlakukan teman dengan hormat, baik secara langsung maupun melalui internet.",
      },
    ],
  },
  {
    judul: "4. Bijak Menggunakan Media Digital",
    pengantar:
      "Internet dapat membantu belajar dan berkarya, tetapi penggunaannya perlu disertai sikap kritis, etika, dan perlindungan privasi.",
    poin: [
      {
        subjudul: "Pikirkan sebelum mengunggah",
        isi: "Periksa kebenaran informasi sebelum membagikannya. Hindari menyebarkan fitnah, perundungan, konten yang merugikan, atau data pribadi diri sendiri dan orang lain.",
      },
      {
        subjudul: "Jaga keamanan akun dan privasi",
        isi: "Gunakan kata sandi yang kuat, jangan membagikan kode rahasia, dan berhati-hatilah terhadap orang atau tautan yang tidak dikenal. Minta bantuan orang dewasa tepercaya jika menemukan konten atau pesan yang mengancam.",
      },
    ],
  },
  {
    judul: "5. Pendidikan, Cita-Cita, dan Masa Depan",
    pengantar:
      "Masa depan dibangun melalui proses belajar, tujuan yang realistis, kebiasaan positif, dan dukungan dari lingkungan yang baik.",
    poin: [
      {
        subjudul: "Tetapkan tujuan bertahap",
        isi: "Tuliskan cita-cita dan langkah sederhana untuk mencapainya. Atur waktu belajar, istirahat, ibadah, aktivitas keluarga, dan kegiatan yang mengembangkan keterampilan.",
      },
      {
        subjudul: "Berani meminta bimbingan",
        isi: "Bicarakan kesulitan belajar atau persoalan pribadi dengan orang tua, guru BK, wali kelas, penyuluh agama, atau orang dewasa tepercaya. Meminta bantuan adalah langkah yang baik.",
      },
      {
        subjudul: "Jaga kesehatan dan keseimbangan",
        isi: "Usahakan tidur cukup, beraktivitas fisik, makan dengan baik, dan menyediakan waktu untuk kegiatan positif. Jika merasa tertekan atau tidak aman, jangan hadapi semuanya sendirian.",
      },
    ],
  },
];

export default function BrusPage() {
  return (
    <main className="bimwin-page">
      <section className="bimwin-hero">
        <p className="bimwin-label">LAYANAN EDUKASI REMAJA</p>
        <h1>Bimbingan Remaja Usia Sekolah (BRUS)</h1>
        <p>
          Ruang belajar bagi remaja untuk mengenali potensi diri, membangun
          akhlak mulia, menjaga pergaulan sehat, menggunakan media digital
          secara bijak, dan merencanakan masa depan.
        </p>
      </section>

      <section className="bimwin-content">
        <h2>Materi Bimbingan Remaja</h2>
        <p className="bimwin-intro">
          Pilih topik untuk membaca penjelasan dan panduan praktis.
        </p>

        <div className="bimwin-list">
          {materi.map((item) => (
            <details className="bimwin-item" key={item.judul}>
              <summary>{item.judul}</summary>
              <div className="bimwin-detail">
                <p>{item.pengantar}</p>
                {item.poin.map((poin) => (
                  <section key={poin.subjudul}>
                    <h3>{poin.subjudul}</h3>
                    <p>{poin.isi}</p>
                  </section>
                ))}
              </div>
            </details>
          ))}
        </div>

        <aside className="bimwin-note">
          <h2>Butuh Pendampingan?</h2>
          <p>
            Jika kamu menghadapi persoalan atau membutuhkan bimbingan,
            bicaralah dengan orang tua, guru, penyuluh agama, atau orang dewasa
            tepercaya. Jika ada ancaman atau kekerasan, prioritaskan keselamatan
            dan segera cari pertolongan.
          </p>
          <p>
            Materi ini bersifat edukatif. Pelaksanaan kegiatan BRUS dapat
            disesuaikan dengan kebutuhan peserta, sekolah, dan koordinasi
            dengan pihak terkait.
          </p>
          <a className="btn primary" href="/">
            Kembali ke Halaman Utama
          </a>
        </aside>
      </section>
    </main>
  );
}
