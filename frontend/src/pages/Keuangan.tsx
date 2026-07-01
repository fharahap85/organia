import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  Plus, 
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
  AlertTriangle,
  ZoomIn,
  FileSpreadsheet
} from 'lucide-react';

interface Agenda {
  id: number;
  judul: string;
}

interface Struk {
  id: number;
  agenda_id: number;
  file_gambar_path: string;
  nominal: number;
  tanggal_transaksi: string | null;
  nama_vendor: string | null;
  status_verifikasi: string; // pending, verified, rejected
  low_confidence_flags: string[] | null;
  agenda?: Agenda;
}

interface KeuanganSummary {
  agenda_id: number;
  judul: string;
  total_pengeluaran: number;
  anggaran_kegiatan: number;
  sisa_anggaran: number;
}

const Keuangan: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [struks, setStruks] = useState<Struk[]>([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [summaries, setSummaries] = useState<KeuanganSummary[]>([]);
  
  // Form upload states
  const [selectedAgendaId, setSelectedAgendaId] = useState('');
  const [fileGambar, setFileGambar] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Verification states (2-column details)
  const [selectedStruk, setSelectedStruk] = useState<Struk | null>(null);
  const [nominal, setNominal] = useState(0);
  const [vendor, setVendor] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [status, setStatus] = useState('pending');
  const [verifying, setVerifying] = useState(false);

  const fetchKeuanganData = async () => {
    try {
      const [struksRes, agendasRes, summariesRes] = await Promise.all([
        api.get('/keuangan/struk'),
        api.get('/agendas'),
        api.get('/keuangan/summary')
      ]);
      setStruks(struksRes.data);
      setAgendas(agendasRes.data);
      setSummaries(summariesRes.data);
      
      if (agendasRes.data.length > 0 && !selectedAgendaId) {
        setSelectedAgendaId(agendasRes.data[0].id.toString());
      }
    } catch (err) {
      console.error('Error fetching keuangan details:', err);
    }
  };

  useEffect(() => {
    fetchKeuanganData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileGambar) return;
    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('agenda_id', selectedAgendaId);
    formData.append('file_gambar', fileGambar);

    try {
      await api.post('/keuangan/struk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFileGambar(null);
      const fileInput = document.getElementById('receiptFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchKeuanganData();
      
      // Let user know AI is working
      alert('Foto struk berhasil diunggah. AI/OCR sedang melakukan ekstraksi data di background.');
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Gagal mengunggah berkas.');
    } finally {
      setUploading(false);
    }
  };

  const openVerificationPanel = (struk: Struk) => {
    setSelectedStruk(struk);
    setNominal(struk.nominal);
    setVendor(struk.nama_vendor || '');
    setTanggal(struk.tanggal_transaksi ? struk.tanggal_transaksi.split('T')[0] : '');
    setStatus(struk.status_verifikasi);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStruk) return;
    setVerifying(true);

    try {
      await api.put(`/keuangan/struk/${selectedStruk.id}`, {
        nominal,
        tanggal_transaksi: tanggal,
        nama_vendor: vendor,
        status_verifikasi: status
      });
      setSelectedStruk(null);
      fetchKeuanganData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan verifikasi.');
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus struk ini?')) {
      try {
        await api.delete(`/keuangan/struk/${id}`);
        fetchKeuanganData();
      } catch (err) {
        console.error('Error deleting receipt:', err);
      }
    }
  };

  const handleExportPdf = () => {
    const token = localStorage.getItem('access_token');
    window.open(`${api.defaults.baseURL}/keuangan/export-pdf?token=${token}`, '_blank');
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
              const isActive = item.path === '/keuangan';
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
          <h1 className="text-xl font-bold">Keuangan Kegiatan & AI OCR</h1>
          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md"
          >
            <Download size={16} />
            Unduh Laporan Keuangan (PDF)
          </button>
        </header>

        <main className="p-8 overflow-y-auto flex-grow space-y-8">
          
          {/* Summary/Budget Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaries.map(s => {
              const percentage = Math.min(100, Math.round((s.total_pengeluaran / s.anggaran_kegiatan) * 100));
              return (
                <div key={s.agenda_id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                  <h3 className="text-sm font-extrabold text-slate-300 truncate">{s.judul}</h3>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>Terpakai: Rp {s.total_pengeluaran.toLocaleString('id-ID')}</span>
                    <span>Anggaran: Rp {s.anggaran_kegiatan.toLocaleString('id-ID')}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-indigo-500'
                      }`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold flex justify-between">
                    <span>Sisa: Rp {s.sisa_anggaran.toLocaleString('id-ID')}</span>
                    <span>{percentage}% terpakai</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Area: Upload Receipt */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 self-start">
              <h3 className="text-lg font-bold text-slate-300">Unggah Struk Pengeluaran</h3>
              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-xl text-xs">
                  {uploadError}
                </div>
              )}
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Pilih Agenda/Kegiatan</label>
                  <select
                    value={selectedAgendaId}
                    onChange={(e) => setSelectedAgendaId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm"
                    required
                  >
                    {agendas.map(a => (
                      <option key={a.id} value={a.id}>{a.judul}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Berkas Gambar Struk</label>
                  <input
                    type="file"
                    id="receiptFileInput"
                    accept="image/*"
                    onChange={(e) => setFileGambar(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md disabled:bg-indigo-800"
                >
                  {uploading ? 'Mengunggah...' : 'Unggah & Ekstrak OCR'}
                </button>
              </form>
            </div>

            {/* Right Area: Receipts List */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
              <h3 className="text-lg font-bold text-slate-300 mb-6 border-b border-slate-800 pb-3">Berkas Struk Bukti Pengeluaran</h3>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/40 text-slate-400 font-semibold uppercase border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Vendor / Toko</th>
                      <th className="px-4 py-3">Kegiatan</th>
                      <th className="px-4 py-3 text-right">Nominal</th>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {struks.map(row => (
                      <tr key={row.id} className="hover:bg-slate-800/10 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white">
                          {row.nama_vendor || 'Mengekstrak AI...'}
                        </td>
                        <td className="px-4 py-3 text-slate-400 truncate max-w-[120px]">
                          {row.agenda?.judul || '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-indigo-400">
                          {row.nominal ? `Rp ${row.nominal.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {row.tanggal_transaksi ? new Date(row.tanggal_transaksi).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                            row.status_verifikasi === 'verified' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                            row.status_verifikasi === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                          }`}>
                            {row.status_verifikasi === 'verified' ? 'Verified' : row.status_verifikasi === 'rejected' ? 'Rejected' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button 
                            onClick={() => openVerificationPanel(row)}
                            className="p-1.5 bg-slate-800 hover:bg-indigo-600 rounded text-slate-300 hover:text-white transition-colors"
                            title="Tinjau Struk"
                          >
                            Tinjau
                          </button>
                          <button 
                            onClick={() => handleDelete(row.id)}
                            className="p-1.5 bg-slate-800 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {struks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500">Belum ada struk diunggah.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Verification 2-Column Modal */}
      {selectedStruk && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-lg font-bold">Verifikasi AI & Koreksi Struk</h2>
              <button onClick={() => setSelectedStruk(null)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {/* Column 1: Struk Image Preview */}
              <div className="p-6 flex flex-col items-center justify-center bg-slate-950 min-h-[300px]">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><ZoomIn size={12} /> Foto Bukti Asli</span>
                <div className="border border-slate-850 rounded-xl overflow-hidden max-w-xs max-h-[400px]">
                  <img 
                    src={`${api.defaults.baseURL?.replace('/api', '')}/${selectedStruk.file_gambar_path}`} 
                    alt="Foto struk bukti" 
                    className="w-full h-auto object-contain max-h-[380px]" 
                  />
                </div>
              </div>

              {/* Column 2: Edit Form */}
              <form onSubmit={handleVerify} className="p-6 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Data Hasil Pembacaan AI</span>

                {selectedStruk.low_confidence_flags && selectedStruk.low_confidence_flags.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-3 rounded-xl text-xs flex items-start gap-2">
                    <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="font-bold">Perlu Review Manual</p>
                      <p className="text-[10px]">AI kurang yakin membaca field berikut: <strong>{selectedStruk.low_confidence_flags.join(', ')}</strong>. Pastikan kebenaran isian.</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Vendor / Toko</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2 text-sm text-white focus:outline-none ${
                      selectedStruk.low_confidence_flags?.includes('nama_vendor') ? 'border-yellow-500/50 focus:border-yellow-500' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nominal (Rp)</label>
                    <input
                      type="number"
                      value={nominal}
                      onChange={(e) => setNominal(parseInt(e.target.value) || 0)}
                      className={`w-full bg-slate-950 border rounded-xl px-4 py-2 text-sm text-white focus:outline-none ${
                        selectedStruk.low_confidence_flags?.includes('nominal') ? 'border-yellow-500/50 focus:border-yellow-500' : 'border-slate-800 focus:border-indigo-500'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tanggal Transaksi</label>
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className={`w-full bg-slate-950 border rounded-xl px-4 py-2 text-sm text-white focus:outline-none ${
                        selectedStruk.low_confidence_flags?.includes('tanggal_transaksi') ? 'border-yellow-500/50 focus:border-yellow-500' : 'border-slate-800 focus:border-indigo-500'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Verifikasi Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="pending">Pending (Perlu Review)</option>
                    <option value="verified">Verified (Setujui Transaksi)</option>
                    <option value="rejected">Rejected (Tolak Transaksi)</option>
                  </select>
                </div>

                <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => setSelectedStruk(null)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                    Batal
                  </button>
                  <button type="submit" disabled={verifying} className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-green-500/25 disabled:bg-green-800">
                    {verifying ? 'Menyimpan...' : 'Simpan & Verifikasi'}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Keuangan;
