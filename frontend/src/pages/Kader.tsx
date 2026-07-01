import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  Plus, 
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
  Search,
  CheckCircle,
  Eye
} from 'lucide-react';

interface Kader {
  id: number;
  nama_lengkap: string;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  no_hp: string | null;
  email: string | null;
  status_keanggotaan: string; // aktif, nonaktif, alumni
}

const KaderList: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [kaders, setKaders] = useState<Kader[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  
  // Add Kader modal/form state
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nik, setNik] = useState('');
  const [tempatLair, setTempatLair] = useState('');
  const [tanggalLair, setTanggalLair] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [statusKeanggotaan, setStatusKeanggotaan] = useState('aktif');
  const [saving, setSaving] = useState(false);

  const fetchKaders = async () => {
    try {
      const response = await api.get('/kader', {
        params: { search, status }
      });
      setKaders(response.data);
    } catch (err) {
      console.error('Error fetching kaders:', err);
    }
  };

  useEffect(() => {
    fetchKaders();
  }, [search, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/kader', {
        nama_lengkap: namaLengkap,
        nik,
        tempat_lahir: tempatLair,
        tanggal_lahir: tanggalLair || null,
        alamat,
        no_hp: noHp,
        email,
        status_keanggotaan: statusKeanggotaan
      });
      setIsOpenModal(false);
      // Reset form
      setNamaLengkap('');
      setNik('');
      setTempatLair('');
      setTanggalLair('');
      setAlamat('');
      setNoHp('');
      setEmail('');
      setStatusKeanggotaan('aktif');
      fetchKaders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan kader.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Apakah Anda yakin ingin menghapus profil kader ini?')) {
      try {
        await api.delete(`/kader/${id}`);
        fetchKaders();
      } catch (err) {
        console.error('Error deleting kader:', err);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Agenda & Absensi', path: '/agendas', icon: <Calendar size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris', 'BIPEKA'] },
    { name: 'Surat-Menyurat', path: '/surat/templates', icon: <Mail size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris'] },
    { name: 'Keuangan Kegiatan', path: '/keuangan', icon: <Wallet size={20} />, roles: ['Superadmin', 'Ketua', 'Bendahara'] },
    { name: 'Laporan Bulanan', path: '/laporan', icon: <FileBarChart size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris'] },
    { name: 'Data Kader', path: '/kader', icon: <UsersIcon size={20} />, roles: ['Superadmin', 'Ketua', 'Kaderisasi', 'BIPEKA'] },
    { name: 'Jenjang Kaderisasi', path: '/kaderisasi', icon: <Award size={20} />, roles: ['Superadmin', 'Ketua', 'Kaderisasi'] },
    { name: 'Notifikasi', path: '/notifikasi', icon: <Bell size={20} /> },
    { name: 'Pengaturan Sistem', path: '/admin/users', icon: <Settings size={20} />, roles: ['Superadmin'] },
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
              const isActive = item.path === '/kader';
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
          <h1 className="text-xl font-bold">Manajemen Data Kader</h1>
          <button 
            onClick={() => setIsOpenModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md"
          >
            <Plus size={16} />
            Tambah Kader
          </button>
        </header>

        <main className="p-8 overflow-y-auto flex-grow space-y-6">
          {/* Search & Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3.5 top-3 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Cari kader berdasarkan nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="w-full md:w-48 shrink-0">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
          </div>

          {/* Kader Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/40 text-slate-400 font-semibold uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Nama Lengkap</th>
                    <th className="px-6 py-3">No. HP</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">TTL</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {kaders.map(row => (
                    <tr 
                      key={row.id} 
                      onClick={() => navigate(`/kader/${row.id}`)}
                      className="hover:bg-slate-800/20 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-white">{row.nama_lengkap}</td>
                      <td className="px-6 py-4 text-slate-400">{row.no_hp || '-'}</td>
                      <td className="px-6 py-4 text-slate-400">{row.email || '-'}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {row.tempat_lahir ? `${row.tempat_lahir}, ` : ''}
                        {row.tanggal_lahir ? new Date(row.tanggal_lahir).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                          row.status_keanggotaan === 'aktif' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                          row.status_keanggotaan === 'alumni' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                          'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          {row.status_keanggotaan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/kader/${row.id}`)}
                          className="p-1.5 bg-slate-800 hover:bg-indigo-600 rounded text-slate-300 hover:text-white transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(row.id, e)}
                          className="p-1.5 bg-slate-800 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {kaders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500">Tidak ada data kader ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Kader Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Tambah Kader Baru</h2>
              <button onClick={() => setIsOpenModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">NIK (KTP)</label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm"
                    maxLength={16}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status Keanggotaan</label>
                  <select
                    value={statusKeanggotaan}
                    onChange={(e) => setStatusKeanggotaan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={tempatLair}
                    onChange={(e) => setTempatLair(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={tanggalLair}
                    onChange={(e) => setTanggalLair(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Alamat Domisili</label>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">No. HP (WhatsApp)</label>
                  <input
                    type="text"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm"
                  />
                </div>
              </div>

              <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpenModal(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-indigo-500/25">
                  {saving ? 'Menyimpan...' : 'Simpan Kader'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaderList;
