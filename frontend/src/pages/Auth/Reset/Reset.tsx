import { useState } from 'react';
import FormCard from '@shared/components/FormCard/FormCard';
import TextField from '@shared/components/TextField/TextField';
import Button from '@shared/components/Button/Button';
import styles from './reset.module.css';
import { Link } from 'react-router-dom';

export default function Reset() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: call API
    setSent(true);
  };

  return (
    <div className={styles.screen}>
      <FormCard
        title="Reset password"
        subtitle={
          !sent
            ? 'We’ll send you a link to reset your password'
            : 'Check your inbox for the reset link'
        }
      >
        {!sent ? (
          <form className={styles.form} onSubmit={onSubmit}>
            <TextField
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.actions}>
              <Button type="submit" block>
                Send reset link
              </Button>
            </div>
          </form>
        ) : (
          <div className={styles.success}>
            If an account exists for {email}, you’ll receive an email with a
            reset link.
          </div>
        )}
      </FormCard>
      <div className={styles.bottomLink}>
        Back to <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
