import { useId } from 'react';
import styles from './TextField.module.css';
import { cn } from '@shared/utils/cn';

type Props = {
  label?: string;
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
};

export default function TextField({
  label,
  type = 'text',
  placeholder,
  name,
  value,
  onChange,
  error,
}: Props) {
  const id = useId();
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(styles.input)}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
