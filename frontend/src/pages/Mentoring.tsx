import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  LayoutDashboard, 
  Calendar, 
  Mail, 
  Wallet, 
  FileBarChart, 
  Users as UsersIcon, 
  Award, 
  Bell, 
  Settings, 
  LogOut, 
  User as UserIcon,
  Plus,
  BookOpen,
  Users
} from 'lucide-react';

interface MentoringGroup {
  id: number;
  nama_kelompok: string;
  mentor_id: number;
  tingkat: string | null;
  status: string;
  total_members: number;
  mentor?: {
    id: number;
    nama_lengkap: string;
  };
}

interface Kader {
  id: number;
  nama_lengkap: string;
}

const Mentoring: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [groups, setGroups] = useState<MentoringGroup[]>([]);
  const [kaders, setKaders] = useState<Kader[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [namaKelompok, setNamaKelompok] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [tingkat, setTingkat] = useState('');
  const [status, setStatus] = useState('aktif');
  const [saving, setSaving] = useState(false);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/mentoring-groups');
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching mentoring groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKaders = async () => {
    try {
      const response = await api.get('/kader?status=aktif');
      setKaders(response.data);
    } catch (err) {
      console.error('Error fetching kaders:', err);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchKaders();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/mentoring-groups', {
        nama_kelompok: namaKelompok,
        mentor_id: mentorId,
        tingkat,
        status
      });
      setIsModalOpen(false);
      setNamaKelompok('');
      setMentorId('');
      setTingkat('');
      setStatus('aktif');
      fetchGroups();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membuat kelompok mentoring.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Agenda & Absensi', path: '/agendas', icon: <Calendar size={20} /> },
    { name: 'Surat-Menyurat', path: '/surat/templates', icon: <Mail size={20} /> },
    { name: 'Keuangan Kegiatan', path: '/keuangan', icon: <Wallet size={20} /> },
    { name: 'Laporan Bulanan', path: '/laporan', icon: <FileBarChart size={20} /> },
    { name: 'Data Kader', path: '/kader', icon: <UsersIcon size={20} /> },
    { name: 'Jenjang Kaderisasi', path: '/kaderisasi', icon: <Award size={20} /> },
    { name: 'Kelompok Mentoring', path: '/mentoring', icon: <BookOpen size={20} /> },
    { name: 'Notifikasi', path: '/notifikasi', icon: <Bell size={20} /> },
    { name: 'Pengaturan Sistem', path: '/admin/users', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800">
            <span className="text-2xl font-bold text-indigo-400">Organia</span>
            <div className="text-xs text-slate-500 mt-1">SIM Organisasi & Kaderisasi</div>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = item.path === '/mentoring';
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                    isActive 
                      ? 'bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-500' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-indigo-400 shrink-0">
              <UserIcon size={20} />
            </div>
            <div className="min-w-0 flex-grow">
              <div className="text-sm font-semibold truncate">{currentUser?.name}</div>
              <div className="text-xs text-slate-500 truncate">{currentUser?.role?.name}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-semibold">
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-bold">Daftar Kelompok Mentoring</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus size={16} /> Tambah Kelompok
          </button>
        </header>

        <main className="p-8 overflow-y-auto flex-grow">
          {loading ? (
            <div className="text-center py-20 text-slate-500 animate-pulse">Memuat data...</div>
          ) : groups.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl">
              <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-300">Belum Ada Kelompok Mentoring</h3>
              <p className="text-sm text-slate-500 mt-2">Buat kelompok baru untuk mulai mendata pembinaan rutin kader.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map(group => (
                <Link
                  key={group.id}
                  to={`/mentoring/${group.id}`}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${
                      group.status === 'aktif' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {group.status}
                    </div>
                    {group.tingkat && (
                      <span className="text-xs font-semibold text-slate-500">{group.tingkat}</span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{group.nama_kelompok}</h3>
                  
                  <div className="space-y-3 mt-6 pt-6 border-t border-slate-800/50">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <UserIcon size={14} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-500">Mentor/Pembimbing</div>
                        <div className="font-medium text-slate-300">{group.mentor?.nama_lengkap || 'Tidak diketahui'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <Users size={14} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-500">Anggota Binaan</div>
                        <div className="font-medium text-slate-300">{group.total_members} Kader</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal Buat Kelompok */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Buat Kelompok Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Kelompok *</label>
                <input
                  type="text"
                  value={namaKelompok}
                  onChange={(e) => setNamaKelompok(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white"
                  placeholder="Contoh: Halaqah Abu Bakar"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mentor / Pembimbing *</label>
                <select
                  value={mentorId}
                  onChange={(e) => setMentorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white"
                  required
                >
                  <option value="" disabled>-- Pilih Mentor (Dari Data Kader) --</option>
                  {kaders.map(k => (
                    <option key={k.id} value={k.id}>{k.nama_lengkap}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tingkatan</label>
                  <input
                    type="text"
                    value={tingkat}
                    onChange={(e) => setTingkat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white"
                    placeholder="Contoh: Dasar 1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <footer className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-indigo-500/25">
                  {saving ? 'Menyimpan...' : 'Buat Kelompok'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentoring;
