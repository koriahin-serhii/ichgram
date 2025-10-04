import type { ReactNode } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@components/Sidebar/Sidebar';
import Footer from '@components/Footer/Footer';
import { SearchSidebar, CreatePostModal } from '@shared/components';
import styles from './MainLayout.module.css';

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  
  const isAuthPage = ['/login', '/signup', '/reset'].includes(
    location.pathname
  );

  const handleSearchOpen = () => setIsSearchOpen(true);
  const handleSearchClose = () => setIsSearchOpen(false);
  
  const handleCreatePostOpen = () => setIsCreatePostOpen(true);
  const handleCreatePostClose = () => setIsCreatePostOpen(false);

  return (
    <div className={styles.container}>
      {!isAuthPage && (
        <Sidebar 
          isSearchOpen={isSearchOpen}
          isCreatePostOpen={isCreatePostOpen}
          onSearchClick={handleSearchOpen}
          onSearchClose={handleSearchClose}
          onCreateClick={handleCreatePostOpen}
          onCreateClose={handleCreatePostClose}
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
      
      <CreatePostModal 
        isOpen={isCreatePostOpen} 
        onClose={handleCreatePostClose} 
      />
    </div>
  );
}
