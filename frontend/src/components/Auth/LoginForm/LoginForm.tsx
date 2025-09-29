import { useState } from 'react';
import TextField from '@shared/components/TextField/TextField';
import Button from '@shared/components/Button/Button';
import useAuth from '@app/providers/useAuth';
import Logo from '@assets/logos/logo-auth.svg?react';
import { Link } from 'react-router-dom';
import styles from './LoginForm.module.css';

export type LoginFormProps = {
  onSuccess?: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      await login(email, password);
      onSuccess?.();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed';
      setError(msg);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.logoWrap}>
        <Logo className={styles.logo} />
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <TextField
          placeholder="Username, or email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className={styles.error}>{error}</div>}
        <Button type="submit" block disabled={loading}>
          Log in
        </Button>
        <div className={styles.separator}>
          <span>OR</span>
        </div>
        <Link to="/reset" className={styles.forgot}>
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
