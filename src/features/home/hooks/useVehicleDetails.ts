// useVehicleDetails.ts — Hook for vehicle details by vehicleId
import { useCallback, useEffect, useState } from 'react';
import { vehicleService } from '@features/home/services/vehicleService';
import { VehicleDetailsData } from '@features/home/types/details';

export function useVehicleDetails(vehicleId: string) {
  const [details, setDetails] = useState<VehicleDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    vehicleService
      .getVehicleDetails(vehicleId)
      .then(data => {
        if (!mounted) {
          return;
        }
        setDetails(data);
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
  }, [vehicleId, attempt]);

  const retry = useCallback(() => setAttempt(n => n + 1), []);

  return { details, loading, error, retry };
}

export default useVehicleDetails;
