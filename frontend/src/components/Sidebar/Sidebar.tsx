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
import ProfileIcon from '@assets/icons/profile.svg?react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: HomeIcon,
      activeIcon: HomeActiveIcon,
    },
    {
      path: '/search',
      label: 'Search',
      icon: SearchIcon,
      activeIcon: SearchActiveIcon,
    },
    {
      path: '/explore',
      label: 'Explore',
      icon: ExploreIcon,
      activeIcon: ExploreActiveIcon,
    },
    {
      path: '/messages',
      label: 'Messages',
      icon: MessagesIcon,
      activeIcon: MessagesActiveIcon,
    },
    {
      path: '/notifications',
      label: 'Notifications',
      icon: NotificationIcon,
      activeIcon: NotificationActiveIcon,
    },
    {
      path: '/create',
      label: 'Create',
      icon: CreateIcon,
      activeIcon: CreateIcon,
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
            const active = isActive(item.path);
            const IconComponent = active ? item.activeIcon : item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
              >
                <IconComponent className={styles.icon} />
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.profile}>
          {user ? (
            <>
              <Link to="/my-profile" className={styles.navItem}>
                <ProfileIcon className={styles.icon} />
                <span className={styles.label}>Profile</span>
              </Link>
              <button onClick={logout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
