"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

function buatSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function MateriKajianPublik() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/api/kajian-keluarga-sakinah", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Materi belum dapat dimuat.");
        return response.json();
      })
      .then((result) => {
        if (active && result.ok && Array.isArray(result.data)) setItems(result.data);
      })
      .catch((error) => console.error("Gagal memuat materi kajian:", error))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function bagikanStatus(item, url) {
    const text = `${item.title}\\n\\n${item.excerpt || "Baca materi Kajian Keluarga Sakinah dari KUA Panca Lautang."}\\n\\nBaca selengkapnya: ${url}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: item.title, text, url });
      } catch (error) {
        if (error?.name !== "AbortError") {
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
        }
      }
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  async function salinTautan(item, url) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(null), 2200);
    } catch {
      window.prompt("Salin tautan materi ini:", url);
    }
  }

  if (loading || items.length === 0) return null;

  return (
    <section className={styles.section} id="materi-dari-admin">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>MATERI PILIHAN PENYULUH</p>
        <h2>Materi Kajian dari KUA</h2>
        <p>Materi yang disusun dan diterbitkan langsung oleh pengelola KUA Panca Lautang.</p>
      </div>
      <div className={styles.articleGrid}>
        {items.map((item, index) => {
          const slug = buatSlug(item.title || String(item.id));
          const url = `https://kua-pancalautang.my.id/kajian-keluarga-sakinah#materi-${slug}`;
          const encodedUrl = encodeURIComponent(url);
          const shareText = encodeURIComponent(`${item.title} — KUA Panca Lautang`);
          return (
            <article className={styles.articleCard} id={`materi-${slug}`} key={item.id}>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <p className={styles.category}>{item.category || "Keluarga Sakinah"}</p>
              <h3>{item.title}</h3>
              {item.excerpt && <p className={styles.summary}>{item.excerpt}</p>}
              <details className={styles.details}>
                <summary>Baca materi lengkap</summary>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, marginTop: 12 }}>{item.content}</div>
              </details>
              <div className={styles.shareArea} aria-label={`Bagikan materi ${item.title}`}>
                <p className={styles.shareLabel}>Bagikan materi ini</p>
                <div className={styles.shareButtons}>
                  <button type="button" className={styles.shareWhatsApp} onClick={() => bagikanStatus(item, url)}>
                    Status WA
                  </button>
                  <a className={styles.shareButton} href={`https://wa.me/?text=${encodeURIComponent(`${item.title}\\n${url}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  <a className={styles.shareButton} href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">Facebook</a>
                  <a className={styles.shareButton} href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer">Telegram</a>
                  <a className={styles.shareButton} href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer">X</a>
                  <button type="button" className={styles.shareButton} onClick={() => salinTautan(item, url)}>
                    {copiedId === item.id ? "Tersalin ✓" : "Salin tautan"}
                  </button>
                </div>
                <p className={styles.shareHint}>Untuk Status WhatsApp, pilih WhatsApp lalu pilih tab Status pada menu berbagi di ponsel.</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
