// RESERVED: pending Home screen (vehicle list)

// useVehicleList.ts — Hook for vehicle list
import { useEffect, useState } from 'react';
import { vehicleService } from '@features/home/services/vehicleService';
import { VehicleSummary } from '@features/home/types/home';

export function useVehicleList() {
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehicleService.getVehicleList().then(data => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  return { vehicles, loading };
}
