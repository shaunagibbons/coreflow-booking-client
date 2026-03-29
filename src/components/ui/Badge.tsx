import type { BookingStatus } from '@/data/types';
import styles from './Badge.module.css';

interface BadgeProps {
  status: BookingStatus;
}

const labels: Record<BookingStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

export default function Badge({ status }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
