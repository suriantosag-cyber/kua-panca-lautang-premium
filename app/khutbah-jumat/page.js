
import KhutbahBugis from "../components/KhutbahBugis";

export const metadata = {
  title: "Khutbah Jumat | KUA Panca Lautang",
  description:
    "Kumpulan naskah khutbah Jumat KUA Panca Lautang.",
};

export default function KhutbahJumatPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 16px",
        background: "#f3f7f3",
      }}
    >
      <header
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "20px 0",
        }}
      >
        <h1 style={{ color: "#17633a" }}>Khutbah Jumat</h1>
        <p>
          Naskah khutbah pertama, khutbah kedua, dan doa penutup
          dalam satu halaman khusus.
        </p>
        <a href="/" style={{ color: "#17633a" }}>
          ← Kembali ke Beranda
        </a>
      </header>

      <KhutbahBugis />
    </main>
  );
}
