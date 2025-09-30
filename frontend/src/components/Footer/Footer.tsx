import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <Link to="/search" className={styles.link}>
            Search
          </Link>
          <Link to="/explore" className={styles.link}>
            Explore
          </Link>
          <Link to="/messages" className={styles.link}>
            Messages
          </Link>
          <Link to="/notifications" className={styles.link}>
            Notifications
          </Link>
          <Link to="/create" className={styles.link}>
            Create
          </Link>
        </nav>
        <div className={styles.copyright}>© 2025 ICHgram</div>
      </div>
    </footer>
  );
}
