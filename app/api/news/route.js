
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '../../../lib/admin-auth';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, data });
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

    if (!body.title || !body.title.trim()) {
      return Response.json(
        { ok: false, error: 'Judul berita wajib diisi.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('news')
      .insert({
        title: body.title.trim(),
        content: body.content || '',
        image_url: body.image_url || null,
        article_blocks: body.article_blocks || []
      })
      .select()
      .single();

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, data });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
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
        { ok: false, error: 'ID berita wajib diisi.' },
        { status: 400 }
      );
    }

    if (!body.title || !body.title.trim()) {
      return Response.json(
        { ok: false, error: 'Judul berita wajib diisi.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('news')
      .update({
        title: body.title.trim(),
        content: body.content || '',
        image_url: body.image_url || null,
        article_blocks: body.article_blocks || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, data });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
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
        { ok: false, error: 'ID berita wajib diisi.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', body.id);

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
