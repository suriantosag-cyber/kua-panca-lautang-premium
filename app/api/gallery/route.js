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
