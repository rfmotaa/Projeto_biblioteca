import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export const ClientePrivateRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.tipo !== 'cliente') {
    return <Navigate to="/login/cliente" replace />;
  }

  return <Outlet />;
};
