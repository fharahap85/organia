import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-black text-indigo-500 mb-4">403</h1>
        <h2 className="text-3xl font-bold mb-4">Akses Ditolak</h2>
        <p className="text-slate-400 mb-8">
          Anda tidak memiliki hak akses (permissions) yang memadai untuk melihat halaman ini.
        </p>
        <Link 
          to="/dashboard" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 inline-block"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
