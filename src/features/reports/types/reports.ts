// reports.ts — Reports feature types.
// Sourced from reports.mock.json; the screen only ever reads these shapes.

/** Which glyph a tile paints in its coloured cap. */
export type ReportIconKey =
  | 'list'
  | 'flag'
  | 'highway'
  | 'steering'
  | 'geofence'
  | 'other';

/** One report card tile (S7–S9). */
export interface ReportTile {
  /** Cap fill, verbatim hex from the reference. */
  color: string;
  iconKey: ReportIconKey;
  title: string;
  desc: string;
  /** Whether the white body shows the green circular "+". "Other" = false. */
  showPlus: boolean;
}

/** One category card: a dark title bar over a row of two tiles. */
export interface ReportCategory {
  title: string;
  tiles: ReportTile[];
}

/** S4 calendar state. Day highlighting is verbatim from the mock — NOT derived. */
export interface CalendarState {
  fromLabel: string;
  untilLabel: string;
  monthLabel: string;
  /** Month cursor: `m` is ZERO-based (11 = December). */
  yearMonth: { y: number; m: number };
  /** Day rendered as the white "start" cell. */
  startDay: number;
  /** Days rendered blue — may be non-contiguous (14,15 + 23,24 in the reference). */
  blueDays: number[];
}

/** S5/S6 single-select chip row. */
export interface PickerRow {
  label: string;
  chips: string[];
  /** Index of the pre-selected chip. */
  selected: number;
}

/** Vehicle option for the S2 dropdown. */
export interface ReportVehicleOption {
  id: string;
  name: string;
}

/** Everything the Reports screen renders. */
export interface ReportsData {
  vehicleOptions: ReportVehicleOption[];
  /** S3 date & time section is expanded on first mount. */
  dateTimeExpanded: boolean;
  calendar: CalendarState;
  hourRow: PickerRow;
  minRow: PickerRow;
  categories: ReportCategory[];
}

/** Raw JSON payload shape (loose numbers) as imported from the mock. */
export interface ReportsMockPayload {
  vehicleOptions: ReportVehicleOption[];
  dateTimeExpanded: boolean;
  calendar: CalendarState;
  hourRow: PickerRow;
  minRow: PickerRow;
  categories: ReportCategory[];
}

