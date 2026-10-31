const crypto = require('node:crypto');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CRON_SECRET = process.env.CRON_SECRET;
const HOME_URL = 'https://m.kemenag.go.id/';
const ALLOWED_HOSTS = new Set(['kemenag.go.id', 'www.kemenag.go.id', 'm.kemenag.go.id']);
const ARTICLE_PATH = /^\/(nasional|internasional|pers-rilis|daerah|opini|feature|islam|hindu|kristen|katolik|buddha|khonghucu)\//i;
const MAX_HTML_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 4;
const FETCH_TIMEOUT_MS = 8000;

function isAuthorized(req) {
  if (!CRON_SECRET) return false;
  const actual = Buffer.from(req.headers.authorization || '');
  const expected = Buffer.from('Bearer ' + CRON_SECRET);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function cleanText(s = '') {
  return s.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ').trim();
}
function decode(s = '') { return cleanText(s); }
function absUrl(href) {
  try { return new URL(href, HOME_URL).toString(); } catch { return ''; }
}
function isAllowedKemenagUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      ALLOWED_HOSTS.has(url.hostname.toLowerCase()) &&
      !url.username && !url.password &&
      (!url.port || url.port === '443');
  } catch {
    return false;
  }
}
function escHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function meta(html, key, attr = 'property') {
  const escapedKey = key.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&');
  const re = new RegExp(
    `<meta\\b[^>]*\\b${attr}=["']${escapedKey}["'][^>]*\\bcontent=["']([^"']*)["'][^>]*>`,
    'i'
  );
  const m = html.match(re);
  return m ? m[1].trim() : '';
}
function metaAny(html, keys) {
  for (const key of keys) {
    const value = meta(html, key, 'property') || meta(html, key, 'name');
    if (value) return value;
  }
  return '';
}
function firstImage(html) {
  return metaAny(html, ['og:image', 'twitter:image']) ||
    ((html.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || '');
}
function parseDate(html) {
  return metaAny(html, ['article:published_time', 'datePublished', 'date']);
}
function normalizeDate(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const timestamp = Date.parse(raw);
  if (!Number.isFinite(timestamp)) return null;
  const date = new Date(timestamp);
  if (date.getUTCFullYear() < 2000 || date.getTime() > Date.now() + 86400000) return null;
  return date.toISOString();
}
function discover(html) {
  const out = [];
  const seen = new Set();
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = re.exec(html))) {
    let href = absUrl(match[1]);
    const title = decode(match[2]);
    try {
      const url = new URL(href);
      if (url.hostname === 'm.kemenag.go.id' && ARTICLE_PATH.test(url.pathname)) {
        href = 'https://kemenag.go.id' + url.pathname;
      }
    } catch {}
    if (!href || !title || title.length < 20 || !isAllowedKemenagUrl(href)) continue;
    const url = new URL(href);
    if (!ARTICLE_PATH.test(url.pathname)) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    out.push({ url: href, title });
    if (out.length >= 10) break;
  }
  return out;
}

async function readLimitedBody(response) {
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (declaredLength > MAX_HTML_BYTES) throw new Error('Respons Kemenag terlalu besar.');
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_HTML_BYTES) {
        await reader.cancel();
        throw new Error('Respons Kemenag terlalu besar.');
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function getKemenagHtml(initialUrl) {
  let currentUrl = initialUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!isAllowedKemenagUrl(currentUrl)) throw new Error('URL Kemenag tidak diizinkan.');
    const response = await fetch(currentUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 KUA-Panca-Lautang-Kemenag-Sync/1.0',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location || hop === MAX_REDIRECTS) throw new Error('Pengalihan Kemenag tidak valid.');
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }
    if (!response.ok) throw new Error(`Kemenag HTTP ${response.status}`);
    const type = response.headers.get('content-type') || '';
    if (!/text\/html|application\/xhtml\+xml/i.test(type)) throw new Error('Respons Kemenag bukan halaman HTML.');
    return await readLimitedBody(response);
  }
  throw new Error('Batas pengalihan Kemenag terlampaui.');
}

function articleFrom(html, url, fallbackTitle) {
  const heading = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
  const title = decode(metaAny(html, ['og:title', 'twitter:title'])) || decode(heading) || fallbackTitle;
  const desc = decode(metaAny(html, ['og:description', 'description', 'twitter:description']));
  const imageCandidate = absUrl(firstImage(html));
  const image = isAllowedKemenagUrl(imageCandidate) ? imageCandidate : '';
  const published = normalizeDate(parseDate(html));
  if (!published || !title) return null;
  const category = (url.match(/kemenag\.go\.id\/([^/]+)\//i) || [])[1] || 'Kemenag';
  const summary = desc.slice(0, 420);
  const content = `<p>${escHtml(summary || 'Berita terbaru dari Kementerian Agama Republik Indonesia.')}</p><p><strong>Sumber resmi:</strong> Kementerian Agama Republik Indonesia.</p><p><a href="${escHtml(url)}" target="_blank" rel="noopener noreferrer">Baca berita lengkap di Kemenag →</a></p>`;
  return {
    title,
    date: published,
    category: 'Kemenag • ' + category.replace(/-/g, ' '),
    excerpt: summary,
    content,
    photoUrl: image,
    sourceUrl: url,
  };
}

async function supabase(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
    signal: AbortSignal.timeout(10000),
  });
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!response.ok) {
    console.error('Supabase sinkronisasi gagal:', response.status, typeof body === 'string' ? body.slice(0, 500) : JSON.stringify(body).slice(0, 500));
    throw new Error(`Supabase HTTP ${response.status}`);
  }
  return body;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
    if (!SUPABASE_URL || !SUPABASE_KEY || !CRON_SECRET) {
      return res.status(500).json({ ok: false, error: 'Konfigurasi sinkronisasi belum lengkap.' });
    }
    if (!isAuthorized(req)) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const home = await getKemenagHtml(HOME_URL);
    const links = discover(home);
    if (!links.length) throw new Error('Tidak menemukan tautan berita pada halaman resmi Kemenag.');

    const existing = await supabase(
      'content_items?select=source_url&source_url=not.is.null&type=eq.berita-kemenag&limit=100',
      { method: 'GET' }
    );
    const known = new Set((existing || []).map(item => item.source_url));
    const candidates = links.filter(link => !known.has(link.url)).slice(0, 6);
    const fetched = await Promise.all(candidates.map(async link => {
      try {
        const html = await getKemenagHtml(link.url);
        return articleFrom(html, link.url, link.title);
      } catch (error) {
        console.warn('Berita Kemenag dilewati:', link.url, error.message);
        return null;
      }
    }));
    const fresh = fetched.filter(Boolean);

    if (fresh.length) {
      await supabase('content_items', {
        method: 'POST',
        body: JSON.stringify(fresh.map(article => ({
          type: 'berita-kemenag',
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          event_date: article.date.slice(0, 10),
          image_url: article.photoUrl || null,
          source_url: article.sourceUrl,
          published: true,
        }))),
      });
    }

    return res.status(200).json({
      ok: true,
      found: links.length,
      inserted: fresh.length,
      message: fresh.length
        ? `${fresh.length} berita Kemenag baru ditambahkan.`
        : 'Tidak ada berita Kemenag baru yang memiliki tanggal publikasi valid.',
    });
  } catch (error) {
    console.error('Sinkronisasi Kemenag gagal:', error.message);
    return res.status(500).json({
      ok: false,
      error: 'Sinkronisasi berita Kemenag belum berhasil. Periksa log server.',
    });
  }
};
