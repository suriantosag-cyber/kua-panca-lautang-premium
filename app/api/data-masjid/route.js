import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '../../../lib/admin-auth';

const ADMIN_ORIGIN = 'https://admin.kua-pancalautang.my.id';
const JENIS_VALID = ['masjid', 'mushalla'];
const STATUS_VALID = ['menunggu', 'tampil', 'ditolak'];
const SIMAS_VALID = ['belum_diverifikasi', 'terverifikasi'];
const FIELD_EDIT = [
  'nama', 'jenis', 'desa', 'kecamatan', 'alamat', 'id_masjid',
  'tipologi', 'nomor_sertifikat', 'luas_tanah', 'status_tanah',
  'luas_bangunan', 'tahun_berdiri', 'jumlah_jamaah', 'jumlah_imam',
  'jumlah_khatib', 'jumlah_muazin', 'jumlah_remaja', 'nama_pengurus',
  'no_telepon_pengurus', 'keterangan', 'status', 'nomor_simas',
  'status_verifikasi_simas', 'latitude', 'longitude',
];

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

function koordinatValid(value, min, max) {
  if (value === null || value === undefined || value === '') return true;
  const angka = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(angka) && angka >= min && angka <= max;
}

function nilaiKoordinat(value) {
  if (value === null || value === undefined || value === '') return null;
  return Number(value);
}
function koordinatBerpasanganValid(latitude, longitude) {
  const latKosong =
    latitude === null ||
    latitude === undefined ||
    String(latitude).trim() === '';

  const lonKosong =
    longitude === null ||
    longitude === undefined ||
    String(longitude).trim() === '';

  if (latKosong && lonKosong) return true;
  if (latKosong || lonKosong) return false;

  return (
    koordinatValid(latitude, -90, 90) &&
    koordinatValid(longitude, -180, 180)
  );
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

    const statusSimas = teks(body.status_verifikasi_simas) || 'belum_diverifikasi';

    if (
      !SIMAS_VALID.includes(statusSimas) ||
      !koordinatBerpasanganValid(body.latitude, body.longitude)
    ) {
      return jsonResponse(request, {
        ok: false,
        error: 'Status SIMAS atau koordinat tidak valid.',
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
        kecamatan: teks(body.kecamatan) || 'Panca Lautang',
        id_masjid: teks(body.id_masjid) || null,
        tipologi: teks(body.tipologi) || null,
        status_tanah: teks(body.status_tanah) || null,
        luas_bangunan: teks(body.luas_bangunan) || null,
        tahun_berdiri: teks(body.tahun_berdiri) || null,
        jumlah_jamaah: teks(body.jumlah_jamaah) || null,
        jumlah_imam: teks(body.jumlah_imam) || null,
        jumlah_khatib: teks(body.jumlah_khatib) || null,
        jumlah_muazin: teks(body.jumlah_muazin) || null,
        jumlah_remaja: teks(body.jumlah_remaja) || null,
        nama_pengurus: teks(body.nama_pengurus) || null,
        no_telepon_pengurus: teks(body.no_telepon_pengurus) || null,
        nomor_sertifikat: teks(body.nomor_sertifikat) || null,
        nomor_simas: teks(body.nomor_simas) || null,
        status_verifikasi_simas: teks(body.status_verifikasi_simas) || 'belum_diverifikasi',
        latitude: nilaiKoordinat(body.latitude),
        longitude: nilaiKoordinat(body.longitude),
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

    if (
      !(teks(body.status_verifikasi_simas) === '' || SIMAS_VALID.includes(teks(body.status_verifikasi_simas))) ||
      !koordinatBerpasanganValid(body.latitude, body.longitude)
    ) {
      return jsonResponse(request, {
        ok: false,
        error: 'Status SIMAS atau koordinat tidak valid.',
      }, 400);
    }

    const perubahan = {};
    for (const field of FIELD_EDIT) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        if (field === 'latitude') {
          perubahan[field] = nilaiKoordinat(body[field]);
        } else if (field === 'longitude') {
          perubahan[field] = nilaiKoordinat(body[field]);
        } else if (field === 'status_verifikasi_simas') {
          perubahan[field] = teks(body[field]) || 'belum_diverifikasi';
        } else {
          perubahan[field] = [
            'alamat', 'kecamatan', 'id_masjid', 'tipologi',
            'nomor_sertifikat', 'luas_tanah', 'status_tanah',
            'luas_bangunan', 'tahun_berdiri', 'jumlah_jamaah',
            'jumlah_imam', 'jumlah_khatib', 'jumlah_muazin',
            'jumlah_remaja', 'nama_pengurus', 'no_telepon_pengurus',
            'keterangan', 'nomor_simas',
          ].includes(field)
            ? teks(body[field]) || null
            : teks(body[field]);
        }
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
