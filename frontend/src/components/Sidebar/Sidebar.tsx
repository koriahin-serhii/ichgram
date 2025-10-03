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
  onSearchClick: () => void;
  onSearchClose: () => void;
}

export default function Sidebar({ isSearchOpen, onSearchClick, onSearchClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isProfileActive = location.pathname === '/my-profile';

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: HomeIcon,
      activeIcon: HomeActiveIcon,
      onClick: undefined,
    },
    {
      path: '#',
      label: 'Search',
      icon: SearchIcon,
      activeIcon: SearchActiveIcon,
      onClick: onSearchClick,
    },
    {
      path: '/explore',
      label: 'Explore',
      icon: ExploreIcon,
      activeIcon: ExploreActiveIcon,
      onClick: undefined,
    },
    {
      path: '/messages',
      label: 'Messages',
      icon: MessagesIcon,
      activeIcon: MessagesActiveIcon,
      onClick: undefined,
    },
    {
      path: '/notifications',
      label: 'Notifications',
      icon: NotificationIcon,
      activeIcon: NotificationActiveIcon,
      onClick: undefined,
    },
    {
      path: '/create',
      label: 'Create',
      icon: CreateIcon,
      activeIcon: CreateIcon,
      onClick: undefined,
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
            // When SearchSidebar is open, only Search is active
            const active = isSearchOpen 
              ? item.label === 'Search'
              : isActive(item.path);
            const IconComponent = active ? item.activeIcon : item.icon;

            if (item.onClick) {
              return (
                <button
                  key={item.path}
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
                key={item.path}
                to={item.path}
                onClick={onSearchClose}
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
            onClick={onSearchClose}
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
