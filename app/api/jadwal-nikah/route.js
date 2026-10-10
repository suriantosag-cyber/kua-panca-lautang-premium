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
    const supabase = getSupabaseAdmin();

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === '1';

    if (isAdmin) {
      const auth = await verifyAdminRequest(request);

      if (!auth.ok) {
        return Response.json(
          { ok: false, error: auth.error },
          { status: auth.status }
        );
      }
    }

    let query = supabase
      .from('jadwal_nikah')
      .select('*')
      .order('tanggal', { ascending: true })
      .order('waktu', { ascending: true });

    if (!isAdmin) {
      query = query.eq('status', 'tampil');
    }

    const { data, error } = await query;

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
    const auth = await verifyAdminRequest(request);

    if (!auth.ok) {
      return Response.json(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const tanggal = String(body.tanggal || '').trim();
    const waktu = String(body.waktu || '').trim();
    const pengantin = String(body.pengantin || '').trim();
    const desa = String(body.desa || '').trim();
    const lokasi = String(body.lokasi || '').trim();

    if (!tanggal || !waktu || !pengantin || !desa || !lokasi) {
      return Response.json(
        {
          ok: false,
          error: 'Tanggal, waktu, pengantin, desa, dan lokasi wajib diisi.'
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('jadwal_nikah')
      .insert({
        tanggal,
        waktu,
        pengantin,
        desa,
        lokasi,
        status: 'tampil'
      })
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
      {
        ok: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const auth = await verifyAdminRequest(request);

    if (!auth.ok) {
      return Response.json(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }


    const body = await request.json();

    if (!body.id) {
      return Response.json(
        { ok: false, error: 'ID jadwal wajib diisi.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const updateData = {};

    if (body.tanggal !== undefined) {
      updateData.tanggal = String(body.tanggal).trim();
    }

    if (body.waktu !== undefined) {
      updateData.waktu = String(body.waktu).trim();
    }

    if (body.pengantin !== undefined) {
      updateData.pengantin = String(body.pengantin).trim();
    }

    if (body.desa !== undefined) {
      updateData.desa = String(body.desa).trim();
    }

    if (body.lokasi !== undefined) {
      updateData.lokasi = String(body.lokasi).trim();
    }

    if (body.status !== undefined) {
      if (!['tampil', 'sembunyi'].includes(body.status)) {
        return Response.json(
          { ok: false, error: 'Status tidak valid.' },
          { status: 400 }
        );
      }

      updateData.status = body.status;
    }

    const { data, error } = await supabase
      .from('jadwal_nikah')
      .update(updateData)
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
      {
        ok: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const auth = await verifyAdminRequest(request);

    if (!auth.ok) {
      return Response.json(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }


    const body = await request.json();

    if (!body.id) {
      return Response.json(
        { ok: false, error: 'ID jadwal wajib diisi.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('jadwal_nikah')
      .delete()
      .eq('id', body.id);

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true
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
