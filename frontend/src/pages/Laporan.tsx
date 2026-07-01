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
  FileText,
  AlertTriangle,
  Clock,
  Printer,
  ChevronRight
} from 'lucide-react';

interface LaporanBulanan {
  id: number;
  bulan: number;
  tahun: number;
  tipe_laporan: string;
  bidang: string | null;
  file_pdf_path: string | null;
  created_at: string;
  generator?: {
    name: string;
  };
}

interface PreviewStats {
  bulan_nama: string;
  bulan: number;
  tahun: number;
  tipe_laporan: string;
  bidang: string | null;
  agendas_count: number;
  total_expenses: number;
  pending_receipts_count: number;
  surat_keluar_count: number;
  surat_masuk_count: number;
  average_attendance: number;
}

const Laporan: React.FC = () => {
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [reports, setReports] = useState<LaporanBulanan[]>([]);
  const [selectedBulan, setSelectedBulan] = useState(new Date().getMonth() + 1);
  const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());
  const [tipeLaporan, setTipeLaporan] = useState('gabungan');
  const [selectedBidang, setSelectedBidang] = useState('');

  // Statistics preview state
  const [previewStats, setPreviewStats] = useState<PreviewStats | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  const listBulan = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ];

  const listBidang = [
    'Pengembangan Organisasi',
    'Kaderisasi & SDM',
    'Minat & Bakat',
    'Hubungan Masyarakat',
    'Media & Informasi'
  ];

  const fetchReports = async () => {
    try {
      const response = await api.get('/laporan');
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const fetchPreviewStats = async () => {
    setLoadingPreview(true);
    try {
      const response = await api.post('/laporan/preview', {
        bulan: selectedBulan,
        tahun: selectedTahun,
        tipe_laporan: tipeLaporan,
        bidang: tipeLaporan === 'per_bidang' ? selectedBidang : null
      });
      setPreviewStats(response.data);
    } catch (err) {
      console.error('Error loading report preview:', err);
      setPreviewStats(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    fetchPreviewStats();
  }, [selectedBulan, selectedTahun, tipeLaporan, selectedBidang]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      await api.post('/laporan/generate', {
        bulan: selectedBulan,
        tahun: selectedTahun,
        tipe_laporan: tipeLaporan,
        bidang: tipeLaporan === 'per_bidang' ? selectedBidang : null
      });
      alert('Antrean Laporan Bulanan PDF berhasil dibuat. PDF sedang diproses.');
      fetchReports();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menggenerasi laporan.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus arsip laporan ini?')) {
      try {
        await api.delete(`/laporan/${id}`);
        fetchReports();
      } catch (err) {
        console.error('Error deleting report:', err);
      }
    }
  };

  const handleDownload = (path: string) => {
    window.open(`${api.defaults.baseURL?.replace('/api', '')}/${path}`, '_blank');
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
              const isActive = item.path === '/laporan';
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
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-8 flex items-center shrink-0">
          <h1 className="text-xl font-bold">Laporan Akhir Bulan</h1>
        </header>

        <main className="p-8 overflow-y-auto flex-grow space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Area: Filter and Generate */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 self-start">
              <h3 className="text-lg font-bold text-slate-300">Generate Laporan Baru</h3>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bulan</label>
                    <select
                      value={selectedBulan}
                      onChange={(e) => setSelectedBulan(parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                      required
                    >
                      {listBulan.map(b => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tahun</label>
                    <select
                      value={selectedTahun}
                      onChange={(e) => setSelectedTahun(parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                      required
                    >
                      {[2025, 2026, 2027].map(yr => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tipe Laporan</label>
                  <select
                    value={tipeLaporan}
                    onChange={(e) => {
                      setTipeLaporan(e.target.value);
                      if (e.target.value === 'per_bidang' && !selectedBidang) {
                        setSelectedBidang(listBidang[0]);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                    required
                  >
                    <option value="gabungan">Seluruh Bidang (Gabungan)</option>
                    <option value="per_bidang">Bidang Spesifik</option>
                  </select>
                </div>

                {tipeLaporan === 'per_bidang' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Pilih Bidang</label>
                    <select
                      value={selectedBidang}
                      onChange={(e) => setSelectedBidang(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                      required
                    >
                      {listBidang.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={generating || loadingPreview || !previewStats}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md disabled:bg-indigo-850"
                >
                  {generating ? 'Membuat PDF...' : 'Proses & Buat PDF'}
                </button>
              </form>
            </div>

            {/* Middle Area: Instant Preview Dashboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col space-y-4">
              <h3 className="text-lg font-bold text-slate-300 border-b border-slate-800 pb-3">Pratinjau Angka & Statistik</h3>
              
              {loadingPreview ? (
                <div className="flex-grow flex items-center justify-center py-12">
                  <div className="text-sm text-slate-500 animate-pulse">Menghitung statistik bulanan...</div>
                </div>
              ) : previewStats ? (
                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    {previewStats.pending_receipts_count > 0 && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-3 rounded-xl text-[11px] flex items-start gap-2">
                        <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={14} />
                        <div>
                          <strong>Perhatian:</strong> Ada {previewStats.pending_receipts_count} struk pengeluaran yang belum diverifikasi Bendahara bulan ini.
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Agenda Selesai</span>
                        <span className="text-2xl font-black text-indigo-400">{previewStats.agendas_count} Kegiatan</span>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Rata Absensi</span>
                        <span className="text-2xl font-black text-green-400">{previewStats.average_attendance} Org</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Total Pengeluaran Kas (Verified)</span>
                      <span className="text-xl font-bold text-indigo-300">Rp {previewStats.total_expenses.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <ChevronRight className="text-indigo-400" size={14} />
                        <span>Surat Keluar: {previewStats.surat_keluar_count}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ChevronRight className="text-indigo-400" size={14} />
                        <span>Surat Masuk: {previewStats.surat_masuk_count}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-medium italic pt-4 border-t border-slate-850">
                    * Data di atas adalah kalkulasi real-time sistem sebelum di-compile menjadi dokumen PDF resmi.
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 flex-grow flex items-center justify-center">
                  Gagal memuat pratinjau data.
                </div>
              )}
            </div>

            {/* Right Area: Generated PDF History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
              <h3 className="text-lg font-bold text-slate-300 mb-6 border-b border-slate-800 pb-3">Arsip Laporan Bulanan</h3>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/40 text-slate-400 font-semibold uppercase border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Periode</th>
                      <th className="px-4 py-3">Tipe</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {reports.map(row => (
                      <tr key={row.id} className="hover:bg-slate-800/10 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white">
                          {listBulan.find(b => b.value === row.bulan)?.label} {row.tahun}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {row.tipe_laporan === 'gabungan' ? 'Gabungan' : `Bidang (${row.bidang})`}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {row.file_pdf_path ? (
                            <button
                              onClick={() => handleDownload(row.file_pdf_path!)}
                              className="p-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded transition-colors text-[10px] font-bold px-2 py-1"
                            >
                              Download
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 animate-pulse">Memproses...</span>
                          )}
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1 bg-slate-800 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reports.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-slate-500">Belum ada arsip laporan dibuat.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Laporan;
