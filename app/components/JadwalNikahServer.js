import { createClient } from '@supabase/supabase-js';

function getTodayMakassar() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function formatTanggal(value) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Makassar',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00+08:00`));
}

async function getJadwalNikah() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Konfigurasi Supabase jadwal nikah belum tersedia.');
    return [];
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('jadwal_nikah')
      .select('id, tanggal, waktu, pengantin, desa, lokasi')
      .eq('status', 'tampil')
      .gte('tanggal', getTodayMakassar())
      .order('tanggal', { ascending: true })
      .order('waktu', { ascending: true })
      .limit(4);

    if (error) {
      console.error('Gagal mengambil jadwal nikah:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Kesalahan saat mengambil jadwal nikah:', error);
    return [];
  }
}

export default async function JadwalNikahServer() {
  const jadwal = await getJadwalNikah();

  return (
    <section className="jadwalNikahSeo" aria-labelledby="jadwal-nikah-seo">
      <h2 id="jadwal-nikah-seo">Jadwal Nikah Terdekat</h2>
      <p>
        Informasi jadwal akad nikah mendatang di wilayah KUA Kecamatan
        Panca Lautang.
      </p>

      {jadwal.length > 0 ? (
        <div>
          {jadwal.map((item) => (
            <article key={item.id}>
              <p>{formatTanggal(item.tanggal)}</p>
              <h3>{item.pengantin || 'Nama belum tersedia'}</h3>
              <p>
                <strong>Waktu:</strong>{' '}
                {item.waktu ? `${String(item.waktu).slice(0, 5)} WITA` : 'Belum ditentukan'}
              </p>
              <p>
                <strong>Lokasi:</strong> {item.desa || '-'} - {item.lokasi || '-'}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p>Belum ada jadwal akad nikah mendatang yang tersedia.</p>
      )}

      <p>
        <a href="/jadwal-nikah">Lihat halaman Jadwal Nikah dan poster</a>
      </p>
    </section>
  );
}
