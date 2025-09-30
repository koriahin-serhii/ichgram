import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@components/Sidebar/Sidebar';
import Footer from '@components/Footer/Footer';
import styles from './MainLayout.module.css';

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/reset'].includes(
    location.pathname
  );
  return (
    <div className={styles.container}>
      {!isAuthPage && <Sidebar />}
      <main className={`${styles.main} ${!isAuthPage ? styles.withSidebar : ''}`}>{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
