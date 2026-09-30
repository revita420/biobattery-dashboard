'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function BioChart({ logs }) {
  const data = {
    labels: logs.map((d) => d.timestamp),
    datasets: [
      {
        label: 'Daya (mW)',
        data: logs.map((d) => d.power),
        borderColor: 'rgb(34, 197, 94)',
        yAxisID: 'y',
      },
      {
        label: 'pH Manual',
        data: logs.map((d) => d.ph),
        borderColor: 'rgb(239, 68, 68)',
        spanGaps: true,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { type: 'linear', position: 'left', title: { display: true, text: 'Daya' } },
      y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'pH' } },
    },
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <h3 className="font-bold text-gray-800 text-lg mb-4">Grafik Performa & pH</h3>
      {logs.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          Belum ada data terkumpul...
        </div>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
}