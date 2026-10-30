
"use client";

import { useEffect, useState } from "react";

function getYouTubeId(url = "") {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "m.youtube.com"
    ) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      if (["embed", "shorts"].includes(parts[0])) {
        return parts[1] || "";
      }
    }
  } catch {
    return "";
  }

  return "";
}

export default function KajianMediaPublik() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadMedia() {
      try {
        const response = await fetch(
          "/api/kajian-keluarga-sakinah",
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Media belum dapat dimuat.");
        }

        const result = await response.json();

        if (active && result.ok && Array.isArray(result.data)) {
          setItems(result.data);
        }
      } catch (error) {
        console.error("Gagal memuat media kajian:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMedia();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <p className="py-6 text-center text-gray-500">
        Memuat media kajian...
      </p>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const youtubeId =
          item.file_type === "youtube"
            ? getYouTubeId(item.source_url || item.file_url || "")
            : "";

        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            {item.file_type === "image" && item.file_url && (
              <img
                src={item.file_url}
                alt={item.title}
                loading="lazy"
                className="aspect-video w-full object-cover"
              />
            )}

            {item.file_type === "video" && item.file_url && (
              <video
                src={item.file_url}
                controls
                preload="metadata"
                className="aspect-video w-full bg-black object-contain"
              >
                Browser Anda tidak mendukung pemutar video.
              </video>
            )}

            {item.file_type === "youtube" && youtubeId && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
                  youtubeId
                )}`}
                title={item.title}
                className="aspect-video w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}

            <div className="p-5">
              {item.category && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {item.category}
                </p>
              )}

              <h3 className="text-lg font-bold text-gray-900">
                {item.title}
              </h3>

              {item.description && (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
