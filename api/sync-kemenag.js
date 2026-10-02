const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gefbibbmqvphpwmaanzv.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_RhTlOQcwdcNJwnuqdmYMvA_2etFZF_f';
const HOME_URL = 'https://m.kemenag.go.id/';
const ALLOWED_HOSTS = new Set(['kemenag.go.id','www.kemenag.go.id','m.kemenag.go.id']);
const KEMENAG_HOST = 'https://kemenag.go.id';

function cleanText(s='') {
  return s.replace(/<script[\s\S]*?<\/script>/gi,' ')
    .replace(/<style[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;/gi,' ')
    .replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'")
    .replace(/\s+/g,' ').trim();
}
function decode(s='') { return cleanText(s); }
function absUrl(href) {
  try { return new URL(href, HOME_URL).toString(); } catch { return ''; }
}
function escHtml(s='') {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function meta(html, key, attr='property') {
  const re = new RegExp(`<meta[^>]+${attr}=["']${key.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i');
  const m = html.match(re); return m ? m[1].trim() : '';
}
function metaAny(html, keys) {
  for (const k of keys) { const a=meta(html,k,'property')||meta(html,k,'name'); if(a) return a; }
  return '';
}
function firstImage(html) {
  return metaAny(html,['og:image','twitter:image']) || ((html.match(/<img[^>]+src=["']([^"']+)["']/i)||[])[1]||'');
}
function parseDate(html) {
  return metaAny(html,['article:published_time','datePublished','date']) || '';
}
function normalizeDate(raw) {
  const d = new Date(raw);
  return isNaN(d) ? new Date().toISOString() : d.toISOString();
}
function discover(html) {
  const out=[]; const seen=new Set();
  const re=/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi; let m;
  while((m=re.exec(html))){
    let href=absUrl(m[1]);
    const title=decode(m[2]);
    try {
      const u=new URL(href);
      if(u.hostname==='m.kemenag.go.id' && /^\/(nasional|internasional|pers-rilis|daerah|opini|feature|islam|hindu|kristen|katolik|buddha|khonghucu)\//i.test(u.pathname)){
        href='https://kemenag.go.id'+u.pathname;
      }
    } catch {}
    if(!href || !title || title.length<20) continue;
    try {
      const u=new URL(href);
      if(!ALLOWED_HOSTS.has(u.hostname.toLowerCase())) continue;
      // The current Kemenag homepage is served from m.kemenag.go.id,
      // while article pages may use kemenag.go.id. Accept both.
      const path=u.pathname.replace(/\\/+$/, '');
      if(!/^\/(nasional|internasional|pers-rilis|daerah|opini|feature|islam|hindu|kristen|katolik|buddha|khonghucu)\\//i.test(path)) continue;
    } catch { continue; }
    if(seen.has(href)) continue; seen.add(href); out.push({url:href,title});
    if(out.length>=10) break;
  }
  return out;
}
async function get(url){
  const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 KUA-Panca-Lautang-Kemenag-Sync/1.0','Accept':'text/html,application/xhtml+xml'},redirect:'follow'});
  if(!r.ok) throw new Error(`Kemenag HTTP ${r.status}`); return await r.text();
}
function articleFrom(html,url,fallbackTitle){
  const title=decode(metaAny(html,['og:title','twitter:title'])) || ((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1] ? decode(RegExp.$1) : fallbackTitle);
  const desc=decode(metaAny(html,['og:description','description','twitter:description']));
  const image=absUrl(firstImage(html));
  const published=parseDate(html);
  const category=(url.match(/kemenag\.go\.id\/([^/]+)\//i)||[])[1]||'Kemenag';
  const summary=desc.slice(0,420);
  const content=`<p>${escHtml(summary || 'Berita terbaru dari Kementerian Agama Republik Indonesia.')}</p><p><strong>Sumber resmi:</strong> Kementerian Agama Republik Indonesia.</p><p><a href="${escHtml(url)}" target="_blank" rel="noopener noreferrer">Baca berita lengkap di Kemenag →</a></p>`;
  return {title,date:normalizeDate(published),category:'Kemenag • '+category.replace(/-/g,' '),excerpt:summary,content,photoUrl:image,sourceUrl:url};
}
async function supabase(path, options={}){
  const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`, 'Content-Type':'application/json',Prefer:'return=representation',...(options.headers||{})}});
  const text=await r.text(); let body; try{body=JSON.parse(text)}catch{body=text}
  if(!r.ok) throw new Error(`Supabase HTTP ${r.status}: ${typeof body==='string'?body:JSON.stringify(body)}`); return body;
}
module.exports=async function handler(req,res){
  try{
    if(req.method!=='GET' && req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
    const home=await get(HOME_URL);
    const links=discover(home);
    if(!links.length) throw new Error('Tidak menemukan tautan berita pada halaman resmi Kemenag.');
    const existing=await supabase('content_items?select=source_url&source_url=not.is.null&type=eq.berita-kemenag&limit=100',{method:'GET'});
    const known=new Set((existing||[]).map(x=>x.source_url));
    const fresh=[];
    for(const link of links){
      if(known.has(link.url)) continue;
      try{ const html=await get(link.url); const a=articleFrom(html,link.url,link.title); if(a.title) fresh.push(a); }catch(e){ console.warn('skip',link.url,e.message); }
      if(fresh.length>=6) break;
    }
    if(fresh.length){
      await supabase('content_items',{method:'POST',body:JSON.stringify(fresh.map(a=>({type:'berita-kemenag',title:a.title,excerpt:a.excerpt,content:a.content,event_date:a.date.slice(0,10),image_url:a.photoUrl||null,source_url:a.sourceUrl,published:true}))) });
    }
    return res.status(200).json({ok:true,found:links.length,inserted:fresh.length,message:fresh.length?`${fresh.length} berita Kemenag baru ditambahkan.`:'Tidak ada berita Kemenag baru.'});
  }catch(e){ return res.status(500).json({ok:false,error:e.message}); }
};
