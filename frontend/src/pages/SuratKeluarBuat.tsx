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
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TemplateSurat {
  id: number;
  judul_template: string;
  jenis_surat: string;
  layout_config?: {
    placeholders?: string[];
  };
}

const SuratKeluarBuat: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<TemplateSurat[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [statusTtd, setStatusTtd] = useState(true);
  
  // Dynamic placeholders list for currently selected template
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  
  // List of recipients with their custom variable data
  const [recipients, setRecipients] = useState<any[]>([
    { nama: '', data: {} }
  ]);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/surat/templates');
      setTemplates(response.data);
      if (response.data.length > 0) {
        setSelectedTemplateId(response.data[0].id.toString());
        setPlaceholders(response.data[0].layout_config?.placeholders || []);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const selected = templates.find(t => t.id.toString() === id);
    const phs = selected?.layout_config?.placeholders || [];
    setPlaceholders(phs);
    
    // Reset recipients data mapping for new placeholders
    const resetRecipients = recipients.map(r => {
      const newData: any = {};
      phs.forEach(p => {
        newData[p] = '';
      });
      return { nama: r.nama, data: newData };
    });
    setRecipients(resetRecipients);
  };

  const addRecipientRow = () => {
    const data: any = {};
    placeholders.forEach(p => {
      data[p] = '';
    });
    setRecipients([...recipients, { nama: '', data }]);
  };

  const removeRecipientRow = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleRecipientNameChange = (index: number, val: string) => {
    const updated = [...recipients];
    updated[index].nama = val;
    setRecipients(updated);
  };

  const handleRecipientPlaceholderChange = (index: number, placeholder: string, val: string) => {
    const updated = [...recipients];
    updated[index].data[placeholder] = val;
    setRecipients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Format payload for backend: array of objects containing 'nama' and other custom fields directly flattened
    const formattedList = recipients.map(r => {
      return {
        nama: r.nama,
        ...r.data
      };
    });

    try {
      const response = await api.post('/surat/generate', {
        template_id: parseInt(selectedTemplateId),
        status_ttd: statusTtd,
        penerima_list: formattedList
      });

      setSuccessMsg(response.data.message);
      // Reset form
      setRecipients([{ nama: '', data: {} }]);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal memulai generate bulk surat.');
    } finally {
      setLoading(false);
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
            <h1 className="text-xl font-bold">Buat Surat Keluar</h1>
            <nav className="flex gap-2 text-xs">
              <Link to="/surat/templates" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Template</Link>
              <Link to="/surat/buat" className="bg-indigo-600/25 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">Buat Surat Keluar</Link>
              <Link to="/surat/keluar" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Arsip Surat Keluar</Link>
              <Link to="/surat/masuk" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Surat Masuk</Link>
            </nav>
          </div>
        </header>

        <main className="p-8 overflow-y-auto flex-grow max-w-4xl w-full mx-auto">
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-300 p-4 rounded-2xl text-sm mb-6 flex items-center gap-3">
              <CheckCircle className="text-green-400" size={20} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-4 rounded-2xl text-sm mb-6 flex items-center gap-3">
              <AlertCircle className="text-red-400" size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-lg font-bold border-b border-slate-800 pb-3">Wizard Generate Massal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Pilih Template Surat</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm"
                  required
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.judul_template}</option>
                  ))}
                  {templates.length === 0 && (
                    <option value="">Buat template terlebih dahulu...</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tanda Tangan Digital Ketua</label>
                <div className="flex items-center gap-2 pt-2.5">
                  <input
                    type="checkbox"
                    id="ttdToggle"
                    checked={statusTtd}
                    onChange={(e) => setStatusTtd(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 h-4 w-4"
                  />
                  <label htmlFor="ttdToggle" className="text-sm text-slate-300 font-semibold cursor-pointer">
                    Lampirkan QR Code TTD Verifikasi Keaslian
                  </label>
                </div>
              </div>
            </div>

            {/* Recipients Data Input */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-300">Daftar Penerima & Variabel</h3>
                <button
                  type="button"
                  onClick={addRecipientRow}
                  className="text-xs font-bold bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg hover:bg-indigo-600/30 transition-colors"
                >
                  Tambah Baris Penerima
                </button>
              </div>

              <div className="space-y-3">
                {recipients.map((rec, index) => (
                  <div key={index} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex gap-3 items-end">
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Penerima</label>
                        <input
                          type="text"
                          value={rec.nama}
                          onChange={(e) => handleRecipientNameChange(index, e.target.value)}
                          placeholder="Nama lengkap"
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs w-full text-white"
                          required
                        />
                      </div>
                      
                      {placeholders.map(ph => (
                        <div key={ph}>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{ph}</label>
                          <input
                            type="text"
                            value={rec.data[ph] || ''}
                            onChange={(e) => handleRecipientPlaceholderChange(index, ph, e.target.value)}
                            placeholder={`Isi ${ph}`}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs w-full text-white"
                            required
                          />
                        </div>
                      ))}
                    </div>
                    
                    {recipients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRecipientRow(index)}
                        className="text-red-400 hover:text-red-300 p-2 bg-slate-900 border border-slate-800 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 disabled:bg-indigo-800 disabled:cursor-not-allowed"
            >
              {loading ? 'Menjadwalkan...' : 'Generate Surat Sekarang'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default SuratKeluarBuat;
