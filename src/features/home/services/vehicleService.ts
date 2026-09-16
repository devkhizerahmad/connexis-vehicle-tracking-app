// vehicleService.ts — Vehicle data service (mock today, API ready signature)
import detailsMock from '@features/home/mocks/details.mock.json';
import vehiclesMock from '@features/home/mocks/vehicles.mock.json';
import { VehicleDetailsData } from '@features/home/types/details';
import { VehicleSummary } from '@features/home/types/home';

export const vehicleService = {
  getVehicleList: async (): Promise<VehicleSummary[]> => {
    return (vehiclesMock as unknown) as VehicleSummary[];
  },

  getVehicleDetails: async (_id: string): Promise<VehicleDetailsData> => {
    return (detailsMock as unknown) as VehicleDetailsData;
  },
};
