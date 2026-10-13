import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '../../../lib/admin-auth';

export async function GET(request) {
  try {
    const auth = await verifyAdminRequest(request);

    if (!auth.ok) {
      return Response.json(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('tahun');
    const currentYear = new Date().getFullYear();
    const year = yearParam === null ? currentYear : Number(yearParam);

    if (
      !Number.isInteger(year) ||
      year < 2000 ||
      year > currentYear + 1
    ) {
      return Response.json(
        { ok: false, error: 'Tahun laporan tidak valid.' },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json(
        { ok: false, error: 'Konfigurasi Supabase server belum lengkap.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const startDate = `${year}-01-01`;
    const endDate = `${year + 1}-01-01`;
    const pageSize = 1000;
    let offset = 0;
    let kegiatan = [];

    while (true) {
      const { data, error } = await supabase
        .from('kegiatan')
        .select(
          'id, nama_kegiatan, penyelenggara, desa, tanggal, kategori, deskripsi, status, created_at'
        )
        .eq('status', 'disetujui')
        .gte('tanggal', startDate)
        .lt('tanggal', endDate)
        .order('tanggal', { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (error) {
        return Response.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
      }

      kegiatan = kegiatan.concat(data || []);

      if (!data || data.length < pageSize) {
        break;
      }

      offset += pageSize;
    }

    return Response.json({
      ok: true,
      tahun: year,
      total: kegiatan.length,
      data: kegiatan
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: 'Terjadi kesalahan saat membuat laporan.' },
      { status: 500 }
    );
  }
}
