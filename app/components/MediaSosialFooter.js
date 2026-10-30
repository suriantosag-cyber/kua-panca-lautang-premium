export default function MediaSosialFooter() {
  const linkStyle = {
    display: 'inline-block',
    color: '#bfdbfe',
    textDecoration: 'none',
    margin: '7px 14px 7px 0',
    overflowWrap: 'anywhere',
  };

  const columnStyle = {
    minWidth: 0,
  };

  return (
    <footer
      style={{
        background: '#0f172a',
        color: '#f8fafc',
        padding: '36px clamp(20px, 4vw, 64px) 22px',
        marginTop: '32px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '32px',
        }}
      >
        <section style={columnStyle}>
          <h2 style={{ fontSize: '20px', margin: '0 0 12px' }}>
            KUA Panca Lautang
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
            Penyuluh Agama Islam - Website informasi masyarakat
          </p>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '14px' }}>
            Kantor Urusan Agama Kecamatan Panca Lautang, Kabupaten Sidenreng Rappang.
          </p>
        </section>

        <section style={columnStyle}>
          <h2 style={{ fontSize: '18px', margin: '0 0 10px' }}>
            Media Sosial KUA
          </h2>
          <p style={{ color: '#cbd5e1', margin: '0 0 10px', lineHeight: 1.7 }}>
            Ikuti informasi dan kegiatan resmi KUA melalui akun berikut.
          </p>
          <div>
            <a
              href="https://www.instagram.com/kua_panca_lautang/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Instagram KUA
            </a>
            <a
              href="https://www.facebook.com/share/1GyUN5KAo3/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Facebook KUA
            </a>
          </div>
        </section>

        <section style={columnStyle}>
          <h2 style={{ fontSize: '18px', margin: '0 0 10px' }}>
            Media Sosial Pengelola
          </h2>
          <p style={{ color: '#cbd5e1', margin: '0 0 10px', lineHeight: 1.7 }}>
            Akun media sosial pengelola website.
          </p>
          <div>
            <a
              href="https://www.instagram.com/suriantosag04/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Instagram Pengelola
            </a>
            <a
              href="https://www.facebook.com/share/1GmsLUCFAs/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Facebook Pengelola
            </a>
          </div>
        </section>
      </div>

      <div
        style={{
          maxWidth: '1600px',
          margin: '28px auto 0',
          paddingTop: '18px',
          borderTop: '1px solid #334155',
          color: '#94a3b8',
          fontSize: '13px',
        }}
      >
        © {new Date().getFullYear()} KUA Kecamatan Panca Lautang
      </div>
    </footer>
  );
}
