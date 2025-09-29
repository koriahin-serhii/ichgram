import styles from './FormCard.module.css';
import type { ReactNode } from 'react';

export default function FormCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className={styles.card}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <div className={styles.title}>{title}</div>}
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      )}
      {children}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
