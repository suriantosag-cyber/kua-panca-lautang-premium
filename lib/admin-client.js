import { supabaseBrowser } from './supabase-browser';

export async function adminFetch(url, options = {}) {
  const { data: { session }, error } =
    await supabaseBrowser.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error('Sesi admin berakhir. Silakan login kembali.');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${session.access_token}`);

  return fetch(url, {
    ...options,
    headers,
  });
}
