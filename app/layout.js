import './globals.css';
import Navbar from './components/Navbar';
export const metadata = {
  metadataBase: new URL('https://kua-pancalautang.my.id'),

  title: {
    default: 'KUA Panca Lautang | Kantor Urusan Agama Kecamatan Panca Lautang',
    template: '%s | KUA Panca Lautang',
  },

  description:
    'Website resmi Kantor Urusan Agama Kecamatan Panca Lautang, Kabupaten Sidenreng Rappang, Sulawesi Selatan. Informasi layanan administrasi KUA, jadwal nikah, bimbingan perkawinan, kegiatan, materi dakwah, dan informasi keagamaan.',

  keywords: [
    'KUA Panca Lautang',
    'Kantor Urusan Agama Panca Lautang',
    'KUA Kecamatan Panca Lautang',
    'kua-pancalautang.my.id',
  ],

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'KUA Panca Lautang | Kantor Urusan Agama Kecamatan Panca Lautang',
    description:
      'Website resmi KUA Panca Lautang untuk informasi layanan, jadwal nikah, bimbingan perkawinan, kegiatan, dan informasi keagamaan.',
    url: 'https://kua-pancalautang.my.id/',
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
     <body>
  <Navbar />
  {children}
</body>
  </html>
  );
}