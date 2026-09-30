// reportsService.ts — Reports data service.
// Mock today, API-ready signatures: getReportsData() / getVehicleOptions().
// Source: reports.mock.json. The mock is the single source of truth for the
// reference layout — day highlighting, chip selection and tile copy are all
// read verbatim and never recomputed.
import reportsMock from '@features/reports/mocks/reports.mock.json';
import type {
  ReportVehicleOption,
  ReportsData,
  ReportsMockPayload,
} from '@features/reports/types/reports';

const mock = reportsMock as unknown as ReportsMockPayload;

export const reportsService = {
  /** Full Reports payload (vehicle options, calendar state, pickers, categories). */
  getReportsData: async (): Promise<ReportsData> => ({
    vehicleOptions: mock.vehicleOptions,
    dateTimeExpanded: mock.dateTimeExpanded,
    calendar: mock.calendar,
    hourRow: mock.hourRow,
    minRow: mock.minRow,
    categories: mock.categories,
  }),

  /** S2 "Select Vehicle" dropdown options. */
  getVehicleOptions: async (): Promise<ReportVehicleOption[]> => mock.vehicleOptions,
};

export default reportsService;

