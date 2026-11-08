import KhutbahBugis from "../components/KhutbahBugis";
import { createSupabaseServerClient } from "../../lib/supabase-server";

export const metadata = {
  title: "Khutbah Jumat",
  description:
    "Kumpulan naskah khutbah Jumat Bahasa Bugis Latin KUA Panca Lautang.",
  alternates: {
    canonical: "/khutbah-jumat",
  },
  openGraph: {
    title: "Khutbah Jumat | KUA Panca Lautang",
    description:
      "Kumpulan naskah khutbah Jumat Bahasa Bugis Latin KUA Panca Lautang.",
    url: "/khutbah-jumat",
    type: "website",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function KhutbahJumatPage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("khutbah_jumat")
    .select(
      "id,week_start,title,theme,language,khutbah_pertama,khutbah_kedua,doa_penutup,referensi,published_at"
    )
    .order("week_start", { ascending: false })
    .limit(1)
    .maybeSingle();

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

      <KhutbahBugis
        khutbah={error ? null : data}
        gagalMemuat={Boolean(error)}
      />
    </main>
  );
}