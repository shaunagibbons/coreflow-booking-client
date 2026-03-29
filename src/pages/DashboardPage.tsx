import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import bookingService from '@/data/bookingService';
import { parseApiError } from '@/utils/errors';
import type { BookingListItem } from '@/data/types';
import PageHeader from '@/components/layout/PageHeader';
import BookingCard from '@/components/BookingCard';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function fetchUpcoming() {
    setLoading(true);
    bookingService
      .upcoming()
      .then((res) => {
        setBookings(res.results.slice(0, 5));
        setError(null);
      })
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchUpcoming();
  }, []);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.first_name ?? 'there'}!`}
        subtitle="Here's a summary of your upcoming classes."
      />

      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Upcoming Classes</h2>
          <Link to="/bookings">View all</Link>
        </div>

        {loading && (
          <div className={styles.center}>
            <Spinner />
          </div>
        )}

        {error && <Alert variant="error">{error}</Alert>}

        {!loading && !error && bookings.length === 0 && (
          <div className={styles.empty}>
            <p>No upcoming bookings.</p>
            <Link to="/classes">
              <Button>Browse Classes</Button>
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className={styles.list}>
            {bookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancelled={fetchUpcoming}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
