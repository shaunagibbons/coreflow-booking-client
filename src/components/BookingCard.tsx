import { useState } from 'react';
import type { BookingListItem } from '@/data/types';
import bookingService from '@/data/bookingService';
import { parseApiError } from '@/utils/errors';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import styles from './BookingCard.module.css';

interface BookingCardProps {
  booking: BookingListItem;
  onCancelled?: () => void;
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

export default function BookingCard({ booking, onCancelled }: BookingCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    setCancelling(true);
    try {
      await bookingService.cancel(booking.id);
      toast.success('Booking cancelled');
      setShowConfirm(false);
      onCancelled?.();
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.info}>
          <h3 className={styles.title}>{booking.pilates_class_title}</h3>
          <p className={styles.meta}>
            {formatDate(booking.pilates_class_date)} at{' '}
            {formatTime(booking.pilates_class_time)}
          </p>
          <p className={styles.instructor}>{booking.instructor_name}</p>
        </div>
        <div className={styles.actions}>
          <Badge status={booking.status} />
          {booking.can_cancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowConfirm(true)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Cancel Booking"
      >
        <p>
          Are you sure you want to cancel your booking for{' '}
          <strong>{booking.pilates_class_title}</strong>?
        </p>
        <div className={styles.modalActions}>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
          >
            Keep Booking
          </Button>
          <Button
            variant="danger"
            loading={cancelling}
            onClick={handleCancel}
          >
            Yes, Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
