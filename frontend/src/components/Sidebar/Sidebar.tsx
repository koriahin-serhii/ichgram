import { Link, useLocation } from 'react-router-dom';
import useAuth from '@app/providers/useAuth';
import styles from './Sidebar.module.css';

// Logo
import Logo from '@assets/logos/logo.svg?react';

// Icons
import HomeIcon from '@assets/icons/home.svg?react';
import HomeActiveIcon from '@assets/icons/home-active.svg?react';
import SearchIcon from '@assets/icons/search.svg?react';
import SearchActiveIcon from '@assets/icons/search-active.svg?react';
import ExploreIcon from '@assets/icons/explore.svg?react';
import ExploreActiveIcon from '@assets/icons/explore-active.svg?react';
import MessagesIcon from '@assets/icons/messages.svg?react';
import MessagesActiveIcon from '@assets/icons/messages-active.svg?react';
import NotificationIcon from '@assets/icons/notification.svg?react';
import NotificationActiveIcon from '@assets/icons/notification-active.svg?react';
import CreateIcon from '@assets/icons/create.svg?react';

interface SidebarProps {
  isSearchOpen: boolean;
  isCreatePostOpen: boolean;
  onSearchClick: () => void;
  onSearchClose: () => void;
  onCreateClick: () => void;
  onCreateClose: () => void;
  onPostDetailClose?: () => void;
}

export default function Sidebar({ 
  isSearchOpen, 
  isCreatePostOpen,
  onSearchClick,
  onSearchClose,
  onCreateClick,
  onCreateClose,
  onPostDetailClose,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isProfileActive = location.pathname === '/my-profile';

  const navItems = [
    {
      id: 'home',
      path: '/',
      label: 'Home',
      icon: HomeIcon,
      activeIcon: HomeActiveIcon,
      onClick: undefined,
    },
    {
      id: 'search',
      path: '#',
      label: 'Search',
      icon: SearchIcon,
      activeIcon: SearchActiveIcon,
      onClick: onSearchClick,
    },
    {
      id: 'explore',
      path: '/explore',
      label: 'Explore',
      icon: ExploreIcon,
      activeIcon: ExploreActiveIcon,
      onClick: undefined,
    },
    {
      id: 'messages',
      path: '/messages',
      label: 'Messages',
      icon: MessagesIcon,
      activeIcon: MessagesActiveIcon,
      onClick: undefined,
    },
    {
      id: 'notifications',
      path: '/notifications',
      label: 'Notifications',
      icon: NotificationIcon,
      activeIcon: NotificationActiveIcon,
      onClick: undefined,
    },
    {
      id: 'create',
      path: '#',
      label: 'Create',
      icon: CreateIcon,
      activeIcon: CreateIcon,
      onClick: onCreateClick,
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <Logo className={styles.logoSvg} />
          </Link>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            // When SearchSidebar or CreatePostModal is open, only that item is active
            const active = isSearchOpen 
              ? item.label === 'Search'
              : isCreatePostOpen
              ? item.label === 'Create'
              : isActive(item.path);
            const IconComponent = active ? item.activeIcon : item.icon;

            if (item.onClick) {
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`${styles.navItem} ${active ? styles.active : ''}`}
                >
                  <IconComponent className={styles.icon} />
                  <span className={styles.label}>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  onSearchClose();
                  onCreateClose();
                  onPostDetailClose?.();
                }}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
              >
                <IconComponent className={styles.icon} />
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.profile}>
          <Link 
            to="/my-profile" 
            className={`${styles.navItem} ${!isSearchOpen && isProfileActive ? styles.active : ''}`} 
            onClick={() => {
              onSearchClose();
              onCreateClose();
              onPostDetailClose?.();
            }}
          >
            <div className={styles.profileAvatar}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatarInner}>
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className={styles.avatarImage} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <span className={styles.label}>Profile</span>
          </Link>
          <button onClick={logout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
