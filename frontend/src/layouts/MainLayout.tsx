import type { ReactNode } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@components/Sidebar/Sidebar';
import Footer from '@components/Footer/Footer';
import {
  SearchSidebar,
  NotificationsSidebar,
  CreatePostModal,
} from '@shared/components';
import PostDetailModal from '@shared/components/PostDetailModal/PostDetailModal';
import { PostDetailProvider } from '@app/providers/PostDetailProvider';
import { usePostDetail } from '@app/providers/usePostDetail';
import styles from './MainLayout.module.css';

function MainLayoutContent({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { selectedPostId, closePostDetail } = usePostDetail();

  const isAuthPage = ['/login', '/signup', '/reset'].includes(
    location.pathname
  );

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
    setIsNotificationsOpen(false);
    setIsCreatePostOpen(false);
    closePostDetail();
  };
  const handleSearchClose = () => setIsSearchOpen(false);

  const handleNotificationsOpen = () => {
    setIsNotificationsOpen(true);
    setIsSearchOpen(false);
    setIsCreatePostOpen(false);
    closePostDetail();
  };
  const handleNotificationsClose = () => setIsNotificationsOpen(false);

  const handleCreatePostOpen = () => {
    setIsCreatePostOpen(true);
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
    closePostDetail();
  };
  const handleCreatePostClose = () => setIsCreatePostOpen(false);

  return (
    <div className={styles.container}>
      {!isAuthPage && (
        <Sidebar
          isSearchOpen={isSearchOpen}
          isNotificationsOpen={isNotificationsOpen}
          isCreatePostOpen={isCreatePostOpen}
          onSearchClick={handleSearchOpen}
          onSearchClose={handleSearchClose}
          onNotificationsClick={handleNotificationsOpen}
          onNotificationsClose={handleNotificationsClose}
          onCreateClick={handleCreatePostOpen}
          onCreateClose={handleCreatePostClose}
          onPostDetailClose={closePostDetail}
        />
      )}
      <main
        className={`${styles.main} ${!isAuthPage ? styles.withSidebar : ''}`}
      >
        {children}
      </main>
      {!isAuthPage && (
        <Footer
          onSearchClick={handleSearchOpen}
          onSearchClose={handleSearchClose}
          onNotificationsClick={handleNotificationsOpen}
          onNotificationsClose={handleNotificationsClose}
          onCreateClick={handleCreatePostOpen}
          onCreateClose={handleCreatePostClose}
          onPostDetailClose={closePostDetail}
        />
      )}

      <SearchSidebar isOpen={isSearchOpen} onClose={handleSearchClose} />

      <NotificationsSidebar
        isOpen={isNotificationsOpen}
        onClose={handleNotificationsClose}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={handleCreatePostClose}
      />

      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          isOpen={true}
          onClose={closePostDetail}
        />
      )}
    </div>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <PostDetailProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </PostDetailProvider>
  );
}
