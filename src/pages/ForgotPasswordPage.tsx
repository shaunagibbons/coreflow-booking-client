import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '@/data/authService';
import { parseApiError } from '@/utils/errors';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset(email.trim());
      setSubmitted(true);
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.brand}>CoreFlow</p>
        <h1 className={styles.heading}>Reset your password</h1>

        {submitted ? (
          <>
            <Alert variant="success">
              If an account exists with that email, a password reset link has been sent. Please check your inbox.
            </Alert>
            <p className={styles.footer}>
              <Link to="/login">Back to Sign In</Link>
            </p>
          </>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <Button type="submit" loading={isSubmitting}>
                Send Reset Link
              </Button>
            </form>

            <p className={styles.footer}>
              Remember your password? <Link to="/login">Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
