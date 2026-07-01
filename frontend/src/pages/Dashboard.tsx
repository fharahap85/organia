import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Calendar, 
  Mail, 
  Wallet, 
  FileBarChart, 
  Users, 
  Award, 
  Bell, 
  Settings, 
  LogOut, 
  User as UserIcon 
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Agenda & Absensi', path: '/agendas', icon: <Calendar size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris', 'BIPEKA'] },
    { name: 'Surat-Menyurat', path: '/surat', icon: <Mail size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris'] },
    { name: 'Keuangan Kegiatan', path: '/keuangan', icon: <Wallet size={20} />, roles: ['Superadmin', 'Ketua', 'Bendahara'] },
    { name: 'Laporan Bulanan', path: '/laporan', icon: <FileBarChart size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris'] },
    { name: 'Data Kader', path: '/kader', icon: <Users size={20} />, roles: ['Superadmin', 'Ketua', 'Kaderisasi', 'BIPEKA'] },
    { name: 'Jenjang Kaderisasi', path: '/kaderisasi', icon: <Award size={20} />, roles: ['Superadmin', 'Ketua', 'Kaderisasi'] },
    { name: 'Notifikasi', path: '/notifikasi', icon: <Bell size={20} /> },
    { name: 'Pengaturan Sistem', path: '/admin/users', icon: <Settings size={20} />, roles: ['Superadmin'] },
    { name: 'Profil Publik', path: '/admin/profile', icon: <Settings size={20} />, roles: ['Superadmin'] },
  ];

  const filteredSidebarItems = sidebarItems.filter(item => {
    if (!item.roles) return true;
    if (!user || !user.role) return false;
    if (user.role.name === 'Superadmin') return true;
    return item.roles.includes(user.role.name);
  });

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
            {filteredSidebarItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
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

        {/* User profile section at the bottom of sidebar */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-indigo-400 shrink-0">
              <UserIcon size={20} />
            </div>
            <div className="min-w-0 flex-grow">
              <div className="text-sm font-semibold truncate">{user?.name}</div>
              <div className="text-xs text-slate-500 truncate">{user?.role?.name}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-semibold"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 font-semibold">Periode aktif:</span>
            <span className="bg-indigo-600/20 text-indigo-400 text-xs px-3 py-1 rounded-full font-bold border border-indigo-500/30">
              {user?.periode?.nama_periode || 'Belum Ditentukan'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="p-8 overflow-y-auto flex-grow">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Selamat Datang, {user?.name}!</h2>
            <p className="text-slate-400">Berikut ringkasan aktivitas dan operasional organisasi Anda hari ini.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-300 mb-2">Agenda Bulan Ini</h3>
              <p className="text-4xl font-extrabold text-indigo-400">0</p>
              <div className="text-xs text-slate-500 mt-2">Tidak ada rapat atau kegiatan terjadwal bulan ini</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-300 mb-2">Surat Keluar</h3>
              <p className="text-4xl font-extrabold text-indigo-400">0</p>
              <div className="text-xs text-slate-500 mt-2">Belum ada surat keluar yang ter-generate</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-300 mb-2">Total Kader</h3>
              <p className="text-4xl font-extrabold text-indigo-400">0</p>
              <div className="text-xs text-slate-500 mt-2">Pendataan kader belum dimulai</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
