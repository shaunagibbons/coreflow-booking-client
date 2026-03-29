import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { parseApiError, parseFieldErrors } from '@/utils/errors';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirm: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});

    // Client validation
    const newErrors: Record<string, string> = {};
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (form.password !== form.password_confirm)
      newErrors.password_confirm = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirm: form.password_confirm,
        ...(form.phone_number.trim() && {
          phone_number: form.phone_number.trim(),
        }),
      });
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
        <h1 className={styles.heading}>Create your account</h1>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <Input
              label="First Name"
              name="first_name"
              placeholder="Jane"
              value={form.first_name}
              onChange={handleChange}
              error={errors.first_name}
            />
            <Input
              label="Last Name"
              name="last_name"
              placeholder="Doe"
              value={form.last_name}
              onChange={handleChange}
              error={errors.last_name}
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Phone Number (optional)"
            name="phone_number"
            type="tel"
            placeholder="(555) 123-4567"
            value={form.phone_number}
            onChange={handleChange}
            error={errors.phone_number}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            name="password_confirm"
            type="password"
            placeholder="Re-enter your password"
            value={form.password_confirm}
            onChange={handleChange}
            error={errors.password_confirm}
          />
          <Button type="submit" loading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
