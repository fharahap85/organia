import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  Download, 
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
  ExternalLink
} from 'lucide-react';

interface SuratKeluar {
  id: number;
  nomor_surat: string;
  tanggal_surat: string;
  jenis_surat: string;
  penerima_nama: string;
  status_ttd: boolean;
  file_pdf_path: string | null;
  uuid_verifikasi: string;
}

const SuratKeluarArsip: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [surats, setSurats] = useState<SuratKeluar[]>([]);
  const [search, setSearch] = useState('');

  const fetchSuratKeluar = async () => {
    try {
      const response = await api.get('/surat/keluar', {
        params: { search: search || undefined }
      });
      setSurats(response.data);
    } catch (err) {
      console.error('Error fetching outgoing archives:', err);
    }
  };

  useEffect(() => {
    fetchSuratKeluar();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuratKeluar();
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
              const isActive = item.path.startsWith('/surat');
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
          <div className="flex gap-4 items-center">
            <h1 className="text-xl font-bold">Arsip Surat Keluar</h1>
            <nav className="flex gap-2 text-xs">
              <Link to="/surat/templates" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Template</Link>
              <Link to="/surat/buat" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Buat Surat Keluar</Link>
              <Link to="/surat/keluar" className="bg-indigo-600/25 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">Arsip Surat Keluar</Link>
              <Link to="/surat/masuk" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Surat Masuk</Link>
            </nav>
          </div>
        </header>

        <main className="p-8 overflow-y-auto flex-grow">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-6 flex gap-2 max-w-md">
            <div className="relative flex-grow">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nomor surat, nama penerima..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            </div>
            <button type="submit" className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              Cari
            </button>
          </form>

          {/* Outgoing Mail Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-4">Nomor & Tanggal</th>
                  <th className="px-6 py-4">Jenis</th>
                  <th className="px-6 py-4">Penerima</th>
                  <th className="px-6 py-4">TTD Digital</th>
                  <th className="px-6 py-4 text-right">Berkas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {surats.map((sm) => (
                  <tr key={sm.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{sm.nomor_surat}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{new Date(sm.tanggal_surat).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{sm.jenis_surat}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-semibold">{sm.penerima_nama}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 w-fit ${
                        sm.status_ttd ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {sm.status_ttd ? <CheckCircle size={12} /> : null}
                        {sm.status_ttd ? 'Terverifikasi' : 'Tanpa TTD'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {sm.file_pdf_path ? (
                        <a 
                          href={`${api.defaults.baseURL?.replace('/api', '')}/${sm.file_pdf_path}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition-all shadow-md ml-auto w-fit"
                        >
                          <Download size={14} /> Unduh PDF
                        </a>
                      ) : (
                        <span className="text-xs text-slate-600 italic">Sedang Generate...</span>
                      )}
                    </td>
                  </tr>
                ))}
                {surats.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">Tidak ada data surat keluar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuratKeluarArsip;
