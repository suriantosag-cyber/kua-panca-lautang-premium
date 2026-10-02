BERITA KEMENAG OTOMATIS - MODEL B RINGKASAN AMAN

Fungsi:
- Mengambil berita terbaru langsung dari situs resmi Kementerian Agama RI.
- Menyimpan judul, tanggal, gambar, ringkasan, dan URL sumber ke Supabase.
- Menampilkan berita otomatis di bagian Berita & kegiatan website KUA.
- Halaman detail tetap bergaya surat kabar dan menyediakan tautan Baca di Kemenag.
- Cron Vercel berjalan 1x sehari (09.00 WITA, sekitar +/- 1 jam pada Hobby).
- Admin dapat menekan tombol "Sinkron Kemenag" untuk menjalankan sinkronisasi manual.

SETUP SATU KALI:
1. Supabase project: gefbibbmqvphpwmaanzv
2. Buka SQL Editor.
3. Jalankan isi file KEMENAG-AUTO-SETUP.sql satu kali.
4. Deploy folder ini ke project Vercel yang sama.

Catatan hak cipta:
Sistem menyimpan ringkasan singkat dan tautan ke sumber resmi, bukan menyalin penuh artikel Kemenag.


PERBAIKAN V2:
- Sinkronisasi diperbaiki agar menerima homepage m.kemenag.go.id dan tautan artikel Kemenag pada domain utama.
- Tautan artikel mobile dinormalisasi ke kemenag.go.id.
- Tidak menggunakan Google News.
