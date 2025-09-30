import styles from './NotFound.module.css';
import loginImage from '@assets/images/login.png';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img
            src={loginImage}
            alt="Phone with Instagram app"
            className={styles.phoneImage}
          />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Oops! Page Not Found (404 Error)</h1>
          <p className={styles.description}>
            We're sorry, but the page you're looking for doesn't seem to exist.
            If you typed the URL manually, please double-check the spelling. If
            you clicked on a link, it may be outdated or broken.
          </p>
        </div>
      </div>
    </div>
  );
}
