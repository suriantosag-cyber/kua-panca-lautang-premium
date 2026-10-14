import './globals.css';

export const metadata = {
  metadataBase: new URL('https://kua-pancalautang.my.id'),

  title: 'KUA Panca Lautang | Kantor Urusan Agama Kecamatan Panca Lautang',

  description:
    'Website resmi KUA Kecamatan Panca Lautang, Kantor Urusan Agama di Panca Lautang. Informasi layanan KUA, jadwal nikah, kegiatan, berita, materi dakwah, galeri, dan informasi Kementerian Agama.',

  keywords: [
    'KUA Panca Lautang',
    'Kantor Urusan Agama Panca Lautang',
    'KUA Kecamatan Panca Lautang',
    'kua-pancalautang.my.id',
  ],

  openGraph: {
    title: 'KUA Panca Lautang | Kantor Urusan Agama Kecamatan Panca Lautang',
    description:
      'Website resmi KUA Panca Lautang untuk informasi layanan, jadwal nikah, kegiatan, dan berita Kementerian Agama.',
    url: 'https://kua-pancalautang.my.id',
    siteName: 'KUA Panca Lautang',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/kantor-kua.jpeg',
        width: 1200,
        height: 630,
        alt: 'Kantor Urusan Agama Kecamatan Panca Lautang',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'KUA Panca Lautang | Kantor Urusan Agama Kecamatan Panca Lautang',
    description:
      'Website resmi KUA Panca Lautang: layanan, jadwal nikah, kegiatan, dan informasi masyarakat.',
    images: ['/kantor-kua.jpeg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}