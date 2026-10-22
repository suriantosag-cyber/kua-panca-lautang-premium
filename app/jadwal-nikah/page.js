import Link from 'next/link';
import JadwalNikahLengkap from '../components/JadwalNikahLengkap';

const shareUrl = 'https://kua-pancalautang.my.id/jadwal-nikah';

export const metadata = {
  title: 'Jadwal Nikah | KUA Panca Lautang',
  description: 'Informasi jadwal akad nikah terbaru KUA Kecamatan Panca Lautang.',
  alternates: { canonical: shareUrl },
  openGraph: {
    title: 'Jadwal Nikah KUA Panca Lautang',
    description: 'Lihat jadwal akad nikah terdekat di Kecamatan Panca Lautang.',
    url: shareUrl,
    siteName: 'KUA Panca Lautang',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Jadwal Nikah KUA Panca Lautang',
    description: 'Informasi jadwal akad nikah terbaru.',
  },
};

export default function JadwalNikahSharePage() {
  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
      <p style={{ marginBottom: 12 }}>
        <Link href="/">← Kembali ke website KUA Panca Lautang</Link>
      </p>
      <JadwalNikahLengkap />
    </main>
  );
}
