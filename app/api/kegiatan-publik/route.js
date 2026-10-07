import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('kegiatan')
      .select(
        'id, nama_kegiatan, penyelenggara, desa, tanggal, kategori, deskripsi, narahubung, foto_url, created_at'
      )
      .eq('status', 'disetujui')
      .order('tanggal', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json(
        {
          ok: false,
          error: error.message,
          data: []
        },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      data: data || []
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error.message,
        data: []
      },
      { status: 500 }
    );
  }
}