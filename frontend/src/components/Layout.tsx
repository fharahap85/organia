import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, Calendar, Mail, Wallet, FileBarChart, Users,
  Award, Bell, Settings, LogOut, User as UserIcon, Menu, X
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

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

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, header }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredItems = sidebarItems.filter(item => {
    if (!item.roles) return true;
    if (!user || !user.role) return false;
    if (user.role.name === 'Superadmin') return true;
    return item.roles.includes(user.role.name);
  });

  const sidebarContent = (
    <>
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-indigo-400">Organia</span>
            <div className="text-xs text-slate-500 mt-1">SIM Organisasi & Kaderisasi</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
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
            <div className="text-sm font-semibold truncate">{user?.name}</div>
            <div className="text-xs text-slate-500 truncate">{user?.role?.name}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-semibold">
          <LogOut size={20} /> Keluar
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            {header}
          </div>
        </header>
        <main className="p-4 sm:p-8 overflow-y-auto flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
