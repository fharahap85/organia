import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Agendas from './pages/Agendas';
import AgendaDetail from './pages/AgendaDetail';
import AbsenFormPublik from './pages/AbsenFormPublik';
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

        {/* Protected routes */}
        <Route element={<AuthGuard />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agendas" element={<Agendas />} />
          <Route path="/agendas/:id" element={<AgendaDetail />} />
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
