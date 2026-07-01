import { create } from 'zustand';
import api from '../services/api';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  periode_id: number | null;
  status: string;
  role?: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permissionName: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await api.post('/login', { email, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('access_token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      set({ 
        token: access_token, 
        user, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const token = get().token;
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Logout error on backend:', error);
    } finally {
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false 
      });
    }
  },

  fetchMe: async () => {
    const token = get().token;
    if (!token) return;

    set({ loading: true });
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/me');
      set({ 
        user: response.data.user, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      console.error('Fetch me error:', error);
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false 
      });
    }
  },

  hasRole: (roleName) => {
    const user = get().user;
    if (!user || !user.role) return false;
    return user.role.name === roleName;
  },

  hasPermission: (permissionName) => {
    const user = get().user;
    if (!user || !user.role) return false;
    
    // Superadmin bypass
    if (user.role.name === 'Superadmin') return true;

    const permissions = user.role.permissions || [];
    return permissions.some(p => p.name === permissionName);
  }
}));
