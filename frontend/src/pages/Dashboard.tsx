import React from 'react';
import { useAuthStore } from '../store/authStore';
import Layout from '../components/Layout';
import { Bell } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const header = (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400 font-semibold">Periode aktif:</span>
        <span className="bg-indigo-600/20 text-indigo-400 text-xs px-3 py-1 rounded-full font-bold border border-indigo-500/30">
          {user?.periode?.nama_periode || 'Belum Ditentukan'}
        </span>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <button className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <Bell size={18} />
        </button>
      </div>
    </>
  );

  return (
    <Layout header={header}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Selamat Datang, {user?.name}!</h2>
        <p className="text-slate-400">Berikut ringkasan aktivitas dan operasional organisasi Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-300 mb-2">Agenda Bulan Ini</h3>
          <p className="text-4xl font-extrabold text-indigo-400">0</p>
          <div className="text-xs text-slate-500 mt-2">Tidak ada rapat atau kegiatan terjadwal bulan ini</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-300 mb-2">Surat Keluar</h3>
          <p className="text-4xl font-extrabold text-indigo-400">0</p>
          <div className="text-xs text-slate-500 mt-2">Belum ada surat keluar yang ter-generate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-300 mb-2">Total Kader</h3>
          <p className="text-4xl font-extrabold text-indigo-400">0</p>
          <div className="text-xs text-slate-500 mt-2">Pendataan kader belum dimulai</div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
