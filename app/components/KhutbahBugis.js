"use client";

import { useState } from "react";

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  const bagian = tanggal.split("-");
  if (bagian.length !== 3) return tanggal;

  const date = new Date(`${tanggal}T00:00:00Z`);

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatReferensi(referensi) {
  if (!Array.isArray(referensi)) return [];

  return referensi.map((item, index) => {
    if (typeof item === "string") {
      return { id: index, text: item };
    }

    if (item && typeof item === "object") {
      const text =
        item.keterangan ||
        item.referensi ||
        item.title ||
        item.nama ||
        item.name ||
        item.sumber ||
        item.source;

      return {
        id: index,
        text: typeof text === "string" ? text : null,
      };
    }

    return { id: index, text: null };
  }).filter((item) => item.text);
}

export default function KhutbahBugis({
  khutbah,
  gagalMemuat = false,
}) {
  const [pesan, setPesan] = useState("");

  if (gagalMemuat) {
    return (
      <section className="khutbah-bugis">
        <h2>Khutbah Jumat</h2>
        <p role="status">
          Naskah khutbah belum dapat dimuat. Silakan coba kembali beberapa saat lagi.
        </p>
      </section>
    );
  }

  if (!khutbah) {
    return (
      <section className="khutbah-bugis">
        <h2>Khutbah Jumat</h2>
        <p>
          Belum ada naskah khutbah Jumat yang diterbitkan.
          Silakan kunjungi kembali halaman ini pada kesempatan berikutnya.
        </p>
      </section>
    );
  }

  const referensi = formatReferensi(khutbah.referensi);

  const naskahLengkap = [
    khutbah.title,
    `TEMA: ${khutbah.theme}`,
    `BAHASA: ${khutbah.language || "Bugis Latin"}`,
    `MINGGU: ${formatTanggal(khutbah.week_start)}`,
    "",
    "KHUTBAH PERTAMA",
    "",
    khutbah.khutbah_pertama,
    "",
    "KHUTBAH KEDUA",
    "",
    khutbah.khutbah_kedua,
    "",
    "DOA PENUTUP",
    "",
    khutbah.doa_penutup,
    "",
    ...(referensi.length
      ? ["REFERENSI", ...referensi.map((item) => `- ${item.text}`)]
      : []),
  ].filter((item) => item !== null && item !== undefined).join("\n");

  async function salinNaskah() {
    try {
      await navigator.clipboard.writeText(naskahLengkap);
      setPesan("Naskah berhasil disalin.");
    } catch {
      setPesan("Penyalinan otomatis gagal. Silakan salin teks secara manual.");
    }
  }

  function bagikanWhatsApp() {
    const url = window.location.href;
    const teks = `Naskah Khutbah Jumat\n${khutbah.title}\nBaca di sini:\n${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(teks)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function renderNaskah(teks) {
    return teks.split(/\r?\n/).map((baris, index) => {
      const arab = /[\u0600-\u06FF]/.test(baris);

      const judul =
        /^KHUTBAH|^DOA PENUTUP|^REFERENSI|^TEMA:|^BAHASA:|^MINGGU:/.test(
          baris
        );

      return (
        <p
          key={index}
          className={[
            arab ? "baris-arab" : "baris-naskah",
            judul ? "baris-judul" : "",
          ].join(" ")}
        >
          {baris || "\u00A0"}
        </p>
      );
    });
  }

  return (
    <section className="khutbah-bugis">
      <header className="khutbah-header">
        <h2>{khutbah.title}</h2>
        <p className="khutbah-tema">{khutbah.theme}</p>
        <p>
          Bahasa: {khutbah.language || "Bugis Latin"}
        </p>
        <p>
          Pekan khutbah: {formatTanggal(khutbah.week_start)}
        </p>
        <p className="khutbah-catatan">
          Naskah yang telah diterbitkan oleh pengelola KUA Panca Lautang.
        </p>
      </header>

      <div className="khutbah-actions">
        <button type="button" onClick={salinNaskah}>
          Salin Naskah Lengkap
        </button>
        <button type="button" onClick={() => window.print()}>
          Cetak
        </button>
        <button type="button" onClick={bagikanWhatsApp}>
          Bagikan WhatsApp
        </button>
      </div>

      {pesan && <p role="status">{pesan}</p>}

      <article className="khutbah-content">
        <h3>Khutbah Pertama</h3>
        {renderNaskah(khutbah.khutbah_pertama)}

        <h3>Khutbah Kedua</h3>
        {renderNaskah(khutbah.khutbah_kedua)}

        <h3>Doa Penutup</h3>
        {renderNaskah(khutbah.doa_penutup)}

        {referensi.length > 0 && (
          <div className="khutbah-referensi">
            <h3>Referensi</h3>
            <ul>
              {referensi.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <style jsx>{`
        .khutbah-bugis {
          margin: 24px auto;
          padding: 24px;
          max-width: 1000px;
          border: 1px solid #d8e5d8;
          border-radius: 16px;
          background: #fff;
          color: #183b2a;
        }

        .khutbah-header {
          margin-bottom: 20px;
        }

        .khutbah-header h2 {
          margin: 0 0 8px;
          color: #17633a;
        }

        .khutbah-header p {
          margin: 6px 0;
          line-height: 1.6;
        }

        .khutbah-tema {
          font-weight: 700;
        }

        .khutbah-catatan {
          color: #666;
          font-size: 14px;
        }

        .khutbah-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
        }

        button {
          padding: 10px 16px;
          border: 0;
          border-radius: 8px;
          background: #17633a;
          color: #fff;
          cursor: pointer;
          font-weight: 600;
        }

        button:hover {
          background: #104b2b;
        }

        .khutbah-content {
          padding: 18px;
          border-radius: 10px;
          background: #f7faf7;
          overflow-wrap: anywhere;
        }

        .khutbah-content h3 {
          margin: 24px 0 12px;
          color: #17633a;
        }

        .baris-naskah {
          margin: 0;
          white-space: pre-wrap;
          font-family: Arial, "Noto Sans", sans-serif;
          font-size: 17px;
          line-height: 1.9;
          color: #20362c;
        }

        .baris-judul {
          margin-top: 14px;
          font-weight: 750;
          color: #17633a;
        }

        .baris-arab {
          margin: 18px 0;
          direction: rtl;
          text-align: right;
          font-family: "Noto Naskh Arabic", "Amiri", serif;
          font-size: 28px;
          line-height: 2;
          color: #183b2a;
        }

        .khutbah-referensi li {
          margin-bottom: 8px;
          line-height: 1.7;
        }

        @media (max-width: 600px) {
          .khutbah-bugis {
            padding: 14px;
          }

          .khutbah-content {
            padding: 12px;
          }

          .baris-naskah {
            font-size: 16px;
          }

          .baris-arab {
            font-size: 24px;
          }
        }

        @media print {
          :global(body *) {
            visibility: hidden !important;
          }

          :global(.khutbah-bugis),
          :global(.khutbah-bugis *) {
            visibility: visible !important;
          }

          :global(.khutbah-bugis) {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            margin: 0;
            padding: 0;
            border: 0;
            color: #000;
          }

          .khutbah-header,
          .khutbah-actions,
          [role="status"] {
            display: none !important;
          }

          .khutbah-content {
            padding: 0;
            background: #fff;
            overflow: visible;
          }

          .baris-naskah {
            color: #000;
            font-size: 12pt;
            line-height: 1.7;
          }

          .baris-arab {
            color: #000;
            font-size: 22pt;
            line-height: 1.8;
          }
        }
      `}</style>
    </section>
  );
}