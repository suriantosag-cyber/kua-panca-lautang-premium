"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function MateriKajianPublik() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading || items.length === 0) return null;

  return (
    <section className={styles.section} id="materi-dari-admin">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>MATERI PILIHAN PENYULUH</p>
        <h2>Materi Kajian dari KUA</h2>
        <p>Materi yang disusun dan diterbitkan langsung oleh pengelola KUA Panca Lautang.</p>
      </div>
      <div className={styles.articleGrid}>
        {items.map((item, index) => (
          <article className={styles.articleCard} key={item.id}>
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <p className={styles.category}>{item.category || "Keluarga Sakinah"}</p>
            <h3>{item.title}</h3>
            {item.excerpt && <p className={styles.summary}>{item.excerpt}</p>}
            <details className={styles.details}>
              <summary>Baca materi lengkap</summary>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, marginTop: 12 }}>{item.content}</div>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
