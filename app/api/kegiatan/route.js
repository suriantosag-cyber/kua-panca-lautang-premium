import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '../../../lib/admin-auth';

const ADMIN_ORIGIN = 'https://admin.kua-pancalautang.my.id';

function corsHeaders(request) {
  const headers = new Headers({ Vary: 'Origin' });

  if (request.headers.get('origin') === ADMIN_ORIGIN) {
    headers.set('Access-Control-Allow-Origin', ADMIN_ORIGIN);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  }

  return headers;
}

function jsonResponse(request, body, status = 200) {
  const headers = corsHeaders(request);
  headers.set('Content-Type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(body), { status, headers });
}

export async function OPTIONS(request) {
  if (request.headers.get('origin') !== ADMIN_ORIGIN) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders(request)
  });
}
function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET(request) {
  try {
    const auth = await verifyAdminRequest(request);

    if (!auth.ok) {
      return jsonResponse(
        request,
        { ok: false, error: auth.error },
        auth.status
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('status', 'menunggu')
      .order('created_at', { ascending: false });

    if (error) {
      return jsonResponse(
        request,
        { ok: false, error: error.message },
        500
      );
    }

    return jsonResponse(request, {
      ok: true,
      data: data || []
    });
  } catch (error) {
    return jsonResponse(
      request,
      { ok: false, error: error.message },
      500
     );
  }
}
export async function POST(request) {
  try {
    const formData = await request.formData();

    const namaKegiatan = String(formData.get('nama_kegiatan') || '').trim();
    const penyelenggara = String(formData.get('penyelenggara') || '').trim();
    const desa = String(formData.get('desa') || '').trim();
    const lokasiLengkap = String(formData.get('lokasi_lengkap') || '').trim();
    const jamMulai = String(formData.get('jam_mulai') || '').trim() || null;
    const jamSelesai = String(formData.get('jam_selesai') || '').trim() || null;
    const tanggal = String(formData.get('tanggal') || '').trim();
    const kategori = String(formData.get('kategori') || '').trim();
    const deskripsi = String(formData.get('deskripsi') || '').trim();
    const narahubung = String(formData.get('narahubung') || '').trim();
    const foto = formData.get('foto');

    if (!namaKegiatan || !penyelenggara || !desa || !tanggal || !narahubung) {
      return jsonResponse(request, {
        ok: false,
        error: 'Data kegiatan wajib belum lengkap.'
      }, 400);
    }

    const supabase = getSupabaseAdmin();
    let fotoUrl = null;
    let uploadedPath = null;

    if (foto && typeof foto.arrayBuffer === 'function' && foto.size > 0) {
      if (!foto.type.startsWith('image/')) {
        return jsonResponse(request, {
          ok: false,
          error: 'File yang dipilih harus berupa gambar.'
        }, 400);
      }

      if (foto.size > 6 * 1024 * 1024) {
        return jsonResponse(request, {
          ok: false,
          error: 'Ukuran foto maksimal 6 MB.'
        }, 400);
      }

      const extension = foto.name && foto.name.includes('.')
        ? foto.name.split('.').pop().toLowerCase()
        : 'jpg';

      const safeExtension = /^[a-z0-9]+$/.test(extension)
        ? extension
        : 'jpg';

      const fileName = `${crypto.randomUUID()}.${safeExtension}`;
      uploadedPath = `kegiatan/${fileName}`;

      const arrayBuffer = await foto.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(uploadedPath, arrayBuffer, {
          contentType: foto.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        return jsonResponse(request, {
          ok: false,
          error: `Upload foto gagal: ${uploadError.message}`
        }, 500);
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(uploadedPath);

      fotoUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('kegiatan')
      .insert({
        nama_kegiatan: namaKegiatan,
        penyelenggara,
        desa,
        lokasi_lengkap: lokasiLengkap || null,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        tanggal,
        kategori,
        deskripsi,
        narahubung,
        foto_url: fotoUrl,
        status: 'menunggu'
      })
      .select()
      .single();

    if (error) {
      if (uploadedPath) {
        await supabase.storage.from('media').remove([uploadedPath]);
      }

      return jsonResponse(request, {
        ok: false,
        error: error.message
      }, 500);
    }

    return jsonResponse(request, {
      ok: true,
      data
    });
   } catch (error) {
    return jsonResponse(request, {
      ok: false,
      error: error.message
    }, 500);
  }
}


export async function PATCH(request) {
  try {
    const auth = await verifyAdminRequest(request);

    if (!auth.ok) {
      return jsonResponse(
        request,
        { ok: false, error: auth.error },
        auth.status
      );
    }

    const body = await request.json();

        if (!body.id || !body.status) {
      return jsonResponse(
        request,
        { ok: false, error: 'ID dan status wajib diisi.' },
        400
      );
    }

    if (!['disetujui', 'ditolak'].includes(body.status)) {
      return jsonResponse(
        request,
        { ok: false, error: 'Status tidak valid.' },
        400
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('kegiatan')
      .update({ status: body.status })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return jsonResponse(
        request,
        { ok: false, error: error.message },
        500
      );
    }

    return jsonResponse(request, {
      ok: true,
      data
    });
  } catch (error) {
    return jsonResponse(
      request,
      { ok: false, error: error.message },
      500
    );
  }
}
