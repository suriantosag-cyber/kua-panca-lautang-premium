# Penyimpanan Permanen Supabase

1. Jalankan `SUPABASE-SETUP.sql` di Supabase SQL Editor.
2. Buka Supabase > Project Settings > API.
3. Salin **Project URL** dan **Publishable/Anon key** ke `supabase-config.js`.
4. Di Supabase Authentication > Users, buat akun admin (email + password).
5. Deploy folder ini ke Vercel.

Catatan keamanan: jangan pernah menaruh `service_role` key di frontend.
Foto/PDF yang diupload dari admin menggunakan bucket Storage `media`.
Data formulir Catin disimpan terpisah agar tidak ikut terbuka sebagai data publik website.


## Perbaikan Galeri Supabase
- Bucket yang dipakai: `website-files` (public).
- Upload memakai path `upload/...` di dalam bucket `website-files`. Jika project memiliki bucket `media` dan `website-files` tidak ditemukan, website mencoba `media` otomatis.
- Setiap foto Galeri juga dicatat ke tabel `content_items` dengan `type = galeri`, `file_path`, `file_name`, `file_type`, `file_size`, dan `image_url`.
- Saat website dibuka, Galeri membaca data `type = galeri` dari `content_items`.
- File lama tidak dihapus atau dipindahkan.
