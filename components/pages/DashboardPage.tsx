'use client';

import BioChart from '@/components/BioChart';
import PhForm from '@/components/PhForm';
import { useEffect, useState } from 'react';
import type { BioLog } from './types';

function Metric({ label, value, average, unit, accent, icon }: { label: string; value: string | number; average: number | null; unit: string; accent: string; icon: string }) {
  return <article className="metric-card"><div className={`metric-icon ${accent}`}>{icon}</div><div><span className="eyebrow">{label}</span><div className="metric-value">{value}<small>{unit}</small></div><div className="metric-detail">Rata-rata: {average == null ? '—' : average.toFixed(2)} {unit}</div></div></article>;
}

export default function DashboardPage({ logs, onDataAdded }: { logs: BioLog[]; onDataAdded: () => void }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);
  const filteredLogs = logs;
  const latest = logs[logs.length - 1] || {};
  const latestPh = [...logs].reverse().find((log) => log.ph != null)?.ph;
  const temperature = latest.temp ?? '—';
  const voltage = latest.voltage ?? '—';
  const current = latest.current ?? '—';
  const power = latest.power ?? '—';
  const average = (field: 'temp' | 'voltage' | 'current' | 'power' | 'ph') => {
    const values = logs
      .map((log) => log[field])
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
    return values.length > 0 ? values.reduce((total, value) => total + value, 0) / values.length : null;
  };
  const averageTemperature = average('temp');
  const averageVoltage = average('voltage');
  const averageCurrent = average('current');
  const averagePower = average('power');
  const averagePh = average('ph');
  return <section className="subpage">
    <div className="page-heading"><div><span className="eyebrow">{currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</span><h1>Dashboard</h1></div></div>
    <div className="metric-grid"><Metric label="Suhu reaktor" value={temperature} average={averageTemperature} unit="°C" accent="orange" icon="◒" /><Metric label="Tegangan" value={voltage} average={averageVoltage} unit="V" accent="blue" icon="ϟ" /><Metric label="Arus" value={current} average={averageCurrent} unit="mA" accent="black" icon="⎓" /><Metric label="Daya output" value={power} average={averagePower} unit="mW" accent="green" icon="↗" /><Metric label="pH anoda" value={latestPh ?? '—'} average={averagePh} unit="pH" accent="pink" icon="⌁" /></div>
    <div className="dashboard-grid"><div className="chart-panel"><div className="panel-heading"><div><span className="eyebrow">PERFORMA REAL-TIME</span><h2>Monitoring sensor</h2><p className="chart-filter-status">{filteredLogs.length} pembacaan</p></div></div><div className="charts-grid"><BioChart logs={filteredLogs} metric="combined" title="Grafik gabungan semua sensor" /></div></div><div className="side-stack"><PhForm onDataAdded={onDataAdded} /></div></div>
  </section>;
}
