const pageTitle = "Materi Dakwah dan Panduan Ibadah";
const pageDescription =
  "Pelajari panduan dasar wudu, persiapan salat, salat lima waktu, kuis pemahaman ibadah, serta materi khutbah untuk edukasi keagamaan masyarakat dari KUA Kecamatan Panca Lautang.";

export const metadata = {
  alternates: { canonical: "/materi-dakwah" },
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: "Materi Dakwah dan Panduan Ibadah | KUA Panca Lautang",
    description: pageDescription,
    url: "/materi-dakwah",
    type: "website",
  },
  twitter: {
    title: "Materi Dakwah dan Panduan Ibadah | KUA Panca Lautang",
    description: pageDescription,
  },
};

export default function MateriDakwahLayout({ children }) {
  return children;
}
