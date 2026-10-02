# KUA Panca Lautang — Website Premium

Website KUA Panca Lautang untuk `kua-pancalautang.my.id`.

## Fitur

- Beranda premium, responsif, dan ringan
- Profil Penyuluh
- Kegiatan
- Berita
- Detail berita bergaya surat kabar
- Galeri foto
- Laporan kegiatan
- Kontak
- Dashboard Admin untuk mengelola berita dan galeri
- Data berita dan galeri terhubung dengan Supabase
- AI Sahabat KUA / Tanya Anto
- Integrasi berita Kementerian Agama

## Detail Berita

- Setiap berita memiliki URL sendiri dengan format `/berita/judul-berita`.
- Tombol Berita & Foto membuka halaman/detail berita.
- URL berita dapat dibagikan dan dibuka langsung.
- Vercel dikonfigurasi dengan rewrite `/berita/:slug` ke aplikasi utama agar direct URL tidak 404.

## Berita Kementerian Agama

- Endpoint sinkronisasi tersedia melalui `/api/sync-kemenag`.
- Sistem dapat mengambil berita dari sumber resmi Kementerian Agama.
- Jika struktur halaman sumber berubah atau sumber sementara tidak tersedia, aplikasi memiliki mekanisme fallback.

## AI Sahabat KUA

- Fitur Tanya Anto / AI Sahabat KUA tersedia pada website.
- API key disimpan sebagai Environment Variable di Vercel.
- Setelah mengubah Environment Variable, lakukan Redeploy.
- Jangan menyimpan API key langsung di dalam kode atau repository.

## Supabase

Project menggunakan Supabase sebagai penyimpanan data berita dan galeri.

Pastikan konfigurasi Supabase tersedia melalui file konfigurasi yang digunakan aplikasi dan Environment Variables yang sesuai.

## Jalankan Lokal

```bash
npm install
npx serve .