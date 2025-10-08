import { useNavigate } from 'react-router-dom';
import styles from './reset.module.css';
import ResetForm from '@components/Auth/ResetForm/ResetForm';

export default function Reset() {
  const navigate = useNavigate();

  return (
    <div className={styles.screen}>
      <ResetForm onSuccess={() => navigate('/login')} />
    </div>
  );
}
