import styles from './Button.module.css';
import { cn } from '@shared/utils/cn';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'primary' | 'ghost';

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{
    variant?: Variant;
    block?: boolean;
  }>;

export default function Button({
  variant = 'primary',
  block,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        styles.button,
        variant === 'ghost' && styles.ghost,
        block && styles.block,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
