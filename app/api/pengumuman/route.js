import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '../../../lib/admin-auth';

function getSupabaseAdmin() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Konfigurasi Supabase server belum lengkap.');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const DEFAULT_DATA = {
  id: 1,
  judul: 'PENGUMUMAN KUA PANCA LAUTANG',
  isi: 'Mohon pastikan dokumen persyaratan lengkap sebelum mengurus layanan di KUA.',
  aktif: true,
};

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('pengumuman')
      .select('id, judul, isi, aktif, diperbarui_pada')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      data: data || DEFAULT_DATA,
    });
  } catch (error) {
    console.error('GET pengumuman:', error);
    return NextResponse.json(
      { ok: false, error: 'Pengumuman gagal dimuat.' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const auth = await verifyAdminRequest(request);

  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json();
    const judul = typeof body.judul === 'string' ? body.judul.trim() : '';
    const isi = typeof body.isi === 'string' ? body.isi.trim() : '';
    const aktif = body.aktif;

    if (!judul || !isi || typeof aktif !== 'boolean') {
      return NextResponse.json(
        { ok: false, error: 'Judul, isi, dan status aktif wajib diisi.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('pengumuman')
      .upsert(
        {
          id: 1,
          judul,
          isi,
          aktif,
          diperbarui_pada: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select('id, judul, isi, aktif, diperbarui_pada')
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('PUT pengumuman:', error);
    return NextResponse.json(
      { ok: false, error: 'Pengumuman gagal disimpan.' },
      { status: 500 }
    );
  }
}
