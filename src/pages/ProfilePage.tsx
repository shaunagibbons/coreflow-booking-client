import { type FormEvent, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import authService from '@/data/authService';
import { parseApiError, parseFieldErrors } from '@/utils/errors';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  // Profile form
  const [profile, setProfile] = useState({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    phone_number: user?.phone_number ?? '',
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setProfileErrors({});

    const errors: Record<string, string> = {};
    if (!profile.first_name.trim()) errors.first_name = 'First name is required';
    if (!profile.last_name.trim()) errors.last_name = 'Last name is required';

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile({
        first_name: profile.first_name.trim(),
        last_name: profile.last_name.trim(),
        ...(profile.phone_number.trim() && {
          phone_number: profile.phone_number.trim(),
        }),
      });
      updateUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      const fieldErrors = parseFieldErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setProfileErrors(fieldErrors);
      } else {
        toast.error(parseApiError(err));
      }
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordErrors({});

    const errors: Record<string, string> = {};
    if (!passwords.old_password) errors.old_password = 'Current password is required';
    if (!passwords.new_password) errors.new_password = 'New password is required';
    else if (passwords.new_password.length < 8)
      errors.new_password = 'Password must be at least 8 characters';
    if (passwords.new_password !== passwords.confirm_password)
      errors.confirm_password = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setSavingPassword(true);
    try {
      await authService.changePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });
      setPasswords({ old_password: '', new_password: '', confirm_password: '' });
      toast.success('Password changed successfully');
    } catch (err) {
      const fieldErrors = parseFieldErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setPasswordErrors(fieldErrors);
      } else {
        toast.error(parseApiError(err));
      }
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle={user?.email} />

      <div className={styles.sections}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Profile Information</h2>
          <form className={styles.form} onSubmit={handleProfileSubmit} noValidate>
            <Input
              label="First Name"
              name="first_name"
              value={profile.first_name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, first_name: e.target.value }))
              }
              error={profileErrors.first_name}
            />
            <Input
              label="Last Name"
              name="last_name"
              value={profile.last_name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, last_name: e.target.value }))
              }
              error={profileErrors.last_name}
            />
            <Input
              label="Phone Number"
              name="phone_number"
              type="tel"
              value={profile.phone_number}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone_number: e.target.value }))
              }
              error={profileErrors.phone_number}
            />
            <Button type="submit" loading={savingProfile}>
              Save Changes
            </Button>
          </form>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Change Password</h2>
          <form className={styles.form} onSubmit={handlePasswordSubmit} noValidate>
            <Input
              label="Current Password"
              name="old_password"
              type="password"
              value={passwords.old_password}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, old_password: e.target.value }))
              }
              error={passwordErrors.old_password}
            />
            <Input
              label="New Password"
              name="new_password"
              type="password"
              value={passwords.new_password}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, new_password: e.target.value }))
              }
              error={passwordErrors.new_password}
            />
            <Input
              label="Confirm New Password"
              name="confirm_password"
              type="password"
              value={passwords.confirm_password}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, confirm_password: e.target.value }))
              }
              error={passwordErrors.confirm_password}
            />
            <Button type="submit" loading={savingPassword}>
              Change Password
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
