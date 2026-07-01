import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  ArrowLeft, 
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
  Plus,
  CheckCircle,
  FileText,
  Clock,
  GraduationCap,
  Star,
  Edit3
} from 'lucide-react';

interface RiwayatPendidikan {
  id: number;
  jenjang: string;
  nama_sekolah: string | null;
  tahun_masuk: number;
  is_estimasi: boolean;
}

interface AnggotaKeluarga {
  id: number;
  tipe_hubungan: string; // pasangan, anak
  nama: string;
  tanggal_lahir: string | null;
  jenis_kelamin: string;
  riwayat_pendidikans?: RiwayatPendidikan[];
}

interface KaderisasiRecord {
  id: number;
  jenjang: string;
  tahun_lulus: number;
  predikat: string | null;
  sertifikat_file: string | null;
}

interface KaderRating {
  id: number;
  kepemimpinan: number;
  loyalitas: number;
  komunikasi: number;
  kreativitas: number;
  catatan: string | null;
}

interface Kader {
  id: number;
  nama_lengkap: string;
  nik: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  alamat: string | null;
  no_hp: string | null;
  email: string | null;
  status_keanggotaan: string;
  keluargas?: AnggotaKeluarga[];
  kaderisasi_records?: KaderisasiRecord[];
  rating?: KaderRating;
}

const KaderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [kader, setKader] = useState<Kader | null>(null);
  const [activeTab, setActiveTab] = useState<'profil' | 'keluarga' | 'kaderisasi'>('profil');

  // Edit Kader Form State
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nik, setNik] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLair] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [statusKeanggotaan, setStatusKeanggotaan] = useState('aktif');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Add Family Form State
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [relTipeHubungan, setRelTipeHubungan] = useState('pasangan');
  const [relNama, setRelNama] = useState('');
  const [relTanggalLahir, setRelTanggalLahir] = useState('');
  const [relJenisKelamin, setRelJenisKelamin] = useState('L');
  const [savingFamily, setSavingFamily] = useState(false);

  // Actualize Education Modal State
  const [selectedPendidikan, setSelectedPendidikan] = useState<RiwayatPendidikan | null>(null);
  const [actualNamaSekolah, setActualNamaSekolah] = useState('');
  const [actualTahunMasuk, setActualTahunMasuk] = useState(2026);
  const [updatingPendidikan, setUpdatingPendidikan] = useState(false);

  // Add Kaderisasi Form State
  const [isKaderisasiModalOpen, setIsKaderisasiModalOpen] = useState(false);
  const [jenjang, setJenjang] = useState('MAPABA');
  const [tahunLulus, setTahunLulus] = useState(new Date().getFullYear());
  const [predikat, setPredikat] = useState('');
  const [savingKaderisasi, setSavingKaderisasi] = useState(false);

  // Rating Form State
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [kepemimpinan, setKepemimpinan] = useState(3);
  const [loyalitas, setLoyalitas] = useState(3);
  const [komunikasi, setKomunikasi] = useState(3);
  const [kreativitas, setKreativitas] = useState(3);
  const [catatanRating, setCatatanRating] = useState('');
  const [savingRating, setSavingRating] = useState(false);

  const fetchKaderDetail = async () => {
    try {
      const response = await api.get(`/kader/${id}`);
      const data = response.data;
      setKader(data);
      
      // Pre-fill profile edit form
      setNamaLengkap(data.nama_lengkap);
      setNik(data.nik || '');
      setTempatLahir(data.tempat_lahir || '');
      setTanggalLair(data.tanggal_lahir ? data.tanggal_lahir.split('T')[0] : '');
      setAlamat(data.alamat || '');
      setNoHp(data.no_hp || '');
      setEmail(data.email || '');
      setStatusKeanggotaan(data.status_keanggotaan);

      // Pre-fill rating form
      if (data.rating) {
        setKepemimpinan(data.rating.kepemimpinan);
        setLoyalitas(data.rating.loyalitas);
        setKomunikasi(data.rating.komunikasi);
        setKreativitas(data.rating.kreativitas);
        setCatatanRating(data.rating.catatan || '');
      }
    } catch (err) {
      console.error('Error fetching kader details:', err);
    }
  };

  useEffect(() => {
    fetchKaderDetail();
  }, [id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await api.put(`/kader/${id}`, {
        nama_lengkap: namaLengkap,
        nik,
        tempat_lahir: tempatLahir,
        tanggal_lahir: tanggalLahir || null,
        alamat,
        no_hp: noHp,
        email,
        status_keanggotaan: statusKeanggotaan
      });
      alert('Profil kader berhasil diperbarui.');
      fetchKaderDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAddFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFamily(true);
    try {
      await api.post(`/kader/${id}/keluarga`, {
        tipe_hubungan: relTipeHubungan,
        nama: relNama,
        tanggal_lahir: relTanggalLahir || null,
        jenis_kelamin: relJenisKelamin
      });
      setIsFamilyModalOpen(false);
      // Reset
      setRelNama('');
      setRelTanggalLahir('');
      setRelTipeHubungan('pasangan');
      setRelJenisKelamin('L');
      fetchKaderDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan anggota keluarga.');
    } finally {
      setSavingFamily(false);
    }
  };

  const handleDeleteFamily = async (famId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus hubungan keluarga ini?')) {
      try {
        await api.delete(`/keluarga/${famId}`);
        fetchKaderDetail();
      } catch (err) {
        console.error('Error deleting family:', err);
      }
    }
  };

  const handleOpenEducationModal = (pend: RiwayatPendidikan) => {
    setSelectedPendidikan(pend);
    setActualNamaSekolah(pend.nama_sekolah || '');
    setActualTahunMasuk(pend.tahun_masuk);
  };

  const handleActualizeEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPendidikan) return;
    setUpdatingPendidikan(true);

    try {
      await api.put(`/pendidikan/${selectedPendidikan.id}`, {
        nama_sekolah: actualNamaSekolah,
        tahun_masuk: actualTahunMasuk
      });
      setSelectedPendidikan(null);
      fetchKaderDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan aktualisasi.');
    } finally {
      setUpdatingPendidikan(false);
    }
  };

  const handleAddKaderisasi = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKaderisasi(true);
    try {
      await api.post(`/kader/${id}/kaderisasi`, {
        jenjang,
        tahun_lulus: tahunLulus,
        predikat
      });
      setIsKaderisasiModalOpen(false);
      setJenjang('MAPABA');
      setTahunLulus(new Date().getFullYear());
      setPredikat('');
      fetchKaderDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan riwayat kaderisasi.');
    } finally {
      setSavingKaderisasi(false);
    }
  };

  const handleDeleteKaderisasi = async (recordId: number) => {
    if (window.confirm('Hapus riwayat kaderisasi ini?')) {
      try {
        await api.delete(`/kaderisasi/${recordId}`);
        fetchKaderDetail();
      } catch (err) {
        console.error('Error deleting kaderisasi:', err);
      }
    }
  };

  const handleUpdateRating = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRating(true);
    try {
      await api.put(`/kader/${id}/rating`, {
        kepemimpinan,
        loyalitas,
        komunikasi,
        kreativitas,
        catatan: catatanRating
      });
      setIsRatingModalOpen(false);
      alert('Rapor berhasil diperbarui.');
      fetchKaderDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memperbarui rapor kader.');
    } finally {
      setSavingRating(false);
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

  if (!kader) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-sm text-slate-400 animate-pulse">Memuat data kader...</div>
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
            {sidebarItems.map((item) => {
              const isActive = item.path === '/kader';
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
          <Link to="/kader" className="text-slate-400 hover:text-white p-1 bg-slate-800 rounded-lg">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold">Detail Profil Kader</h1>
        </header>

        <main className="p-8 overflow-y-auto flex-grow space-y-8">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex justify-between items-center">
            <div>
              <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${
                kader.status_keanggotaan === 'aktif' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                kader.status_keanggotaan === 'alumni' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}>
                {kader.status_keanggotaan}
              </span>
              <h2 className="text-3xl font-extrabold mt-2 text-white">{kader.nama_lengkap}</h2>
              <p className="text-slate-400 mt-1">{kader.email || 'Tidak ada alamat email.'}</p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex gap-6 border-b border-slate-800 pb-3 mb-6 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('profil')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'profil' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Profil Diri
              </button>
              <button
                onClick={() => setActiveTab('keluarga')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'keluarga' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Data Keluarga ({kader.keluargas?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('kaderisasi')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'kaderisasi' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Kaderisasi & Rapor
              </button>
            </div>

            {activeTab === 'profil' && (
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">NIK (KTP) [Terenkripsi]</label>
                    <input
                      type="text"
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                      maxLength={16}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status Keanggotaan</label>
                    <select
                      value={statusKeanggotaan}
                      onChange={(e) => setStatusKeanggotaan(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tempat Lahir</label>
                    <input
                      type="text"
                      value={tempatLahir}
                      onChange={(e) => setTempatLahir(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={tanggalLair}
                      onChange={(e) => setTanggalLair(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Alamat Lengkap</label>
                  <textarea
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">No. HP (WhatsApp)</label>
                    <input
                      type="text"
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  {updatingProfile ? 'Memproses...' : 'Simpan Perubahan'}
                </button>
              </form>
            )}

            {activeTab === 'keluarga' && (
              <div className="space-y-6">
                <header className="flex justify-between items-center">
                  <h3 className="text-md font-bold text-slate-300">Hubungan Keluarga Kader</h3>
                  <button
                    onClick={() => setIsFamilyModalOpen(true)}
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-colors"
                  >
                    <Plus size={14} />
                    Hubungkan Keluarga
                  </button>
                </header>

                <div className="space-y-6">
                  {kader.keluargas?.map(fam => (
                    <div key={fam.id} className="bg-slate-950 border border-slate-850 p-5 rounded-2xl relative space-y-4">
                      <button
                        onClick={() => handleDeleteFamily(fam.id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-300 p-1.5 bg-slate-900 rounded-lg border border-slate-800"
                        title="Hapus Anggota Keluarga"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600/10 rounded-full flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                          <UsersIcon size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{fam.nama}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">
                            {fam.tipe_hubungan} • {fam.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </p>
                        </div>
                      </div>

                      {/* Render Education Timeline for Children */}
                      {fam.tipe_hubungan === 'anak' && (
                        <div className="border-t border-slate-850 pt-4 space-y-3">
                          <h5 className="text-[11px] font-extrabold text-slate-400 uppercase flex items-center gap-1.5">
                            <GraduationCap size={14} className="text-indigo-400" />
                            Estimasi & Riwayat Sekolah Anak
                          </h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            {fam.riwayat_pendidikans?.map(pend => (
                              <div key={pend.id} className="bg-slate-900 border border-slate-850 p-3 rounded-xl flex flex-col justify-between min-h-[90px]">
                                <div>
                                  <div className="flex justify-between items-start gap-1">
                                    <span className="text-[10px] font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{pend.jenjang}</span>
                                    <span className={`text-[8px] font-extrabold uppercase px-1 rounded ${
                                      pend.is_estimasi ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    }`}>
                                      {pend.is_estimasi ? 'Taksiran AI' : 'Aktual'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-medium mt-2 truncate">
                                    {pend.nama_sekolah || 'Belum diisi'}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center mt-2 border-t border-slate-850 pt-1">
                                  <span className="text-[9px] text-slate-500 font-bold">Masuk: {pend.tahun_masuk}</span>
                                  {pend.is_estimasi && (
                                    <button
                                      onClick={() => handleOpenEducationModal(pend)}
                                      className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300"
                                    >
                                      Aktualisasi
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {kader.keluargas?.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                      Belum ada anggota keluarga terhubung.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'kaderisasi' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Riwayat Kaderisasi */}
                <div className="space-y-6">
                  <header className="flex justify-between items-center">
                    <h3 className="text-md font-bold text-slate-300">Riwayat Kaderisasi Formal</h3>
                    <button
                      onClick={() => setIsKaderisasiModalOpen(true)}
                      className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-colors"
                    >
                      <Plus size={14} />
                      Tambah Riwayat
                    </button>
                  </header>

                  <div className="space-y-4">
                    {kader.kaderisasi_records?.map(rec => (
                      <div key={rec.id} className="bg-slate-950 border border-slate-850 p-4 rounded-2xl relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 font-bold text-xs border border-indigo-500/20">
                            {rec.jenjang}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{rec.jenjang}</h4>
                            <p className="text-xs text-slate-400">Lulus Tahun: {rec.tahun_lulus} {rec.predikat && `• Predikat: ${rec.predikat}`}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteKaderisasi(rec.id)}
                          className="p-1.5 hover:bg-slate-900 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                          title="Hapus Riwayat"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {kader.kaderisasi_records?.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">
                        Belum ada riwayat kaderisasi yang tercatat.
                      </div>
                    )}
                  </div>
                </div>

                {/* Rapor Kader */}
                <div className="space-y-6">
                  <header className="flex justify-between items-center">
                    <h3 className="text-md font-bold text-slate-300">Rapor Penilaian Kader</h3>
                    <button
                      onClick={() => setIsRatingModalOpen(true)}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 transition-colors"
                    >
                      <Edit3 size={14} />
                      {kader.rating ? 'Perbarui Rapor' : 'Beri Penilaian'}
                    </button>
                  </header>

                  {kader.rating ? (
                    <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-5">
                      {[
                        { label: 'Kepemimpinan', value: kader.rating.kepemimpinan, color: 'bg-blue-500' },
                        { label: 'Loyalitas', value: kader.rating.loyalitas, color: 'bg-green-500' },
                        { label: 'Komunikasi', value: kader.rating.komunikasi, color: 'bg-purple-500' },
                        { label: 'Kreativitas', value: kader.rating.kreativitas, color: 'bg-yellow-500' }
                      ].map(item => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">{item.label}</span>
                            <span className="text-white">{item.value} / 5</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.value / 5) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                      {kader.rating.catatan && (
                        <div className="mt-4 pt-4 border-t border-slate-800">
                          <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Catatan Tambahan</h5>
                          <p className="text-xs text-slate-300 italic">"{kader.rating.catatan}"</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">
                      Kader ini belum memiliki rapor penilaian.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Family Member Modal */}
      {isFamilyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Hubungkan Keluarga Baru</h2>
              <button onClick={() => setIsFamilyModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleAddFamily} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipe Hubungan</label>
                  <select
                    value={relTipeHubungan}
                    onChange={(e) => setRelTipeHubungan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="pasangan">Pasangan (Suami/Istri)</option>
                    <option value="anak">Anak</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Jenis Kelamin</label>
                  <select
                    value={relJenisKelamin}
                    onChange={(e) => setRelJenisKelamin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={relNama}
                  onChange={(e) => setRelNama(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tanggal Lahir {relTipeHubungan === 'anak' && '[Terenkripsi]'}</label>
                <input
                  type="date"
                  value={relTanggalLahir}
                  onChange={(e) => setRelTanggalLahir(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-white"
                  required={relTipeHubungan === 'anak'}
                />
              </div>

              <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsFamilyModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" disabled={savingFamily} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-indigo-500/25">
                  {savingFamily ? 'Menyimpan...' : 'Hubungkan'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Actualize Education Modal */}
      {selectedPendidikan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Aktualisasi Pendidikan ({selectedPendidikan.jenjang})</h2>
              <button onClick={() => setSelectedPendidikan(null)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleActualizeEducation} className="p-6 space-y-4">
              <p className="text-xs text-slate-400">Silakan masukkan nama instansi sekolah aktual untuk menggantikan estimasi sistem.</p>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Sekolah / Universitas *</label>
                <input
                  type="text"
                  value={actualNamaSekolah}
                  onChange={(e) => setActualNamaSekolah(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-white"
                  placeholder="Contoh: SD Negeri 1 Jakarta"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tahun Masuk Sekolah *</label>
                <input
                  type="number"
                  value={actualTahunMasuk}
                  onChange={(e) => setActualTahunMasuk(parseInt(e.target.value) || 2026)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-white"
                  required
                />
              </div>

              <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedPendidikan(null)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" disabled={updatingPendidikan} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-indigo-500/25">
                  {updatingPendidikan ? 'Menyimpan...' : 'Simpan & Aktualkan'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Add Kaderisasi Modal */}
      {isKaderisasiModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Catat Riwayat Kaderisasi</h2>
              <button onClick={() => setIsKaderisasiModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleAddKaderisasi} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Jenjang Kaderisasi</label>
                  <select
                    value={jenjang}
                    onChange={(e) => setJenjang(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="MAPABA">MAPABA</option>
                    <option value="PKD">PKD</option>
                    <option value="PKL">PKL</option>
                    <option value="PKN">PKN</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tahun Lulus *</label>
                  <input
                    type="number"
                    value={tahunLulus}
                    onChange={(e) => setTahunLulus(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Predikat / Nilai (Opsional)</label>
                <input
                  type="text"
                  value={predikat}
                  onChange={(e) => setPredikat(e.target.value)}
                  placeholder="Contoh: Lulus Terbaik"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsKaderisasiModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" disabled={savingKaderisasi} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-indigo-500/25">
                  {savingKaderisasi ? 'Menyimpan...' : 'Catat Riwayat'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Update Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-8">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Rapor Penilaian Kader</h2>
              <button onClick={() => setIsRatingModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>

            <form onSubmit={handleUpdateRating} className="p-6 space-y-5">
              {[
                { state: kepemimpinan, setter: setKepemimpinan, label: 'Kepemimpinan' },
                { state: loyalitas, setter: setLoyalitas, label: 'Loyalitas / Komitmen' },
                { state: komunikasi, setter: setKomunikasi, label: 'Kecakapan Komunikasi' },
                { state: kreativitas, setter: setKreativitas, label: 'Kreativitas & Inovasi' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase">{item.label}</label>
                    <span className="text-xs font-bold text-indigo-400">{item.state} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1" max="5" step="1"
                    value={item.state}
                    onChange={(e) => item.setter(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 px-1 mt-0.5">
                    <span>Kurang</span>
                    <span>Cukup</span>
                    <span>Baik</span>
                    <span>Sangat Baik</span>
                    <span>Sempurna</span>
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Catatan Tambahan</label>
                <textarea
                  value={catatanRating}
                  onChange={(e) => setCatatanRating(e.target.value)}
                  placeholder="Tambahkan evaluasi deskriptif..."
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-white h-20 resize-none"
                />
              </div>

              <footer className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsRatingModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  Batal
                </button>
                <button type="submit" disabled={savingRating} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-indigo-500/25">
                  {savingRating ? 'Menyimpan...' : 'Simpan Rapor'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaderDetail;
