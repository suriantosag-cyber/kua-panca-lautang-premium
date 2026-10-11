
'use client';

import { useState } from 'react';

const naskah = `KHUTBAH KEDUA
BAHASA BUGIS

اَلْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ

Alhamdulillah, tapuji Puang Allah Taala,
Puangna lino sibawa akherat.
Makkasuwi'ki ri Puang Allah Taala
nasaba' napoleangngi'ki nikmat iman,
Islam, kesehatan, sibawa kesempatan
untuk massumpajang Jumaa' esso e.

وَالصَّلَاةُ وَالسَّلَامُ عَلَى سَيِّدِنَا مُحَمَّدٍ
وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ

Salawat sibawa salam tapancajiang
ri Nabitta Muhammad shallallahu 'alaihi wasallam,
keluargana, sahabatna, sibawa umatna
makkutaneng ri laleng petunjukna
sampai ri esso kiamat.

Jamaah Jumat rahimakumullah,

Marilah tapalettu'i ketakwaatta ri Puang Allah Taala.
Pakkatenningngi perinta'na sibawa aja'ki
mappogau' gau' napasala.
Takwa de' na cukup ri onrong ada bicara,
tapi harus napparengngi ri ibadah,
ri pabbicara, sibawa ri gau'ta
ri esso-esso.

Jamaah Jumat yang dimuliakan Allah,

Mappadecengngi salatta lima waktu.
Aja' tapalettu'i salat nasaba' sibukki
makkaja, mappigau' jama-jamang,
atau mappenuhi kabutuhan lino.
Ajari ana'-ana' sibawa keluarga ta
mappoji salat, bukan cuma ri nasihat,
tapi ri contoh gau' madeceng.

Mappadecengngi hubungan ta ri indo' sibawa ambo',
ri pasangan, ana'-ana', tetangga,
sibawa tau laingnge.
Aja'ki mappabicara napasala ati tau,
aja'ki mappogau' fitnah, musu,
sibawa gau' naparugikan tau laingnge.
Mudah-mudahan keberadaan ta
napoleangngi kebaikan ri keluarga
sibawa ri masyarakat.

Jamaah Jumat rahimakumullah,

Mudah-mudahan Puang Allah Taala
mattarima ibadah ta, mappammasei dosa-dosa ta,
mappadeceng akhlak ta, napoleangngi berkah
ri laleng atuoang ta, sibawa napajaji'ki
hamba-hamba istiqamah mappatenningngi salat
sampai ri akhir umur.

DOA PENUTUP

اللَّهُمَّ اغْفِرْ لِلْمُسْلِمِينَ
وَالْمُسْلِمَاتِ وَالْمُؤْمِنِينَ
وَالْمُؤْمِنَاتِ الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ

رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً
وَفِي الْآخِرَةِ حَسَنَةً
وَقِنَا عَذَابَ النَّارِ

آمِينَ يَا رَبَّ الْعَالَمِينَ`;

export default function KhutbahKeduaPage() {
  const [pesan, setPesan] = useState('');

  async function salinNaskah() {
    try {
      await navigator.clipboard.writeText(naskah);
      setPesan('Naskah berhasil disalin.');
    } catch {
      setPesan('Gagal menyalin. Silakan salin teks secara manual.');
    }
  }

  function bagikanWhatsApp() {
    const url = window.location.href;
    const teks = `Naskah Khutbah Kedua Bahasa Bugis\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(teks)}`,
      '_blank'
    );
  }

  return (
    <main style={{
      maxWidth: 850,
      margin: '30px auto',
      padding: '20px',
      color: '#173b2b',
      fontFamily: 'Arial, sans-serif',
      lineHeight: 1.9
    }}>
      
<div style={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  marginBottom: 20
}}>
  <a
    href="/"
    style={{ color: '#176b45', textDecoration: 'none' }}
  >
    ← Kembali ke Beranda
  </a>

  <a
    href="/materi-dakwah"
    style={{ color: '#176b45', textDecoration: 'none' }}
  >
    ← Kembali ke Materi Dakwah
  </a>


</div>

      

      <h1 style={{ marginTop: 24 }}>
        Khutbah Kedua Bahasa Bugis
      </h1>

      <p>
        Naskah bacaan untuk khatib. Periksa kembali
        dialek Bugis dan bacaan Arab sebelum digunakan.
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        margin: '20px 0'
      }}>
        <button onClick={salinNaskah} style={tombol}>
          Salin Naskah
        </button>
        <button onClick={() => window.print()} style={tombol}>
          Cetak
        </button>
        <button onClick={bagikanWhatsApp} style={tombol}>
          Bagikan WhatsApp
        </button>
      </div>

      {pesan && <p role="status">{pesan}</p>}

      <article style={{
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        background: '#fff',
        border: '1px solid #d8e5dc',
        borderRadius: 12,
        padding: 24,
        fontSize: 18
      }}>
        {naskah}
      </article>
    </main>
  );
}

const tombol = {
  background: '#176b45',
  color: '#fff',
  border: 0,
  borderRadius: 8,
  padding: '11px 16px',
  cursor: 'pointer',
  fontSize: 15
};
