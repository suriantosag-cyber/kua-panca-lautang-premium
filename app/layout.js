import './globals.css';

export const metadata = {
  metadataBase: new URL('https://kua-pancalautang.my.id'),
  title: 'KUA Panca Lautang | Penyuluh Agama Islam',
  description: 'Website resmi informasi, kegiatan, materi dakwah, galeri, laporan, dan berita Kementerian Agama untuk masyarakat Panca Lautang.',
  openGraph: {
    title: 'KUA Panca Lautang | Penyuluh Agama Islam',
    description: 'Website resmi KUA Panca Lautang untuk informasi, kegiatan, galeri, dan berita.',
    url: 'https://kua-pancalautang.my.id',
    siteName: 'KUA Panca Lautang',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/kantor-kua.jpeg',
        width: 1200,
        height: 630,
        alt: 'KUA Panca Lautang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KUA Panca Lautang | Penyuluh Agama Islam',
    description: 'Website resmi KUA Panca Lautang.',
    images: ['/kantor-kua.jpeg'],
  },
};

export default function RootLayout({ children }) {
  return <html lang="id"><body>{children}</body></html>;
}
