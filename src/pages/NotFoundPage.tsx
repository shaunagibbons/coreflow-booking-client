import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Page not found</p>
      <p className={styles.hint}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to={isAuthenticated ? '/' : '/login'} className={styles.link}>
        {isAuthenticated ? 'Back to Dashboard' : 'Go to Login'}
      </Link>
    </div>
  );
}
