// historyService.ts — History (route playback) data service.
// Mock today, API-ready signature: getHistoryData(vehicleId, dateRange).
// Source: history.mock.json (summary/playback/map/stops). The mock carries its
// own vehicle roster so the screen stays self-contained. Follows mapService's
// resolve-with-fallback rule (unknown id -> default vehicle).
import historyMock from '@features/map/mocks/history.mock.json';
import type {
  HistoryData,
  HistoryDateRange,
  HistoryMockPayload,
  HistoryMonth,
  HistoryVehicle,
} from '@features/map/types/history';

const mock = historyMock as unknown as HistoryMockPayload;

/** Resolve a vehicle id to its record, falling back to the default vehicle. */
const resolveVehicle = (vehicleId?: string): HistoryVehicle =>
  mock.vehicles.find(v => v.id === vehicleId) ??
  mock.vehicles.find(v => v.id === mock.defaultVehicleId) ??
  mock.vehicles[0];

/** The month cursor that owns the `from` day (keeps the calendar on-range). */
const monthForRange = (range: HistoryDateRange): HistoryMonth => {
  const [year, month] = range.from.split('-').map(Number);
  return { year, month: (month ?? 1) - 1 };
};

export const historyService = {
  /**
   * History payload for one vehicle over one inclusive date range.
   * `dateRange` is optional — omitting it returns the mock default range,
   * which is what the screen shows on first mount.
   */
  getHistoryData: async (
    vehicleId?: string,
    dateRange?: HistoryDateRange,
  ): Promise<HistoryData> => {
    const range = dateRange ?? mock.defaultRange;
    return {
      vehicle: resolveVehicle(vehicleId),
      range,
      month: monthForRange(range),
      filters: {
        hourOptions: mock.hourOptions,
        minuteOptions: mock.minuteOptions,
        defaultHour: mock.defaultHour,
        defaultMinute: mock.defaultMinute,
      },
      summary: mock.summary,
      playback: mock.playback,
      map: mock.map,
      alertText: mock.alert.text,
      stops: mock.stops,
    };
  },

  /** Vehicle roster for the S2 chip / future vehicle switcher. */
  getHistoryVehicles: async (): Promise<HistoryVehicle[]> => mock.vehicles,

  getDefaultVehicleId: (): string => mock.defaultVehicleId,
};

export default historyService;
