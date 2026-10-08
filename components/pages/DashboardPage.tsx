'use client';

import BioChart from '@/components/BioChart';
import PhForm from '@/components/PhForm';
import { useEffect, useState } from 'react';
import type { BioLog } from './types';

function Metric({ label, value, unit, accent, icon }: { label: string; value: string | number; unit: string; accent: string; icon: string }) {
  return <article className="metric-card"><div className={`metric-icon ${accent}`}>{icon}</div><div><span className="eyebrow">{label}</span><div className="metric-value">{value}<small>{unit}</small></div></div></article>;
}

export default function DashboardPage({ logs, onDataAdded }: { logs: BioLog[]; onDataAdded: () => void }) {
  const [dateOpen, setDateOpen] = useState(false);
  const [date, setDate] = useState('7 hari terakhir');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);
  const filterOptions = [
    { label: '24 jam terakhir', hours: 24 },
    { label: '7 hari terakhir', hours: 24 * 7 },
    { label: '30 hari terakhir', hours: 24 * 30 },
    { label: 'Semua waktu', hours: null },
  ];
  const selectedFilter = filterOptions.find((option) => option.label === date) ?? filterOptions[1];
  const timestamps = logs
    .map((log) => (log.timestamp ? new Date(log.timestamp).getTime() : NaN))
    .filter((timestamp) => Number.isFinite(timestamp));
  const latestTimestamp = timestamps.length ? Math.max(...timestamps) : 0;
  const startTimestamp = selectedFilter.hours === null ? -Infinity : latestTimestamp - selectedFilter.hours * 60 * 60 * 1000;
  const filteredLogs = logs.filter((log) => {
    if (!log.timestamp || selectedFilter.hours === null) return selectedFilter.hours === null;
    const timestamp = new Date(log.timestamp).getTime();
    return Number.isFinite(timestamp) && timestamp >= startTimestamp && timestamp <= latestTimestamp;
  });
  const latest = logs[logs.length - 1] || {};
  const latestPh = [...logs].reverse().find((log) => log.ph != null)?.ph;
  const temperature = latest.temp ?? '—';
  const voltage = latest.voltage ?? '—';
  const current = latest.current ?? '—';
  const power = latest.power ?? '—';
  return <section className="subpage">
    <div className="page-heading"><div><span className="eyebrow">{currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</span><h1>Dashboard</h1></div><div className="date-picker"><button className="date-button" onClick={() => setDateOpen(!dateOpen)} aria-expanded={dateOpen}>◷ {date} <span>⌄</span></button>{dateOpen && <div className="picker-menu">{filterOptions.map((option) => <button key={option.label} onClick={() => { setDate(option.label); setDateOpen(false); }}>{option.label}</button>)}</div>}</div></div>
    <div className="metric-grid"><Metric label="Suhu reaktor" value={temperature} unit="°C" accent="orange" icon="◒" /><Metric label="Tegangan" value={voltage} unit="V" accent="blue" icon="ϟ" /><Metric label="Arus" value={current} unit="mA" accent="black" icon="⎓" /><Metric label="Daya output" value={power} unit="mW" accent="green" icon="↗" /><Metric label="pH anoda" value={latestPh ?? '—'} unit="pH" accent="pink" icon="⌁" /></div>
    <div className="dashboard-grid"><div className="chart-panel"><div className="panel-heading"><div><span className="eyebrow">PERFORMA REAL-TIME</span><h2>Monitoring sensor</h2><p className="chart-filter-status">{filteredLogs.length} dari {logs.length} pembacaan · {date}</p></div></div><div className="charts-grid"><BioChart logs={filteredLogs} metric="temp" title="Suhu reaktor" /><BioChart logs={filteredLogs} metric="ph" title="pH anoda" /><BioChart logs={filteredLogs} metric="power" title="Daya output" /><BioChart logs={filteredLogs} metric="electrical" title="Tegangan & arus" /><div className="combined-chart"><BioChart logs={filteredLogs} metric="combined" title="Grafik gabungan semua sensor" /></div></div></div><div className="side-stack"><PhForm onDataAdded={onDataAdded} /></div></div>
  </section>;
}
