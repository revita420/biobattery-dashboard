'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

interface LabRecord {
  id?: string | number;
  created_at?: string;
  activity_type?: string;
  note_detail?: string;
  molase_amount?: string;
  pollutant_estimate?: string;
  leachate_condition?: string;
}

export default function LabNotesPage() {
  const [noteForm, setNoteForm] = useState({ activity: 'Penambahan substrat', date: '', detail: '' });
  const [reportForm, setReportForm] = useState({ molase: '', pollutantEstimate: '', leachateNote: '' });
  const [saving, setSaving] = useState<'note' | 'report' | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [messages, setMessages] = useState({ note: '', report: '' });
  const [history, setHistory] = useState<LabRecord[]>([]);
  const [historyError, setHistoryError] = useState('');

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('/api/lab-notes');
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Gagal mengambil riwayat lab');
      setHistory(result.data || []);
      setHistoryError('');
    } catch (error) {
      setHistoryError(error instanceof Error ? error.message : 'Gagal mengambil riwayat lab');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadHistory(), 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  const noteHistory = history.filter((record) => record.note_detail);
  const reportHistory = history.filter((record) => record.molase_amount || record.pollutant_estimate || record.leachate_condition);

  const save = async (event: FormEvent<HTMLFormElement>, type: 'note' | 'report') => {
    event.preventDefault();
    setSaving(type);
    setMessages((current) => ({ ...current, [type]: '' }));

    // Pemetaan nama kolom disesuaikan dengan database Supabase
    const body = type === 'note' 
      ? { 
          activity_type: noteForm.activity, 
          created_at: noteForm.date ? new Date(noteForm.date).toISOString() : new Date().toISOString(), 
          note_detail: noteForm.detail 
        } 
      : { 
          molase_amount: reportForm.molase, 
          pollutant_estimate: reportForm.pollutantEstimate, 
          leachate_condition: reportForm.leachateNote 
        };

    try {
      const response = await fetch('/api/lab-notes', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      });
      const result = await response.json();
      
      if (!response.ok || !result.success) throw new Error(result.error || 'Gagal menyimpan data');
      
      setMessages((current) => ({ 
        ...current, 
        [type]: type === 'note' ? 'Catatan berhasil disimpan.' : 'Laporan berhasil disimpan.' 
      }));

      if (type === 'note') setNoteForm({ activity: 'Penambahan substrat', date: '', detail: '' });
      else setReportForm({ molase: '', pollutantEstimate: '', leachateNote: '' });
      await loadHistory();
    } catch (error) {
      setMessages((current) => ({ 
        ...current, 
        [type]: error instanceof Error ? error.message : 'Gagal menyimpan data.' 
      }));
    } finally { 
      setSaving(null); 
    }
  };

  return (
    <section className="subpage">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORKSPACE / CATATAN LAB</span>
          <h1>Catatan & laporan lab</h1>
          <p>Dokumentasikan intervensi eksperimen di sini.</p>
        </div>
      </div>
      <div className="two-column">
        <form className="form-panel" onSubmit={(event) => void save(event, 'note')}>
          <span className="eyebrow">EXPERIMENT NOTE</span>
          <h2>Catatan eksperimen</h2>
          <label>
            Jenis aktivitas
            <select value={noteForm.activity} onChange={(event) => setNoteForm({ ...noteForm, activity: event.target.value })}>
              <option>Penambahan substrat</option>
              <option>Penggantian lindi</option>
              <option>Pergantian elektroda</option>
            </select>
          </label>
          <label>
            Tanggal
            <input type="date" value={noteForm.date} onChange={(event) => setNoteForm({ ...noteForm, date: event.target.value })} required />
          </label>
          <label>
            Detail
            <textarea placeholder="Tulis observasi, volume, atau perubahan kondisi..." value={noteForm.detail} onChange={(event) => setNoteForm({ ...noteForm, detail: event.target.value })} required />
          </label>
          <button type="submit" className="pink-button" disabled={saving !== null}>
            {saving === 'note' ? 'Menyimpan...' : 'Simpan catatan'}
          </button>
          {messages.note && <p className="save-message">{messages.note}</p>}
        </form>

        <form className="form-panel" onSubmit={(event) => void save(event, 'report')}>
          <span className="eyebrow">MOLASE & BIOREMEDIASI</span>
          <h2>Suplementasi molase</h2>
          <label>
            Jumlah molase
            <input type="text" placeholder="10 ml" value={reportForm.molase} onChange={(event) => setReportForm({ ...reportForm, molase: event.target.value })} required />
          </label>
          <label>
            Estimasi penurunan polutan
            <input type="text" placeholder="mis. COD turun 12%" value={reportForm.pollutantEstimate} onChange={(event) => setReportForm({ ...reportForm, pollutantEstimate: event.target.value })} required />
          </label>
          <label>
            Catatan penggantian air lindi
            <textarea placeholder="Volume dan kondisi lindi..." value={reportForm.leachateNote} onChange={(event) => setReportForm({ ...reportForm, leachateNote: event.target.value })} required />
          </label>
          <button type="submit" className="dark-button" disabled={saving !== null}>
            {saving === 'report' ? 'Menyimpan...' : 'Simpan laporan'}
          </button>
          {messages.report && <p className="save-message">{messages.report}</p>}
        </form>
      </div>
      <div className="panel-heading lab-history-heading">
        <div><span className="eyebrow">ACTIVITY HISTORY</span><h2>Riwayat tersimpan</h2></div>
        <button type="button" className="outline-button" onClick={() => void loadHistory()} disabled={loadingHistory}>
          {loadingHistory ? 'Memuat...' : '↻ Refresh'}
        </button>
      </div>
      {historyError && <p className="save-message">{historyError}</p>}
      {!historyError && <div className="two-column lab-history-grid">
        <div className="table-panel lab-history-panel">
          <span className="eyebrow">EXPERIMENT NOTE</span>
          <h2>Riwayat catatan eksperimen</h2>
          {noteHistory.length === 0 ? <p className="empty-history">Belum ada catatan eksperimen.</p> : <table><thead><tr><th>Tanggal</th><th>Aktivitas</th><th>Detail</th></tr></thead><tbody>{noteHistory.map((record, index) => <tr key={record.id ?? `${record.created_at}-${index}`}><td>{record.created_at ? new Date(record.created_at).toLocaleDateString('id-ID') : '-'}</td><td>{record.activity_type || '-'}</td><td>{record.note_detail || '-'}</td></tr>)}</tbody></table>}
        </div>
        <div className="table-panel lab-history-panel">
          <span className="eyebrow">MOLASE & BIOREMEDIASI</span>
          <h2>Riwayat laporan molase</h2>
          {reportHistory.length === 0 ? <p className="empty-history">Belum ada laporan molase.</p> : <table><thead><tr><th>Waktu</th><th>Molase</th><th>Estimasi polutan</th><th>Kondisi lindi</th></tr></thead><tbody>{reportHistory.map((record, index) => <tr key={record.id ?? `${record.created_at}-${index}`}><td>{record.created_at ? new Date(record.created_at).toLocaleDateString('id-ID') : '-'}</td><td>{record.molase_amount || '-'}</td><td>{record.pollutant_estimate || '-'}</td><td>{record.leachate_condition || '-'}</td></tr>)}</tbody></table>}
        </div>
      </div>}
    </section>
  );
}