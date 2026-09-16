// useVehicleDetails.ts — Hook for vehicle details by vehicleId
import { useEffect, useState } from 'react';
import { vehicleService } from '@features/home/services/vehicleService';
import { VehicleDetailsData } from '@features/home/types/details';

export function useVehicleDetails(vehicleId: string) {
  const [details, setDetails] = useState<VehicleDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    vehicleService.getVehicleDetails(vehicleId).then(data => {
      if (mounted) {
        setDetails(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [vehicleId]);

  return { details, loading };
}
