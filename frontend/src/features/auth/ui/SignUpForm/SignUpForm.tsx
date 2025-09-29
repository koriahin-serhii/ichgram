import { useState } from 'react';
import FormCard from '@shared/components/FormCard/FormCard';
import TextField from '@shared/components/TextField/TextField';
import Button from '@shared/components/Button/Button';
import useAuth from '@app/providers/useAuth';
import styles from './SignUpForm.module.css';

export type SignUpFormProps = {
  onSuccess?: () => void;
};

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, loading } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: string[] = [];
    if (!name) next.push('Name is required');
    if (!email) next.push('Email is required');
    if (!password) next.push('Password is required');
    if (password && password.length < 6) next.push('Password must be at least 6 characters');
    if (password !== confirm) next.push('Passwords do not match');
    setErrors(next);
    if (next.length) return;
    setSubmitError(null);
    try {
      await register(name, email, password);
      onSuccess?.();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Registration failed';
      setSubmitError(msg);
    }
  };

  return (
    <FormCard title="Sign up" subtitle="Create your Ichgram account">
      <form className={styles.form} onSubmit={onSubmit}>
        <TextField label="Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        <TextField label="Confirm password" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {!!errors.length && (
          <ul className={styles.errors}>
            {errors.map((er, i) => (
              <li key={i}>{er}</li>
            ))}
          </ul>
        )}
        <div className={styles.actions}>
          {submitError && <div className={styles.errors}>{submitError}</div>}
          <Button type="submit" block disabled={loading}>
            Create account
          </Button>
        </div>
      </form>
    </FormCard>
  );
}
