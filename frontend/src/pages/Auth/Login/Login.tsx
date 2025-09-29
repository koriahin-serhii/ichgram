import styles from './login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '@features/auth/ui/LoginForm/LoginForm';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className={styles.screen}>
      <LoginForm onSuccess={() => navigate('/')} />
      <div style={{ height: 8 }} />
      <div style={{ textAlign: 'center' }}>
        <Link to="/reset" style={{ color: 'var(--primary)' }}>Forgot password?</Link>
      </div>
      <div className={styles.bottomLink}>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
