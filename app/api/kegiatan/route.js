import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '../../../lib/admin-auth';

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
      return Response.json(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('status', 'menunggu')
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      data: data || []
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const namaKegiatan = String(formData.get('nama_kegiatan') || '').trim();
    const penyelenggara = String(formData.get('penyelenggara') || '').trim();
    const desa = String(formData.get('desa') || '').trim();
    const tanggal = String(formData.get('tanggal') || '').trim();
    const kategori = String(formData.get('kategori') || '').trim();
    const deskripsi = String(formData.get('deskripsi') || '').trim();
    const narahubung = String(formData.get('narahubung') || '').trim();
    const foto = formData.get('foto');

        if (
      !namaKegiatan ||
      !penyelenggara ||
      !desa ||
      !tanggal ||
      !narahubung
    ) {
      return Response.json(
        {
          ok: false,
          error: 'Data kegiatan wajib belum lengkap.'
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    let fotoUrl = null;
    let uploadedPath = null;

    if (foto && typeof foto.arrayBuffer === 'function' && foto.size > 0) {
      if (!foto.type.startsWith('image/')) {
        return Response.json(
          {
            ok: false,
            error: 'File yang dipilih harus berupa gambar.'
          },
          { status: 400 }
        );
      }

      if (foto.size > 6 * 1024 * 1024) {
        return Response.json(
          {
            ok: false,
            error: 'Ukuran foto maksimal 6 MB.'
          },
          { status: 400 }
        );
      }

      const extension =
        foto.name && foto.name.includes('.')
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
        return Response.json(
          {
            ok: false,
            error: `Upload foto gagal: ${uploadError.message}`
          },
          { status: 500 }
        );
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
        await supabase.storage
          .from('media')
          .remove([uploadedPath]);
      }

      return Response.json(
        {
          ok: false,
          error: error.message
        },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      data
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}


export async function PATCH(request) {
  try {
    const auth = await verifyAdminRequest(request);

    if (!auth.ok) {
      return Response.json(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();

    if (!body.id || !body.status) {
      return Response.json(
        { ok: false, error: 'ID dan status wajib diisi.' },
        { status: 400 }
      );
    }

    if (!['disetujui', 'ditolak'].includes(body.status)) {
      return Response.json(
        { ok: false, error: 'Status tidak valid.' },
        { status: 400 }
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
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      data
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
