

import { createClient } from '@supabase/supabase-js';
export async function verifyAdminRequest(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : '';

  if (!token) {
    return {
      ok: false,
      status: 401,
      error: 'Silakan login terlebih dahulu.',
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!supabaseUrl || !anonKey || !adminEmail) {
    return {
      ok: false,
      status: 500,
      error: 'Konfigurasi autentikasi admin belum lengkap.',
    };
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return {
      ok: false,
      status: 401,
      error: 'Sesi login tidak valid atau sudah berakhir.',
    };
  }

  if (data.user.email?.trim().toLowerCase() !== adminEmail) {
    return {
      ok: false,
      status: 403,
      error: 'Akun ini tidak memiliki akses admin.',
    };
  }

  return {
    ok: true,
    user: data.user,
  };
}
