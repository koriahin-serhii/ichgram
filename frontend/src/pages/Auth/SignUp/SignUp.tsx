import styles from './signup.module.css';
import { Link, useNavigate } from 'react-router-dom';
import SignUpForm from '@components/Auth/SignUpForm/SignUpForm';

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <div className={styles.screen}>
      <SignUpForm onSuccess={() => navigate('/')} />
      <div className={styles.bottomLink}>
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
