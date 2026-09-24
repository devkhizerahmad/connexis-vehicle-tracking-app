// useVehicleList.ts — Home feed hook (summary + vehicles + promo)
import { useEffect, useState } from 'react';
import { vehicleService } from '@features/home/services/vehicleService';
import { HomeFeedData } from '@features/home/types/home';

/**
 * Consumes vehicleService.getVehicleList() once on mount.
 * `feed` is a single memoized state object so memoized card rows only re-render
 * when the feed itself changes (G1/G2).
 */
export function useVehicleList() {
  const [feed, setFeed] = useState<HomeFeedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    vehicleService.getVehicleList().then(data => {
      if (mounted) {
        setFeed(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { feed, loading };
}

export default useVehicleList;
