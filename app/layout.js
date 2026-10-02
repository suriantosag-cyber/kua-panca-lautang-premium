import './globals.css';

export const metadata = {
  title: 'KUA Panca Lautang | Penyuluh Agama Islam',
  description: 'Website resmi informasi, kegiatan, materi dakwah, galeri, laporan, dan berita Kementerian Agama untuk masyarakat Panca Lautang.',
};

export default function RootLayout({ children }) {
  return <html lang="id"><body>{children}</body></html>;
}
