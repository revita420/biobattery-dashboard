'use client';
import { useState } from 'react';
import type { FormEvent } from 'react';

interface PhFormProps {
  onDataAdded: () => void;
}

export default function PhForm({ onDataAdded }: PhFormProps) {
  const [ph, setPh] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch('/api/bio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ph: parseFloat(ph),
      }),
    });

    setPh('');
    onDataAdded(); // Refresh data di layar
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <h3 className="font-bold text-gray-800 text-lg mb-4">Input pH Manual</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Nilai pH</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 6.8"
            value={ph}
            onChange={(e) => setPh(e.target.value)}
            className="w-full border p-2 rounded text-black outline-none focus:border-pink-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold p-2 rounded transition"
        >
          Simpan Log
        </button>
      </form>
    </div>
  );
}