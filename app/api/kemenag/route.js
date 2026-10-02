const FALLBACK = {
  title: 'Menag Suarakan Pendekatan Keagamaan untuk Jaga Lingkungan',
  url: 'https://kemenag.go.id/nasional/menag-suarakan-pendekatan-keagamaan-untuk-jaga-lingkungan-GFM95',
  date: '25 September 2026',
  source: 'Kementerian Agama Republik Indonesia'
};

function cleanText(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
}

function absoluteUrl(href) {
  try { return new URL(href, 'https://kemenag.go.id/').toString(); } catch { return ''; }
}

function extract(html) {
  const candidates = [];
  const re = /<a[^>]+href=["']([^"']*\/nasional\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) && candidates.length < 30) {
    const url = absoluteUrl(m[1]);
    const title = cleanText(m[2]);
    if (url && title && title.length > 15 && !/selengkapnya|baca/i.test(title)) candidates.push({ title, url });
  }
  return candidates[0] || null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('refresh') === '1';
  const source = process.env.KEMENAG_SOURCE_URL || 'https://kemenag.go.id/';
  try {
    const res = await fetch(source, { cache: force ? 'no-store' : 'no-store', headers: { 'User-Agent': 'KUA-Panca-Lautang/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const item = extract(html);
    if (!item) throw new Error('Tidak menemukan berita nasional pada halaman resmi Kemenag.');
    return Response.json({ ok: true, ...item, source: 'Kementerian Agama Republik Indonesia', fetchedAt: new Date().toISOString() }, { headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate=3600' } });
  } catch (error) {
    return Response.json({ ok: false, ...FALLBACK, fallback: true, error: error?.message || 'Sumber sementara tidak tersedia.', fetchedAt: new Date().toISOString() }, { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' } });
  }
}
