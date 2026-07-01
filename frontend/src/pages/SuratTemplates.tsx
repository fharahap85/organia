import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
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
  HelpCircle
} from 'lucide-react';

interface TemplateSurat {
  id: number;
  judul_template: string;
  jenis_surat: string;
  konten_html: string;
  layout_config?: {
    placeholders?: string[];
  };
}

const SuratTemplates: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<TemplateSurat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form states
  const [judul, setJudul] = useState('');
  const [jenisSurat, setJenisSurat] = useState('Keputusan');
  const [kontenHtml, setKontenHtml] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/surat/templates');
      setTemplates(response.data);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setJudul('');
    setJenisSurat('Keputusan');
    setKontenHtml(`<h3>KOP SURAT</h3>\n<p>Hal: Undangan Kegiatan</p>\n<p>Kepada Yth.<br><strong>{{nama}}</strong><br>di Tempat</p>\n<p>Dengan hormat, kami mengundang Saudara selaku <strong>{{jabatan}}</strong> untuk menghadiri acara...</p>`);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (tpl: TemplateSurat) => {
    setEditId(tpl.id);
    setJudul(tpl.judul_template);
    setJenisSurat(tpl.jenis_surat);
    setKontenHtml(tpl.konten_html);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const payload = {
      judul_template: judul,
      jenis_surat: jenisSurat,
      konten_html: kontenHtml
    };

    try {
      if (editId) {
        await api.put(`/surat/templates/${editId}`, payload);
      } else {
        await api.post('/surat/templates', payload);
      }
      setIsModalOpen(false);
      fetchTemplates();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal menyimpan template.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus template ini?')) {
      try {
        await api.delete(`/surat/templates/${id}`);
        fetchTemplates();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Gagal menghapus template.');
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
            <h1 className="text-xl font-bold">Template Surat</h1>
            <nav className="flex gap-2 text-xs">
              <Link to="/surat/templates" className="bg-indigo-600/25 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">Template</Link>
              <Link to="/surat/buat" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Buat Surat Keluar</Link>
              <Link to="/surat/keluar" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Arsip Surat Keluar</Link>
              <Link to="/surat/masuk" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Surat Masuk</Link>
            </nav>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md"
          >
            <Plus size={16} />
            Tambah Template
          </button>
        </header>

        <main className="p-8 overflow-y-auto flex-grow">
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <div key={tpl.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div>
                  <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    {tpl.jenis_surat}
                  </span>
                  <h3 className="text-lg font-bold mt-3 mb-2">{tpl.judul_template}</h3>
                  <div className="text-xs text-slate-500 space-y-1 mb-4">
                    <span className="font-semibold text-slate-400 block mb-1">Daftar Variabel Placeholder:</span>
                    <div className="flex flex-wrap gap-1">
                      {tpl.layout_config?.placeholders?.map(ph => (
                        <span key={ph} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">{`{{${ph}}}`}</span>
                      ))}
                      {(!tpl.layout_config?.placeholders || tpl.layout_config.placeholders.length === 0) && (
                        <span className="text-[10px] text-slate-600 italic">Hanya sistem default ({{nomor_surat}}, {{tanggal_surat}})</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-slate-850 pt-4 mt-auto">
                  <button
                    onClick={() => openEditModal(tpl)}
                    className="flex-grow flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-bold text-slate-300 transition-colors"
                  >
                    <Edit size={14} />
                    Ubah Template
                  </button>
                  <button
                    onClick={() => handleDelete(tpl.id)}
                    className="p-2 bg-slate-850 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors border border-slate-800 inline-block"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {templates.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">Belum ada template surat dibuat.</div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl my-8">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">{editId ? 'Ubah Template' : 'Buat Template Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama/Judul Template</label>
                  <input
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Undangan Rapat Kerja"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Jenis Surat</label>
                  <select
                    value={jenisSurat}
                    onChange={(e) => setJenisSurat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm"
                  >
                    <option value="Keputusan">Keputusan (SK)</option>
                    <option value="Undangan">Undangan</option>
                    <option value="Pengantar">Pengantar</option>
                    <option value="Keterangan">Keterangan</option>
                    <option value="Pemberitahuan">Pemberitahuan</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Konten HTML Surat</label>
                  <div className="text-[10px] text-indigo-400 flex items-center gap-1">
                    <HelpCircle size={12} />
                    <span>Gunakan placeholder seperti <code>{`{{nama}}`}</code>, <code>{`{{jabatan}}`}</code>, <code>{`{{nomor_surat}}`}</code></span>
                  </div>
                </div>
                <textarea
                  value={kontenHtml}
                  onChange={(e) => setKontenHtml(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono h-64 resize-none focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25">
                  Simpan Template
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuratTemplates;
