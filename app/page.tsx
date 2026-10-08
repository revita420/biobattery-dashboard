'use client';

import { useEffect, useState } from 'react';
import DashboardPage from '@/components/pages/DashboardPage';
import LogDataPage from '@/components/pages/LogDataPage';
import LabNotesPage from '@/components/pages/LabNotesPage';
import type { BioLog, View } from '@/components/pages/types';

const menu: { name: View; icon: string; note: string }[] = [
  { name: 'Dashboard', icon: '⌂', note: 'Live overview' },
  { name: 'Log Data', icon: '▤', note: 'Riwayat sensor' },
  { name: 'Catatan Lab', icon: '✎', note: 'Eksperimen' },
];

function PageContent({ view, logs, refreshLogs, searchQuery }: { view: View; logs: BioLog[]; refreshLogs: () => void; searchQuery: string }) {
  if (view === 'Dashboard') return <DashboardPage logs={logs} onDataAdded={refreshLogs} />;
  if (view === 'Log Data') return <LogDataPage logs={logs} searchQuery={searchQuery} />;
  return <LabNotesPage searchQuery={searchQuery} />;
}

export default function Home() {
  const [logs, setLogs] = useState<BioLog[]>([]);
  const [view, setView] = useState<View>('Dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const changeView = (nextView: View) => {
    setView(nextView);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const loadData = async () => {
    try {
      const response = await fetch('/api/bio-data');
      setLogs(await response.json());
    } catch {
      console.error('Gagal ambil data');
    }
  };

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadData(), 0);
    const timer = window.setInterval(() => void loadData(), 5000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
    };
  }, []);

  return <main className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">B</div><div><b>Bio<span>Volt</span></b><small>LEACHATE LAB</small></div></div><nav>{menu.map((item) => <button key={item.name} className={`nav-item ${view === item.name ? 'active' : ''}`} onClick={() => changeView(item.name)}><strong>{item.icon}</strong><span>{item.name}<small>{item.note}</small></span></button>)}</nav></aside><div className="content"><header className="topbar"><div className="mobile-brand">Bio<span>Volt</span></div><div className="top-actions">{view !== 'Dashboard' && <><button type="button" className="search-button" aria-label="Buka pencarian" aria-expanded={searchOpen} onClick={() => setSearchOpen((isOpen) => !isOpen)}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg></button>{searchOpen && <div className="search-popover"><label htmlFor="page-search">Cari di halaman</label><input autoFocus id="page-search" className="search-input" aria-label="Cari data" placeholder="Ketik kata kunci..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></div>}</>}<button type="button" className="notification-button" aria-label="Buka notifikasi" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((isOpen) => !isOpen)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg><i>2</i></button>{notificationsOpen && <div className="notification-popover" role="dialog" aria-label="Notifikasi"><div className="notification-heading"><div><span className="eyebrow">PUSAT NOTIFIKASI</span><h2>Notifikasi</h2></div><button type="button" aria-label="Tutup notifikasi" onClick={() => setNotificationsOpen(false)}>×</button></div><div className="notification-item"><span className="notification-dot warning" /><div><b>pH anoda perlu diperhatikan</b><small>Nilai terakhir mendekati batas bawah target.</small><time>Baru saja</time></div></div><div className="notification-item"><span className="notification-dot success" /><div><b>Data sensor berhasil diperbarui</b><small>Pembacaan terbaru sudah masuk ke dashboard.</small><time>5 menit lalu</time></div></div><button type="button" className="notification-footer" onClick={() => setNotificationsOpen(false)}>Tandai sudah dibaca</button></div>}</div></header><div className="main-area"><PageContent view={view} logs={logs} searchQuery={searchQuery} refreshLogs={() => void loadData()} /></div></div></main>;
}
