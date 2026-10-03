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

  return NextResponse.json(data);
}

// 2. Simpan data baru dari ESP32 atau Form Input Manual ke Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase.from('bio_logs').insert([
      {
        voltage: body.voltage ?? 0,
        current: body.current ?? 0,
        power: body.power ?? 0,
        temp: body.temp ?? 0,
        ph: body.ph ?? null,
        molase: body.molase ?? '',
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}