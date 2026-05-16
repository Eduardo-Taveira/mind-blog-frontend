import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // Se não estiver logado, redireciona para /login
  // Se estiver logado, renderiza a página filha normalmente (Outlet)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
