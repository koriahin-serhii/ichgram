import { useState } from 'react';
import TextField from '@shared/components/TextField/TextField';
import Button from '@shared/components/Button/Button';
import useAuth from '@app/providers/useAuth';
import Logo from '@assets/logos/logo.svg?react';
import styles from './SignUpForm.module.css';

export type SignUpFormProps = {
  onSuccess?: () => void;
};

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, loading } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: string[] = [];
    if (!email) next.push('Email is required');
    if (!fullName) next.push('Full name is required');
    if (!name) next.push('Username is required');
    if (!password) next.push('Password is required');
    if (password && password.length < 6) next.push('Password must be at least 6 characters');
    if (password !== confirm) next.push('Passwords do not match');
    setErrors(next);
    if (next.length) return;
    setSubmitError(null);
    try {
      await register(name, email, password, fullName);
      onSuccess?.();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Registration failed';
      setSubmitError(msg);
    }
  };

  const usernameTaken = submitError?.toLowerCase().includes('username') || submitError?.toLowerCase().includes('email or username') || false;

  return (
    <div className={styles.card}>
      <div className={styles.logoWrap}><Logo className={styles.logo} /></div>
      <div className={styles.subtitle}>Sign up to see photos and videos from your friends.</div>
      <form className={styles.form} onSubmit={onSubmit}>
        <TextField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <div>
          <TextField placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
          {(errors.includes('Username is required') || usernameTaken) && (
            <div className={styles.fieldError}>{usernameTaken ? 'This username is already taken.' : 'This username is required.'}</div>
          )}
        </div>
        <TextField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
  <TextField type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {!!errors.length && !errors.includes('Username is required') && (
          <ul className={styles.errors}>
            {errors.map((er, i) => (
              <li key={i}>{er}</li>
            ))}
          </ul>
        )}
        {!usernameTaken && submitError && <div className={styles.errors}>{submitError}</div>}
        <p className={styles.terms}>
          People who use our service may have uploaded your contact information to Ichgram. Learn More.
          <br />
          By signing up, you agree to our <b>Terms</b>, <b>Privacy Policy</b> and <b>Cookies Policy</b>.
        </p>
        <Button type="submit" block disabled={loading}>
          Sign up
        </Button>
      </form>
    </div>
  );
}
