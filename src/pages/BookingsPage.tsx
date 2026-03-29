import { useEffect, useState, useCallback } from 'react';
import bookingService from '@/data/bookingService';
import { parseApiError } from '@/utils/errors';
import type { BookingListItem, PaginatedResponse } from '@/data/types';
import PageHeader from '@/components/layout/PageHeader';
import BookingCard from '@/components/BookingCard';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import styles from './BookingsPage.module.css';

type Tab = 'upcoming' | 'past' | 'all';

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<BookingListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback((currentTab: Tab, currentPage: number) => {
    setLoading(true);
    const fetcher =
      currentTab === 'upcoming'
        ? bookingService.upcoming
        : currentTab === 'past'
          ? bookingService.past
          : bookingService.list;

    fetcher(currentPage)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBookings(tab, page);
  }, [tab, page, fetchBookings]);

  function handleTabChange(newTab: Tab) {
    setTab(newTab);
    setPage(1);
  }

  function handleRefresh() {
    fetchBookings(tab, page);
  }

  return (
    <div>
      <PageHeader title="My Bookings" />

      <div className={styles.tabs}>
        {(['upcoming', 'past', 'all'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${t === tab ? styles.activeTab : ''}`}
            onClick={() => handleTabChange(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <div className={styles.center}>
          <Spinner />
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && data && data.results.length === 0 && (
        <div className={styles.empty}>
          <p>No {tab === 'all' ? '' : tab} bookings found.</p>
        </div>
      )}

      {!loading && !error && data && data.results.length > 0 && (
        <>
          <div className={styles.list}>
            {data.results.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancelled={handleRefresh}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalCount={data.count}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
