'use client';

import { useEffect, useState } from 'react';
import DashboardPage from '@/components/pages/DashboardPage';
import LogDataPage from '@/components/pages/LogDataPage';
import LabNotesPage from '@/components/pages/LabNotesPage';
import NotificationsPage from '@/components/pages/NotificationsPage';
import HardwarePage from '@/components/pages/HardwarePage';
import AnalysisPage from '@/components/pages/AnalysisPage';
import type { BioLog, View } from '@/components/pages/types';

const menu: { name: View; icon: string; note: string }[] = [
  { name: 'Dashboard', icon: '⌂', note: 'Live overview' },
  { name: 'Log Data', icon: '▤', note: 'Riwayat sensor' },
  { name: 'Catatan Lab', icon: '✎', note: 'Eksperimen' },
  { name: 'Notifikasi', icon: '◉', note: '2 perhatian' },
  { name: 'Hardware', icon: '⌁', note: 'ESP32 & sensor' },
  { name: 'Analisis', icon: '◒', note: 'Perbandingan' },
];

function PageContent({ view, logs, refreshLogs }: { view: View; logs: BioLog[]; refreshLogs: () => void }) {
  if (view === 'Dashboard') return <DashboardPage logs={logs} onDataAdded={refreshLogs} />;
  if (view === 'Log Data') return <LogDataPage logs={logs} />;
  if (view === 'Catatan Lab') return <LabNotesPage />;
  if (view === 'Notifikasi') return <NotificationsPage />;
  if (view === 'Hardware') return <HardwarePage />;
  return <AnalysisPage />;
}

export default function Home() {
  const [logs, setLogs] = useState<BioLog[]>([]);
  const [view, setView] = useState<View>('Dashboard');
  const [workspace, setWorkspace] = useState('MFC Lab 01');
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

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

  return <main className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">B</div><div><b>Bio<span>Volt</span></b><small>LEACHATE LAB</small></div></div><div className="workspace"><span className="eyebrow">WORKSPACE</span><button className="workspace-select" onClick={() => setWorkspaceOpen(!workspaceOpen)} aria-expanded={workspaceOpen}>{workspace} <span>⌄</span></button>{workspaceOpen && <div className="sidebar-picker picker-menu">{['MFC Lab 01', 'MFC Lab 02'].map((option) => <button key={option} onClick={() => { setWorkspace(option); setWorkspaceOpen(false); }}>{option}</button>)}</div>}</div><nav>{menu.map((item) => <button key={item.name} className={`nav-item ${view === item.name ? 'active' : ''}`} onClick={() => setView(item.name)}><strong>{item.icon}</strong><span>{item.name}<small>{item.note}</small></span>{item.name === 'Notifikasi' && <em>2</em>}</button>)}</nav><div className="sidebar-footer"><div className="avatar">AS</div><div><b>Revita</b><small>Peneliti · Aktif</small></div><span>•••</span></div></aside><div className="content"><header className="topbar"><div className="mobile-brand">Bio<span>Volt</span></div><div className="live-status"><span className="pulse" /> LIVE <small>Terakhir update 12 detik lalu</small></div><div className="top-actions"><button aria-label="Cari">⌕</button><button aria-label="Notifikasi">♧<i>2</i></button><div className="avatar small">AS</div></div></header><div className="main-area"><PageContent view={view} logs={logs} refreshLogs={() => void loadData()} /></div></div></main>;
}
