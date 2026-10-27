
'use client';

import { useState } from 'react';
import Link from 'next/link';

const menus = [
  {
    label: 'Profil',
    items: [
      ['Profil KUA', '/profil#profil-kua'],
      ['Visi dan Misi', '/profil#visi'],
      ['Wilayah Kerja', '/profil#wilayah-kerja'],
      ['Struktur Organisasi dan Staf', '/profil#struktur-organisasi'],
    ],
  },
  {
    label: 'Ruang Layanan',
    items: [
      ['Layanan Perkawinan', '/profil#layanan-perkawinan'],
      ['Jadwal Akad Nikah', '/jadwal-nikah'],
      ['Bimbingan Perkawinan', '/bimbingan-perkawinan'],
      ['Kemasjidan, Zakat dan Wakaf', '/profil#layanan-kemasjidan'],
      ['Layanan Halal (SEHATI)', '/layanan-halal'],
      ['Konsultasi Keagamaan', '/profil#layanan-sosial'],    ],
  },
  {
    label: 'Data & Statistik',
    items: [
      ['Data Masjid dan Mushalla', '/data-masjid'],
      ['Statistik Layanan', '/'],
      ['Jadwal Akad Nikah', '/jadwal-nikah'],
    ],
  },
  {
    label: 'Pusat Unduhan',
    items: [
      ['Persyaratan Perkawinan', '/profil#persyaratan-perkawinan'],
      ['Materi Dakwah', '/materi-dakwah'],
      ['Khutbah Jumat', '/khutbah-jumat'],
    ],
  },
  {
    label: 'Galeri Kegiatan',
    items: [
      ['Kegiatan KUA', '/kegiatan'],
      ['Dokumentasi Kegiatan', '/kegiatan'],
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState('');

  function closeMenu() {
    setMobileOpen(false);
    setExpanded('');
  }

  return (
    <header className="top kuaNavbar">
      <div className="wrap kuaNavInner">
        <Link href="/" className="brand kuaBrand" onClick={closeMenu}>
          <img
            className="brandmark kuaBrandmark"
            src="/logo-kemenag-kua.png"
            alt="Lambang Kementerian Agama Republik Indonesia"
          />
          <span className="kuaBrandTitle">KUA Panca Lautang</span>
        </Link>

        <button
          type="button"
          className="kuaMenuToggle"
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={mobileOpen}
          aria-controls="kua-navigation"
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span aria-hidden="true">{mobileOpen ? '\u2715' : '\u2630'}</span>
          <span>{mobileOpen ? 'Tutup' : 'Menu'}</span>
        </button>

        <nav
          id="kua-navigation"
          className={`navlinks kuaNavLinks${mobileOpen ? ' isOpen' : ''}`}
          aria-label="Navigasi utama"
        >
          <Link href="/" onClick={closeMenu}>Beranda</Link>

          {menus.map((menu) => (
            <div className="kuaNavGroup" key={menu.label}>
              <button
                type="button"
                className="kuaDropdownToggle"
                aria-expanded={expanded === menu.label}
                onClick={() =>
                  setExpanded((current) =>
                    current === menu.label ? '' : menu.label
                  )
                }
              >
                {menu.label}
                <span aria-hidden="true">{'\u2304'}</span>
              </button>

              <div
                className={`kuaDropdown${expanded === menu.label ? ' isExpanded' : ''}`}
              >
                {menu.items.map(([label, href]) => (
                  <Link key={label} href={href} onClick={closeMenu}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <Link href="/#kontak" onClick={closeMenu}>Kontak</Link>
        </nav>
      </div>
    </header>
  );
}
