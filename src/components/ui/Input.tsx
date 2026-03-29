import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, name, className, ...props }, ref) => {
    const inputId = id ?? name;

    return (
      <div className={`${styles.field} ${className ?? ''}`}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          {...props}
        />
        {error && (
          <span className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
