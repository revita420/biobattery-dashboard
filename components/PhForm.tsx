'use client';
import { useState } from 'react';

export default function PhForm({ onDataAdded }) {
  const [ph, setPh] = useState('');
  const [molase, setMolase] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch('/api/bio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ph: parseFloat(ph),
        molase: molase,
      }),
    });

    setPh('');
    setMolase('');
    onDataAdded(); // Refresh data di layar
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <h3 className="font-bold text-gray-800 text-lg mb-4">Input Log Manual</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Nilai pH</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 6.8"
            value={ph}
            onChange={(e) => setPh(e.target.value)}
            className="w-full border p-2 rounded text-black outline-none focus:border-green-500"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Catatan Molase</label>
          <input
            type="text"
            placeholder="e.g. +10ml molase"
            value={molase}
            onChange={(e) => setMolase(e.target.value)}
            className="w-full border p-2 rounded text-black outline-none focus:border-green-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-2 rounded transition"
        >
          Simpan Log
        </button>
      </form>
    </div>
  );
}