import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import classService from '@/data/classService';
import { parseApiError } from '@/utils/errors';
import type { ClassFilters, PaginatedResponse, PilatesClass } from '@/data/types';
import PageHeader from '@/components/layout/PageHeader';
import ClassFiltersBar from '@/components/ClassFilters';
import ClassCard from '@/components/ClassCard';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import styles from './ClassListPage.module.css';

function filtersFromParams(params: URLSearchParams): ClassFilters {
  return {
    search: params.get('search') ?? undefined,
    date_from: params.get('date_from') ?? undefined,
    date_to: params.get('date_to') ?? undefined,
    available_only: params.get('available_only') === 'true' || undefined,
    page: params.get('page') ? Number(params.get('page')) : undefined,
  };
}

function filtersToParams(filters: ClassFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.date_from) params.date_from = filters.date_from;
  if (filters.date_to) params.date_to = filters.date_to;
  if (filters.available_only) params.available_only = 'true';
  if (filters.page && filters.page > 1) params.page = String(filters.page);
  return params;
}

export default function ClassListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<PaginatedResponse<PilatesClass> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = filtersFromParams(searchParams);

  const fetchClasses = useCallback((f: ClassFilters) => {
    setLoading(true);
    classService
      .list(f)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchClasses(filters);
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, fetchClasses]);

  function handleFilterChange(newFilters: ClassFilters) {
    setSearchParams(filtersToParams(newFilters));
  }

  function handlePageChange(page: number) {
    handleFilterChange({ ...filters, page });
  }

  return (
    <div>
      <PageHeader title="Classes" subtitle="Browse and book Pilates classes" />

      <ClassFiltersBar filters={filters} onChange={handleFilterChange} />

      {loading && (
        <div className={styles.center}>
          <Spinner />
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && data && data.results.length === 0 && (
        <div className={styles.empty}>
          <p>No classes found matching your filters.</p>
        </div>
      )}

      {!loading && !error && data && data.results.length > 0 && (
        <>
          <div className={styles.grid}>
            {data.results.map((cls) => (
              <ClassCard key={cls.id} pilatesClass={cls} />
            ))}
          </div>
          <Pagination
            currentPage={filters.page ?? 1}
            totalCount={data.count}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
