import { Link } from 'react-router-dom';
import type { PilatesClass } from '@/data/types';
import styles from './ClassCard.module.css';

interface ClassCardProps {
  pilatesClass: PilatesClass;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours!, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 || 12;
  return `${display}:${minutes} ${ampm}`;
}

export default function ClassCard({ pilatesClass }: ClassCardProps) {
  const {
    id,
    title,
    instructor,
    date,
    start_time,
    end_time,
    location,
    available_spots,
    is_full,
  } = pilatesClass;

  return (
    <Link to={`/classes/${id}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={`${styles.badge} ${is_full ? styles.full : styles.available}`}>
          {is_full ? 'Full' : `${available_spots} spots`}
        </span>
      </div>
      <div className={styles.details}>
        <p className={styles.detail}>
          <span className={styles.label}>Instructor</span>
          {instructor.full_name}
        </p>
        <p className={styles.detail}>
          <span className={styles.label}>Date</span>
          {formatDate(date)}
        </p>
        <p className={styles.detail}>
          <span className={styles.label}>Time</span>
          {formatTime(start_time)} &ndash; {formatTime(end_time)}
        </p>
        <p className={styles.detail}>
          <span className={styles.label}>Location</span>
          {location}
        </p>
      </div>
    </Link>
  );
}
