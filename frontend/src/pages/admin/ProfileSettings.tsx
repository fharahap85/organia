import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import {
  LayoutDashboard, Calendar, Mail, Wallet, FileBarChart, Users as UsersIcon,
  Award, Bell, Settings, LogOut, User as UserIcon, Globe, Save
} from 'lucide-react';

interface OrgProfile {
  id: number;
  name: string;
  logo_url: string | null;
  visi: string | null;
  misi: string | null;
  sejarah: string | null;
  kontak: string | null;
  is_public_page_active: boolean;
}

const ProfileSettings: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [visi, setVisi] = useState('');
  const [misi, setMisi] = useState('');
  const [sejarah, setSejarah] = useState('');
  const [kontak, setKontak] = useState('');
  const [isPublicActive, setIsPublicActive] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/organization-profile');
      const p = res.data;
      setProfile(p);
      setName(p.name || '');
      setLogoUrl(p.logo_url || '');
      setVisi(p.visi || '');
      setMisi(p.misi || '');
      setSejarah(p.sejarah || '');
      setKontak(p.kontak || '');
      setIsPublicActive(p.is_public_page_active);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await api.put('/organization-profile', {
        name,
        logo_url: logoUrl || null,
        visi: visi || null,
        misi: misi || null,
        sejarah: sejarah || null,
        kontak: kontak || null,
        is_public_page_active: isPublicActive,
      });
      setMsg('Profil berhasil disimpan.');
      fetchProfile();
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Gagal menyimpan profil.');
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
    { name: 'Agenda & Absensi', path: '/agendas', icon: <Calendar size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris', 'BIPEKA'] },
    { name: 'Surat-Menyurat', path: '/surat', icon: <Mail size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris'] },
    { name: 'Keuangan Kegiatan', path: '/keuangan', icon: <Wallet size={20} />, roles: ['Superadmin', 'Ketua', 'Bendahara'] },
    { name: 'Laporan Bulanan', path: '/laporan', icon: <FileBarChart size={20} />, roles: ['Superadmin', 'Ketua', 'Sekretaris'] },
    { name: 'Data Kader', path: '/kader', icon: <UsersIcon size={20} />, roles: ['Superadmin', 'Ketua', 'Kaderisasi', 'BIPEKA'] },
    { name: 'Jenjang Kaderisasi', path: '/kaderisasi', icon: <Award size={20} />, roles: ['Superadmin', 'Ketua', 'Kaderisasi'] },
    { name: 'Notifikasi', path: '/notifikasi', icon: <Bell size={20} /> },
    { name: 'Pengaturan Sistem', path: '/admin/users', icon: <Settings size={20} />, roles: ['Superadmin'] },
  ];

  const filteredSidebarItems = sidebarItems.filter(item => {
    if (!item.roles) return true;
    if (!user || !user.role) return false;
    if (user.role.name === 'Superadmin') return true;
    return item.roles.includes(user.role.name);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-400">Memuat...</div>
      </div>
    );
  }

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
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold flex items-center gap-2"><Globe size={20} /> Pengaturan Halaman Publik</h1>
          <a href="/profil" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:underline font-semibold">
            Lihat Halaman Publik
          </a>
        </header>

        <main className="p-8 overflow-y-auto flex-grow max-w-3xl">
          {msg && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${msg.includes('berhasil') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Toggle */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Halaman Publik Aktif</h3>
                  <p className="text-xs text-slate-500 mt-1">Nonaktifkan untuk menyembunyikan halaman publik dari pengunjung.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublicActive(!isPublicActive)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isPublicActive ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isPublicActive ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold mb-4">Informasi Dasar</h3>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Organisasi</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Logo URL</label>
                <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Kontak</label>
                <input type="text" value={kontak} onChange={e => setKontak(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm" placeholder="email | telepon" />
              </div>
            </div>

            {/* Visi Misi */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold mb-4">Visi & Misi</h3>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Visi</label>
                <textarea value={visi} onChange={e => setVisi(e.target.value)} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Misi</label>
                <textarea value={misi} onChange={e => setMisi(e.target.value)} rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm resize-none" />
              </div>
            </div>

            {/* Sejarah */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Sejarah</h3>
              <textarea value={sejarah} onChange={e => setSejarah(e.target.value)} rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm resize-none" />
            </div>

            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/25">
              <Save size={16} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;
