import { createClient } from '@supabase/supabase-js';
import DataMasjidClient from './DataMasjidClient';

export const dynamic = 'force-dynamic';

async function getDataMasjid() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Konfigurasi Supabase server untuk direktori masjid belum lengkap.');
    return { data: [], error: 'Data belum dapat dimuat. Silakan coba lagi nanti.' };
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase
    .from('data_masjid')
    .select('id, nama, jenis, desa, kecamatan, alamat, keterangan, id_masjid, tipologi, status_tanah, luas_bangunan, tahun_berdiri, nomor_sertifikat, luas_tanah, nomor_simas, status_verifikasi_simas, latitude, longitude')
    .eq('status', 'tampil')
    .order('desa')
    .order('nama');

  if (error) {
    console.error('Gagal mengambil data masjid:', error.message);
    return { data: [], error: 'Data belum dapat dimuat. Silakan coba lagi nanti.' };
  }

  return { data: data || [], error: '' };
}

export default async function DataMasjidPage() {
  const { data, error } = await getDataMasjid();
  return <DataMasjidClient initialData={data} initialError={error} />;
}
