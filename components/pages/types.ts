export interface BioLog {
  timestamp?: string;
  voltage?: number;
  current?: number;
  power?: number;
  temp?: number;
  ph?: number | null;
  molase?: string;
}

export type View = 'Dashboard' | 'Log Data' | 'Catatan Lab';
