const NEWS = [
  {
    title: "Persamaan Pesantren dan Pramuka, Punya Misi Membentuk Karakter Bangsa",
    url: "https://kemenag.go.id/nasional/persamaan-pesantren-dan-pramuka-punya-misi-membentuk-karakter-bangsa-HK5MQ",
    date: "1 Oktober 2026",
    source: "Kementerian Agama Republik Indonesia",
    excerpt:
      "Menteri Agama menegaskan bahwa pesantren dan gerakan Pramuka memiliki misi yang sama dalam membentuk karakter generasi bangsa melalui kemandirian, akhlak, pendidikan karakter, dan kemampuan bersosialisasi.",
    image_url: ""
  },
  {
    title: "Saka Amal Bakti, Wadah Gerakan Pramuka Pelajar Binaan Kementerian Agama",
    url: "https://kemenag.go.id/nasional/saka-amal-bakti-wadah-gerakan-pramuka-pelajar-binaan-kementerian-agama-6qbKx",
    date: "1 Oktober 2026",
    source: "Kementerian Agama Republik Indonesia",
    excerpt:
      "Kementerian Agama meluncurkan Saka Amal Bakti sebagai wadah bagi santri, mahasiswa, dan pelajar binaan Kemenag untuk mengembangkan kegiatan kepramukaan yang mendorong kehidupan beragama yang harmonis, toleran, dan damai.",
    image_url: ""
  },
  {
    title: "Usai IGIC 2026, Menag Siapkan Dialog Imam dan Pemimpin Lintas Agama",
    url: "https://kemenag.go.id/nasional/usai-igic-2026-menag-siapkan-dialog-imam-dan-pemimpin-lintas-agama-doPhn",
    date: "1 Oktober 2026",
    source: "Kementerian Agama Republik Indonesia",
    excerpt:
      "Setelah International Grand Imams Conference 2026, Kementerian Agama menyiapkan dialog lanjutan yang melibatkan pemimpin rumah ibadah dan tokoh lintas agama untuk memperkuat perdamaian, kerukunan, dan diplomasi keagamaan.",
    image_url: ""
  }
];

export async function GET() {
  return Response.json({
    ok: true,
    source: "Kementerian Agama Republik Indonesia",
    count: NEWS.length,
    data: NEWS,
    fetchedAt: new Date().toISOString()
  });
}