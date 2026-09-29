import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BUCKET = 'website-files';

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Konfigurasi Supabase server belum lengkap.');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list('galeri', {
        limit: 100,
        sortBy: {
          column: 'created_at',
          order: 'desc',
        },
      });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const files = (data || [])
      .filter((item) => item.name)
      .map((item) => {
        const path = `galeri/${item.name}`;

        const { data: publicUrl } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(path);

        return {
          name: item.name,
          path,
          url: publicUrl.publicUrl,
          created_at: item.created_at,
        };
      });

    return NextResponse.json({
      ok: true,
      data: files,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Gagal mengambil galeri.',
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { ok: false, error: 'File foto belum dipilih.' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { ok: false, error: 'File harus berupa gambar.' },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: 'Ukuran foto maksimal 10 MB.' },
        { status: 400 }
      );
    }

    const extension =
      file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const safeName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${extension}`;

    const path = `galeri/${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const { data: publicUrl } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return NextResponse.json({
      ok: true,
      data: {
        name: safeName,
        path,
        url: publicUrl.publicUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Gagal mengunggah foto.',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const supabase = getSupabaseAdmin();

    const body = await request.json();
    const path = body?.path;

    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Path foto tidak ditemukan.' },
        { status: 400 }
      );
    }

    if (!path.startsWith('galeri/')) {
      return NextResponse.json(
        { ok: false, error: 'Path foto tidak valid.' },
        { status: 400 }
      );
    }

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Foto berhasil dihapus.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Gagal menghapus foto.',
      },
      { status: 500 }
    );
  }
}
