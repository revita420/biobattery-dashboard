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
import type { ChartOptions } from 'chart.js';

interface BioLog {
  timestamp?: string;
  voltage?: number;
  current?: number;
  power?: number;
  temp?: number;
  ph?: number | null;
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type ChartMetric = 'temp' | 'ph' | 'power' | 'electrical' | 'combined';

interface BioChartProps {
  logs: BioLog[];
  title: string;
  metric: ChartMetric;
}

const colors = {
  temp: 'rgb(234, 156, 76)',
  ph: 'rgb(201, 87, 124)',
  power: 'rgb(71, 169, 112)',
  voltage: 'rgb(82, 126, 188)',
  current: 'rgb(137, 111, 177)',
};

export default function BioChart({ logs, title, metric }: BioChartProps) {
  const labels = logs.map((log) => {
    if (!log.timestamp) return 'Tanpa waktu';
    const timestamp = new Date(log.timestamp);
    if (Number.isNaN(timestamp.getTime())) return 'Tanpa waktu';
    return timestamp.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  });
  const datasets = metric === 'combined'
    ? [
      { label: 'Daya (mW)', data: logs.map((log) => log.power), borderColor: colors.power, yAxisID: 'power' },
      { label: 'pH', data: logs.map((log) => log.ph), borderColor: colors.ph, yAxisID: 'ph', spanGaps: true },
      { label: 'Suhu (°C)', data: logs.map((log) => log.temp), borderColor: colors.temp, yAxisID: 'temp' },
    ]
    : metric === 'electrical'
      ? [
        { label: 'Tegangan (V)', data: logs.map((log) => log.voltage), borderColor: colors.voltage, yAxisID: 'voltage' },
        { label: 'Arus (mA)', data: logs.map((log) => log.current), borderColor: colors.current, yAxisID: 'current' },
      ]
      : [{
        label: metric === 'temp' ? 'Suhu (°C)' : metric === 'ph' ? 'pH' : 'Daya (mW)',
        data: logs.map((log) => log[metric]),
        borderColor: colors[metric],
        yAxisID: metric,
        spanGaps: metric === 'ph',
      }];

  const data = {
    labels,
    datasets,
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    elements: { point: { radius: 2, hoverRadius: 5 }, line: { tension: 0.3, borderWidth: 2 } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { autoSkip: true, maxTicksLimit: 5, maxRotation: 0, minRotation: 0 },
      },
      ...(metric === 'combined'
        ? {
          power: { type: 'linear' as const, position: 'left' as const, title: { display: true, text: 'Daya (mW)' } },
          ph: { type: 'linear' as const, position: 'right' as const, grid: { drawOnChartArea: false }, title: { display: true, text: 'pH' } },
          temp: { type: 'linear' as const, position: 'right' as const, display: false },
        }
        : metric === 'electrical'
          ? {
            voltage: { type: 'linear' as const, position: 'left' as const, title: { display: true, text: 'Volt (V)' } },
            current: { type: 'linear' as const, position: 'right' as const, grid: { drawOnChartArea: false }, title: { display: true, text: 'Arus (mA)' } },
          }
          : { [metric]: { type: 'linear' as const, position: 'left' as const, title: { display: true, text: metric === 'temp' ? 'Suhu (°C)' : metric === 'ph' ? 'pH' : 'Daya (mW)' } } }),
    },
  };

  return (
    <div className="bio-chart">
      <h3>{title}</h3>
      {logs.length === 0 ? (
        <div className="chart-empty">
          Belum ada data terkumpul...
        </div>
      ) : (
        <div className="chart-canvas"><Line data={data} options={options} /></div>
      )}
    </div>
  );
}