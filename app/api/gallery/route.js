import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BUCKET = 'website-files';
const GALLERY_FOLDER = 'galeri/website_files';

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
      .list(GALLERY_FOLDER, {
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

    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
      '.gif'
    ];

    const files = (data || [])
      .filter((item) => {
        if (!item.name) return false;

        const lowerName = item.name.toLowerCase();

        return imageExtensions.some((ext) =>
          lowerName.endsWith(ext)
        );
      })
      .map((item) => {
        const path = `${GALLERY_FOLDER}/${item.name}`;

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
export async function DELETE(request) {
  try {
    const supabase = getSupabaseAdmin();

    const body = await request.json();
    const path = body?.path;

    if (!path) {
      return NextResponse.json(
        { ok: false, error: 'Path foto tidak ditemukan.' },
        { status: 400 }
      );
    }

    // Hanya izinkan penghapusan file di folder Galeri.
    if (!path.startsWith(`${GALLERY_FOLDER}/`)) {
      return NextResponse.json(
        { ok: false, error: 'Path file tidak valid.' },
        { status: 400 }
      );
    }

    const fileName = path.split('/').pop()?.toLowerCase() || '';

    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
      '.gif'
    ];

    const isImage = imageExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!isImage) {
      return NextResponse.json(
        { ok: false, error: 'Hanya file gambar yang boleh dihapus dari Galeri.' },
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
      message: 'Foto berhasil dihapus.'
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Gagal menghapus foto.'
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

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json(
        { ok: false, error: 'File foto tidak ditemukan.' },
        { status: 400 }
      );
    }

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const originalName = file.name || 'foto';
    const lowerName = originalName.toLowerCase();

    if (!imageExtensions.some((ext) => lowerName.endsWith(ext))) {
      return NextResponse.json(
        { ok: false, error: 'File harus berupa gambar.' },
        { status: 400 }
      );
    }

    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '-');
    const fileName = `${Date.now()}-${safeName}`;
    const path = `${GALLERY_FOLDER}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false
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
        name: fileName,
        path,
        url: publicUrl.publicUrl
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Gagal mengunggah foto.'
      },
      { status: 500 }
    );
  }
}
