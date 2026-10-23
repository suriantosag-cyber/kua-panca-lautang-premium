import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '../../../lib/admin-auth';

const ADMIN_ORIGIN = 'https://admin.kua-pancalautang.my.id';
const JENIS_VALID = ['masjid', 'mushalla'];
const STATUS_VALID = ['menunggu', 'tampil', 'ditolak'];
const FIELD_EDIT = ['nama', 'jenis', 'desa', 'alamat', 'nomor_sertifikat', 'luas_tanah', 'keterangan', 'status'];

function corsHeaders(request) {
  const headers = new Headers({ Vary: 'Origin' });

  if (request.headers.get('origin') === ADMIN_ORIGIN) {
    headers.set('Access-Control-Allow-Origin', ADMIN_ORIGIN);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  }

  return headers;
}

function jsonResponse(request, body, status = 200) {
  const headers = corsHeaders(request);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');

  return new Response(JSON.stringify(body), { status, headers });
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Konfigurasi Supabase server belum lengkap.');
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function periksaAdmin(request) {
  const auth = await verifyAdminRequest(request);

  if (!auth.ok) {
    return jsonResponse(
      request,
      { ok: false, error: auth.error },
      auth.status
    );
  }

  return null;
}

function teks(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function OPTIONS(request) {
  if (request.headers.get('origin') !== ADMIN_ORIGIN) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request) {
  try {
    const ditolak = await periksaAdmin(request);
    if (ditolak) return ditolak;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('data_masjid')
      .select('*')
      .order('desa')
      .order('nama');

    if (error) {
      return jsonResponse(request, {
        ok: false,
        error: 'Gagal mengambil data masjid.',
      }, 500);
    }

    return jsonResponse(request, { ok: true, data: data || [] });
  } catch (error) {
    console.error('GET data-masjid:', error);
    return jsonResponse(request, {
      ok: false,
      error: 'Terjadi kesalahan pada server.',
    }, 500);
  }
}

export async function POST(request) {
  try {
    const ditolak = await periksaAdmin(request);
    if (ditolak) return ditolak;

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(request, {
        ok: false,
        error: 'Format data JSON tidak valid.',
      }, 400);
    }

    const nama = teks(body.nama);
    const desa = teks(body.desa);
    const jenis = teks(body.jenis) || 'masjid';
    const status = teks(body.status) || 'menunggu';

    if (!nama || !desa) {
      return jsonResponse(request, {
        ok: false,
        error: 'Nama masjid dan desa wajib diisi.',
      }, 400);
    }

    if (!JENIS_VALID.includes(jenis) || !STATUS_VALID.includes(status)) {
      return jsonResponse(request, {
        ok: false,
        error: 'Jenis atau status tidak valid.',
      }, 400);
    }

    if (nama.length > 200 || desa.length > 120) {
      return jsonResponse(request, {
        ok: false,
        error: 'Nama atau desa terlalu panjang.',
      }, 400);
    }

    const supabase = getSupabaseAdmin();

    const { data: duplikat, error: cekError } = await supabase
      .from('data_masjid')
      .select('id,nama,desa')
      .ilike('nama', nama)
      .ilike('desa', desa);

    if (cekError) {
      return jsonResponse(request, {
        ok: false,
        error: 'Gagal memeriksa kemungkinan data duplikat.',
      }, 500);
    }

    if (duplikat?.length) {
      return jsonResponse(request, {
        ok: false,
        error: 'Nama dan desa tersebut sudah tercatat.',
      }, 409);
    }

    const { data, error } = await supabase
      .from('data_masjid')
      .insert({
        nama,
        desa,
        jenis,
        alamat: teks(body.alamat) || null,
        nomor_sertifikat: teks(body.nomor_sertifikat) || null,
        luas_tanah: teks(body.luas_tanah) || null,
        keterangan: teks(body.keterangan) || null,
        status,
      })
      .select()
      .single();

    if (error) {
      return jsonResponse(request, {
        ok: false,
        error: 'Gagal menyimpan data masjid.',
      }, 500);
    }

    return jsonResponse(request, { ok: true, data }, 201);
  } catch (error) {
    console.error('POST data-masjid:', error);
    return jsonResponse(request, {
      ok: false,
      error: 'Terjadi kesalahan pada server.',
    }, 500);
  }
}

export async function PATCH(request) {
  try {
    const ditolak = await periksaAdmin(request);
    if (ditolak) return ditolak;

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(request, {
        ok: false,
        error: 'Format data JSON tidak valid.',
      }, 400);
    }

    const id = teks(body.id);
    if (!id) {
      return jsonResponse(request, {
        ok: false,
        error: 'ID data wajib diisi.',
      }, 400);
    }

    const perubahan = {};
    for (const field of FIELD_EDIT) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        perubahan[field] =
          ['alamat', 'nomor_sertifikat', 'luas_tanah', 'keterangan'].includes(field)
            ? teks(body[field]) || null
            : teks(body[field]);
      }
    }

    if (!Object.keys(perubahan).length) {
      return jsonResponse(request, {
        ok: false,
        error: 'Tidak ada perubahan yang dikirim.',
      }, 400);
    }

    if (
      ('nama' in perubahan && !perubahan.nama) ||
      ('desa' in perubahan && !perubahan.desa) ||
      ('jenis' in perubahan && !JENIS_VALID.includes(perubahan.jenis)) ||
      ('status' in perubahan && !STATUS_VALID.includes(perubahan.status))
    ) {
      return jsonResponse(request, {
        ok: false,
        error: 'Nama, desa, jenis, atau status tidak valid.',
      }, 400);
    }

    perubahan.updated_at = new Date().toISOString();

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('data_masjid')
      .update(perubahan)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      return jsonResponse(request, {
        ok: false,
        error: 'Gagal memperbarui data masjid.',
      }, 500);
    }

    if (!data) {
      return jsonResponse(request, {
        ok: false,
        error: 'Data masjid tidak ditemukan.',
      }, 404);
    }

    return jsonResponse(request, { ok: true, data });
  } catch (error) {
    console.error('PATCH data-masjid:', error);
    return jsonResponse(request, {
      ok: false,
      error: 'Terjadi kesalahan pada server.',
    }, 500);
  }
}

export async function DELETE(request) {
  try {
    const ditolak = await periksaAdmin(request);
    if (ditolak) return ditolak;

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(request, {
        ok: false,
        error: 'Format data JSON tidak valid.',
      }, 400);
    }

    const id = teks(body.id);
    if (!id) {
      return jsonResponse(request, {
        ok: false,
        error: 'ID data wajib diisi.',
      }, 400);
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('data_masjid')
      .delete()
      .eq('id', id)
      .select('id,nama,desa')
      .maybeSingle();

    if (error) {
      return jsonResponse(request, {
        ok: false,
        error: 'Gagal menghapus data masjid.',
      }, 500);
    }

    if (!data) {
      return jsonResponse(request, {
        ok: false,
        error: 'Data masjid tidak ditemukan.',
      }, 404);
    }

    return jsonResponse(request, { ok: true, data });
  } catch (error) {
    console.error('DELETE data-masjid:', error);
    return jsonResponse(request, {
      ok: false,
      error: 'Terjadi kesalahan pada server.',
    }, 500);
  }
}
