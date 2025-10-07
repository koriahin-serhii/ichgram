import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@components/Auth/LoginForm/LoginForm';
import loginImage from '@assets/images/login.png';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className={styles.screen}>
      <div className={styles.imageContainer}>
        <img
          src={loginImage}
          alt="Phone with Instagram app"
          className={styles.phoneImage}
        />
      </div>

      <LoginForm onSuccess={() => navigate('/')} />
    </div>
  );
}
