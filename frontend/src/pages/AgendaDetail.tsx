import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Plus, 
  FileText, 
  MapPin, 
  Clock, 
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
  FileSpreadsheet,
  Camera,
  Video as VideoIcon,
  Trash2,
  Play,
  X
} from 'lucide-react';

interface TemplateAbsensi {
  id: number;
  nama_template: string;
  skema_kolom: any[];
}

interface Absensi {
  id: number;
  data_kehadiran: any;
  waktu_hadir: string;
  operator?: {
    name: string;
  };
}

interface Agenda {
  id: number;
  judul: string;
  deskripsi: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  bidang_penyelenggara: string;
  status: string;
  is_publik: boolean;
  uuid_qr: string;
  template_absensi_id: number;
  template_absensi?: TemplateAbsensi;
  absensis?: Absensi[];
}

interface DokumentasiKegiatan {
  id: number;
  file_path: string;
  tipe_file: 'image' | 'video';
  caption: string | null;
  uploader?: {
    name: string;
  };
}

const AgendaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [absensis, setAbsensis] = useState<Absensi[]>([]);
  const [qrCodeSvg, setQrCodeSvg] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'absensi' | 'dokumentasi'>('absensi');
  const [dokumentasis, setDokumentasis] = useState<DokumentasiKegiatan[]>([]);
  
  // Documentation Upload states
  const [caption, setCaption] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docError, setDocError] = useState('');

  // Lightbox state
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxType, setLightboxType] = useState<'image' | 'video' | null>(null);

  // Modal manual entry state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualData, setManualData] = useState<any>({});
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDokumentasis = async () => {
    try {
      const response = await api.get(`/agendas/${id}/dokumentasi`);
      setDokumentasis(response.data);
    } catch (err) {
      console.error('Error fetching documentation:', err);
    }
  };

  const fetchAgendaDetails = async () => {
    try {
      const response = await api.get(`/agendas/${id}`);
      setAgenda(response.data);
      
      const absensiRes = await api.get(`/agendas/${id}/absensi`);
      setAbsensis(absensiRes.data);

      const qrRes = await api.get(`/agendas/${id}/qr`);
      setQrCodeSvg(qrRes.data.qr_code_svg);
      setQrUrl(qrRes.data.url);
      
      fetchDokumentasis();
    } catch (err) {
      console.error('Error fetching agenda details:', err);
    }
  };

  useEffect(() => {
    fetchAgendaDetails();
    
    // Setup polling for real-time absensi updates if active
    let interval: any;
    if (agenda?.status === 'aktif') {
      interval = setInterval(async () => {
        try {
          const absensiRes = await api.get(`/agendas/${id}/absensi`);
          setAbsensis(absensiRes.data);
        } catch (err) {
          console.error('Error polling absensi:', err);
        }
      }, 5000); // Poll every 5s
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id, agenda?.status]);

  const updateAgendaStatus = async (newStatus: string) => {
    if (!agenda) return;
    try {
      await api.put(`/agendas/${agenda.id}`, {
        judul: agenda.judul,
        deskripsi: agenda.deskripsi,
        tanggal_mulai: agenda.tanggal_mulai,
        tanggal_selesai: agenda.tanggal_selesai,
        lokasi: agenda.lokasi,
        bidang_penyelenggara: agenda.bidang_penyelenggara,
        status: newStatus,
        is_publik: agenda.is_publik,
        template_absensi_id: agenda.template_absensi_id
      });
      fetchAgendaDetails();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleManualAbsen = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await api.post(`/agendas/${id}/absensi/manual`, {
        data_kehadiran: manualData
      });
      setIsManualModalOpen(false);
      setManualData({});
      fetchAgendaDetails();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal menambahkan absensi manual.');
    }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) return;
    setUploadingDoc(true);
    setDocError('');

    const formData = new FormData();
    formData.append('file', docFile);
    if (caption) {
      formData.append('caption', caption);
    }

    try {
      await api.post(`/agendas/${id}/dokumentasi`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDocFile(null);
      setCaption('');
      const fileInput = document.getElementById('docFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchDokumentasis();
    } catch (err: any) {
      setDocError(err.response?.data?.message || 'Gagal mengunggah berkas dokumentasi.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteDoc = async (docId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dokumentasi ini?')) {
      try {
        await api.delete(`/dokumentasi/${docId}`);
        fetchDokumentasis();
      } catch (err) {
        console.error('Error deleting documentation:', err);
      }
    }
  };

  const handleExport = () => {
    // Navigate directly to export endpoint to trigger download
    const token = localStorage.getItem('access_token');
    window.open(`${api.defaults.baseURL}/agendas/${id}/absensi/export?token=${token}`, '_blank');
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && agenda) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code Absensi - ${agenda.judul}</title>
            <style>
              body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
              .qr-container { border: 2px solid #ccc; padding: 20px; border-radius: 16px; background: white; margin-bottom: 20px; }
              h1 { font-size: 28px; margin: 0 0 10px; }
              p { font-size: 16px; color: #666; margin: 5px 0; }
              .url { font-weight: bold; color: #4f46e5; margin-top: 15px; }
            </style>
          </head>
          <body>
            <h1>SCAN QR UNTUK ABSENSI</h1>
            <p style="font-size: 20px; font-weight: bold; color: #333;">${agenda.judul}</p>
            <p>Lokasi: ${agenda.lokasi}</p>
            <div class="qr-container">
              ${qrCodeSvg}
            </div>
            <p>Atau akses link berikut:</p>
            <p class="url">${qrUrl}</p>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
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

  if (!agenda) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const schema = agenda.template_absensi?.skema_kolom || [];

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
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-8 flex items-center gap-4 shrink-0">
          <Link to="/agendas" className="text-slate-400 hover:text-white p-1 bg-slate-800 rounded-lg">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold">Detail Agenda</h1>
        </header>

        <main className="p-8 overflow-y-auto flex-grow space-y-8">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4">
              <div>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${
                  agenda.status === 'aktif' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                  agenda.status === 'selesai' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {agenda.status}
                </span>
                <h2 className="text-3xl font-extrabold mt-2">{agenda.judul}</h2>
                <p className="text-slate-400 mt-2">{agenda.deskripsi || 'Tidak ada deskripsi.'}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-indigo-400" />
                  <span>{new Date(agenda.tanggal_mulai).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-400" />
                  <span>{agenda.lokasi}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-indigo-400" />
                  <span>Form: {agenda.template_absensi?.nama_template || 'Custom'}</span>
                </div>
              </div>
            </div>

            {/* Actions for Status */}
            <div className="flex flex-col justify-center gap-2 bg-slate-950 p-4 rounded-xl border border-slate-800 self-start md:self-center">
              <span className="text-xs font-bold text-slate-500 uppercase mb-1">Ubah Status Absensi</span>
              <div className="flex gap-2">
                <button
                  onClick={() => updateAgendaStatus('draft')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    agenda.status === 'draft' ? 'bg-yellow-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  Tutup/Draft
                </button>
                <button
                  onClick={() => updateAgendaStatus('aktif')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    agenda.status === 'aktif' ? 'bg-green-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  Buka/Aktif
                </button>
                <button
                  onClick={() => updateAgendaStatus('selesai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    agenda.status === 'selesai' ? 'bg-slate-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Area: QR Code */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-bold text-slate-300 mb-4">QR Code Kehadiran</h3>
              {qrCodeSvg ? (
                <div 
                  className="bg-white p-4 rounded-2xl border-4 border-indigo-500/20 max-w-[200px]" 
                  dangerouslySetInnerHTML={{ __html: qrCodeSvg }} 
                />
              ) : (
                <div className="h-44 w-44 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">Memuat QR...</div>
              )}
              <p className="text-xs text-slate-500 mt-4 max-w-xs break-all">
                URL Absen: <a href={qrUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{qrUrl}</a>
              </p>
              
              <div className="flex gap-2 w-full mt-6">
                <button 
                  onClick={handlePrintQR}
                  className="flex-grow flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  <Printer size={14} />
                  Cetak QR
                </button>
              </div>
            </div>

            {/* Right Area: Tabs for Kehadiran / Dokumentasi */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
              {/* Tab Header Selector */}
              <div className="flex gap-4 border-b border-slate-800 pb-3 mb-6 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab('absensi')}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === 'absensi' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Daftar Kehadiran ({absensis.length})
                </button>
                <button
                  onClick={() => setActiveTab('dokumentasi')}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === 'dokumentasi' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Dokumentasi ({dokumentasis.length})
                </button>
              </div>

              {activeTab === 'absensi' ? (
                <>
                  <header className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-300">Daftar Kehadiran</h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-semibold">Total Hadir: {absensis.length} Orang</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsManualModalOpen(true)}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 transition-colors"
                      >
                        <Plus size={14} />
                        Absen Manual
                      </button>
                      <button
                        onClick={handleExport}
                        className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                      >
                        <FileSpreadsheet size={14} />
                        Ekspor CSV
                      </button>
                    </div>
                  </header>

                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-800/40 text-slate-400 font-semibold uppercase border-b border-slate-800">
                        <tr>
                          {schema.map(field => (
                            <th key={field.name} className="px-4 py-3">{field.label}</th>
                          ))}
                          <th className="px-4 py-3">Waktu</th>
                          <th className="px-4 py-3">Metode</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {absensis.map(row => (
                          <tr key={row.id} className="hover:bg-slate-800/10 transition-colors">
                            {schema.map(field => (
                              <td key={field.name} className="px-4 py-3 font-medium">
                                {row.data_kehadiran[field.name] || '-'}
                              </td>
                            ))}
                            <td className="px-4 py-3 text-slate-500">
                              {new Date(row.waktu_hadir).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                row.operator ? 'bg-indigo-500/10 text-indigo-400' : 'bg-green-500/10 text-green-400'
                              }`}>
                                {row.operator ? `Manual (${row.operator.name})` : 'Mandiri'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {absensis.length === 0 && (
                          <tr>
                            <td colSpan={schema.length + 2} className="text-center py-8 text-slate-500">Belum ada kehadiran tercatat.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Upload Form */}
                  <form onSubmit={handleUploadDoc} className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Unggah Dokumentasi Baru</h4>
                    {docError && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-2.5 rounded-lg text-xs">
                        {docError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="file"
                          id="docFileInput"
                          accept="image/*,video/mp4"
                          onChange={(e) => setDocFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg p-2 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          placeholder="Tambahkan keterangan foto/video..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={uploadingDoc}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 disabled:bg-indigo-800"
                    >
                      <Camera size={14} />
                      {uploadingDoc ? 'Mengunggah...' : 'Unggah File'}
                    </button>
                  </form>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {dokumentasis.map(doc => (
                      <div key={doc.id} className="group relative bg-slate-950 border border-slate-850 rounded-xl overflow-hidden shadow">
                        {doc.tipe_file === 'video' ? (
                          <div 
                            onClick={() => { setLightboxUrl(doc.file_path); setLightboxType('video'); }}
                            className="aspect-video w-full bg-slate-900 flex items-center justify-center cursor-pointer relative"
                          >
                            <VideoIcon className="text-indigo-400" size={32} />
                            <span className="absolute bottom-2 right-2 bg-black/60 p-1 rounded-full"><Play size={10} className="text-white" /></span>
                          </div>
                        ) : (
                          <img
                            src={`${api.defaults.baseURL?.replace('/api', '')}/${doc.file_path}`}
                            alt={doc.caption || 'Dokumentasi'}
                            onClick={() => { setLightboxUrl(doc.file_path); setLightboxType('image'); }}
                            className="aspect-video w-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="p-2 border-t border-slate-850 flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] text-slate-400 font-semibold truncate">{doc.caption || 'Tanpa keterangan'}</p>
                            <p className="text-[9px] text-slate-500 truncate">Oleh: {doc.uploader?.name || 'Sistem'}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="text-red-400 hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {dokumentasis.length === 0 && (
                      <div className="col-span-full text-center py-12 text-slate-500">Belum ada dokumentasi terunggah.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Manual Absensi Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Catat Kehadiran Manual</h2>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleManualAbsen} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              {schema.map(field => (
                <div key={field.name}>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={manualData[field.name] || ''}
                    onChange={(e) => setManualData({ ...manualData, [field.name]: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    required={field.required}
                  />
                </div>
              ))}

              <footer className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsManualModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25">
                  Catat Hadir
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Viewer Modal */}
      {lightboxUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={() => { setLightboxUrl(null); setLightboxType(null); }} 
            className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 bg-slate-900/50 rounded-full"
          >
            <X size={28} />
          </button>
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            {lightboxType === 'video' ? (
              <video 
                src={`${api.defaults.baseURL?.replace('/api', '')}/${lightboxUrl}`} 
                controls 
                className="max-w-full max-h-[75vh] rounded-xl" 
                autoPlay 
              />
            ) : (
              <img 
                src={`${api.defaults.baseURL?.replace('/api', '')}/${lightboxUrl}`} 
                alt="Pratinjau dokumentasi" 
                className="max-w-full max-h-[75vh] rounded-xl object-contain" 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaDetail;
