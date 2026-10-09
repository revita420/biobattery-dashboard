'use client';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';
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
type SensorFilter = 'all' | 'temp' | 'ph' | 'power' | 'voltage' | 'current';

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
  const [sensorFilter, setSensorFilter] = useState<SensorFilter>('all');
  const chartLogs = logs.length <= 48
    ? logs
    : logs.filter((_, index) => index % Math.ceil(logs.length / 48) === 0 || index === logs.length - 1);
  const labels = chartLogs.map((_, index) => String(index + 1));
  const datasets = metric === 'combined'
    ? [
      { label: 'Daya (mW)', data: chartLogs.map((log) => log.power), borderColor: colors.power, yAxisID: 'power' },
      { label: 'pH', data: chartLogs.map((log) => log.ph), borderColor: colors.ph, yAxisID: 'ph', spanGaps: true },
      { label: 'Suhu (°C)', data: chartLogs.map((log) => log.temp), borderColor: colors.temp, yAxisID: 'temp' },
      { label: 'Tegangan (V)', data: chartLogs.map((log) => log.voltage), borderColor: colors.voltage, yAxisID: 'voltage' },
      { label: 'Arus (mA)', data: chartLogs.map((log) => log.current), borderColor: colors.current, yAxisID: 'current' },
    ]
    : metric === 'electrical'
      ? [
        { label: 'Tegangan (V)', data: chartLogs.map((log) => log.voltage), borderColor: colors.voltage, yAxisID: 'voltage' },
        { label: 'Arus (mA)', data: chartLogs.map((log) => log.current), borderColor: colors.current, yAxisID: 'current' },
      ]
      : [{
        label: metric === 'temp' ? 'Suhu (°C)' : metric === 'ph' ? 'pH' : 'Daya (mW)',
        data: chartLogs.map((log) => log[metric]),
        borderColor: colors[metric],
        yAxisID: metric,
        spanGaps: metric === 'ph',
      }];
  const filteredDatasets = datasets.map((dataset) => ({
    ...dataset,
    hidden: metric === 'combined' && sensorFilter !== 'all' && dataset.yAxisID !== sensorFilter,
  }));

  const data = {
    labels,
    datasets: filteredDatasets,
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: metric === 'combined',
        position: 'bottom',
        labels: { boxWidth: 10, boxHeight: 10, padding: 14, usePointStyle: true, pointStyle: 'circle' },
      },
      tooltip: { mode: 'index', intersect: false },
    },
    elements: { point: { radius: 0, hoverRadius: 4 }, line: { tension: 0.25, borderWidth: 1.7 } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { autoSkip: true, maxTicksLimit: 5, maxRotation: 0, minRotation: 0 },
      },
      ...(metric === 'combined'
        ? {
          power: {
            type: 'linear' as const,
            position: 'left' as const,
            display: sensorFilter === 'all' || sensorFilter === 'power',
            ticks: { color: colors.power },
            border: { display: false },
          },
          ph: {
            type: 'linear' as const,
            position: 'left' as const,
            display: sensorFilter === 'ph',
            ticks: { color: colors.ph },
            border: { display: false },
          },
          temp: { type: 'linear' as const, position: 'left' as const, display: sensorFilter === 'temp', ticks: { color: colors.temp }, border: { display: false } },
          voltage: { type: 'linear' as const, position: 'left' as const, display: sensorFilter === 'voltage', ticks: { color: colors.voltage }, border: { display: false } },
          current: { type: 'linear' as const, position: 'left' as const, display: sensorFilter === 'current', ticks: { color: colors.current }, border: { display: false } },
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
      {metric === 'combined' && (
        <div className="chart-filters" aria-label="Filter sensor">
          {[
            ['all', 'Semua'],
            ['temp', 'Suhu'],
            ['ph', 'pH'],
            ['power', 'Daya'],
            ['voltage', 'Tegangan'],
            ['current', 'Arus'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={sensorFilter === value ? 'active' : ''}
              onClick={() => setSensorFilter(value as SensorFilter)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
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