import type { BioLog } from './types';

export default function LogDataPage({ logs }: { logs: BioLog[] }) {
  const rows = logs.length ? logs : [{ timestamp: 'Belum ada data', temp: 0, ph: null, voltage: 0, current: 0, power: 0, molase: '-' }];
  return <section className="subpage"><div className="page-heading"><div><span className="eyebrow">WORKSPACE / LOG DATA</span><h1>Log data & riwayat</h1><p>Seluruh pembacaan sensor tersimpan dalam satu timeline.</p></div><button className="outline-button">↓ Ekspor CSV</button></div><div className="table-panel"><div className="panel-heading"><div><span className="eyebrow">DATA STREAM</span><h2>Histori pembacaan sensor</h2></div></div><table><thead><tr><th>Waktu</th><th>Suhu</th><th>pH</th><th>Tegangan</th><th>Arus</th><th>Daya</th><th>Molase</th></tr></thead><tbody>{rows.map((log, index) => <tr key={`${log.timestamp}-${index}`}><td>{log.timestamp}</td><td>{log.temp} °C</td><td>{log.ph ?? '-'}</td><td>{log.voltage} V</td><td>{log.current} mA</td><td>{log.power} mW</td><td>{log.molase || '-'}</td></tr>)}</tbody></table></div></section>;
}
