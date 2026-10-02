-- Jalankan SEKALI di Supabase SQL Editor project gefbibbmqvphpwmaanzv.
alter table public.content_items add column if not exists source_url text;
create unique index if not exists content_items_source_url_uq
  on public.content_items(source_url) where source_url is not null;
drop policy if exists "public insert kemenag sync" on public.content_items;
create policy "public insert kemenag sync" on public.content_items
for insert to anon, authenticated
with check (type = 'berita-kemenag' and source_url like 'https://kemenag.go.id/%');
notify pgrst, 'reload schema';
