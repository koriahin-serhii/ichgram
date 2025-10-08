import { useState } from 'react';
import TextField from '@shared/components/TextField/TextField';
import Button from '@shared/components/Button/Button';
import useAuth from '@app/providers/useAuth';
import Logo from '@assets/logos/logo-auth.svg?react';
import styles from './SignUpForm.module.css';
import { Link } from 'react-router-dom';

export type SignUpFormProps = {
  onSuccess?: () => void;
};

type ValidationError = {
  field: string;
  message: string;
};

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];
    
    // Email validation
    if (!email.trim()) {
      newErrors.push({ field: 'email', message: 'Email is required' });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.push({ field: 'email', message: 'Please enter a valid email' });
      }
    }
    
    // Full name validation
    if (!fullName.trim()) {
      newErrors.push({ field: 'fullName', message: 'Full name is required' });
    }
    
    // Username validation
    if (!name.trim()) {
      newErrors.push({ field: 'name', message: 'Username is required' });
    } else if (name.length < 3) {
      newErrors.push({ field: 'name', message: 'Username must be at least 3 characters' });
    } else if (!/^[a-zA-Z0-9._]+$/.test(name)) {
      newErrors.push({ field: 'name', message: 'Username can only contain letters, numbers, dots and underscores' });
    }
    
    // Password validation
    if (!password.trim()) {
      newErrors.push({ field: 'password', message: 'Password is required' });
    } else if (password.length < 6) {
      newErrors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await register(name, email, password, fullName);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      
      setSubmitError('');
      setErrors([]);
      
      // Handle specific error cases from backend
      if (errorMessage.toLowerCase().includes('this email')) {
        setErrors([{ field: 'email', message: 'This email is already registered' }]);
      } else if (errorMessage.toLowerCase().includes('this username')) {
        setErrors([{ field: 'name', message: 'This username is already taken' }]);
      } else {
        setSubmitError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string) => 
    errors.find(err => err.field === field)?.message;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Logo className={styles.logo} />
        </div>
        <div className={styles.subtitle}>
          Sign up to see photos and videos from your friends.
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <TextField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {getFieldError('email') && (
              <div className={styles.fieldError}>{getFieldError('email')}</div>
            )}
          </div>
          <div>
            <TextField
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {getFieldError('fullName') && (
              <div className={styles.fieldError}>{getFieldError('fullName')}</div>
            )}
          </div>
          <div>
            <TextField
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {getFieldError('name') && (
              <div className={styles.fieldError}>{getFieldError('name')}</div>
            )}
          </div>
          <div>
            <TextField
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {getFieldError('password') && (
              <div className={styles.fieldError}>{getFieldError('password')}</div>
            )}
          </div>
          {submitError && (
            <div className={styles.submitError}>{submitError}</div>
          )}
          <p className={styles.terms}>
            <p>People who use our service may have uploaded your contact
            information to Ichgram. <b>Learn More.</b>
            </p>
            <p>
            By signing up, you agree to our <b>Terms</b>, <b>Privacy Policy</b>{' '}
            and <b>Cookies Policy</b>.
            </p>
          </p>
          <Button type="submit" block disabled={isSubmitting}>
            Sign up
          </Button>
        </form>
      </div>
      <div className={styles.bottomLink}>
        Have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}

