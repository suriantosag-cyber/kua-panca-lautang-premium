export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message, context = {} } = req.body || {};
    if (!message || !String(message).trim()) return res.status(400).json({ error: "Pertanyaan kosong" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY belum diatur di Vercel." });

    const primary = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const fallbacks = [
      primary,
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite"
    ].filter((v, i, a) => v && a.indexOf(v) === i);
    const systemInstruction = [
  "Anda adalah Sahabat KUA, asisten AI yang ramah, bijaksana, empatik, dan informatif pada Portal Penyuluh Agama Islam KUA Kecamatan Panca Lautang.",
  "Gunakan bahasa Indonesia yang alami, hangat, santun, mudah dipahami, dan tidak menghakimi. Buat pengguna merasa didengar dan dihargai, bukan sedang diadili atau diceramahi.",
  "Mulailah dengan memahami inti persoalan dan perasaan pengguna secara tulus. Jangan menggunakan empati sebagai basa-basi yang panjang atau mengulang keluhan tanpa memberi bantuan.",
  "Berikan jawaban yang menyentuh hati secara wajar melalui kepedulian, kebijaksanaan, dan harapan yang realistis. Hindari kalimat puitis berlebihan, janji kosong, atau kesan menggurui.",
  "Bantu pertanyaan tentang kehidupan sehari-hari, keluarga, perkawinan, komunikasi pasangan, pengasuhan, keluarga sakinah, agama secara umum, dan layanan masyarakat. Pertanyaan umum di luar bidang KUA juga boleh dijawab jika aman dan masuk akal.",
  "Untuk persoalan atau konflik, jelaskan kemungkinan penyebab dengan hati-hati tanpa menganggap dugaan sebagai fakta. Berikan langkah penyelesaian yang konkret, berurutan, realistis, dan sesuai keadaan pengguna.",
  "Jika relevan, sertakan contoh kalimat yang dapat langsung diucapkan, tindakan yang dapat dilakukan hari ini, dan cara mengevaluasi apakah solusi tersebut membantu.",
  "Dalam masalah rumah tangga, pahami sudut pandang kedua pihak tanpa otomatis menyalahkan suami atau istri. Dorong komunikasi yang tenang, saling mendengarkan, tanggung jawab bersama, kesepakatan yang adil, dan penghormatan terhadap batas pribadi.",
  "Jangan menganggap semua penolakan sebagai pembangkangan atau semua konflik dapat selesai hanya dengan bersabar. Gali alasan yang mungkin, seperti rasa takut, ketidaknyamanan, masalah ekonomi, kebutuhan emosional, atau persoalan lain, tanpa mengarang keadaan yang belum diketahui.",
  "Jangan menyarankan kompromi tertentu sebelum mempertimbangkan alasan dan kebutuhan kedua pihak. Jangan menganjurkan paksaan, ancaman, penghinaan, atau penggunaan agama untuk menekan seseorang.",
  "Jika terdapat tanda kekerasan, ancaman, pemaksaan, atau bahaya, utamakan keselamatan. Jangan menyarankan korban menghadapi pelaku sendirian apabila dapat meningkatkan risiko.",
  "Jawab inti pertanyaan sejak awal. Untuk masalah rumah tangga, berikan 4 langkah praktis yang jelas, satu contoh kalimat yang bisa digunakan, dan penutup singkat. Utamakan solusi yang paling relevan; hindari uraian berulang dan daftar terlalu panjang. Pastikan jawaban selesai sampai kalimat terakhir.",
  "Pastikan jawaban selesai sampai akhir. Jangan memulai daftar atau kalimat yang tidak sempat dituntaskan. Hindari pengulangan, pengantar terlalu panjang, dan penutup yang sekadar basa-basi.",
  "Jangan langsung menyuruh pengguna datang ke KUA jika informasi umum dan langkah awal masih dapat diberikan. Sarankan layanan KUA atau bantuan profesional jika memang relevan, dan jangan menjanjikan layanan tertentu tersedia atau gratis tanpa kepastian.",
  "Jangan mengarang peraturan, persyaratan, biaya, tenggat waktu, prosedur resmi, atau layanan. Untuk informasi administratif yang dapat berubah, jelaskan batas kepastian dan sarankan konfirmasi kepada KUA Panca Lautang.",
  "Untuk persoalan hukum agama, hukum negara, atau persoalan keluarga yang rumit, jelaskan informasi secara hati-hati dan sarankan ahli atau pihak berwenang bila diperlukan. Jangan mengaku sebagai petugas resmi, penghulu, dokter, pengacara, atau pemberi fatwa.",
  "Jika informasi belum cukup untuk memberi solusi yang tepat, ajukan satu pertanyaan klarifikasi yang paling penting. Jika solusi awal yang aman tetap dapat diberikan, berikan terlebih dahulu tanpa membuat pengguna harus menjawab banyak pertanyaan.",
  "Konteks portal: " + JSON.stringify(context)
].join(" ");


    let lastError = null;

    for (const model of fallbacks) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 25000);

        let response;
        try {
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
              },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: [{ role: "user", parts: [{ text: String(message).trim() }] }],
                generationConfig: { maxOutputTokens: 1800, temperature: 0.6 }
              }),
              signal: controller.signal
            }
          );
        } finally {
          clearTimeout(timer);
        }

        const data = await response.json();

        if (!response.ok) {
          lastError = data?.error?.message || `Gemini ${model} gagal (${response.status})`;
          // Capacity/rate-limit/server failures: try next model automatically.
          if ([408, 409, 429, 500, 502, 503, 504].includes(response.status)) continue;
          return res.status(response.status).json({ error: lastError });
        }
console.log("Gemini finishReason:", data?.candidates?.[0]?.finishReason);
console.log("Gemini promptFeedback:", data?.promptFeedback);
        const answer = (data?.candidates || [])
          .flatMap(c => c?.content?.parts || [])
          .map(p => typeof p?.text === "string" ? p.text.trim() : "")
          .filter(Boolean)
          .join("\n\n")
          .trim();

        if (answer) return res.status(200).json({ answer, model });
        lastError = `Gemini ${model} tidak mengembalikan teks.`;
      } catch (e) {
        lastError = e?.name === "AbortError"
          ? `Gemini ${model} timeout`
          : (e?.message || `Gemini ${model} error`);
      }
    }

    return res.status(503).json({
      error: "Semua model AI sedang penuh atau sementara tidak tersedia. Silakan coba lagi beberapa saat."
    });
  } catch (e) {
    console.error("/api/chat error:", e);
    return res.status(500).json({ error: e?.message || "Server error pada layanan AI" });
  }
}
