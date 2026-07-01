import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface AuthGuardProps {
  requiredRole?: string;
  requiredPermission?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ requiredRole, requiredPermission }) => {
  const { isAuthenticated, user, fetchMe, loading } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchMe();
    }
  }, [isAuthenticated, user, fetchMe]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading || (isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-400">Memuat profil...</p>
        </div>
      </div>
    );
  }

  // Check roles if required
  if (requiredRole && user && user.role?.name !== 'Superadmin' && user.role?.name !== requiredRole) {
    return <Navigate to="/403" replace />;
  }

  // Check permissions if required
  if (requiredPermission && user && user.role?.name !== 'Superadmin') {
    const permissions = user.role?.permissions || [];
    const hasPerm = permissions.some(p => p.name === requiredPermission);
    if (!hasPerm) {
      return <Navigate to="/403" replace />;
    }
  }

  return <Outlet />;
};

export default AuthGuard;
