import { useState } from 'react';
import FormCard from '@shared/components/FormCard/FormCard';
import TextField from '@shared/components/TextField/TextField';
import Button from '@shared/components/Button/Button';
import useAuth from '@app/providers/useAuth';
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
    <FormCard title="Log in" subtitle="Welcome back to Ichgram">
      <form className={styles.form} onSubmit={onSubmit}>
        <TextField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}>
          <Button type="submit" block disabled={loading}>
            Log in
          </Button>
        </div>
      </form>
    </FormCard>
  );
}
