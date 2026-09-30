import { NextResponse } from 'next/server';

interface BioLog {
  timestamp: string;
  voltage: number;
  current: number;
  power: number;
  temp: number;
  ph: number | null;
  molase: string;
}

let dataStorage: BioLog[] = [];

export async function GET() {
  return NextResponse.json(dataStorage);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newData: BioLog = {
      timestamp: body.timestamp || new Date().toLocaleTimeString('id-ID'),
      voltage: body.voltage || 0,
      current: body.current || 0,
      power: body.power || 0,
      temp: body.temp || 0,
      ph: body.ph || null,
      molase: body.molase || '',
    };

    dataStorage.push(newData);

    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal simpan data' }, { status: 500 });
  }
}