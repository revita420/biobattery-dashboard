import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 1. Ambil seluruh data dari Supabase (diurutkan berdasarkan waktu dibuat)
export async function GET() {
  const { data, error } = await supabase
    .from('bio_logs')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let previousSensorValues = { voltage: 0, current: 0, power: 0, temp: 0 };
  const logs = data.map((log) => {
    const isManualOnly = log.ph != null
      && [log.voltage, log.current, log.power, log.temp].every((value) => value == null || value === 0);
    const sensorValues = isManualOnly ? previousSensorValues : {
      voltage: log.voltage ?? 0,
      current: log.current ?? 0,
      power: log.power ?? 0,
      temp: log.temp ?? 0,
    };
    previousSensorValues = sensorValues;

    return {
      ...log,
      ...sensorValues,
      timestamp: log.timestamp ?? log.created_at,
    };
  });

  return NextResponse.json(logs);
}

// 2. Simpan data baru dari ESP32 atau Form Input Manual ke Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload: Record<string, unknown> = {
      ph: body.ph ?? null,
      molase: body.molase ?? '',
    };
    const sensorFields = ['voltage', 'current', 'power', 'temp'] as const;
    const hasSensorValue = sensorFields.some((field) => body[field] != null);

    if (hasSensorValue) {
      for (const field of sensorFields) {
        if (body[field] != null) payload[field] = body[field];
      }
    }

    const { data, error } = await supabase.from('bio_logs').insert([payload]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan data';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}