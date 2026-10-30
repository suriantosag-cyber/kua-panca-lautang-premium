import data from "./data.json";
import WakafTableClient from "./WakafTableClient";

export const metadata = {
  title: "Data Objek Wakaf 2026 | KUA Panca Lautang",
  description:
    "Informasi data objek wakaf tahun 2026 di Kecamatan Panca Lautang, Kabupaten Sidenreng Rappang.",
};

function statusLabel(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "√" || normalized === "v" || normalized === "✓") {
    return { text: "Ada", className: "wakaf-status wakaf-yes" };
  }
  if (normalized === "x" || normalized === "×") {
    return { text: "Belum ada", className: "wakaf-status wakaf-no" };
  }
  return { text: "Belum diisi", className: "wakaf-status wakaf-empty" };
}

export default function DataWakafPage() {
  return (
    <main className="wakaf-page">
      <style>{`
        .wakaf-page{--ink:#17352c;--green:#176b4d;--muted:#66756e;max-width:1240px;margin:0 auto;padding:32px 20px 64px;color:#20342d}
        .wakaf-hero{position:relative;overflow:hidden;border-radius:24px;padding:clamp(24px,5vw,48px);background:linear-gradient(135deg,#103d2e,#176b4d 62%,#2d8060);color:#fff;box-shadow:0 18px 45px rgba(16,61,46,.16)}
        .wakaf-eyebrow{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;opacity:.82}
        .wakaf-hero h1{font-size:clamp(26px,4vw,42px);line-height:1.15;margin:12px 0 10px;font-weight:850;letter-spacing:-.025em}
        .wakaf-hero p{margin:0;color:#e2f1e9;line-height:1.7;max-width:680px}
        .wakaf-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:22px 0}
        .wakaf-stat{border:1px solid #e0e9e3;border-radius:16px;padding:18px;background:#fff;box-shadow:0 4px 16px rgba(23,53,44,.04)}
        .wakaf-stat strong{display:block;font-size:28px;line-height:1.2;color:var(--green)}
        .wakaf-stat span{display:block;color:var(--muted);font-size:13px;margin-top:6px}
        .wakaf-toolbar{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:22px 0 14px}
        .wakaf-search,.wakaf-select{font:inherit;min-height:44px;border:1px solid #cfdad2;border-radius:12px;padding:10px 13px;background:#fff;color:#20342d;min-width:0}
        .wakaf-search{flex:1 1 280px}
        .wakaf-select{flex:0 1 220px}
        .wakaf-download{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border-radius:12px;background:#176b4d;color:#fff;font-weight:750;text-decoration:none;white-space:nowrap}
        .wakaf-download:hover{background:#10553c}
        .wakaf-count{font-size:13px;color:var(--muted);margin:10px 0 12px}
        .wakaf-table-wrap{overflow:auto;border:1px solid #dfe8e1;border-radius:16px;background:#fff}
        .wakaf-table{width:100%;border-collapse:separate;border-spacing:0;min-width:1050px;font-size:13px}
        .wakaf-table th{position:sticky;top:0;background:#edf5ef;color:#244b39;text-align:left;padding:13px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;border-bottom:1px solid #dfe8e1}
        .wakaf-table td{padding:13px 12px;border-bottom:1px solid #edf1ed;vertical-align:top;line-height:1.5}
        .wakaf-table tbody tr:hover{background:#f8fbf8}
        .wakaf-table tbody tr:last-child td{border-bottom:0}
        .wakaf-name{font-weight:750;color:#17352c;min-width:180px}
        .wakaf-status{display:inline-flex;align-items:center;border-radius:999px;padding:4px 8px;font-size:11px;font-weight:750;white-space:nowrap}
        .wakaf-yes{background:#e2f5e9;color:#176b4d}.wakaf-no{background:#fff0e7;color:#9a451e}.wakaf-empty{background:#f1f3f1;color:#5f6b64}
        .wakaf-note{margin-top:18px;padding:15px 17px;border-radius:12px;background:#f5f8f5;border:1px solid #e1e9e2;color:#52635a;font-size:13px;line-height:1.65}
        .wakaf-empty-state{text-align:center;padding:28px;color:#66756e}
        @media(max-width:640px){.wakaf-page{padding:20px 12px 44px}.wakaf-hero{border-radius:18px}.wakaf-stats{grid-template-columns:1fr;gap:10px}.wakaf-stat{padding:14px}.wakaf-stat strong{font-size:24px}.wakaf-toolbar>*{width:100%;flex-basis:100%}.wakaf-download{width:100%;box-sizing:border-box}}
      `}</style>
      <section className="wakaf-hero">
        <div className="wakaf-eyebrow">Kantor Urusan Agama Kecamatan Panca Lautang</div>
        <h1>Data Objek Wakaf Tahun 2026</h1>
        <p>
          Informasi objek wakaf di Kecamatan Panca Lautang, Kabupaten Sidenreng
          Rappang. Data ditampilkan berdasarkan berkas sumber yang diterima.
        </p>
      </section>

      <section className="wakaf-stats" aria-label="Ringkasan data wakaf">
        <div className="wakaf-stat"><strong>{data.length}</strong><span>Total entri dalam berkas</span></div>
        <div className="wakaf-stat"><strong>{data.filter((item) => item.peruntukan.toLowerCase() === "masjid").length}</strong><span>Peruntukan tercatat sebagai masjid</span></div>
        <div className="wakaf-stat"><strong>{new Set(data.map((item) => item.lokasi).filter(Boolean)).size}</strong><span>Desa/kelurahan tercatat</span></div>
      </section>

      <WakafTableClient data={data} />
    </main>
  );
}

