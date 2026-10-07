const SOURCE_URL = "https://kemenag.go.id/api/articles";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  try {
    const response = await fetch(
      `${SOURCE_URL}?category=nasional&limit=5&page=1`,
      {
        next: { revalidate: 3600 },
        headers: {
          "User-Agent": "KUA-Panca-Lautang/1.0",
          "Accept": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Kemenag HTTP ${response.status}`);
    }

    const result = await response.json();

    const articles = Array.isArray(result.data) ? result.data : [];

    const data = articles.map((article) => ({
      id: article.id,
      title: article.title,
      url: article.path
        ? `https://kemenag.go.id${article.path}`
        : "https://kemenag.go.id/nasional",
      date: article.publishedAt || "",
      source: "Kementerian Agama Republik Indonesia",
      excerpt: article.preview || article.caption || "",
      image:
        article.image?.medium ||
        article.image?.thumbnail ||
        ""
    }));

    return Response.json({
      ok: true,
      source: "Kementerian Agama Republik Indonesia",
      data,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        source: "Kementerian Agama Republik Indonesia",
        data: [],
        error: "Gagal mengambil berita terbaru Kemenag"
      },
      { status: 200 }
    );
  }
}

