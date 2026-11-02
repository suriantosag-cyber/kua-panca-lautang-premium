import './globals.css';
import Navbar from './components/Navbar';
import MediaSosialFooter from './components/MediaSosialFooter';
export const metadata = {
  metadataBase: new URL('https://kua-pancalautang.my.id'),

  title: {
    default: 'Portal Resmi KUA Kecamatan Panca Lautang - Kab. Sidrap',
    template: '%s | KUA Panca Lautang',
  },

  description:
    'Layanan pendaftaran nikah, bimbingan perkawinan, konsultasi keagamaan, zakat, wakaf, dan penyuluhan agama Islam di Kecamatan Panca Lautang, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan.',

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
    title: 'Portal Resmi KUA Kecamatan Panca Lautang - Kab. Sidrap',
    description:
      'Layanan pendaftaran nikah, bimbingan perkawinan, konsultasi keagamaan, zakat, wakaf, dan penyuluhan agama Islam di Panca Lautang, Sidenreng Rappang.',
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
      'Layanan pendaftaran nikah, bimbingan perkawinan, konsultasi keagamaan, zakat, wakaf, dan penyuluhan agama Islam di Panca Lautang, Sidenreng Rappang.',
    images: ['/kantor-kua.jpeg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
     <body>
  <Navbar />
  {children}
  <MediaSosialFooter />
</body>
  </html>
  );
}