import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  Clock, 
  FileText, 
  LayoutDashboard, 
  Mail, 
  Wallet, 
  FileBarChart, 
  Users as UsersIcon, 
  Award, 
  Bell, 
  Settings, 
  LogOut, 
  User as UserIcon, 
  Eye 
} from 'lucide-react';

interface TemplateAbsensi {
  id: number;
  nama_template: string;
  skema_kolom: any[];
}

interface Agenda {
  id: number;
  judul: string;
  deskripsi: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  bidang_penyelenggara: string;
  status: string; // draft, aktif, selesai
  is_publik: boolean;
  uuid_qr: string;
  template_absensi_id: number;
  template_absensi?: TemplateAbsensi;
}

const Agendas: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [templates, setTemplates] = useState<TemplateAbsensi[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form states
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [bidang, setBidang] = useState('Sekretaris');
  const [status, setStatus] = useState('draft');
  const [isPublik, setIsPublik] = useState(false);
  const [templateId, setTemplateId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Template Creator modal states
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateColumns, setNewTemplateColumns] = useState<any[]>([
    { name: 'nama', label: 'Nama Lengkap', type: 'text', required: true }
  ]);

  const fetchAgendas = async () => {
    try {
      const response = await api.get('/agendas');
      setAgendas(response.data);
    } catch (err) {
      console.error('Error fetching agendas:', err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/template-absensis');
      setTemplates(response.data);
      if (response.data.length > 0 && !templateId) {
        setTemplateId(response.data[0].id.toString());
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  useEffect(() => {
    fetchAgendas();
    fetchTemplates();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setJudul('');
    setDeskripsi('');
    setTanggalMulai('');
    setTanggalSelesai('');
    setLokasi('');
    setBidang(currentUser?.role?.name || 'Sekretaris');
    setStatus('draft');
    setIsPublik(false);
    if (templates.length > 0) {
      setTemplateId(templates[0].id.toString());
    }
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (agenda: Agenda) => {
    setEditId(agenda.id);
    setJudul(agenda.judul);
    setDeskripsi(agenda.deskripsi || '');
    
    // Format dates for input type datetime-local (YYYY-MM-DDTHH:MM)
    const formatForInput = (dateStr: string) => {
      const d = new Date(dateStr);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setTanggalMulai(formatForInput(agenda.tanggal_mulai));
    setTanggalSelesai(formatForInput(agenda.tanggal_selesai));
    setLokasi(agenda.lokasi);
    setBidang(agenda.bidang_penyelenggara);
    setStatus(agenda.status);
    setIsPublik(agenda.is_publik);
    setTemplateId(agenda.template_absensi_id.toString());
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const payload = {
      judul,
      deskripsi: deskripsi || null,
      tanggal_mulai: tanggalMulai,
      tanggal_selesai: tanggalSelesai,
      lokasi,
      bidang_penyelenggara: bidang,
      status,
      is_publik: isPublik,
      template_absensi_id: parseInt(templateId),
    };

    try {
      if (editId) {
        await api.put(`/agendas/${editId}`, payload);
      } else {
        await api.post('/agendas', payload);
      }
      setIsModalOpen(false);
      fetchAgendas();
    } catch (err: any) {
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('Gagal memproses data. Periksa kembali form.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
      try {
        await api.delete(`/agendas/${id}`);
        fetchAgendas();
      } catch (err) {
        console.error('Error deleting agenda:', err);
      }
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/template-absensis', {
        nama_template: newTemplateName,
        skema_kolom: newTemplateColumns
      });
      setIsTemplateModalOpen(false);
      fetchTemplates();
      setTemplateId(response.data.template.id.toString());
      setNewTemplateName('');
      setNewTemplateColumns([{ name: 'nama', label: 'Nama Lengkap', type: 'text', required: true }]);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membuat template.');
    }
  };

  const addTemplateField = () => {
    setNewTemplateColumns([
      ...newTemplateColumns,
      { name: '', label: '', type: 'text', required: true }
    ]);
  };

  const removeTemplateField = (index: number) => {
    setNewTemplateColumns(newTemplateColumns.filter((_, i) => i !== index));
  };

  const updateTemplateField = (index: number, key: string, value: any) => {
    const updated = [...newTemplateColumns];
    updated[index][key] = value;
    
    // Automatically generate 'name' from 'label' slug if editing label
    if (key === 'label' && !updated[index]['name']) {
      updated[index]['name'] = value.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    
    setNewTemplateColumns(updated);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Sidebar config
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
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800">
            <span className="text-2xl font-bold text-indigo-400">Organia</span>
            <div className="text-xs text-slate-500 mt-1">SIM Organisasi & Kaderisasi</div>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = item.path === '/agendas';
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
          <h1 className="text-xl font-bold">Agenda Kegiatan</h1>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md"
          >
            <Plus size={16} />
            Buat Agenda Baru
          </button>
        </header>

        <main className="p-8 overflow-y-auto flex-grow">
          {/* Agenda Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agendas.map((agenda) => {
              const start = new Date(agenda.tanggal_mulai).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
              return (
                <div key={agenda.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${
                        agenda.status === 'aktif' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                        agenda.status === 'selesai' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {agenda.status}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{agenda.bidang_penyelenggara}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{agenda.judul}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{agenda.deskripsi || 'Tidak ada deskripsi.'}</p>

                    <div className="space-y-2 text-xs text-slate-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-indigo-400" />
                        <span>{start}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-indigo-400" />
                        <span className="truncate">{agenda.lokasi}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-indigo-400" />
                        <span className="truncate">Form: {agenda.template_absensi?.nama_template || 'Custom'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-slate-800/80 pt-4 mt-auto">
                    <Link
                      to={`/agendas/${agenda.id}`}
                      className="flex-grow flex justify-center items-center gap-1.5 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-bold text-slate-300 transition-colors"
                    >
                      <Eye size={14} />
                      Detail & QR
                    </Link>
                    <button
                      onClick={() => openEditModal(agenda)}
                      className="p-2 bg-slate-850 hover:bg-slate-800 text-indigo-400 rounded-xl transition-colors border border-slate-800 inline-block"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(agenda.id)}
                      className="p-2 bg-slate-850 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors border border-slate-800 inline-block"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            {agendas.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">Belum ada agenda kegiatan dibuat.</div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl my-8">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">{editId ? 'Ubah Agenda' : 'Buat Agenda Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Judul Kegiatan</label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Deskripsi</label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mulai Kegiatan</label>
                  <input
                    type="datetime-local"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Selesai Kegiatan</label>
                  <input
                    type="datetime-local"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Lokasi / Tempat</label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bidang Penyelenggara</label>
                  <select
                    value={bidang}
                    onChange={(e) => setBidang(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm"
                  >
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Kaderisasi">Kaderisasi</option>
                    <option value="BIPEKA">BIPEKA</option>
                    <option value="Bendahara">Bendahara</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm"
                  >
                    <option value="draft">Draft (Tutup Absen)</option>
                    <option value="aktif">Aktif (Buka Absen)</option>
                    <option value="selesai">Selesai (Tutup Absen)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Template Form Absensi</label>
                  <button
                    type="button"
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Plus size={12} /> Buat Baru
                  </button>
                </div>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm"
                  required
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.nama_template}</option>
                  ))}
                  {templates.length === 0 && (
                    <option value="">Buat template terlebih dahulu...</option>
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublik"
                  checked={isPublik}
                  onChange={(e) => setIsPublik(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 h-4 w-4"
                />
                <label htmlFor="isPublik" className="text-sm text-slate-300 font-semibold cursor-pointer">
                  Agenda Bersifat Publik (Dapat dilihat umum)
                </label>
              </div>

              <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25">
                  Simpan
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Template Creator Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl my-8">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Buat Template Kolom Absensi</h2>
              <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleCreateTemplate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Template</label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
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
                    onClick={addTemplateField}
                    className="text-xs font-bold bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg hover:bg-indigo-600/30 transition-colors"
                  >
                    Tambah Kolom
                  </button>
                </div>

                {newTemplateColumns.map((col, index) => (
                  <div key={index} className="flex gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="flex-grow grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={col.label}
                        onChange={(e) => updateTemplateField(index, 'label', e.target.value)}
                        placeholder="Label (Nama, NIK, dll)"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs w-full"
                        required
                      />
                      <select
                        value={col.type}
                        onChange={(e) => updateTemplateField(index, 'type', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none"
                      >
                        <option value="text">Teks Pendek</option>
                        <option value="number">Angka / NIK</option>
                        <option value="textarea">Teks Panjang</option>
                      </select>
                      <select
                        value={col.required ? 'true' : 'false'}
                        onChange={(e) => updateTemplateField(index, 'required', e.target.value === 'true')}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none"
                      >
                        <option value="true">Wajib Diisi</option>
                        <option value="false">Opsional</option>
                      </select>
                    </div>
                    {newTemplateColumns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTemplateField(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
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

export default Agendas;
