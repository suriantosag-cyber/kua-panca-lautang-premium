"use client";

export default function ShareBerita({ title }) {
  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    padding: "9px 15px",
    borderRadius: 999,
    border: "1px solid #dce6df",
    background: "#fff",
    color: "#244b3a",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background .2s ease, border-color .2s ease"
  };

  return (
    <div className="beritaShare" aria-label="Bagikan berita ini">
      <span className="beritaShareLabel">Bagikan:</span>
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
        style={{ ...buttonStyle, background: "#eaf7ef", borderColor: "#cce9d5", color: "#17643d" }}
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
        style={buttonStyle}
      >
        Facebook
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
        style={buttonStyle}
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
        style={buttonStyle}
      >
        Salin tautan
      </button>
    </div>
  );
}
