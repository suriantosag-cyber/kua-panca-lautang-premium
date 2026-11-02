
'use client';

import { useEffect, useMemo, useState } from 'react';

const RATE = 0.025;

const money = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Number(value) || 0));

const number = (value) => Math.max(0, Number(value) || 0);

const fields = {
  penghasilan: [
    { key: 'penghasilan', label: 'Penghasilan per bulan (Rp)' },
    { key: 'tambahan', label: 'Penghasilan tambahan per bulan (Rp)' },
  ],
  emas: [
    { key: 'berat', label: 'Berat emas yang diperhitungkan (gram)' },
    { key: 'harga', label: 'Harga emas per gram (Rp)' },
  ],
  tabungan: [
    { key: 'harta', label: 'Total tabungan dan harta sejenis (Rp)' },
    { key: 'utang', label: 'Kewajiban jatuh tempo yang relevan (Rp)' },
  ],
  perdagangan: [
    { key: 'aset', label: 'Nilai persediaan dagang dan kas (Rp)' },
    { key: 'utang', label: 'Kewajiban usaha yang relevan (Rp)' },
  ],
  pertanian: [
    { key: 'hasil', label: 'Jumlah hasil panen (kg)' },
    { key: 'hargaPanen', label: 'Harga hasil panen per kg (Rp)' },
  ],
  fitrah: [
    { key: 'jiwa', label: 'Jumlah jiwa (orang)' },
    { key: 'nilai', label: 'Nilai zakat fitrah per jiwa (Rp)' },
  ],
};

const defaults = {
  penghasilan: 0,
  tambahan: 0,
  berat: 0,
  harga: 0,
  harta: 0,
  utang: 0,
  aset: 0,
  hasil: 0,
  hargaPanen: 0,
  jiwa: 1,
  nilai: 0,
};

const labelStyle = {
  display: 'block',
  fontWeight: 700,
  marginBottom: 8,
  color: '#14532d',
  lineHeight: 1.6,
};

const inputStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  border: '1px solid #cbd5d1',
  borderRadius: 10,
  background: '#ffffff',
  color: '#17251c',
  fontSize: 16,
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
  gap: 16,
  marginTop: 20,
};

export default function ZakatCalculator() {
  const [jenis, setJenis] = useState('penghasilan');
  const [nilai, setNilai] = useState(defaults);

  // Nilai acuan dapat disesuaikan berdasarkan ketetapan resmi.
  const [nisabBulanan, setNisabBulanan] = useState(7640144);
  const [nisabEmas, setNisabEmas] = useState(85);
  const [hargaEmasAcuan, setHargaEmasAcuan] = useState(0);
  const [hargaEmasDiperbarui, setHargaEmasDiperbarui] = useState('');
  const [statusHargaEmas, setStatusHargaEmas] = useState('Memuat harga emas...');
  const [nisabPanen, setNisabPanen] = useState(653);

  const [pengairan, setPengairan] = useState('alami');
  const [haulTerpenuhi, setHaulTerpenuhi] = useState(false);

  useEffect(() => {
    let aktif = true;

    async function muatHargaEmas() {
      try {
        const response = await fetch('/api/harga-emas', {
          cache: 'no-store',
        });
        const data = await response.json();

        if (
          !response.ok ||
          !Number.isFinite(data.pricePerGram) ||
          data.pricePerGram <= 0
        ) {
          throw new Error(data.error || 'Harga emas belum tersedia.');
        }

        if (!aktif) return;

        setHargaEmasAcuan(data.pricePerGram);
        setNilai((prev) => ({
          ...prev,
          harga: data.pricePerGram,
        }));
        setHargaEmasDiperbarui(data.asOf || '');
        setStatusHargaEmas('Harga spot berhasil diperbarui.');
      } catch {
        if (!aktif) return;
        setStatusHargaEmas(
          'Harga otomatis belum tersedia. Coba muat ulang nanti.'
        );
      }
    }

    muatHargaEmas();
    const interval = setInterval(muatHargaEmas, 60000);

    return () => {
      aktif = false;
      clearInterval(interval);
    };
  }, []);

  function ubah(key, value) {
    setNilai((prev) => ({ ...prev, [key]: number(value) }));
  }

  const hasil = useMemo(() => {
    let dasar = 0;
    let batas = 0;
    let kadar = RATE;
    let wajib = false;
    let perluHaul = false;
    let haulValid = true;
    let satuan = 'rupiah';
    let keterangan = '';

    if (jenis === 'penghasilan') {
      dasar = nilai.penghasilan + nilai.tambahan;
      batas = nisabBulanan;
      wajib = batas > 0 && dasar >= batas;

      keterangan =
        'Simulasi bulanan dengan kadar 2,5%. Pastikan nisab dan metode penghitungan mengikuti ketetapan resmi yang berlaku.';
    } else if (jenis === 'emas') {
      dasar = nilai.berat * nilai.harga;
      batas = nisabEmas * nilai.harga;
      perluHaul = true;
      haulValid = haulTerpenuhi;

      wajib =
        nilai.harga > 0 &&
        nisabEmas > 0 &&
        nilai.berat >= nisabEmas &&
        haulValid;

      keterangan =
        'Simulasi berdasarkan nilai emas dan asumsi nisab gram yang ditampilkan. Periksa jenis emas, kepemilikan, serta ketentuan haul.';
    } else if (jenis === 'tabungan') {
      dasar = Math.max(0, nilai.harta - nilai.utang);
      batas = nisabEmas * hargaEmasAcuan;
      perluHaul = true;
      haulValid = haulTerpenuhi;

      wajib =
        hargaEmasAcuan > 0 &&
        batas > 0 &&
        dasar >= batas &&
        haulValid;

      keterangan =
        'Simulasi harta bersih. Pastikan nisab, haul, penggabungan harta, dan kewajiban yang boleh dikurangkan sesuai pedoman resmi.';
    } else if (jenis === 'perdagangan') {
      dasar = Math.max(0, nilai.aset - nilai.utang);
      batas = nisabEmas * hargaEmasAcuan;
      perluHaul = true;
      haulValid = haulTerpenuhi;

      wajib =
        hargaEmasAcuan > 0 &&
        batas > 0 &&
        dasar >= batas &&
        haulValid;

      keterangan =
        'Simulasi nilai aset dagang dan kas setelah pengurangan kewajiban yang relevan. Penilaian aset usaha perlu mengikuti ketentuan zakat perdagangan.';
    } else if (jenis === 'pertanian') {
      dasar = nilai.hasil;
      batas = nisabPanen;
      satuan = 'kg';

      // Kadar simulasi berdasarkan metode pengairan.
      kadar = pengairan === 'alami' ? 0.1 : 0.05;

      wajib = batas > 0 && dasar >= batas;

      keterangan =
        'Simulasi menggunakan jumlah panen dalam kg. Nisab panen yang tampil adalah nilai acuan yang bisa diedit, bukan penetapan otomatis untuk semua komoditas.';
    } else if (jenis === 'fitrah') {
      dasar = nilai.jiwa * nilai.nilai;
      batas = 0;
      kadar = 1;

      wajib = nilai.jiwa > 0 && nilai.nilai > 0;

      keterangan =
        'Masukkan nilai resmi zakat fitrah per jiwa sesuai wilayah dan tahun pembayaran. Nilai nol berarti acuan belum dimasukkan.';
    }

    const jumlah = wajib
  ? (jenis === 'pertanian'
      ? Math.round(dasar * kadar * 100) / 100
      : dasar * kadar)
  : 0;

    return {
      dasar,
      batas,
      kadar,
      jumlah,
      wajib,
      perluHaul,
      haulValid,
      satuan,
      keterangan,
    };
  }, [
    jenis,
    nilai,
    nisabBulanan,
    nisabEmas,
    hargaEmasAcuan,
    nisabPanen,
    pengairan,
    haulTerpenuhi,
  ]);

  const isFitrah = jenis === 'fitrah';
  const isPertanian = jenis === 'pertanian';
  const isEmas = jenis === 'emas';
  const isHaul = ['emas', 'tabungan', 'perdagangan'].includes(jenis);

  return (
    <section
      id="kalkulator"
      style={{
        marginTop: 32,
        padding: 'clamp(20px, 4vw, 32px)',
        border: '1px solid #d9e7dd',
        borderRadius: 20,
        background: '#ffffff',
      }}
    >
      <p style={{ color: '#16804a', fontWeight: 800, fontSize: 13 }}>
        KALKULATOR INTERAKTIF
      </p>

      <h2 style={{ color: '#14532d' }}>Hitung Simulasi Zakat</h2>

      <p style={{ lineHeight: 1.8 }}>
        Pilih jenis zakat dan isi data. Hasil dihitung otomatis sebagai
        simulasi awal, bukan penetapan hukum atau fatwa individual.
      </p>

      <label htmlFor="jenis-zakat" style={labelStyle}>
        Jenis zakat
      </label>

      <select
        id="jenis-zakat"
        value={jenis}
        onChange={(event) => {
          setJenis(event.target.value);
          setHaulTerpenuhi(false);
        }}
        style={inputStyle}
      >
        <option value="penghasilan">Zakat penghasilan</option>
        <option value="emas">Zakat emas</option>
        <option value="tabungan">Zakat tabungan</option>
        <option value="perdagangan">Zakat perdagangan</option>
        <option value="pertanian">Zakat pertanian</option>
        <option value="fitrah">Zakat fitrah</option>
      </select>

      {['emas', 'tabungan', 'perdagangan'].includes(jenis) && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            border: '1px solid #d9e7dd',
            borderRadius: 12,
            background: '#f8fafc',
          }}
        >
          <p style={{ margin: 0, fontWeight: 800, color: '#14532d' }}>
            Harga emas spot acuan 24 karat
          </p>
          <p style={{ margin: '8px 0', fontSize: 20, fontWeight: 800 }}>
            {hargaEmasAcuan > 0
              ? `${money(hargaEmasAcuan)} per gram`
              : 'Harga belum tersedia'}
          </p>
          <p style={{ margin: '6px 0', fontSize: 13, lineHeight: 1.7 }}>
            {statusHargaEmas}
            {hargaEmasDiperbarui
              ? ` Waktu data sumber: ${new Date(hargaEmasDiperbarui).toLocaleString('id-ID', { timeZone: 'Asia/Makassar' })} WITA.`
              : ''}
          </p>
          <p style={{ margin: '6px 0 0', fontSize: 12, lineHeight: 1.7 }}>
            Nisab tabungan dan perdagangan dihitung dengan acuan {nisabEmas} gram emas.
            Harga spot bersifat indikatif, bukan harga jual toko emas.
            Sumber: <a href="https://goldprice.corgano.com/" target="_blank" rel="noreferrer">Gold price data by Corgano</a>.
          </p>
        </div>
      )}

      <div style={gridStyle}>
        {fields[jenis].map((field) => (
          <div key={field.key}>
            <label htmlFor={field.key} style={labelStyle}>
              {field.label}
            </label>
            <input
              id={field.key}
              type="number"
              min="0"
              step="any"
              value={field.key === 'harga' ? hargaEmasAcuan : nilai[field.key]}
              onChange={(event) => ubah(field.key, event.target.value)}
              readOnly={field.key === 'harga'}
              style={{
                ...inputStyle,
                ...(field.key === 'harga' ? { background: '#f1f5f9' } : {}),
              }}
            />
          </div>
        ))}
      </div>

      {jenis === 'penghasilan' && (
        <div style={{ marginTop: 18 }}>
          <label htmlFor="nisab-bulanan" style={labelStyle}>
            Acuan nisab dalam rupiah (Rp)
          </label>
          <input
            id="nisab-bulanan"
            type="number"
            min="0"
            value={nisabBulanan}
            onChange={(event) =>
              setNisabBulanan(number(event.target.value))
            }
            style={inputStyle}
          />
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#57534e' }}>
            Periksa sumber dan periode acuan sebelum menggunakan nilai ini.
            Untuk tabungan dan perdagangan, nisab perlu dikonversi dari
            acuan yang sesuai dengan ketentuan resmi.
          </p>
        </div>
      )}

      {isEmas && (
        <div style={{ marginTop: 18 }}>
          <label htmlFor="nisab-emas" style={labelStyle}>
            Acuan nisab emas (gram)
          </label>
          <input
            id="nisab-emas"
            type="number"
            min="0"
            value={nisabEmas}
            onChange={(event) =>
              setNisabEmas(number(event.target.value))
            }
            style={inputStyle}
          />
        </div>
      )}

      {isPertanian && (
        <div style={{ marginTop: 18 }}>
          <label htmlFor="nisab-panen" style={labelStyle}>
            Acuan nisab hasil panen (kg)
          </label>
          <input
            id="nisab-panen"
            type="number"
            min="0"
            value={nisabPanen}
            onChange={(event) =>
              setNisabPanen(number(event.target.value))
            }
            style={inputStyle}
          />

          <label
            htmlFor="pengairan"
            style={{ ...labelStyle, marginTop: 18 }}
          >
            Metode pengairan
          </label>
          <select
            id="pengairan"
            value={pengairan}
            onChange={(event) => setPengairan(event.target.value)}
            style={inputStyle}
          >
            <option value="alami">
              Air hujan atau alami — simulasi 10%
            </option>
            <option value="biaya">
              Irigasi dengan biaya — simulasi 5%
            </option>
          </select>

          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#57534e' }}>
            Pastikan satuan hasil panen dan acuan nisab sesuai komoditas
            serta pedoman resmi. Jangan gunakan angka bawaan tanpa verifikasi.
          </p>
        </div>
      )}

      {isHaul && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            border: '1px solid #d9e7dd',
            borderRadius: 12,
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              lineHeight: 1.7,
              color: '#14532d',
            }}
          >
            <input
              type="checkbox"
              checked={haulTerpenuhi}
              onChange={(event) => setHaulTerpenuhi(event.target.checked)}
              style={{ marginTop: 5 }}
            />
            Harta telah memenuhi ketentuan haul menurut pedoman yang berlaku.
          </label>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#57534e' }}>
            Centang hanya setelah memeriksa ketentuan haul untuk jenis harta
            yang dihitung.
          </p>
        </div>
      )}

      <div
        aria-live="polite"
        style={{
          marginTop: 24,
          padding: 22,
          borderRadius: 16,
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
        }}
      >
        <p style={{ margin: 0, color: '#166534', fontWeight: 800 }}>
          HASIL SIMULASI
        </p>


        <h3
          style={{
            color: '#14532d',
            fontSize: 'clamp(25px, 4vw, 34px)',
            overflowWrap: 'anywhere',
          }}
        >
          {isPertanian
            ? `${new Intl.NumberFormat('id-ID', {
                maximumFractionDigits: 2,
              }).format(hasil.jumlah)} kg hasil panen`
            : money(hasil.jumlah)}
        </h3>


        <p>
          Dasar perhitungan:{' '}
          <strong>
            {isPertanian
              ? `${new Intl.NumberFormat('id-ID').format(hasil.dasar)} kg`
              : money(hasil.dasar)}
          </strong>
        </p>

        {!isFitrah && (
          <p>
            Acuan nisab:{' '}
            <strong>
              {isPertanian
                ? `${new Intl.NumberFormat('id-ID').format(hasil.batas)} kg`
                : money(hasil.batas)}
            </strong>
          </p>
        )}

        {isPertanian && (
          <p>
            Perkiraan nilai panen:{' '}
            <strong>{money(nilai.hasil * nilai.hargaPanen)}</strong>
          </p>
        )}

        <p>
          Kadar simulasi:{' '}
          <strong>{new Intl.NumberFormat('id-ID', {
            style: 'percent',
            maximumFractionDigits: 2,
          }).format(hasil.kadar)}</strong>
        </p>

        <p>
          Status simulasi:{' '}
          <strong>
            {hasil.wajib
              ? 'Acuan simulasi terpenuhi; konfirmasikan ketentuan yang berlaku'
              : hasil.perluHaul && !hasil.haulValid
                ? 'Belum dihitung: konfirmasi ketentuan haul terlebih dahulu'
                : 'Acuan belum terpenuhi atau data belum mencukupi'}
          </strong>
        </p>

        <p style={{ lineHeight: 1.8 }}>{hasil.keterangan}</p>
      </div>

      <p
        style={{
          marginTop: 18,
          color: '#57534e',
          fontSize: 13,
          lineHeight: 1.8,
        }}
      >
        Catatan: nilai nisab, haul, harta yang wajib dizakati, hasil panen,
        dan zakat fitrah perlu mengacu pada ketentuan resmi yang relevan.
        Kalkulator ini tidak mengambil data resmi secara langsung dan tidak
        menggantikan konsultasi kepada BAZNAS, LAZ resmi, atau petugas yang
        kompeten.
      </p>
    </section>
  );
}
