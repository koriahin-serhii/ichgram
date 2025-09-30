import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import styles from './MainLayout.module.css';

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/reset'].includes(
    location.pathname
  );
  return (
    <div className={styles.container}>
      {!isAuthPage && <Header />}
      <main className={styles.main}>{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
