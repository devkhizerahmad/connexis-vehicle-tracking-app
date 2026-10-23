// useVehicleDetails.ts — Hook for vehicle details by vehicleId
import { useAsyncData } from '@shared/hooks/useAsyncData';
import { vehicleService } from '@features/home/services/vehicleService';

/**
 * M31: keyed on `vehicleId`, so switching vehicles refetches and a late
 * response for the previous vehicle is dropped instead of relabelling the
 * screen.
 */
export function useVehicleDetails(vehicleId: string) {
  const { data: details, loading, error, retry } = useAsyncData(
    () => vehicleService.getVehicleDetails(vehicleId),
    vehicleId,
  );

  return { details, loading, error, retry };
}

export default useVehicleDetails;
