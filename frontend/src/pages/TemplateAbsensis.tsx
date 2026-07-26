import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  Plus, Edit, Trash2, LayoutDashboard, Calendar, Mail, Wallet, FileBarChart, 
  Users as UsersIcon, Award, Bell, Settings, LogOut, User as UserIcon, FileSpreadsheet
} from 'lucide-react';

interface TemplateField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'signature';
  required: boolean;
  options?: string[];
}

interface TemplateAbsensi {
  id: number;
  nama_template: string;
  skema_kolom: TemplateField[];
}

const typeLabels: Record<string, string> = {
  text: 'Teks Pendek',
  number: 'Angka / NIK',
  textarea: 'Teks Panjang',
  select: 'Pilihan',
  signature: 'Tanda Tangan',
};

const fieldTypes = ['text', 'number', 'textarea', 'select', 'signature'];

const TemplateAbsensis: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<TemplateAbsensi[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [namaTemplate, setNamaTemplate] = useState('');
  const [fields, setFields] = useState<TemplateField[]>([
    { name: 'nama', label: 'Nama Lengkap', type: 'text', required: true }
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/template-absensis');
      setTemplates(response.data);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setNamaTemplate('');
    setFields([{ name: 'nama', label: 'Nama Lengkap', type: 'text', required: true }]);
    setErrorMsg('');
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (tpl: TemplateAbsensi) => {
    setEditId(tpl.id);
    setNamaTemplate(tpl.nama_template);
    setFields(tpl.skema_kolom.map(f => ({ ...f })));
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const addField = () => {
    setFields([...fields, { name: '', label: '', type: 'text', required: false }]);
  };

  const updateField = (index: number, key: keyof TemplateField, value: any) => {
    const updated = [...fields];
    (updated[index] as any)[key] = value;
    if (key === 'label') {
      updated[index].name = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    }
    setFields(updated);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const payload = {
      nama_template: namaTemplate,
      skema_kolom: fields,
    };

    try {
      if (editId) {
        await api.put(`/template-absensis/${editId}`, payload);
      } else {
        await api.post('/template-absensis', payload);
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
        await api.delete(`/template-absensis/${id}`);
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
              const isActive = item.path.startsWith('/template-absensis');
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
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-8 flex items-center justify-between shrink-0">
          <div className="flex gap-4 items-center">
            <h1 className="text-xl font-bold">Template Form Absensi</h1>
            <nav className="flex gap-2 text-xs">
              <Link to="/template-absensis" className="bg-indigo-600/25 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">Template</Link>
              <Link to="/agendas" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Agenda & Absensi</Link>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <div key={tpl.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div>
                  <h3 className="text-lg font-bold mb-2">{tpl.nama_template}</h3>
                  <p className="text-xs text-slate-400 font-semibold mb-3">Jumlah kolom: {tpl.skema_kolom.length}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tpl.skema_kolom.map((f, i) => (
                      <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                        {f.label}
                        <span className={`text-[8px] font-bold ${f.required ? 'text-red-400' : 'text-slate-500'}`}>
                          {f.required ? '*' : '?'}
                        </span>
                        <span className="text-indigo-400 font-semibold">[{typeLabels[f.type] || f.type}]</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 border-t border-slate-850 pt-4 mt-auto">
                  <button
                    onClick={() => openEditModal(tpl)}
                    className="flex-grow flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-bold text-slate-300 transition-colors"
                  >
                    <Edit size={14} />
                    Ubah
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
              <div className="col-span-full text-center py-12 text-slate-500">
                <FileSpreadsheet className="mx-auto mb-3 text-slate-600" size={40} />
                <p>Belum ada template absensi dibuat.</p>
                <p className="text-xs text-slate-600 mt-1">Buat template baru untuk mulai mengelola kolom absensi.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl my-8">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">{editId ? 'Ubah Template' : 'Buat Template Baru'}</h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Template</label>
                <input
                  type="text"
                  value={namaTemplate}
                  onChange={(e) => setNamaTemplate(e.target.value)}
                  placeholder="Misal: Absen Rapat Bulanan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                  required
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Skema Kolom Form</label>
                  <button
                    type="button"
                    onClick={addField}
                    className="text-xs font-bold bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg hover:bg-indigo-600/30 transition-colors"
                  >
                    Tambah Kolom
                  </button>
                </div>

                {fields.map((col, index) => (
                  <div key={index} className="flex gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="flex-grow grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={col.label}
                        onChange={(e) => updateField(index, 'label', e.target.value)}
                        placeholder="Label (Nama, NIK, dll)"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs w-full"
                        required
                      />
                      <select
                        value={col.type}
                        onChange={(e) => updateField(index, 'type', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none"
                      >
                        {fieldTypes.map(t => (
                          <option key={t} value={t}>{typeLabels[t]}</option>
                        ))}
                      </select>
                      <select
                        value={col.required ? 'true' : 'false'}
                        onChange={(e) => updateField(index, 'required', e.target.value === 'true')}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none"
                      >
                        <option value="true">Wajib Diisi</option>
                        <option value="false">Opsional</option>
                      </select>
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
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

export default TemplateAbsensis;
