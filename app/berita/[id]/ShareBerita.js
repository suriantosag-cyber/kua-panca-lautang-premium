"use client";

export default function ShareBerita({ title }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center",
        margin: "0 0 28px"
      }}
    >
      <strong style={{ marginRight: 4 }}>Bagikan Berita:</strong>
      <button
        type="button"
        onClick={() => {
          const url = window.location.href;
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
            "_blank",
            "noopener,noreferrer"
          );
        }}
        style={{ padding: "10px 16px", borderRadius: 999, border: "none", background: "#25D366", color: "#fff", fontWeight: 700, cursor: "pointer" }}
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.location.href;
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank",
            "noopener,noreferrer"
          );
        }}
        style={{ padding: "10px 16px", borderRadius: 999, border: "none", background: "#1877F2", color: "#fff", fontWeight: 700, cursor: "pointer" }}
      >
        f Facebook
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.location.href;
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            "_blank",
            "noopener,noreferrer"
          );
        }}
        style={{ padding: "10px 16px", borderRadius: 999, border: "none", background: "#000", color: "#fff", fontWeight: 700, cursor: "pointer" }}
      >
        X
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            alert("Tautan berita berhasil disalin.");
          } catch {
            alert("Gagal menyalin tautan.");
          }
        }}
        style={{ padding: "10px 16px", borderRadius: 999, border: "1px solid #ddd", background: "#fff", color: "#222", fontWeight: 700, cursor: "pointer" }}
      >
        Salin Link
      </button>
    </div>
  );
}
