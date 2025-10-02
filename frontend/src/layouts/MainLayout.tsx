import type { ReactNode } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@components/Sidebar/Sidebar';
import Footer from '@components/Footer/Footer';
import { SearchSidebar } from '@shared/components';
import styles from './MainLayout.module.css';

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const isAuthPage = ['/login', '/signup', '/reset'].includes(
    location.pathname
  );

  const handleSearchOpen = () => setIsSearchOpen(true);
  const handleSearchClose = () => setIsSearchOpen(false);

  return (
    <div className={styles.container}>
      {!isAuthPage && (
        <Sidebar 
          isSearchOpen={isSearchOpen}
          onSearchClick={handleSearchOpen}
          onSearchClose={handleSearchClose}
        />
      )}
      <main className={`${styles.main} ${!isAuthPage ? styles.withSidebar : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
      
      <SearchSidebar 
        isOpen={isSearchOpen} 
        onClose={handleSearchClose} 
      />
    </div>
  );
}
