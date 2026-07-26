import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard, Calendar, Mail, Wallet, FileBarChart,
  Users as UsersIcon, Award, Bell, Settings, LogOut, User as UserIcon
} from 'lucide-react';

const Notifikasi: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Agenda & Absensi', path: '/agendas', icon: <Calendar size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris', 'BIPEKA'] },
    { name: 'Surat-Menyurat', path: '/surat', icon: <Mail size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris'] },
    { name: 'Keuangan Kegiatan', path: '/keuangan', icon: <Wallet size={20} />, roles: ['Superadmin', 'Ketua', 'Bendahara'] },
    { name: 'Laporan Bulanan', path: '/laporan', icon: <FileBarChart size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris'] },
    { name: 'Data Kader', path: '/kader', icon: <UsersIcon size={20} />, roles: ['Superadmin', 'Ketua', 'Kaderisasi', 'BIPEKA'] },
    { name: 'Jenjang Kaderisasi', path: '/kaderisasi', icon: <Award size={20} />, roles: ['Superadmin', 'Ketua', 'Kaderisasi'] },
    { name: 'Notifikasi', path: '/notifikasi', icon: <Bell size={20} /> },
    { name: 'Pengaturan Sistem', path: '/admin/users', icon: <Settings size={20} />, roles: ['Superadmin'] },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800">
            <span className="text-2xl font-bold text-indigo-400">Organia</span>
            <div className="text-xs text-slate-500 mt-1">SIM Organisasi & Kaderisasi</div>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = item.path === '/notifikasi';
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

      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-8 flex items-center shrink-0">
          <h1 className="text-xl font-bold">Notifikasi</h1>
        </header>
        <main className="p-8 overflow-y-auto flex-grow space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl max-w-xl mx-auto">
            <Bell className="mx-auto text-indigo-400 mb-4" size={56} />
            <h2 className="text-2xl font-bold mb-2">Notifikasi</h2>
            <p className="text-slate-400 text-sm">Halaman ini akan segera hadir untuk pemberitahuan sistem.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifikasi;
