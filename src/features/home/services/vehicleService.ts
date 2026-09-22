// vehicleService.ts — Vehicle data service (mock today, API ready signature)
import detailsMock from '@features/home/mocks/details.mock.json';
import vehiclesMock from '@features/home/mocks/vehicles.mock.json';
import { VehicleDetailsData } from '@features/home/types/details';
import { HomeFeedData } from '@features/home/types/home';

export const vehicleService = {
  /** Home tab feed: summary counters + vehicle cards + promo slot (mock today). */
  getVehicleList: async (): Promise<HomeFeedData> => {
    return (vehiclesMock as unknown) as HomeFeedData;
  },

  getVehicleDetails: async (_id: string): Promise<VehicleDetailsData> => {
    return (detailsMock as unknown) as VehicleDetailsData;
  },
};
