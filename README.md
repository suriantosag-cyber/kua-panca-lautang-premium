# KUA Panca Lautang — Website Premium

Website Next.js siap deploy ke Vercel untuk `kua-pancalautang.my.id`.

## Fitur
- Beranda premium, responsif, dan ringan
- Profil Penyuluh
- Kegiatan
- 1 berita terbaru dari situs resmi Kementerian Agama RI
- Materi Dakwah
- Galeri (struktur siap dikembangkan setelah website stabil)
- Laporan kegiatan
- Kontak
- Tidak menggunakan Google News
- Endpoint `/api/kemenag` mengambil berita langsung dari `kemenag.go.id`
- Cron Vercel mencoba menyegarkan sumber sekali sehari

## Jalankan
```bash
npm install
npm run dev
```

## Deploy
```bash
vercel
vercel --prod
```

Setelah deploy, tambahkan domain `kua-pancalautang.my.id` pada Vercel dan arahkan DNS Rumahweb sesuai nilai yang diberikan Vercel.

## Catatan berita Kemenag
Situs resmi Kemenag dapat berubah struktur HTML. Endpoint dibuat dengan beberapa pola pencarian dan memiliki fallback resmi agar halaman tidak blank jika sumber sedang berubah/temporer tidak dapat diambil.
