import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface VerificationDetails {
  valid: boolean;
  nomor_surat: string;
  tanggal_surat: string;
  jenis_surat: string;
  penerima_nama: string;
  status_ttd: boolean;
  pembuat: string;
  pesan: string;
}

const SuratVerifikasiPublik: React.FC = () => {
  const { uuid_verifikasi } = useParams<{ uuid_verifikasi: string }>();

  const [details, setDetails] = useState<VerificationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const verifyDoc = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const response = await api.get(`/public/verifikasi-surat/${uuid_verifikasi}`);
        setDetails(response.data);
      } catch (err) {
        setErrorMsg('DOKUMEN TIDAK VALID / PALSU. Tanda tangan digital atau nomor surat tidak tercatat di basis data kami.');
      } finally {
        setLoading(false);
      }
    };
    verifyDoc();
  }, [uuid_verifikasi]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-400">Memverifikasi keaslian dokumen...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4">
        <div className="max-w-md w-full bg-red-950/20 border border-red-500/50 p-8 rounded-2xl text-center shadow-xl">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-400 mb-2">Verifikasi Gagal</h2>
          <p className="text-slate-300 text-sm">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center py-12 px-4">
      {details && (
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 text-center">
          <div className="relative inline-block mx-auto">
            <div className="h-16 w-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400">
              <ShieldCheck size={36} />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border border-slate-900">
              <CheckCircle2 size={12} />
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-green-400">Dokumen Asli</h2>
            <p className="text-xs text-slate-400 mt-1">SIM Organia Digital Signature Service</p>
          </div>

          <p className="text-xs text-slate-300 bg-slate-950 border border-slate-850 p-4 rounded-xl leading-relaxed">
            {details.pesan}
          </p>

          <div className="text-left text-xs divide-y divide-slate-800 border-t border-b border-slate-800 py-2">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-semibold">Nomor Surat</span>
              <span className="text-slate-300 font-bold">{details.nomor_surat}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-semibold">Tanggal Terbit</span>
              <span className="text-slate-300 font-bold">{details.tanggal_surat}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-semibold">Jenis Surat</span>
              <span className="text-slate-300 font-bold">{details.jenis_surat}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-semibold">Penerima</span>
              <span className="text-slate-300 font-bold">{details.penerima_nama}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-semibold">Dibuat Oleh</span>
              <span className="text-slate-300 font-bold">{details.pembuat}</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500">
            Tanda tangan digital di-generate menggunakan sistem persetujuan pengurus. Hak cipta terpelihara.
          </div>
        </div>
      )}
    </div>
  );
};

export default SuratVerifikasiPublik;
