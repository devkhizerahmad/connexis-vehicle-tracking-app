// useVehicleList.ts — Home feed hook (summary + vehicles + promo)
import { useAsyncData } from '@shared/hooks/useAsyncData';
import { vehicleService } from '@features/home/services/vehicleService';

/**
 * Consumes vehicleService.getVehicleList() on mount, and again on retry().
 * `feed` is a single memoized state object so memoized card rows only re-render
 * when the feed itself changes (G1/G2).
 *
 * M31: the load lifecycle (cancellation, retry, error normalisation) is the
 * shared `useAsyncData`, not a local copy.
 */
export function useVehicleList() {
  const { data: feed, loading, error, retry } = useAsyncData(
    () => vehicleService.getVehicleList(),
    'vehicle-list',
  );

  return { feed, loading, error, retry };
}

export default useVehicleList;
