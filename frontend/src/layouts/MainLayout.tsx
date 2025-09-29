import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@widgets/Header/Header';

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/reset'].includes(location.pathname);
  return (
    <div>
      {!isAuthPage && <Header />}
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}
