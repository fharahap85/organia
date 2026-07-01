import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  ArrowLeft, 
  Trash2, 
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

interface Kader {
  id: number;
  nama_lengkap: string;
}

interface MentoringMember {
  id: number;
  mentoring_group_id: number;
  kader_id: number;
  status: string;
  kader: Kader;
}

interface MentoringGroup {
  id: number;
  nama_kelompok: string;
  mentor_id: number;
  tingkat: string | null;
  status: string;
  mentor?: Kader;
  members?: MentoringMember[];
}

const MentoringDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [group, setGroup] = useState<MentoringGroup | null>(null);
  const [kaders, setKaders] = useState<Kader[]>([]);

  // Add Member State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedKader, setSelectedKader] = useState('');
  const [memberStatus, setMemberStatus] = useState('aktif');
  const [adding, setAdding] = useState(false);

  const fetchGroupDetail = async () => {
    try {
      const response = await api.get(`/mentoring-groups/${id}`);
      setGroup(response.data);
    } catch (err) {
      console.error('Error fetching mentoring group details:', err);
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
    fetchGroupDetail();
    fetchKaders();
  }, [id]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post(`/mentoring-groups/${id}/members`, {
        kader_id: selectedKader,
        status: memberStatus
      });
      setIsAddModalOpen(false);
      setSelectedKader('');
      fetchGroupDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan anggota.');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (window.confirm('Yakin ingin mengeluarkan kader dari kelompok mentoring ini?')) {
      try {
        await api.delete(`/mentoring-members/${memberId}`);
        fetchGroupDetail();
      } catch (err) {
        console.error('Error removing member:', err);
      }
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

  if (!group) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-sm text-slate-400 animate-pulse">Memuat detail kelompok...</div>
      </div>
    );
  }

  // Filter out kaders that are already in this group
  const availableKaders = kaders.filter(k => 
    !group.members?.some(m => m.kader_id === k.id)
  );

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
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-8 flex items-center gap-4 shrink-0">
          <Link to="/mentoring" className="text-slate-400 hover:text-white p-1 bg-slate-800 rounded-lg">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold">Detail Kelompok Mentoring</h1>
        </header>

        <main className="p-8 overflow-y-auto flex-grow space-y-8">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 text-indigo-400 shadow-inner">
                  <BookOpen size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-extrabold text-white">{group.nama_kelompok}</h2>
                    <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${
                      group.status === 'aktif' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <UserIcon size={16} className="text-slate-500" />
                      <span className="text-sm font-medium text-slate-300"><span className="text-slate-500">Mentor:</span> {group.mentor?.nama_lengkap}</span>
                    </div>
                    {group.tingkat && (
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-300"><span className="text-slate-500">Tingkat:</span> {group.tingkat}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-500" />
                      <span className="text-sm font-medium text-slate-300"><span className="text-slate-500">Anggota:</span> {group.members?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Anggota Kelompok</h3>
                <p className="text-xs text-slate-400">Daftar kader yang tergabung dalam pembinaan ini.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
              >
                <Plus size={16} /> Tambah Anggota
              </button>
            </div>
            
            <div className="p-6">
              {group.members && group.members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map(member => (
                    <div key={member.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                          <UserIcon size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                            {member.kader.nama_lengkap}
                          </div>
                          <div className={`text-[10px] font-bold uppercase mt-1 ${
                            member.status === 'aktif' ? 'text-green-400' : 'text-slate-500'
                          }`}>
                            {member.status}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 bg-slate-900 rounded-xl text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all border border-slate-800"
                        title="Hapus Anggota"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                  <Users size={48} className="mx-auto text-slate-700 mb-4" />
                  <p className="text-sm">Belum ada anggota yang ditambahkan.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Tambah Anggota */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Tambah Kader ke Kelompok</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Pilih Kader *</label>
                <select
                  value={selectedKader}
                  onChange={(e) => setSelectedKader(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white"
                  required
                >
                  <option value="" disabled>-- Pilih Kader yang Tersedia --</option>
                  {availableKaders.map(k => (
                    <option key={k.id} value={k.id}>{k.nama_lengkap}</option>
                  ))}
                  {availableKaders.length === 0 && (
                    <option value="" disabled>Semua kader aktif sudah masuk ke kelompok ini.</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status Keanggotaan</label>
                <select
                  value={memberStatus}
                  onChange={(e) => setMemberStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white"
                >
                  <option value="aktif">Aktif</option>
                  <option value="alumni">Alumni / Lulus</option>
                  <option value="keluar">Keluar / Pindah</option>
                </select>
              </div>

              <footer className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" disabled={adding || availableKaders.length === 0} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
                  {adding ? 'Menambahkan...' : 'Tambah Anggota'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentoringDetail;
