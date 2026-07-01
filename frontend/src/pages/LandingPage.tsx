import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface OrgProfile {
  name: string;
  logo_url: string | null;
  visi: string | null;
  misi: string | null;
  sejarah: string | null;
  kontak: string | null;
}

interface StrukturItem {
  id: number;
  jabatan: string;
  user?: { name: string };
  parent_id: number | null;
}

interface Agenda {
  id: number;
  judul: string;
  deskripsi: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  status: string;
}

const LandingPage: React.FC = () => {
  const [profile, setProfile] = useState<OrgProfile | null>(null);
  const [struktur, setStruktur] = useState<StrukturItem[]>([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, strukturRes, agendaRes] = await Promise.all([
          api.get('/public/profile'),
          api.get('/public/struktur'),
          api.get('/public/agendas'),
        ]);
        setProfile(profileRes.data);
        setStruktur(strukturRes.data);
        setAgendas(agendaRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-400">Memuat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Halaman Tidak Tersedia</h1>
          <p className="text-slate-400 mb-4">{error}</p>
          <Link to="/login" className="text-indigo-400 hover:underline">Ke Halaman Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-400">{profile?.name || 'Organia'}</span>
          <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors font-semibold">
            Masuk
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-6">{profile?.name || 'Organia'}</h1>
        {profile?.visi && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-indigo-400 mb-3">Visi</h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">{profile.visi}</p>
          </div>
        )}
        {profile?.misi && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-indigo-400 mb-3">Misi</h2>
            <div className="text-slate-400 text-left max-w-3xl mx-auto whitespace-pre-line leading-relaxed">
              {profile.misi}
            </div>
          </div>
        )}
      </section>

      {/* Struktur Kepengurusan */}
      {struktur.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-10">Kepengurusan Saat Ini</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {struktur.map((s) => (
              <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="text-sm text-indigo-400 font-bold mb-1">{s.jabatan}</div>
                <div className="text-slate-300 font-semibold">{s.user?.name || '-'}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Kalender Kegiatan */}
      {agendas.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-10">Kalender Kegiatan</h2>
          <div className="space-y-4">
            {agendas.map((a) => (
              <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold mb-1">{a.judul}</h3>
                  {a.deskripsi && <p className="text-slate-400 text-sm mb-2">{a.deskripsi}</p>}
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(a.tanggal_mulai).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {a.lokasi}</span>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold self-start ${
                  a.status === 'aktif' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {a.status === 'aktif' ? 'Berlangsung' : 'Selesai'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-500 text-sm">
          {profile?.kontak && <p className="mb-2">{profile.kontak}</p>}
          <p>&copy; {new Date().getFullYear()} {profile?.name || 'Organia'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
