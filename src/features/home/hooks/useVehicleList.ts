// useVehicleList.ts — Home feed hook (summary + vehicles + promo)
import { useCallback, useEffect, useState } from 'react';
import { vehicleService } from '@features/home/services/vehicleService';
import { HomeFeedData } from '@features/home/types/home';

/**
 * Consumes vehicleService.getVehicleList() on mount, and again on retry().
 * `feed` is a single memoized state object so memoized card rows only re-render
 * when the feed itself changes (G1/G2).
 */
export function useVehicleList() {
  const [feed, setFeed] = useState<HomeFeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    vehicleService
      .getVehicleList()
      .then(data => {
        if (!mounted) {
          return;
        }
        setFeed(data);
        setLoading(false);
      })
      .catch((reason: unknown) => {
        if (!mounted) {
          return;
        }
        setError(reason instanceof Error ? reason : new Error(String(reason)));
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt(n => n + 1), []);

  return { feed, loading, error, retry };
}

export default useVehicleList;
