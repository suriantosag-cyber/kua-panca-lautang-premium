import Link from 'next/link';

const posterUrl = 'https://kua-pancalautang.my.id/poster/poster-pengantin.png';
const shareUrl = 'https://kua-pancalautang.my.id/jadwal-nikah';

export const metadata = {
  title: 'Jadwal Nikah | KUA Panca Lautang',
  description: 'Informasi jadwal akad nikah KUA Kecamatan Panca Lautang.',
  alternates: {
    canonical: shareUrl,
  },
  openGraph: {
    title: 'Jadwal Nikah KUA Panca Lautang',
    description: 'Lihat informasi jadwal akad nikah dan poster jadwal KUA Panca Lautang.',
    url: shareUrl,
    siteName: 'KUA Panca Lautang',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: posterUrl,
        alt: 'Poster Jadwal Nikah KUA Panca Lautang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jadwal Nikah KUA Panca Lautang',
    description: 'Informasi jadwal akad nikah KUA Panca Lautang.',
    images: [posterUrl],
  },
};

export default function JadwalNikahSharePage() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', textAlign: 'center' }}>
      <h1>Jadwal Nikah KUA Panca Lautang</h1>
      <p>Informasi jadwal akad nikah di wilayah Kecamatan Panca Lautang.</p>
      <img
        src="/poster/poster-pengantin.png"
        alt="Poster Jadwal Nikah KUA Panca Lautang"
        style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 12 }}
      />
      <p>
        <Link href="/">Kembali ke website KUA Panca Lautang</Link>
      </p>
    </main>
  );
}
