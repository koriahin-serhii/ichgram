import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '@app/providers/useAuth';

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a loader
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export function RedirectIfAuthed() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (user) {
    let redirectTo = '/';
    const state = (location as unknown as { state?: { from?: { pathname?: string } } }).state;
    if (state?.from?.pathname) redirectTo = state.from.pathname;
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
}
