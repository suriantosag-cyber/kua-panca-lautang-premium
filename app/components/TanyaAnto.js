"use client";

import { useState } from "react";

export default function TanyaAnto() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAnto(e) {
    e.preventDefault();

    if (!question.trim() || loading) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Tanya Anto belum dapat menjawab.");
      }

      setAnswer(data.answer || "Maaf, jawaban belum tersedia.");
    } catch (error) {
      setAnswer(error.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          zIndex: 9999,
          border: "none",
          borderRadius: "999px",
          padding: "14px 20px",
          background: "#0f766e",
          color: "white",
          fontSize: "16px",
          fontWeight: "700",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        }}
      >
        Tanya Anto
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            bottom: "80px",
            zIndex: 9998,
            width: "min(360px, calc(100vw - 40px))",
            background: "white",
            borderRadius: "18px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            overflow: "hidden",
            border: "1px solid #ddd",
          }}
        >
          <div
            style={{
              padding: "16px",
              background: "#0f766e",
              color: "white",
            }}
          >
            <strong>Tanya Anto</strong>
            <div style={{ fontSize: "13px", marginTop: "4px" }}>
              Asisten informasi KUA Panca Lautang
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {!answer && !loading && (
              <p style={{ marginTop: 0 }}>
                Silakan tanyakan tentang pernikahan atau informasi KUA.
              </p>
            )}

            {loading && <p>Tanya Anto sedang menjawab...</p>}

            {answer && (
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.5",
                }}
              >
                {answer}
              </div>
            )}
          </div>

          <form
            onSubmit={askAnto}
            style={{
              display: "flex",
              gap: "8px",
              padding: "12px",
              borderTop: "1px solid #eee",
            }}
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Tulis pertanyaan..."
              style={{
                flex: 1,
                minWidth: 0,
                padding: "11px",
                border: "1px solid #ccc",
                borderRadius: "10px",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "10px 14px",
                background: "#0f766e",
                color: "white",
                cursor: loading ? "wait" : "pointer",
              }}
            >
              Kirim
            </button>
          </form>
        </div>
      )}
    </>
  );
}

