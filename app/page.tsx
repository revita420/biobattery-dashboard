'use client';
import { useState, useEffect } from 'react';
import PhForm from '@/components/PhForm';
import BioChart from '@/components/BioChart';

interface BioLog {
  timestamp?: string;
  voltage?: number;
  current?: number;
  power?: number;
  temp?: number;
  ph?: number | null;
  molase?: string;
}

export default function Home() {
  const [logs, setLogs] = useState<BioLog[]>([]);

  const loadData = async () => {
    try {
      const res = await fetch('/api/bio-data');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error('Gagal ambil data');
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, []);

  const dataTerakhir = logs[logs.length - 1] || {};

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Bio-Baterai Air Lindi</h1>
          <p className="text-sm text-gray-500">Monitoring Sisi Biologi & Output Listrik</p>
        </div>

        {/* Card Angka Terakhir */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <span className="text-xs text-gray-500">Tegangan</span>
            <p className="text-xl font-bold text-green-600">{dataTerakhir.voltage || 0} V</p>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <span className="text-xs text-gray-500">Arus</span>
            <p className="text-xl font-bold text-blue-600">{dataTerakhir.current || 0} mA</p>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <span className="text-xs text-gray-500">Suhu</span>
            <p className="text-xl font-bold text-amber-600">{dataTerakhir.temp || 0} °C</p>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <span className="text-xs text-gray-500">pH Terakhir</span>
            <p className="text-xl font-bold text-red-600">{dataTerakhir.ph || '-'}</p>
          </div>
        </div>

        {/* Layout Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <BioChart logs={logs} />
          </div>
          <div>
            <PhForm onDataAdded={loadData} />
          </div>
        </div>
      </div>
    </main>
  );
}