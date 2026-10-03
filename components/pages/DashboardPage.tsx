'use client';

import BioChart from '@/components/BioChart';
import PhForm from '@/components/PhForm';
import type { BioLog } from './types';

function Metric({ label, value, unit, accent, detail }: { label: string; value: string | number; unit: string; accent: string; detail: string }) {
  return <article className="metric-card"><div className={`metric-icon ${accent}`}>{accent === 'pink' ? '⌁' : accent === 'orange' ? '◒' : accent === 'green' ? '↗' : 'pH'}</div><div><span className="eyebrow">{label}</span><div className="metric-value">{value}<small>{unit}</small></div><p className="metric-detail">{detail}</p></div></article>;
}

export default function DashboardPage({ logs, onDataAdded }: { logs: BioLog[]; onDataAdded: () => void }) {
  const latest = logs[logs.length - 1] || {};
  return <section className="subpage">
    <div className="page-heading"><div><span className="eyebrow">WEDNESDAY, 30 SEPTEMBER 2026</span><h1>Selamat pagi, Revita <span>✦</span></h1><p>Berikut ringkasan performa MFC Lab 01 hari ini.</p></div><button className="date-button">◷ 30 Sep 2026 <span>⌄</span></button></div>
    <div className="metric-grid"><Metric label="Suhu reaktor" value={latest.temp || '36.8'} unit="°C" accent="orange" detail="Zona mesofilik · ideal" /><Metric label="pH anoda" value={latest.ph || '6.7'} unit="pH" accent="pink" detail="Target 6.5 – 7.2" /><Metric label="Daya output" value={latest.power || '42.8'} unit="mW" accent="green" detail="+8.2% dari kemarin" /><Metric label="Efisiensi MET" value="82" unit="%" accent="black" detail="Indeks aktivitas mikroba" /></div>
    <div className="dashboard-grid"><div className="chart-panel"><div className="panel-heading"><div><span className="eyebrow">PERFORMA REAL-TIME</span><h2>Output energi & pH</h2></div><div className="legend"><span className="legend-pink" /> Daya <span className="legend-gray" /> pH</div></div><BioChart logs={logs} /></div><div className="side-stack"><PhForm onDataAdded={onDataAdded} /><div className="met-card"><span className="eyebrow">MET EFFICIENCY</span><h2>Aktivitas mikroba</h2><div className="met-meter"><div className="meter-ring"><b>82</b><small>%</small></div><div><span className="trend">↗ 12.6%</span><p>dibanding periode sebelumnya</p></div></div></div></div></div>
  </section>;
}
