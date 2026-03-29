import { type FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import authService from '@/data/authService';
import { parseApiError, parseFieldErrors } from '@/utils/errors';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export default function ResetPasswordPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!password) newErrors.new_password = 'Password is required';
    else if (password.length < 8) newErrors.new_password = 'Password must be at least 8 characters';
    if (!passwordConfirm) newErrors.new_password_confirm = 'Please confirm your password';
    else if (password !== passwordConfirm) newErrors.new_password_confirm = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!uid || !token) {
      toast.error('Invalid reset link.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.confirmPasswordReset(uid, token, password, passwordConfirm);
      setSuccess(true);
    } catch (err) {
      const fieldErrors = parseFieldErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        toast.error(parseApiError(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.brand}>CoreFlow</p>
        <h1 className={styles.heading}>Set new password</h1>

        {success ? (
          <>
            <Alert variant="success">
              Your password has been reset successfully.
            </Alert>
            <p className={styles.footer}>
              <Link to="/login">Sign In</Link>
            </p>
          </>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <Input
                label="New Password"
                name="new_password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.new_password}
              />
              <Input
                label="Confirm New Password"
                name="new_password_confirm"
                type="password"
                placeholder="Confirm new password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                error={errors.new_password_confirm}
              />
              <Button type="submit" loading={isSubmitting}>
                Reset Password
              </Button>
            </form>

            <p className={styles.footer}>
              <Link to="/login">Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
