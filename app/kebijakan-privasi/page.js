import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan Privasi Portal Informasi KUA Kecamatan Panca Lautang tentang pengumpulan, penggunaan, penyimpanan, dan perlindungan data pengunjung.",
  alternates: {
    canonical: "/kebijakan-privasi",
  },
};

const sections = [
  {
    title: "1. Pengelola Situs",
    body: (
      <p>
        Kebijakan ini berlaku untuk Portal Informasi KUA Kecamatan Panca Lautang
        di <strong>kua-pancalautang.my.id</strong>, yang dikelola oleh Penyuluh
        Agama Islam di lingkungan KUA Kecamatan Panca Lautang, Kabupaten
        Sidenreng Rappang. Portal ini menyediakan informasi, edukasi, dokumentasi,
        dan fasilitas pengajuan layanan. Portal ini bukan pengganti sistem
        administrasi resmi Kementerian Agama.
      </p>
    ),
  },
  {
    title: "2. Informasi yang Kami Terima",
    body: (
      <>
        <p>Data yang dapat Anda berikan secara langsung melalui formulir layanan meliputi:</p>
        <ul>
          <li>Nama pemohon dan nomor telepon/WhatsApp.</li>
          <li>Alamat email jika Anda memilih untuk mengisinya.</li>
          <li>Desa atau kelurahan, jenis layanan, dan uraian keperluan.</li>
          <li>Catatan tambahan yang Anda kirimkan secara sukarela.</li>
        </ul>
        <p>
          Saat pengajuan diterima, sistem membuat kode pelacakan dan PIN. PIN
          disimpan dalam bentuk hash menggunakan mekanisme <em>scrypt</em>, bukan
          sebagai PIN terbaca. Untuk membatasi penyalahgunaan formulir dan
          pemeriksaan status, sistem juga memproses alamat IP dalam bentuk nilai
          hash sebagai kunci pembatasan percobaan.
        </p>
        <p>
          Seperti layanan web pada umumnya, penyedia hosting dapat memproses
          informasi teknis permintaan seperti waktu akses, alamat IP, jenis
          perangkat/peramban, dan catatan keamanan sesuai layanan dan
          konfigurasi infrastrukturnya.
        </p>
      </>
    ),
  },
  {
    title: "3. Tujuan Penggunaan Data",
    body: (
      <>
        <p>Informasi digunakan seperlunya untuk:</p>
        <ul>
          <li>Menerima, memeriksa, dan menindaklanjuti permohonan layanan.</li>
          <li>Menghubungkan pemohon dengan petugas yang menangani layanan.</li>
          <li>Menampilkan status dan riwayat pengajuan setelah kode pelacakan serta PIN yang benar diverifikasi.</li>
          <li>Menjaga keamanan, mencegah spam, dan mengatasi gangguan teknis.</li>
          <li>Memenuhi kewajiban hukum atau permintaan sah dari pihak berwenang.</li>
        </ul>
        <p>
          Kami tidak meminta Anda mengirimkan kata sandi akun pribadi, PIN
          perbankan, atau informasi sensitif lain yang tidak diperlukan untuk
          layanan KUA.
        </p>
      </>
    ),
  },
  {
    title: "4. Penyimpanan dan Perlindungan",
    body: (
      <p>
        Data permohonan disimpan pada basis data yang digunakan oleh situs untuk
        menjalankan layanan. Infrastruktur aplikasi menggunakan layanan hosting
        Vercel dan basis data Supabase. Akses administratif dibatasi untuk
        pengelola yang berwenang dan sistem menerapkan langkah pengamanan
        teknis, termasuk pembatasan percobaan serta penyimpanan PIN dalam bentuk
        hash. Tidak ada sistem transmisi atau penyimpanan daring yang dapat
        dijamin aman sepenuhnya. Data disimpan selama diperlukan untuk
        penanganan layanan, administrasi, keamanan, dan pemenuhan kewajiban
        yang berlaku.
      </p>
    ),
  },
  {
    title: "5. Pengungkapan kepada Pihak Lain",
    body: (
      <p>
        Kami tidak menjual data pribadi pengunjung. Data hanya dapat diproses
        oleh penyedia infrastruktur yang mendukung operasional situs, petugas
        yang berwenang menangani permohonan, atau diungkapkan apabila diwajibkan
        oleh ketentuan hukum dan permintaan resmi yang sah. Kami tidak
        mengendalikan kebijakan privasi situs pihak ketiga yang ditautkan dari
        portal ini.
      </p>
    ),
  },
  {
    title: "6. Cookie dan Teknologi Serupa",
    body: (
      <p>
        Fitur tertentu dan layanan pihak ketiga dapat menggunakan cookie atau
        teknologi serupa untuk fungsi, keamanan, preferensi, pengukuran, atau
        penyajian layanan. Pengaturan cookie dapat dikelola melalui peramban
        Anda, meskipun menonaktifkan cookie tertentu dapat memengaruhi fungsi
        layanan. Jika layanan analitik atau iklan pihak ketiga diaktifkan,
        penyedia layanan tersebut dapat memproses data sesuai kebijakan dan
        pengaturan privasinya.
      </p>
    ),
  },
  {
    title: "7. Informasi Iklan Google",
    body: (
      <p>
        Apabila Google AdSense atau produk iklan Google digunakan pada situs
        ini, Google dan mitranya dapat menggunakan cookie atau teknologi
        serupa untuk menayangkan, membatasi frekuensi, mengukur, dan
        mempersonalisasi iklan sesuai pengaturan serta persetujuan yang berlaku.
        Pengunjung dapat mempelajari dan mengelola personalisasi iklan melalui
        <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer"> Pusat Iklan Google</a>
        {" "}serta membaca
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer"> informasi teknologi iklan Google</a>.
        Ketentuan ini menjelaskan kemungkinan penggunaan layanan iklan dan
        bukan pernyataan bahwa iklan selalu ditayangkan pada setiap kunjungan.
      </p>
    ),
  },
  {
    title: "8. Tautan dan Layanan Eksternal",
    body: (
      <p>
        Portal dapat memuat tautan menuju layanan resmi atau pihak ketiga,
        termasuk SIMKAH, peta, media sosial, dan informasi Kementerian Agama.
        Ketika Anda membuka layanan tersebut, pemrosesan data mengikuti
        kebijakan privasi penyedia yang bersangkutan. Periksa kebijakan mereka
        sebelum memberikan informasi pribadi.
      </p>
    ),
  },
  {
    title: "9. Hak dan Pilihan Pengunjung",
    body: (
      <p>
        Anda dapat meminta informasi mengenai data permohonan yang pernah
        disampaikan, mengoreksi data yang tidak tepat, atau menyampaikan
        pertanyaan terkait privasi melalui kontak KUA. Permintaan akan
        diverifikasi secara wajar untuk melindungi data pemohon dan tidak
        mengesampingkan kewajiban penyimpanan yang ditentukan oleh hukum atau
        kebutuhan administrasi layanan.
      </p>
    ),
  },
  {
    title: "10. Perubahan Kebijakan",
    body: (
      <p>
        Kebijakan ini dapat diperbarui apabila fitur, proses pengelolaan data,
        atau ketentuan yang berlaku berubah. Versi terbaru akan ditampilkan pada
        halaman ini beserta tanggal pembaruannya.
      </p>
    ),
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <main className="privacy-page">
      <header className="privacy-hero">
        <span className="privacy-eyebrow">TRANSPARANSI DAN PERLINDUNGAN DATA</span>
        <h1>Kebijakan Privasi</h1>
        <p>
          Penjelasan mengenai informasi yang diterima situs, tujuan
          penggunaannya, serta cara kami menjaga dan mengelolanya.
        </p>
        <span className="privacy-updated">Terakhir diperbarui: 1 November 2026</span>
      </header>

      <article className="privacy-content">
        <div className="privacy-intro">
          Dengan menggunakan portal atau mengirimkan formulir layanan, Anda
          dianggap telah membaca penjelasan ini. Mohon jangan mengirimkan
          informasi pribadi yang tidak diperlukan.
        </div>

        {sections.map((section) => (
          <section className="privacy-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.body}
          </section>
        ))}

        <section className="privacy-contact">
          <h2>Kontak Privasi</h2>
          <p>
            Untuk pertanyaan atau koreksi terkait data, hubungi KUA Kecamatan
            Panca Lautang melalui kanal kontak yang tersedia pada situs.
          </p>
          <div className="privacy-actions">
            <a href="https://wa.me/6282132244214" target="_blank" rel="noopener noreferrer">WhatsApp 0821-3224-4214</a>
            <a href="https://wa.me/6281355495872" target="_blank" rel="noopener noreferrer">WhatsApp 0813-5549-5872</a>
            <Link href="/#kontak">Lihat halaman kontak</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
