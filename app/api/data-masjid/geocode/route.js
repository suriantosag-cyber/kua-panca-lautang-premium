
import { verifyAdminRequest } from '../../../../lib/admin-auth';

const ADMIN_ORIGIN = 'https://kua-pancalautang.my.id';

function originDiizinkan(origin) {
  if (origin === ADMIN_ORIGIN) return true;

  return (
    process.env.NODE_ENV === 'development' &&
    (origin === 'http://localhost:3001' ||
      origin === 'http://127.0.0.1:3001')
  );
}

function jsonResponse(request, body, status = 200) {
  const origin = request.headers.get('origin');
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  });

  if (originDiizinkan(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set(
      'Access-Control-Allow-Headers',
      'Authorization, Content-Type'
    );
  }

  return Response.json(body, { status, headers });
}

export async function OPTIONS(request) {
  const origin = request.headers.get('origin');

  if (!originDiizinkan(origin)) {
    return new Response(null, { status: 403 });
  }

  const headers = new Headers({
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    Vary: 'Origin',
  });

  return new Response(null, { status: 204, headers });
}

export async function POST(request) {
  try {
    if (!originDiizinkan(request.headers.get('origin'))) {
      return jsonResponse(request, {
        ok: false,
        error: 'Asal permintaan tidak diizinkan.',
      }, 403);
    }

    const auth = await verifyAdminRequest(request);

    if (!auth.ok) {
      return jsonResponse(request, {
        ok: false,
        error: auth.error || 'Akses admin diperlukan.',
      }, auth.status || 401);
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return jsonResponse(request, {
        ok: false,
        error: 'Data pencarian tidak valid.',
      }, 400);
    }

    const nama = typeof body.nama === 'string' ? body.nama.trim() : '';
    const desa = typeof body.desa === 'string' ? body.desa.trim() : '';

    if (!nama || !desa || nama.length > 200 || desa.length > 150) {
      return jsonResponse(request, {
        ok: false,
        error: 'Nama masjid dan desa wajib diisi.',
      }, 400);
    }

    const query = [
      nama,
      desa,
      'Panca Lautang',
      'Sidenreng Rappang',
      'Sulawesi Selatan',
      'Indonesia',
    ].join(', ');

    const url = new URL('https://nominatim.openstreetmap.org/search');

    url.searchParams.set('q', query);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '5');
    url.searchParams.set('countrycodes', 'id');
    url.searchParams.set('addressdetails', '1');

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'KUA-Panca-Lautang-Website/1.0',
        'Accept-Language': 'id',
      },
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });

    if (!response.ok) {
      return jsonResponse(request, {
        ok: false,
        error: 'Layanan pencarian lokasi sedang tidak tersedia.',
      }, 502);
    }

    const hasil = await response.json();

    const kandidat = hasil.map((item) => ({
      namaLokasi: item.display_name,
      latitude: Number(item.lat),
      longitude: Number(item.lon),
      tipe: item.type || '',
      sumber: 'OpenStreetMap',
    }));

    return jsonResponse(request, { ok: true, kandidat });
  } catch (error) {
    console.error('Geocoding masjid gagal:', error);

    return jsonResponse(request, {
      ok: false,
      error: 'Pencarian lokasi gagal. Silakan coba kembali.',
    }, 500);
  }
}
