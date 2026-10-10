
'use client';

import { useState } from 'react';

const tahapanWudu = [
  {
    judul: '1. Niat dan persiapan',
    isi: 'Niat berwudu di dalam hati untuk bersuci karena Allah. Mulailah dengan membaca basmalah.',
  },
  {
    judul: '2. Membasuh telapak tangan',
    isi: 'Basuh kedua telapak tangan. Dalam praktik yang umum diajarkan, dilakukan tiga kali.',
  },
  {
    judul: '3. Berkumur dan membersihkan hidung',
    isi: 'Berkumur dan membersihkan hidung dengan air secara wajar.',
  },
  {
    judul: '4. Membasuh wajah',
    isi: 'Ratakan air ke seluruh wajah sesuai batasnya.',
  },
  {
    judul: '5. Membasuh kedua tangan',
    isi: 'Basuh tangan kanan dan kiri hingga siku, termasuk bagian siku.',
  },
  {
    judul: '6. Mengusap kepala dan telinga',
    isi: 'Usap kepala dengan air dan bersihkan telinga sesuai tuntunan yang dipelajari.',
  },
  {
    judul: '7. Membasuh kedua kaki',
    isi: 'Basuh kaki kanan dan kiri hingga mata kaki, pastikan air menjangkau sela-sela jari.',
  },
];

const kuis = [
  {
    tanya: 'Berapa kali salat wajib dalam sehari semalam?',
    pilihan: ['Tiga kali', 'Lima kali', 'Tujuh kali'],
    benar: 1,
    penjelasan: 'Salat wajib sehari semalam terdiri dari Subuh, Zuhur, Asar, Magrib, dan Isya.',
  },
  {
    tanya: 'Apa yang harus diperhatikan saat membasuh anggota wudu?',
    pilihan: [
      'Air menjangkau bagian yang wajib dibasuh',
      'Cukup terkena sedikit air di satu titik',
      'Tidak perlu memperhatikan urutannya',
    ],
    benar: 0,
    penjelasan: 'Pastikan bagian yang wajib dibasuh terkena air dengan merata.',
  },
  {
    tanya: 'Apa yang dilakukan ketika mendengar azan?',
    pilihan: [
      'Mengabaikannya selalu',
      'Mengingat waktu salat dan bersiap menunaikannya',
      'Menunda salat tanpa alasan',
    ],
    benar: 1,
    penjelasan: 'Azan mengingatkan umat Islam akan masuknya waktu salat.',
  },
];

export default function MateriDakwahPage() {
  const [terbuka, setTerbuka] = useState(0);
  const [jawaban, setJawaban] = useState({});
  const [selesai, setSelesai] = useState(false);

  const skor = kuis.filter((item, i) => jawaban[i] === item.benar).length;

  return (
    <main className="mdPage">
      <header className="mdHero">
        <a className="mdBack" href="/">← Kembali ke Beranda</a>
        <span className="mdLabel">MATERI DAKWAH • KUA PANCA LAUTANG</span>
        <h1>Wudu dan Salat, Langkah Menuju Ibadah yang Baik</h1>
        <p>
          Belajar dasar bersuci dan salat dengan panduan ringkas.
          Baca perlahan, pahami tahapannya, lalu praktikkan sesuai tuntunan.
        </p>
        <div className="mdHeroTags">
          <span>📖 Panduan praktis</span>
          <span>⏱️ 5–8 menit</span>
          <span>🌿 Untuk semua usia</span>
        </div>
      </header>

      <section className="mdContent">
        <article className="mdIntro">
          <span className="mdIcon">🌙</span>
          <div>
            <h2>Mengapa wudu dan salat penting?</h2>
            <p>
              Wudu merupakan salah satu cara bersuci sebelum salat.
              Salat wajib menjadi ibadah utama yang dikerjakan umat Islam
              lima kali sehari semalam. Memahami dasar-dasarnya membantu
              kita beribadah dengan lebih tertib dan khusyuk.
            </p>
          </div>
        </article>

        <article className="mdCard">
          <div className="mdSectionTitle">
            <span>01</span>
            <div>
              <h2>Langkah-langkah wudu</h2>
              <p>Pilih setiap tahap untuk membaca penjelasannya.</p>
            </div>
          </div>

          <div className="mdSteps">
            {tahapanWudu.map((item, i) => (
              <div className="mdStep" key={item.judul}>
                <button
                  type="button"
                  className="mdStepButton"
                  onClick={() => setTerbuka(terbuka === i ? -1 : i)}
                  aria-expanded={terbuka === i}
                >
                  <span>{item.judul}</span>
                  <span>{terbuka === i ? '−' : '+'}</span>
                </button>
                {terbuka === i && <p className="mdStepText">{item.isi}</p>}
              </div>
            ))}
          </div>

          <div className="mdNote">
            <strong>💡 Perlu diingat</strong>
            <p>
              Urutan dan rincian tata cara wudu perlu dipelajari dengan benar.
              Ada perbedaan rincian sunah di antara mazhab. Pelajari rukun wudu
              dan praktiknya dari guru agama yang tepercaya.
            </p>
          </div>
        </article>

        <article className="mdCard">
          <div className="mdSectionTitle">
            <span>02</span>
            <div>
              <h2>Persiapan menunaikan salat</h2>
              <p>Periksa beberapa hal berikut sebelum mulai.</p>
            </div>
          </div>

          <ul className="mdChecklist">
            <li>Pastikan waktu salat telah masuk.</li>
            <li>Bersuci dari hadas sesuai ketentuan.</li>
            <li>Pastikan badan, pakaian, dan tempat salat suci dari najis.</li>
            <li>Tutup aurat dan menghadap kiblat.</li>
            <li>Niatkan salat yang akan dikerjakan.</li>
            <li>Laksanakan salat dengan tertib dan berusaha khusyuk.</li>
          </ul>

          <div className="mdQuote">
            <p>
              “Sesungguhnya salat itu adalah kewajiban yang ditentukan
              waktunya atas orang-orang yang beriman.”
            </p>
            <span>QS. An-Nisa’ [4]: 103 — kutipan makna ayat</span>
          </div>
        </article>

        <article className="mdCard">
          <div className="mdSectionTitle">
            <span>03</span>
            <div>
              <h2>Kenali salat lima waktu</h2>
              <p>Ingat nama dan jumlah rakaat wajibnya.</p>
            </div>
          </div>

          <div className="mdPrayerGrid">
            {[
              ['Subuh', '2 rakaat'],
              ['Zuhur', '4 rakaat'],
              ['Asar', '4 rakaat'],
              ['Magrib', '3 rakaat'],
              ['Isya', '4 rakaat'],
            ].map(([nama, rakaat]) => (
              <div className="mdPrayer" key={nama}>
                <span>🕌</span>
                <strong>{nama}</strong>
                <small>{rakaat}</small>
              </div>
            ))}
          </div>
          <p className="mdSmall">
            Jumlah di atas adalah rakaat salat fardu, tidak termasuk salat sunah.
          </p>
        </article>

        <article className="mdCard mdQuiz">
          <div className="mdSectionTitle">
            <span>04</span>
            <div>
              <h2>Yuk, uji pemahaman!</h2>
              <p>Pilih satu jawaban untuk setiap pertanyaan.</p>
            </div>
          </div>

          {kuis.map((item, i) => (
            <div className="mdQuestion" key={item.tanya}>
              <h3>{i + 1}. {item.tanya}</h3>
              {item.pilihan.map((pilihan, j) => (
                <label className="mdOption" key={pilihan}>
                  <input
                    type="radio"
                    name={`kuis-${i}`}
                    checked={jawaban[i] === j}
                    disabled={selesai}
                    onChange={() => setJawaban({ ...jawaban, [i]: j })}
                  />
                  <span>{pilihan}</span>
                </label>
              ))}
              {selesai && (
                <p className="mdFeedback">
                  {jawaban[i] === item.benar ? '✅ Benar!' : `📌 Jawaban yang tepat: ${item.pilihan[item.benar]}.`}
                  {' '}{item.penjelasan}
                </p>
              )}
            </div>
          ))}

          {!selesai ? (
            <button
              className="mdSubmit"
              type="button"
              disabled={Object.keys(jawaban).length !== kuis.length}
              onClick={() => setSelesai(true)}
            >
              Periksa Jawaban
            </button>
          ) : (
            <div className="mdResult">
              Skor Anda: {skor} dari {kuis.length}
              <button
                type="button"
                onClick={() => {
                  setJawaban({});
                  setSelesai(false);
                }}
              >
                Ulangi Kuis
              </button>
            </div>
          )}
        </article>

        <footer className="mdFooter">
          <strong>Terus belajar, terus memperbaiki ibadah.</strong>
          <p>
            Materi edukasi ringkas dari KUA Panca Lautang.
            Untuk rincian hukum ibadah, konsultasikan kepada pembimbing agama
            atau ulama tepercaya.
          </p>
          <a href="/">← Kembali ke website utama</a>
        </footer>
      </section>

      <style jsx>{`
        .mdPage { background:#f3f8f3; color:#20362c; min-height:100vh; padding-bottom:40px; }
        .mdHero { padding:30px max(20px, calc((100% - 900px)/2)) 38px; background:linear-gradient(135deg,#075e48,#13805d); color:white; }
        .mdBack { color:#e1f5e9; text-decoration:none; font-size:14px; display:inline-block; margin-bottom:30px; }
        .mdLabel { display:block; font-size:12px; letter-spacing:1.5px; font-weight:800; color:#c6f6d5; }
        .mdHero h1 { font-size:clamp(30px,5vw,48px); line-height:1.13; max-width:750px; margin:14px 0; }
        .mdHero p { max-width:690px; line-height:1.8; color:#e4f5eb; }
        .mdHeroTags { display:flex; flex-wrap:wrap; gap:9px; margin-top:22px; }
        .mdHeroTags span { border:1px solid #ffffff50; background:#ffffff12; border-radius:999px; padding:8px 12px; font-size:12px; }
        .mdContent { max-width:900px; padding:0 18px; margin:24px auto; }
        .mdIntro,.mdCard { background:white; border:1px solid #e0ebe2; border-radius:18px; padding:24px; margin-bottom:18px; box-shadow:0 5px 20px #123c1810; }
        .mdIntro { display:flex; gap:16px; align-items:flex-start; }
        .mdIcon { font-size:32px; background:#e4f5e9; border-radius:14px; padding:12px; }
        h2 { margin:0 0 8px; font-size:22px; }
        .mdIntro p,.mdSectionTitle p { margin:0; line-height:1.8; color:#5d7165; }
        .mdSectionTitle { display:flex; align-items:flex-start; gap:14px; margin-bottom:20px; }
        .mdSectionTitle > span { background:#dff4e5; color:#08704f; border-radius:12px; min-width:42px; height:42px; display:grid; place-items:center; font-weight:800; }
        .mdSteps { border-top:1px solid #e5eee7; }
        .mdStep { border-bottom:1px solid #e5eee7; }
        .mdStepButton { border:0; width:100%; padding:16px 0; background:white; display:flex; justify-content:space-between; gap:12px; text-align:left; font-size:15px; font-weight:750; color:#214536; cursor:pointer; }
        .mdStepButton span:last-child { color:#087c55; font-size:20px; }
        .mdStepText { margin:0 0 17px; color:#586c60; line-height:1.8; }
        .mdNote { background:#eff9ed; border-left:4px solid #3b9b63; border-radius:10px; padding:16px; margin-top:20px; }
        .mdNote p { margin:6px 0 0; line-height:1.8; color:#4c6453; }
        .mdChecklist { padding-left:22px; line-height:2; color:#435c4c; }
        .mdQuote { padding:18px; border-radius:12px; background:#f2f8f3; margin-top:20px; }
        .mdQuote p { font-weight:650; line-height:1.8; margin:0 0 8px; }
        .mdQuote span,.mdSmall { font-size:12px; color:#62766a; }
        .mdPrayerGrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:10px; }
        .mdPrayer { background:#eff8f0; border:1px solid #deede0; padding:16px 8px; border-radius:14px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:7px; }
        .mdPrayer span { font-size:23px; }
        .mdPrayer small { color:#607468; }
        .mdSmall { margin-top:14px; }
        .mdQuestion { border-top:1px solid #e5eee7; padding:18px 0; }
        .mdQuestion h3 { font-size:16px; line-height:1.6; margin:0 0 12px; }
        .mdOption { display:flex; gap:10px; align-items:flex-start; border:1px solid #e2ece4; border-radius:10px; padding:12px; margin:8px 0; cursor:pointer; line-height:1.5; }
        .mdOption input { margin-top:4px; accent-color:#087653; }
        .mdFeedback { background:#f0f8f1; padding:12px; border-radius:10px; line-height:1.7; font-size:14px; }
        .mdSubmit,.mdResult button { border:0; border-radius:10px; padding:13px 18px; background:#087653; color:white; font-weight:750; cursor:pointer; }
        .mdSubmit:disabled { background:#9bb9a7; cursor:not-allowed; }
        .mdResult { display:flex; flex-wrap:wrap; align-items:center; gap:16px; font-weight:800; }
        .mdFooter { text-align:center; padding:28px 10px; color:#536b5b; line-height:1.8; }
        .mdFooter p { font-size:14px; }
        .mdFooter a { color:#087653; font-weight:750; text-decoration:none; }
        @media(max-width:600px) { .mdHero { padding:24px 20px 30px; } .mdIntro,.mdCard { padding:18px; } .mdIntro { flex-direction:column; } h2 { font-size:20px; } }
      `}</style>
    </main>
  );
}
