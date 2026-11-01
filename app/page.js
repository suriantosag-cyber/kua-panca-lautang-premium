import { createClient } from '@supabase/supabase-js';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

async function getLatestNews() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Konfigurasi Supabase belum tersedia untuk berita beranda.');
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
      .from('news')
      .select('id, title, content, image_url, article_blocks, published_at')
      .order('published_at', { ascending: false })
      .limit(9);

    if (error) {
      console.error('Gagal mengambil berita beranda:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Kesalahan saat memuat berita beranda:', error);
    return [];
  }
}

export default async function Page() {
  const initialNews = await getLatestNews();
  return <HomeClient initialNews={initialNews} />;
}
