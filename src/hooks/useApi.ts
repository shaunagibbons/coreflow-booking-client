import { useState, useEffect, useCallback } from 'react';
import { parseApiError } from '@/utils/errors';

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export default function useApi<T>(
  apiCall: () => Promise<T>,
  deps: unknown[] = [],
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    let cancelled = false;
    setLoading(true);

    apiCall()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(parseApiError(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cleanup = fetch();
    return cleanup;
  }, [fetch]);

  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch };
}
