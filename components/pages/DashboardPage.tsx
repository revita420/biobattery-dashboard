'use client';

import BioChart from '@/components/BioChart';
import PhForm from '@/components/PhForm';
import { useState } from 'react';
import type { BioLog } from './types';

function Metric({ label, value, unit, accent, detail }: { label: string; value: string | number; unit: string; accent: string; detail: string }) {
  return <article className="metric-card"><div className={`metric-icon ${accent}`}>{accent === 'pink' ? '⌁' : accent === 'orange' ? '◒' : accent === 'green' ? '↗' : 'pH'}</div><div><span className="eyebrow">{label}</span><div className="metric-value">{value}<small>{unit}</small></div><p className="metric-detail">{detail}</p></div></article>;
}

export default function DashboardPage({ logs, onDataAdded }: { logs: BioLog[]; onDataAdded: () => void }) {
  const [dateOpen, setDateOpen] = useState(false);
  const [date, setDate] = useState('7 hari terakhir');
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
  return <section className="subpage">
    <div className="page-heading"><div><span className="eyebrow">WEDNESDAY, 30 SEPTEMBER 2026</span><h1>Selamat pagi, Revita <span>✦</span></h1><p>Berikut ringkasan performa MFC Lab 01 hari ini.</p></div><div className="date-picker"><button className="date-button" onClick={() => setDateOpen(!dateOpen)} aria-expanded={dateOpen}>◷ {date} <span>⌄</span></button>{dateOpen && <div className="picker-menu">{filterOptions.map((option) => <button key={option.label} onClick={() => { setDate(option.label); setDateOpen(false); }}>{option.label}</button>)}</div>}</div></div>
    <div className="metric-grid"><Metric label="Suhu reaktor" value={latest.temp || '36.8'} unit="°C" accent="orange" detail="Zona mesofilik · ideal" /><Metric label="pH anoda" value={latest.ph || '6.7'} unit="pH" accent="pink" detail="Target 6.5 – 7.2" /><Metric label="Daya output" value={latest.power || '42.8'} unit="mW" accent="green" detail="+8.2% dari kemarin" /><Metric label="Efisiensi MET" value="82" unit="%" accent="black" detail="Indeks aktivitas mikroba" /></div>
    <div className="dashboard-grid"><div className="chart-panel"><div className="panel-heading"><div><span className="eyebrow">PERFORMA REAL-TIME</span><h2>Monitoring sensor</h2><p className="chart-filter-status">{filteredLogs.length} dari {logs.length} pembacaan · {date}</p></div></div><div className="charts-grid"><BioChart logs={filteredLogs} metric="temp" title="Suhu reaktor" /><BioChart logs={filteredLogs} metric="ph" title="pH anoda" /><BioChart logs={filteredLogs} metric="power" title="Daya output" /><BioChart logs={filteredLogs} metric="electrical" title="Tegangan & arus" /><div className="combined-chart"><BioChart logs={filteredLogs} metric="combined" title="Grafik gabungan semua sensor" /></div></div></div><div className="side-stack"><PhForm onDataAdded={onDataAdded} /><div className="met-card"><span className="eyebrow">MET EFFICIENCY</span><h2>Aktivitas mikroba</h2><div className="met-meter"><div className="meter-ring"><b>82</b><small>%</small></div><div><span className="trend">↗ 12.6%</span><p>dibanding periode sebelumnya</p></div></div></div></div></div>
  </section>;
}
