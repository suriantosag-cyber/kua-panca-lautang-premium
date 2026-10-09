export const metadata = {
title: "Bimbingan Perkawinan dan Keluarga Sakinah | KUA Panca Lautang",
description: "Informasi bimbingan perkawinan, persiapan calon pengantin, dan pembinaan keluarga sakinah di KUA Kecamatan Panca Lautang.",
};

export default function BimbinganPerkawinanPage() {
return ( <main className="section"> <div className="wrap"> <a className="btn" href="/">← Kembali ke Beranda</a>


    <article className="card" style={{ marginTop: 24, maxWidth: 900, marginInline: "auto" }}>
      <div className="icon">BK</div>
      <h1 style={{ color: "var(--brand)", lineHeight: 1.25 }}>
        Bimbingan Perkawinan dan Keluarga Sakinah
      </h1>
      <p>
        Kantor Urusan Agama Kecamatan Panca Lautang menyediakan informasi
        bimbingan untuk membantu calon pengantin mempersiapkan kehidupan
        rumah tangga dan mendorong terbentuknya keluarga yang harmonis,
        bertanggung jawab, serta berlandaskan nilai-nilai agama.
      </p>

      <h2>Materi Bimbingan</h2>
      <ul style={{ lineHeight: 1.9, color: "var(--muted)" }}>
        <li>Persiapan membangun kehidupan rumah tangga.</li>
        <li>Hak dan kewajiban suami istri.</li>
        <li>Komunikasi yang sehat dan penyelesaian konflik keluarga.</li>
        <li>Penguatan ketahanan keluarga dan pengasuhan anak.</li>
        <li>Pembinaan keluarga sakinah, mawaddah, wa rahmah.</li>
      </ul>

      <h2>Bagaimana memperoleh informasi?</h2>
      <p>
        Masyarakat dapat menghubungi atau datang ke KUA Kecamatan Panca
        Lautang untuk menanyakan jadwal, mekanisme pendaftaran, dan
        ketersediaan bimbingan. Jadwal serta persyaratan mengikuti
        ketentuan resmi yang berlaku.
      </p>

      <div style={{ background: "#e5f5ee", padding: 18, borderRadius: 14, marginTop: 24 }}>
        <strong>Catatan layanan</strong>
        <p style={{ marginTop: 8 }}>
          Silakan konfirmasi jadwal dan persyaratan langsung kepada KUA
          sebelum datang agar memperoleh informasi terbaru.
        </p>
      </div>
    </article>
  </div>
</main>


);
}

