import { useState } from 'react';
import TextField from '@shared/components/TextField/TextField';
import Button from '@shared/components/Button/Button';
import Lock from '@assets/icons/lock.svg?react';
import styles from './resetForm.module.css';
import { Link } from 'react-router-dom';
import * as AuthAPI from '@shared/api/auth';

export type ResetFormProps = {
  onSuccess?: () => void;
};

export default function ResetForm({ onSuccess }: ResetFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!email.trim()) {
      setError('Please enter email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AuthAPI.resetPassword({ email });
      setSuccess(response.message);
      onSuccess?.();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Password reset failed';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Lock className={styles.logo} />
        </div>
        <div className={styles.title}>Trouble logging in?</div>
        <div className={styles.subtitle}>
          Enter your email, phone, or username and we'll send you a link to get
          back into your account.
        </div>
        <form className={styles.form} onSubmit={onSubmit}>
          <TextField
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <div className={styles.error}>{error}</div>}
          {success && (
            <div className={styles.success}>
              {success}
            </div>
          )}
          <Button type="submit" block disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Reset your password'}
          </Button>
          <div className={styles.separator}>
            <span>OR</span>
          </div>
          <Link to="/signup" className={styles.createNew}>
            Create new account
          </Link>
        </form>
      </div>
      <div className={styles.backToLogin}>
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  );
}
