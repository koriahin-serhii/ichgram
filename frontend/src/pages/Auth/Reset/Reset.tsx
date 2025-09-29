import styles from './reset.module.css';
import { Link } from 'react-router-dom';

export default function Reset() {
 

  return (
    <div className={styles.screen}>
      
      <div className={styles.bottomLink}>
        Back to <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
