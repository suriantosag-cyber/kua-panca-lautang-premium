import { createClient } from '@supabase/supabase-js';
import { randomUUID, timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(request.headers.get('authorization') || '');

  return (
    actual.length === expected.length &&
    timingSafeEqual(actual, expected)
  );
}

function getMondayWITA() {
  const nowWITA = new Date(Date.now() + 8 * 60 * 60 * 1000);

  const year = nowWITA.getUTCFullYear();
  const month = nowWITA.getUTCMonth();
  const day = nowWITA.getUTCDate();
  const dayOfWeek = nowWITA.getUTCDay();

  // Senin = 0, Selasa = 1, ..., Minggu = 6.
  const daysSinceMonday = (dayOfWeek + 6) % 7;

  const monday = new Date(
    Date.UTC(year, month, day - daysSinceMonday)
  );

  return monday.toISOString().slice(0, 10);
}

function validateDraft(draft) {
  const requiredFields = [
    'title',
    'theme',
    'khutbah_pertama',
    'khutbah_kedua',
    'doa_penutup',
  ];

  for (const field of requiredFields) {
    if (
      typeof draft?.[field] !== 'string' ||
      !draft[field].trim()
    ) {
      throw new Error(`Hasil Gemini tidak valid pada bagian ${field}.`);
    }
  }

  const limits = {
    title: 200,
    theme: 500,
    khutbah_pertama: 30000,
    khutbah_kedua: 30000,
    doa_penutup: 10000,
  };

  for (const [field, maxLength] of Object.entries(limits)) {
    if (draft[field].length > maxLength) {
      throw new Error(`Bagian ${field} melebihi batas panjang.`);
    }
  }

  if (!Array.isArray(draft.referensi)) {
    throw new Error('Referensi Gemini harus berupa array.');
  }

  const referensi = draft.referensi.map((item, index) => {
    if (
      !item ||
      typeof item !== 'object' ||
      Array.isArray(item)
    ) {
      throw new Error(`Referensi nomor ${index + 1} harus berupa objek.`);
    }

    const fields = {
      jenis: 80,
      rujukan: 500,
      catatan_verifikasi: 1000,
    };

    const normalized = {};

    for (const [field, maxLength] of Object.entries(fields)) {
      if (
        typeof item[field] !== 'string' ||
        !item[field].trim()
      ) {
        throw new Error(
          `Referensi nomor ${index + 1} tidak memiliki ${field} yang valid.`
        );
      }

      const value = item[field].trim();

      if (value.length > maxLength) {
        throw new Error(
          `Properti ${field} pada referensi nomor ${index + 1} terlalu panjang.`
        );
      }

      normalized[field] = value;
    }

    return normalized;
  });

  return {
    title: draft.title.trim(),
    theme: draft.theme.trim(),
    khutbah_pertama: draft.khutbah_pertama.trim(),
    khutbah_kedua: draft.khutbah_kedua.trim(),
    doa_penutup: draft.doa_penutup.trim(),
    referensi,
  };
}

async function generateDraftWithGemini(weekStart, apiKey, model) {
  const systemInstruction = [
    'Anda membantu menyusun DRAF khutbah Jumat untuk KUA Kecamatan Panca Lautang.',
    'Bahasa utama wajib Bugis dialek lokal Panca Lautang/Sidrap yang ditulis menggunakan aksara Latin (Bugis Latin), bukan aksara Lontara.',
    'Jangan mengaku sebagai ulama atau mufti.',
    'Susun materi dengan adab, akhlak, ketepatan akidah, dan kehati-hatian dalam persoalan fikih.',
    'Jangan mengarang ayat Al-Quran, hadis, nomor hadis, nama kitab, atau atribusi ulama.',
    'Cantumkan referensi hanya jika identitas sumber dan rujukannya benar-benar diyakini.',
    'Setiap referensi harus berupa objek dengan properti jenis, rujukan, dan catatan_verifikasi.',
    'Jika rujukan hadis atau dalil tidak dapat dipastikan, jangan menciptakan nomor atau kutipan; jelaskan kebutuhan verifikasi pada catatan_verifikasi.',
    'Materi harus terdiri atas khutbah pertama, khutbah kedua, dan doa penutup.',
    'Khutbah pertama memuat pembukaan, hamdalah, syahadat, shalawat, wasiat takwa, pembahasan tema, dan penutup khutbah pertama.',
    'Khutbah kedua memuat hamdalah, shalawat, wasiat takwa, doa untuk kaum muslimin, dan penutup.',
    'Hindari klaim hukum yang kontroversial dan jangan membuat fatwa baru.',
    'Tulis materi sebagai DRAF untuk diperiksa manusia. Jangan menyatakan bahwa materi sudah disahkan.',
    'Gunakan bahasa Bugis Latin yang wajar. Jika tidak yakin dengan istilah Bugis tertentu, jangan membuat kosakata palsu; tandai bagian tersebut untuk koreksi penyunting.',
    'Keluarkan JSON valid saja, tanpa Markdown, tanpa code fence, dan tanpa teks pengantar.',
  ].join(' ');

  const prompt = `
Susun draf khutbah Jumat untuk pekan yang dimulai pada hari Senin ${weekStart}.

Konteks:
- Instansi: KUA Kecamatan Panca Lautang, Kabupaten Sidenreng Rappang.
- Bahasa: Bugis Latin.
- Status hasil: draf internal, wajib diperiksa dan disetujui admin sebelum diterbitkan.
- Tema: pilih tema aktual yang relevan dengan akhlak, ibadah, keluarga sakinah, persatuan, kepedulian sosial, atau kehidupan masyarakat.
- Hindari tema yang memerlukan data berita terkini jika tidak tersedia.

Keluaran harus mengikuti struktur JSON:
{
  "title": "Judul khutbah",
  "theme": "Tema utama",
  "khutbah_pertama": "Naskah lengkap khutbah pertama",
  "khutbah_kedua": "Naskah lengkap khutbah kedua",
  "doa_penutup": "Doa penutup",
  "referensi": [
    {
      "jenis": "Al-Quran atau Hadis",
      "rujukan": "Identitas rujukan yang benar-benar diyakini",
      "catatan_verifikasi": "Catatan bagi admin untuk memeriksa sumber"
    }
  ]
}

Jangan memasukkan referensi yang tidak dapat dipastikan. Jangan mengarang kutipan atau nomor hadis.
`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  let response;

  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            maxOutputTokens: 8192,
            temperature: 0.35,
          },
        }),
        signal: controller.signal,
      }
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    // Jangan meneruskan detail respons penyedia ke pemanggil endpoint.
    throw new Error(`Gemini mengembalikan HTTP ${response.status}.`);
  }

  const result = await response.json();

  const text = (result?.candidates?.[0]?.content?.parts || [])
    .map((part) => typeof part?.text === 'string' ? part.text : '')
    .filter(Boolean)
    .join('\n')
    .trim();

  if (!text) {
    throw new Error('Gemini tidak menghasilkan naskah.');
  }

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Keluaran Gemini bukan JSON yang valid.');
  }

  return validateDraft(parsed);
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return jsonResponse(
      { ok: false, error: 'Unauthorized.' },
      401
    );
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL;

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    !geminiApiKey ||
    !geminiModel
  ) {
    return jsonResponse(
      { ok: false, error: 'Konfigurasi layanan belum lengkap.' },
      500
    );
  }

  try {
    const weekStart = getMondayWITA();

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Hindari biaya Gemini jika draf pekan ini sudah tersedia.
    const { data: existing, error: lookupError } = await supabase
      .from('khutbah_jumat')
      .select('id, status')
      .eq('week_start', weekStart)
      .maybeSingle();

    if (lookupError) {
      throw new Error('Pemeriksaan draf khutbah di database gagal.');
    }

    if (existing) {
      return jsonResponse({
        ok: true,
        created: false,
        message: 'Draf untuk pekan ini sudah tersedia.',
        khutbah_id: existing.id,
        status: existing.status,
        week_start: weekStart,
      });
    }

    // Klaim kunci sebelum memanggil Gemini agar tidak terjadi
    // pemanggilan generator ganda untuk pekan yang sama.
    const lockToken = randomUUID();

    const { data: lockAcquired, error: lockError } = await supabase.rpc(
      'claim_khutbah_jumat_generation_lock',
      {
        p_week_start: weekStart,
        p_lock_token: lockToken,
        p_lease_seconds: 300,
      }
    );

    if (lockError) {
      console.error('Klaim kunci cron gagal:', lockError.code);
      throw new Error('Penguncian generator khutbah gagal.');
    }

    if (lockAcquired !== true) {
      return jsonResponse(
        {
          ok: true,
          created: false,
          in_progress: true,
          week_start: weekStart,
          message: 'Pembuatan draf pekan ini sedang diproses.',
        },
        202
      );
    }

    try {
      // Periksa ulang setelah kunci berhasil diperoleh.
      const { data: latest, error: latestError } = await supabase
        .from('khutbah_jumat')
        .select('id, status')
        .eq('week_start', weekStart)
        .maybeSingle();

      if (latestError) {
        throw new Error('Pemeriksaan ulang draf khutbah gagal.');
      }

      if (latest) {
        return jsonResponse({
          ok: true,
          created: false,
          khutbah_id: latest.id,
          status: latest.status,
          week_start: weekStart,
          message: 'Draf untuk pekan ini sudah tersedia.',
        });
      }

      const draft = await generateDraftWithGemini(
        weekStart,
        geminiApiKey,
        geminiModel
      );

      const { data, error: rpcError } = await supabase.rpc(
        'generate_khutbah_jumat',
        {
          p_week_start: weekStart,
          p_title: draft.title,
          p_theme: draft.theme,
          p_khutbah_pertama: draft.khutbah_pertama,
          p_khutbah_kedua: draft.khutbah_kedua,
          p_doa_penutup: draft.doa_penutup,
          p_referensi: draft.referensi,
          p_model_name: geminiModel,
        }
      );

      if (rpcError) {
        console.error('RPC generator khutbah gagal:', rpcError.code);
        throw new Error('Penyimpanan draf khutbah gagal.');
      }

      const result = Array.isArray(data) ? data[0] : null;

      if (!result?.khutbah_id) {
        throw new Error('Database tidak mengembalikan identitas draf.');
      }

      return jsonResponse({
        ok: true,
        created: result.was_created === true,
        khutbah_id: result.khutbah_id,
        status: result.result_status,
        week_start: weekStart,
        message: result.was_created
          ? 'Draf khutbah berhasil dibuat dan menunggu pemeriksaan admin.'
          : 'Draf pekan ini sudah tersedia.',
      });
    } finally {
      // Hanya token pemilik yang dapat melepaskan kunci.
      const { error: releaseError } = await supabase.rpc(
        'release_khutbah_jumat_generation_lock',
        {
          p_week_start: weekStart,
          p_lock_token: lockToken,
        }
      );

      if (releaseError) {
        // Kunci akan kedaluwarsa otomatis setelah masa lease.
        console.error('Pelepasan kunci cron gagal:', releaseError.code);
      }
    }
  } catch (error) {
    console.error(
      'Cron khutbah Jumat gagal:',
      error?.name === 'AbortError' ? 'Gemini timeout' : error?.message
    );

    return jsonResponse(
      {
        ok: false,
        error: 'Pembuatan draf khutbah gagal. Periksa log server.',
      },
      500
    );
  }
}