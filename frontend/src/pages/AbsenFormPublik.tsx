import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, AlertTriangle, MapPin, Calendar, Clock } from 'lucide-react';

interface SchemaField {
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  label: string;
  required: boolean;
  options?: string[];
}

interface AgendaPublic {
  id: number;
  judul: string;
  deskripsi: string | null;
  tanggal_mulai: string;
  lokasi: string;
  schema: SchemaField[];
}

const AbsenFormPublik: React.FC = () => {
  const { uuid_qr } = useParams<{ uuid_qr: string }>();

  const [agenda, setAgenda] = useState<AgendaPublic | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAgenda = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const response = await api.get(`/public/agenda/${uuid_qr}`);
        setAgenda(response.data);
      } catch (err: any) {
        if (err.response && err.response.data && err.response.data.message) {
          setErrorMsg(err.response.data.message);
        } else {
          setErrorMsg('Agenda tidak ditemukan atau absensi belum dibuka.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAgenda();
  }, [uuid_qr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      await api.post(`/public/agenda/${uuid_qr}/absen`, {
        data_kehadiran: formData
      });
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        setErrorMsg(errors[firstKey][0]);
      } else {
        setErrorMsg('Gagal mengirim absensi. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-400">Memuat halaman absensi...</p>
        </div>
      </div>
    );
  }

  if (errorMsg && !agenda) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center shadow-xl">
          <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold mb-2">Absensi Tidak Aktif</h2>
          <p className="text-slate-400 text-sm mb-6">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (success && agenda) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center shadow-xl space-y-4">
          <CheckCircle2 className="mx-auto text-green-500" size={56} />
          <h2 className="text-2xl font-bold">Kehadiran Dicatat</h2>
          <p className="text-slate-400 text-sm">
            Terima kasih! Kehadiran Anda pada kegiatan <strong>{agenda.judul}</strong> telah berhasil direkam dalam sistem.
          </p>
          <div className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 py-1 px-3 rounded-full inline-block">
            Organia System
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center py-12 px-4">
      {agenda && (
        <div className="max-w-lg w-full space-y-6">
          {/* Info Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
            <span className="text-[10px] bg-green-500/15 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase">
              Absensi Terbuka
            </span>
            <h2 className="text-2xl font-extrabold text-white">{agenda.judul}</h2>
            {agenda.deskripsi && <p className="text-slate-400 text-sm">{agenda.deskripsi}</p>}
            
            <div className="pt-2 grid grid-cols-1 gap-2 text-xs text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-indigo-400" />
                <span>{new Date(agenda.tanggal_mulai).toLocaleDateString('id-ID', { weekday: 'long', dateStyle: 'medium' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-indigo-400" />
                <span>{new Date(agenda.tanggal_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-indigo-400" />
                <span>{agenda.lokasi}</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Formulir Kehadiran</h3>
            
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-xl text-xs mb-6">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {agenda.schema.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm h-20 resize-none text-white focus:outline-none focus:border-indigo-500"
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 disabled:bg-indigo-800 disabled:cursor-not-allowed mt-6"
              >
                {submitting ? 'Mengirim...' : 'Kirim Kehadiran'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbsenFormPublik;
