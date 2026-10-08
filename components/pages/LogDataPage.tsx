 'use client';

import type { BioLog } from './types';

function escapeCsvValue(value: string | number | null | undefined) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export default function LogDataPage({ logs, searchQuery = '' }: { logs: BioLog[]; searchQuery?: string }) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredLogs = normalizedQuery
    ? logs.filter((log) => [
      log.timestamp,
      log.temp == null ? '' : `${log.temp} °C`,
      log.ph,
      log.voltage == null ? '' : `${log.voltage} V`,
      log.current == null ? '' : `${log.current} mA`,
      log.power == null ? '' : `${log.power} mW`,
    ].some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery)))
    : logs;
  const rows = filteredLogs.length ? filteredLogs : [{ timestamp: 'Belum ada data', temp: 0, ph: null, voltage: 0, current: 0, power: 0 }];
  const exportCsv = () => {
    const header = ['Waktu', 'Suhu (°C)', 'pH', 'Tegangan (V)', 'Arus (mA)', 'Daya (mW)'];
    const csvRows = rows.map((log) => [
      log.timestamp,
      log.temp,
      log.ph,
      log.voltage,
      log.current,
      log.power,
    ].map(escapeCsvValue).join(','));
    const csv = [header.join(','), ...csvRows].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bio-logs.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return <section className="subpage"><div className="page-heading"><div><span className="eyebrow">WORKSPACE / LOG DATA</span><h1>Log data & riwayat</h1><p>Seluruh pembacaan sensor tersimpan dalam satu timeline.</p></div><button type="button" className="outline-button" onClick={exportCsv}>↓ Ekspor CSV</button></div><div className="table-panel"><div className="panel-heading"><div><span className="eyebrow">DATA STREAM</span><h2>Histori pembacaan sensor</h2></div></div><table><thead><tr><th>Waktu</th><th>Suhu</th><th>pH</th><th>Tegangan</th><th>Arus</th><th>Daya</th></tr></thead><tbody>{filteredLogs.length === 0 && normalizedQuery ? <tr><td colSpan={6}>Data tidak ditemukan</td></tr> : rows.map((log, index) => <tr key={`${log.timestamp}-${index}`}><td>{log.timestamp}</td><td>{log.temp} °C</td><td>{log.ph ?? '-'}</td><td>{log.voltage} V</td><td>{log.current} mA</td><td>{log.power} mW</td></tr>)}</tbody></table></div></section>;
}
