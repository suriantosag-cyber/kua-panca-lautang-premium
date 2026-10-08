"use client";

import { useEffect, useState } from "react";

export default function JadwalNikahAdmin() {
  const kosong = {
    tanggal: "",
    waktu: "",
    pengantin: "",
    desa: "",
    lokasi: "",
    status: "tampil",
  };

  const [jadwal, setJadwal] = useState([]);
  const [form, setForm] = useState(kosong);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadJadwal() {
    try {
      const response = await fetch("/api/jadwal-nikah?admin=1", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal mengambil jadwal nikah.");
      }

      setJadwal(result.data || []);
    } catch (error) {
      console.error(error);
      setMessage(`Gagal mengambil jadwal: ${error.message}`);
    }
  }

  useEffect(() => {
    loadJadwal();
  }, []);

  function ubahForm(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(kosong);
    setEditingId(null);
  }

  async function simpan(e) {
    e.preventDefault();

    if (
      !form.tanggal ||
      !form.waktu ||
      !form.pengantin.trim() ||
      !form.desa.trim() ||
      !form.lokasi.trim()
    ) {
      setMessage("Semua data jadwal wajib diisi.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/jadwal-nikah", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId
            ? { id: editingId, ...form }
            : form
        ),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal menyimpan jadwal.");
      }

      setMessage(
        editingId
          ? "Jadwal berhasil diperbarui."
          : "Jadwal berhasil ditambahkan."
      );

      resetForm();
      await loadJadwal();
    } catch (error) {
      console.error(error);
      setMessage(`Gagal menyimpan jadwal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function editJadwal(item) {
    setEditingId(item.id);
    setForm({
      tanggal: item.tanggal || "",
      waktu: item.waktu ? String(item.waktu).slice(0, 5) : "",
      pengantin: item.pengantin || "",
      desa: item.desa || "",
      lokasi: item.lokasi || "",
      status: item.status || "tampil",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function ubahStatus(item) {
    const statusBaru = item.status === "tampil" ? "sembunyi" : "tampil";

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/jadwal-nikah", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          status: statusBaru,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal mengubah status jadwal.");
      }

      setMessage(
        statusBaru === "tampil"
          ? "Jadwal ditampilkan."
          : "Jadwal disembunyikan."
      );

      await loadJadwal();
    } catch (error) {
      console.error(error);
      setMessage(`Gagal mengubah status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function hapusJadwal(id) {
    const yakin = window.confirm("Yakin ingin menghapus jadwal ini?");

    if (!yakin) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/jadwal-nikah", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Gagal menghapus jadwal.");
      }

      setMessage("Jadwal berhasil dihapus.");
      await loadJadwal();
    } catch (error) {
      console.error(error);
      setMessage(`Gagal menghapus jadwal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 5px 20px rgba(0,0,0,.06)",
        marginTop: 24,
      }}
    >
      <h2>Jadwal Nikah</h2>

      <p style={{ color: "#667085" }}>
        Kelola jadwal akad nikah yang akan ditampilkan di website publik.
      </p>

      <form onSubmit={simpan}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <div>
            <label>Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={ubahForm}
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
                border: "1px solid #d0d5dd",
                borderRadius: 8,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label>Waktu</label>
            <input
              type="time"
              name="waktu"
              value={form.waktu}
              onChange={ubahForm}
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
                border: "1px solid #d0d5dd",
                borderRadius: 8,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label>Nama Pengantin</label>
            <input
              name="pengantin"
              value={form.pengantin}
              onChange={ubahForm}
              placeholder="Contoh: Ahmad & Aisyah"
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
                border: "1px solid #d0d5dd",
                borderRadius: 8,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label>Desa/Kelurahan</label>
            <input
              name="desa"
              value={form.desa}
              onChange={ubahForm}
              placeholder="Contoh: Bilokka"
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
                border: "1px solid #d0d5dd",
                borderRadius: 8,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label>Lokasi Akad</label>
            <input
              name="lokasi"
              value={form.lokasi}
              onChange={ubahForm}
              placeholder="Contoh: Desa Corawali"
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
                border: "1px solid #d0d5dd",
                borderRadius: 8,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 18px",
              border: 0,
              borderRadius: 8,
              background: "#146c43",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading
              ? "Memproses..."
              : editingId
                ? "Simpan Perubahan"
                : "Tambah Jadwal"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                marginLeft: 10,
                padding: "10px 18px",
                border: "1px solid #d0d5dd",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>

      {message && (
        <p
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f0fdf4",
            borderRadius: 8,
          }}
        >
          {message}
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        {jadwal.length === 0 ? (
          <p style={{ color: "#667085" }}>
            Belum ada jadwal nikah.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {jadwal.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 16,
                  background: "#fafafa",
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  {item.pengantin}
                </h3>

                <p>
                  <strong>Tanggal:</strong>{" "}
                  {item.tanggal}
                </p>

                <p>
                  <strong>Waktu:</strong>{" "}
                  {String(item.waktu || "").slice(0, 5)} WITA
                </p>

                <p>
                  <strong>Desa/Kelurahan:</strong>{" "}
                  {item.desa}
                </p>

                <p>
                  <strong>Lokasi:</strong>{" "}
                  {item.lokasi}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {item.status}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 14,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => editJadwal(item)}
                    disabled={loading}
                    style={{
                      padding: "8px 14px",
                      border: 0,
                      borderRadius: 8,
                      background: "#146c43",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => ubahStatus(item)}
                    disabled={loading}
                    style={{
                      padding: "8px 14px",
                      border: "1px solid #d0d5dd",
                      borderRadius: 8,
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {item.status === "tampil"
                      ? "Sembunyikan"
                      : "Tampilkan"}
                  </button>

                  <button
                    type="button"
                    onClick={() => hapusJadwal(item.id)}
                    disabled={loading}
                    style={{
                      padding: "8px 14px",
                      border: 0,
                      borderRadius: 8,
                      background: "#b42318",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
