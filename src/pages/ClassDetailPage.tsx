import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classService from '@/data/classService';
import bookingService from '@/data/bookingService';
import { parseApiError } from '@/utils/errors';
import type { PilatesClass } from '@/data/types';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import styles from './ClassDetailPage.module.css';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
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

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pilatesClass, setPilatesClass] = useState<PilatesClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showBooking, setShowBooking] = useState(false);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    classService
      .getById(Number(id))
      .then((res) => {
        setPilatesClass(res);
        setError(null);
      })
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleBook() {
    if (!pilatesClass) return;
    setBooking(true);
    try {
      await bookingService.create({
        pilates_class: pilatesClass.id,
        ...(notes.trim() && { notes: notes.trim() }),
      });
      toast.success('Class booked successfully!');
      navigate('/bookings');
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !pilatesClass) {
    return <Alert variant="error">{error ?? 'Class not found.'}</Alert>;
  }

  const {
    title,
    description,
    instructor,
    date,
    start_time,
    end_time,
    location,
    max_capacity,
    available_spots,
    is_full,
    can_book,
  } = pilatesClass;

  return (
    <div>
      <PageHeader
        title={title}
        action={
          can_book ? (
            <Button onClick={() => setShowBooking(true)}>
              Book This Class
            </Button>
          ) : is_full ? (
            <Button disabled>Class Full</Button>
          ) : (
            <Button disabled>Booking Unavailable</Button>
          )
        }
      />

      {description && (
        <p className={styles.description}>{description}</p>
      )}

      <div className={styles.details}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Class Details</h3>
          <dl className={styles.dl}>
            <div className={styles.row}>
              <dt>Instructor</dt>
              <dd>{instructor.full_name}</dd>
            </div>
            <div className={styles.row}>
              <dt>Date</dt>
              <dd>{formatDate(date)}</dd>
            </div>
            <div className={styles.row}>
              <dt>Time</dt>
              <dd>
                {formatTime(start_time)} &ndash; {formatTime(end_time)}
              </dd>
            </div>
            <div className={styles.row}>
              <dt>Location</dt>
              <dd>{location}</dd>
            </div>
            <div className={styles.row}>
              <dt>Capacity</dt>
              <dd>
                {available_spots} of {max_capacity} spots available
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Modal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        title="Book Class"
      >
        <p className={styles.bookingText}>
          Book <strong>{title}</strong> on {formatDate(date)} at{' '}
          {formatTime(start_time)}?
        </p>
        <Input
          label="Notes (optional)"
          name="notes"
          placeholder="Any special requirements..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={() => setShowBooking(false)}>
            Cancel
          </Button>
          <Button loading={booking} onClick={handleBook}>
            Confirm Booking
          </Button>
        </div>
      </Modal>
    </div>
  );
}
