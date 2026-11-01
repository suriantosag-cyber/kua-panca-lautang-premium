import './globals.css';
import 'leaflet/dist/leaflet.css';
import Navbar from './components/Navbar';
import MediaSosialFooter from './components/MediaSosialFooter';
export const metadata = {
  metadataBase: new URL('https://kua-pancalautang.my.id'),

  title: {
    default: 'KUA Panca Lautang | Portal Informasi Penyuluh Agama Islam',
    template: '%s | KUA Panca Lautang',
  },

  description:
    'Portal informasi dan edukasi masyarakat yang dikelola Penyuluh Agama Islam di lingkungan KUA Kecamatan Panca Lautang, Kabupaten Sidenreng Rappang, Sulawesi Selatan. Memuat informasi layanan, jadwal nikah, bimbingan perkawinan, kegiatan, materi dakwah, dan informasi keagamaan. Bukan pengganti sistem administrasi resmi Kementerian Agama.',

  keywords: [
    'KUA Panca Lautang',
    'Kantor Urusan Agama Panca Lautang',
    'KUA Kecamatan Panca Lautang',
    'kua-pancalautang.my.id',
  ],

  openGraph: {
    title: 'KUA Panca Lautang | Portal Informasi Penyuluh Agama Islam',
    description:
      'Portal informasi dan edukasi masyarakat KUA Panca Lautang: layanan, jadwal nikah, bimbingan perkawinan, kegiatan, dan informasi keagamaan.',
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
    title: 'KUA Panca Lautang | Portal Informasi Penyuluh Agama Islam',
    description:
      'Portal informasi Penyuluh Agama Islam KUA Panca Lautang: layanan, jadwal nikah, kegiatan, dan informasi masyarakat.',
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

