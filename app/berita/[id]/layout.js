import { createClient } from '@supabase/supabase-js';

async function getBerita(id) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data } = await supabase
    .from('news')
    .select('id, title, content, image_url, article_blocks, published_at')
    .eq('id', id)
    .single();

  return data;
}

export async function generateMetadata({ params }) {
  const berita = await getBerita(params.id);

  if (!berita) {
    return {
      title: 'Berita KUA Panca Lautang',
      description: 'Berita KUA Panca Lautang',
    };
  }

  const foto =
    berita.image_url ||
    (Array.isArray(berita.article_blocks)
      ? berita.article_blocks.find(
          (block) => block.type === 'image' && block.url
        )?.url
      : null) ||
    '/kantor-kua.jpeg';

  return {
    metadataBase: new URL('https://kua-pancalautang.my.id'),
    title: berita.title,
    description:
      berita.content?.slice(0, 160) ||
      'Berita terbaru KUA Panca Lautang.',
    openGraph: {
      title: berita.title,
      description:
        berita.content?.slice(0, 160) ||
        'Berita terbaru KUA Panca Lautang.',
      url: `https://kua-pancalautang.my.id/berita/${berita.id}`,
      siteName: 'KUA Panca Lautang',
      locale: 'id_ID',
      type: 'article',
      images: [
        {
          url: foto,
          alt: berita.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: berita.title,
      description:
        berita.content?.slice(0, 160) ||
        'Berita terbaru KUA Panca Lautang.',
      images: [foto],
    },
  };
}

export default function BeritaLayout({ children }) {
  return children;
}
