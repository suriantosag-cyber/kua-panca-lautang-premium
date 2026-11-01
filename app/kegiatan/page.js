import { createClient } from '@supabase/supabase-js';
import KegiatanClient from './KegiatanClient';

export const dynamic = 'force-dynamic';

async function getKegiatanPublik() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Konfigurasi Supabase server belum tersedia untuk daftar kegiatan.');
    return [];
  }

  try {
    const supabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    const { data, error } = await supabase
      .from('kegiatan')
      .select('id, nama_kegiatan, penyelenggara, desa, tanggal, kategori, deskripsi, narahubung, foto_url, created_at')
      .eq('status', 'disetujui')
      .order('tanggal', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal mengambil kegiatan publik:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Kesalahan saat memuat kegiatan publik:', error);
    return [];
  }
}

export default async function KegiatanPage() {
  const initialKegiatan = await getKegiatanPublik();
  return <KegiatanClient initialKegiatan={initialKegiatan} />;
}
