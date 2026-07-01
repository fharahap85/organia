import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
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
  Clock,
  ExternalLink
} from 'lucide-react';

interface SuratMasuk {
  id: number;
  nomor_surat: string;
  tanggal_terima: string;
  pengirim: string;
  perihal: string;
  file_lampiran_path: string | null;
  status_tindak_lanjut: string; // pending, diproses, selesai
  disposisi_ke_bidang: string | null;
}

const SuratMasukPage: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [suratMasuks, setSuratMasuks] = useState<SuratMasuk[]>([]);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form states
  const [nomorSurat, setNomorSurat] = useState('');
  const [tanggalTerima, setTanggalTerima] = useState('');
  const [pengirim, setPengirim] = useState('');
  const [perihal, setPerihal] = useState('');
  const [fileLampiran, setFileLampiran] = useState<File | null>(null);
  const [statusTindakLanjut, setStatusTindakLanjut] = useState('pending');
  const [disposisiKeBidang, setDisposisiKeBidang] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSuratMasuk = async () => {
    try {
      const response = await api.get('/surat/masuk', {
        params: { search: search || undefined }
      });
      setSuratMasuks(response.data);
    } catch (err) {
      console.error('Error fetching incoming mail:', err);
    }
  };

  useEffect(() => {
    fetchSuratMasuk();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuratMasuk();
  };

  const openAddModal = () => {
    setEditId(null);
    setNomorSurat('');
    setTanggalTerima(new Date().toISOString().split('T')[0]);
    setPengirim('');
    setPerihal('');
    setFileLampiran(null);
    setStatusTindakLanjut('pending');
    setDisposisiKeBidang('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (sm: SuratMasuk) => {
    setEditId(sm.id);
    setNomorSurat(sm.nomor_surat);
    setTanggalTerima(sm.tanggal_terima.split('T')[0]);
    setPengirim(sm.pengirim);
    setPerihal(sm.perihal);
    setFileLampiran(null);
    setStatusTindakLanjut(sm.status_tindak_lanjut);
    setDisposisiKeBidang(sm.disposisi_ke_bidang || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Since we handle file upload, we must use FormData
    const formData = new FormData();
    formData.append('nomor_surat', nomorSurat);
    formData.append('tanggal_terima', tanggalTerima);
    formData.append('pengirim', pengirim);
    formData.append('perihal', perihal);
    formData.append('status_tindak_lanjut', statusTindakLanjut);
    
    if (disposisiKeBidang) {
      formData.append('disposisi_ke_bidang', disposisiKeBidang);
    }
    
    if (fileLampiran) {
      formData.append('file_lampiran', fileLampiran);
    }

    try {
      if (editId) {
        // We use POST to update because multipart forms inside PUT/PATCH in PHP/Laravel can sometimes drop uploaded files.
        // So we route to a POST endpoint specifically designed for update.
        await api.post(`/surat/masuk/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/surat/masuk', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchSuratMasuk();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal mengarsipkan surat masuk. Cek format berkas.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus arsip surat masuk ini?')) {
      try {
        await api.delete(`/surat/masuk/${id}`);
        fetchSuratMasuk();
      } catch (err) {
        console.error('Error deleting incoming mail:', err);
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
            <h1 className="text-xl font-bold">Surat Masuk</h1>
            <nav className="flex gap-2 text-xs">
              <Link to="/surat/templates" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Template</Link>
              <Link to="/surat/buat" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Buat Surat Keluar</Link>
              <Link to="/surat/keluar" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">Arsip Surat Keluar</Link>
              <Link to="/surat/masuk" className="bg-indigo-600/25 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">Surat Masuk</Link>
            </nav>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md"
          >
            <Plus size={16} />
            Arsipkan Surat Masuk
          </button>
        </header>

        <main className="p-8 overflow-y-auto flex-grow">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-6 flex gap-2 max-w-md">
            <div className="relative flex-grow">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nomor surat, perihal..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            </div>
            <button type="submit" className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              Cari
            </button>
          </form>

          {/* Incoming Mail Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-4">Nomor & Tanggal</th>
                  <th className="px-6 py-4">Pengirim</th>
                  <th className="px-6 py-4">Perihal</th>
                  <th className="px-6 py-4">Disposisi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {suratMasuks.map((sm) => (
                  <tr key={sm.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{sm.nomor_surat}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{new Date(sm.tanggal_terima).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{sm.pengirim}</td>
                    <td className="px-6 py-4 text-slate-300 font-semibold">{sm.perihal}</td>
                    <td className="px-6 py-4">
                      {sm.disposisi_ke_bidang ? (
                        <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                          {sm.disposisi_ke_bidang}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600 italic">Belum ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 w-fit ${
                        sm.status_tindak_lanjut === 'selesai' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                        sm.status_tindak_lanjut === 'diproses' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {sm.status_tindak_lanjut === 'selesai' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {sm.status_tindak_lanjut === 'selesai' ? 'Selesai' : sm.status_tindak_lanjut === 'diproses' ? 'Diproses' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {sm.file_lampiran_path && (
                        <a 
                          href={`${api.defaults.baseURL?.replace('/api', '')}/${sm.file_lampiran_path}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 hover:bg-slate-800 rounded-lg text-indigo-400 transition-colors inline-block"
                          title="Buka Lampiran"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button onClick={() => openEditModal(sm)} className="p-2 hover:bg-slate-800 rounded-lg text-indigo-400 transition-colors inline-block" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(sm.id)} className="p-2 hover:bg-slate-800 rounded-lg text-red-400 transition-colors inline-block" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {suratMasuks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">Tidak ada data surat masuk.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl my-8">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">{editId ? 'Ubah Surat Masuk' : 'Arsipkan Surat Masuk'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nomor Surat</label>
                <input
                  type="text"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  placeholder="Contoh: 025/EXT/ORG/VI/2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tanggal Diterima</label>
                  <input
                    type="date"
                    value={tanggalTerima}
                    onChange={(e) => setTanggalTerima(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Pengirim</label>
                  <input
                    type="text"
                    value={pengirim}
                    onChange={(e) => setPengirim(e.target.value)}
                    placeholder="Nama Pengirim/Instansi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Perihal / Hal</label>
                <input
                  type="text"
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                  placeholder="Isi singkat perihal surat"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Disposisi Ke Bidang</label>
                  <select
                    value={disposisiKeBidang}
                    onChange={(e) => setDisposisiKeBidang(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm"
                  >
                    <option value="">Tanpa Disposisi</option>
                    <option value="Ketua">Ketua</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="BIPEKA">BIPEKA</option>
                    <option value="Kaderisasi">Kaderisasi</option>
                    <option value="Bendahara">Bendahara</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Status Tindak Lanjut</label>
                  <select
                    value={statusTindakLanjut}
                    onChange={(e) => setStatusTindakLanjut(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Upload Lampiran (PDF / Gambar)</label>
                <input
                  type="file"
                  onChange={(e) => setFileLampiran(e.target.files ? e.target.files[0] : null)}
                  accept=".pdf,image/*"
                  className="w-full text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none"
                />
              </div>

              <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25">
                  Simpan Arsip
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuratMasukPage;
