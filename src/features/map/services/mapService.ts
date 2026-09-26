// mapService.ts — Live Map data service (mock today, API-ready signature).
// Sources: livemap.mock.json (routes/pins/car) + home vehicles.mock.json (dropdown options).
import livemapMock from '@features/map/mocks/livemap.mock.json';
import vehiclesMock from '@features/home/mocks/vehicles.mock.json';
import { LivemapMockPayload, LiveMapData, VehicleOption } from '@features/map/types/map';

const mock = livemapMock as unknown as LivemapMockPayload;

export const mapService = {
  /** Live map payload for one vehicle (falls back to the default Honda Civic route). */
  getLiveMapData: async (vehicleId?: string): Promise<LiveMapData> => {
    const vehicle =
      mock.vehicles.find(v => v.id === vehicleId) ??
      mock.vehicles.find(v => v.id === mock.defaultVehicleId) ??
      mock.vehicles[0];
    return {
      vehicle,
      trafficSegment: mock.trafficSegment,
      dashedSegment: mock.dashedSegment,
      pins: mock.pins,
      dots: mock.dots,
    };
  },

  /** Dropdown options: the 4 vehicles that have live-map data (from vehicles.mock). */
  getVehicleOptions: async (): Promise<VehicleOption[]> => {
    const ids = new Set(mock.vehicles.map(v => v.id));
    return vehiclesMock.vehicles
      .filter(v => ids.has(v.id))
      .slice(0, 4)
      .map(v => ({ id: v.id, name: v.name }));
  },

  getDefaultVehicleId: (): string => mock.defaultVehicleId,
};
