import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Agendas from './pages/Agendas';
import AgendaDetail from './pages/AgendaDetail';
import AbsenFormPublik from './pages/AbsenFormPublik';
import SuratTemplates from './pages/SuratTemplates';
import SuratKeluarBuat from './pages/SuratKeluarBuat';
import SuratKeluarArsip from './pages/SuratKeluarArsip';
import SuratMasukPage from './pages/SuratMasuk';
import SuratVerifikasiPublik from './pages/SuratVerifikasiPublik';
import Keuangan from './pages/Keuangan';
import Laporan from './pages/Laporan';
import Kader from './pages/Kader';
import KaderDetail from './pages/KaderDetail';
import Forbidden from './pages/Forbidden';
import AuthGuard from './components/AuthGuard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="/absen/:uuid_qr" element={<AbsenFormPublik />} />
        <Route path="/verifikasi-surat/:uuid_verifikasi" element={<SuratVerifikasiPublik />} />

        {/* Protected routes */}
        <Route element={<AuthGuard />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agendas" element={<Agendas />} />
          <Route path="/agendas/:id" element={<AgendaDetail />} />
          
          {/* Surat-Menyurat */}
          <Route path="/surat/templates" element={<SuratTemplates />} />
          <Route path="/surat/buat" element={<SuratKeluarBuat />} />
          <Route path="/surat/keluar" element={<SuratKeluarArsip />} />
          <Route path="/surat/masuk" element={<SuratMasukPage />} />

          {/* Keuangan & OCR */}
          <Route path="/keuangan" element={<Keuangan />} />

          {/* Laporan Bulanan */}
          <Route path="/laporan" element={<Laporan />} />

          {/* Kader & Keluarga */}
          <Route path="/kader" element={<Kader />} />
          <Route path="/kader/:id" element={<KaderDetail />} />
        </Route>

        <Route element={<AuthGuard requiredRole="Superadmin" />}>
          <Route path="/admin/users" element={<Users />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
