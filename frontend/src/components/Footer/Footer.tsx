import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

interface FooterProps {
  onSearchClick?: () => void;
  onSearchClose?: () => void;
  onNotificationsClick?: () => void;
  onNotificationsClose?: () => void;
  onCreateClick?: () => void;
  onCreateClose?: () => void;
  onPostDetailClose?: () => void;
}

export default function Footer({
  onSearchClick,
  onSearchClose,
  onNotificationsClick,
  onNotificationsClose,
  onCreateClick,
  onCreateClose,
  onPostDetailClose,
}: FooterProps) {
  const handleNavigationClick = () => {
    onSearchClose?.();
    onNotificationsClose?.();
    onCreateClose?.();
    onPostDetailClose?.();
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link} onClick={handleNavigationClick}>
            Home
          </Link>
          <button 
            className={styles.link} 
            onClick={onSearchClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Search
          </button>
          <Link to="/explore" className={styles.link} onClick={handleNavigationClick}>
            Explore
          </Link>
          <Link to="/messages" className={styles.link} onClick={handleNavigationClick}>
            Messages
          </Link>
          <button 
            className={styles.link}
            onClick={onNotificationsClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Notifications
          </button>
          <button 
            className={styles.link}
            onClick={onCreateClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Create
          </button>
        </nav>
        <div className={styles.copyright}>© 2025 ICHgram</div>
      </div>
    </footer>
  );
}
