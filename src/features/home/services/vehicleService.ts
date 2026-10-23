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

  getVehicleDetails: async (id: string): Promise<VehicleDetailsData> => {
    const base = (detailsMock as unknown) as VehicleDetailsData;

    // M3: the id used to be ignored, so every card opened the same Honda Civic
    // payload. The mock ships ONE detail body; label it with the vehicle that was
    // actually tapped so the header can never disagree with the card. Mock files
    // are untouched - the swap happens here in the service.
    const feed = (vehiclesMock as unknown) as HomeFeedData;
    const selected = feed.vehicles.find(vehicle => vehicle.id === id);
    if (!selected) {
      return base;
    }
    return { ...base, plate: selected.name };
  },
};
