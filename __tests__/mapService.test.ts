// mapService.test.ts — Live Map data service contract (mock payload shape)
import { mapService } from '../src/features/map/services/mapService';

describe('mapService (livemap mock)', () => {
  it('returns the default Honda Civic payload with full route geometry', async () => {
    const data = await mapService.getLiveMapData();

    expect(data.vehicle.id).toBe('LFA-1464');
    expect(data.vehicle.name).toBe('Honda Civic (LFA-1464)');
    expect(data.vehicle.statusLabel).toBe('Running');
    expect(data.vehicle.speed).toBe('65 km/Hr');
    // 12 Ring Road route points
    expect(data.vehicle.route).toHaveLength(12);
    expect(data.vehicle.route[0]).toEqual([31.452, 74.348]);
    expect(data.vehicle.route[11]).toEqual([31.551, 74.4]);
    // car marker with heading
    expect(data.vehicle.car.coordinate).toEqual([31.455, 74.3495]);
    expect(data.vehicle.car.heading).toBe(45);
    // overlays + scatter markers
    expect(data.trafficSegment).toEqual({ startIndex: 4, endIndex: 8 });
    expect(data.dashedSegment).toEqual({ startIndex: 8, endIndex: 10 });
    expect(data.pins).toHaveLength(7);
    expect(data.dots).toHaveLength(10);
  });

  it('returns the Kia Sportage reversed-subset route when selected', async () => {
    const data = await mapService.getLiveMapData('LZA-8735-2');

    expect(data.vehicle.name).toBe('Kia Sportage (LZA-8735)');
    // reversed subset: starts at the Honda route's last point
    expect(data.vehicle.route[0]).toEqual([31.551, 74.4]);
    expect(data.vehicle.statusLabel).toBe('Idle');
  });

  it('falls back to the default vehicle for an unknown id', async () => {
    const data = await mapService.getLiveMapData('UNKNOWN-ID');

    expect(data.vehicle.id).toBe('LFA-1464');
  });

  it('lists 4 dropdown options that all resolve to live-map data', async () => {
    const options = await mapService.getVehicleOptions();

    expect(options).toHaveLength(4);
    for (const option of options) {
      const data = await mapService.getLiveMapData(option.id);
      expect(data.vehicle.id).toBe(option.id);
      expect(data.vehicle.name).toBe(option.name);
    }
    expect(options[0].id).toBe('LFA-1464');
  });
});