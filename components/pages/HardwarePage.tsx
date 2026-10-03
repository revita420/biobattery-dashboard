const devices = [['ESP32 controller', 'Terhubung', 'WiFi -58 dBm · uptime 4d 06h', 'online'], ['DS18B20', 'Terhubung', 'Kalibrasi berikutnya · 18 Okt 2026', 'online'], ['INA219', 'Terhubung', 'Kalibrasi berikutnya · 02 Nov 2026', 'online'], ['pH probe', 'Perlu perhatian', 'Kalibrasi terlewat 3 hari', 'offline']];

export default function HardwarePage() {
  return <section className="subpage"><div className="page-heading"><div><span className="eyebrow">WORKSPACE / HARDWARE</span><h1>Status perangkat & hardware</h1><p>Kesehatan koneksi dan jadwal kalibrasi sensor.</p></div></div><div className="hardware-grid">{devices.map(([name, status, detail, state]) => <div className="hardware-card" key={name}><span className={`status-dot ${state}`} />{name}<strong>{status}</strong><small>{detail}</small></div>)}</div></section>;
}
