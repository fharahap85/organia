import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface Role {
  id: number;
  name: string;
}

interface Period {
  id: number;
  nama_periode: string;
  is_active: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  periode_id: number | null;
  status: string;
  role?: Role;
  periode?: Period;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [periodeId, setPeriodeId] = useState('');
  const [status, setStatus] = useState('active');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users', { params: { search: search || undefined } });
      setUsers(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [rolesRes, periodsRes] = await Promise.all([api.get('/roles'), api.get('/periodes')]);
      setRoles(rolesRes.data);
      setPeriods(periodsRes.data);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  useEffect(() => { fetchUsers(); fetchMetadata(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchUsers(); };

  const openAddModal = () => {
    setEditId(null); setName(''); setEmail(''); setPassword('');
    setRoleId(roles[0]?.id.toString() || '');
    setPeriodeId(periods.find(p => p.is_active)?.id.toString() || '');
    setStatus('active'); setErrorMsg(''); setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditId(u.id); setName(u.name); setEmail(u.email); setPassword('');
    setRoleId(u.role_id.toString()); setPeriodeId(u.periode_id?.toString() || '');
    setStatus(u.status); setErrorMsg(''); setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const payload = { name, email, role_id: parseInt(roleId), periode_id: periodeId ? parseInt(periodeId) : null, status, password: password || undefined };
    try {
      if (editId) { await api.put(`/users/${editId}`, payload); }
      else { if (!password) { setErrorMsg('Sandi/Password wajib diisi untuk pengguna baru.'); return; } await api.post('/users', payload); }
      setIsModalOpen(false); fetchUsers();
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const firstKey = Object.keys(err.response.data.errors)[0];
        setErrorMsg(err.response.data.errors[firstKey][0]);
      } else { setErrorMsg(err.response?.data?.message || 'Gagal memproses data.'); }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try { await api.delete(`/users/${id}`); fetchUsers(); } catch (err) { console.error(err); }
    }
  };

  const header = (
    <h1 className="text-xl font-bold ml-2">Manajemen Pengguna</h1>
  );

  return (
    <Layout header={header}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <div className="relative flex-grow">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau email..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          </div>
          <button type="submit" className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Cari</button>
        </form>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md self-start">
          <Plus size={16} /> Tambah Pengguna
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-800 animate-pulse rounded-xl" />)}</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Peran</th>
                  <th className="px-6 py-4 hidden md:table-cell">Periode</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-semibold">{u.name}</td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4 hidden sm:table-cell"><span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">{u.role?.name || '-'}</span></td>
                    <td className="px-6 py-4 text-slate-400 hidden md:table-cell">{u.periode?.nama_periode || 'Semua'}</td>
                    <td className="px-6 py-4"><span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${u.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>{u.status === 'active' ? 'Aktif' : 'Nonaktif'}</span></td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(u)} className="p-2 hover:bg-slate-800 rounded-lg text-indigo-400 transition-colors" title="Edit"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(u.id)} className="p-2 hover:bg-slate-800 rounded-lg text-red-400 transition-colors" title="Hapus"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-slate-500">Tidak ada data pengguna.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <header className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">{editId ? 'Ubah Pengguna' : 'Tambah Pengguna'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </header>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-xl text-xs">{errorMsg}</div>}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Lengkap</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Kata Sandi {editId && <span className="text-[10px] text-slate-500 lowercase">(kosongkan jika tidak diubah)</span>}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm" required={!editId} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Peran</label>
                  <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Periode</label>
                  <select value={periodeId} onChange={(e) => setPeriodeId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
                    <option value="">Semua Periode</option>
                    {periods.map(p => <option key={p.id} value={p.id}>{p.nama_periode}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
              <footer className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">Batal</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25">Simpan</button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Users;
