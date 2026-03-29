import { type ReactNode } from 'react';
import styles from './Alert.module.css';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: ReactNode;
  onDismiss?: () => void;
}

export default function Alert({
  variant = 'info',
  children,
  onDismiss,
}: AlertProps) {
  return (
    <div className={`${styles.alert} ${styles[variant]}`} role="alert">
      <div className={styles.content}>{children}</div>
      {onDismiss && (
        <button
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          &times;
        </button>
      )}
    </div>
  );
}
