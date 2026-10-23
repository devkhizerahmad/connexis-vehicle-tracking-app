// vehicleService.test.ts — the id must reach the payload (M3).
//
// The mock ships ONE details body (Honda Civic). The service used to ignore the
// id entirely, so every card opened the same vehicle's header. The contract now
// is: label the shared body with the vehicle that was actually requested.
import { vehicleService } from '../src/features/home/services/vehicleService';

describe('vehicleService.getVehicleDetails', () => {
  it('keeps the mock body for the vehicle the mock was written for', async () => {
    const details = await vehicleService.getVehicleDetails('LFA-1464');

    expect(details.plate).toBe('Honda Civic (LFA-1464)');
    expect(details.status).toBe('Running');
    expect(details.activity.score).toBe(64);
  });

  it('labels the body with a different requested vehicle', async () => {
    const details = await vehicleService.getVehicleDetails('LZA-8735');

    expect(details.plate).toBe('Suzuki Mehran (LZA-8735)');
    // the shared body is untouched — only the header label follows the id
    expect(details.speed).toContain('65 km/Hr');
  });

  it('falls back to the base payload for an unknown id', async () => {
    const details = await vehicleService.getVehicleDetails('UNKNOWN-ID');

    expect(details.plate).toBe('Honda Civic (LFA-1464)');
  });
});
