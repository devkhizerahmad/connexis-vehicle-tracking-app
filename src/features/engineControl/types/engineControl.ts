// engineControl.ts — Engine Control feature types.
// Sourced from engineControl.mock.json; the screen only ever reads these shapes.
// Nothing here is derived from the reference at runtime — the mock is the single
// source of truth for the frozen layout (copy, order, states).

/** Route lifecycle state → drives the S6 badge + state chip tone. */
export type RouteState = 'Moving' | 'Idle' | 'Stop';

/** One S6 "Driving Routes" row. */
export interface ControlRoute {
  id: string;
  /** Ordinal painted inside the coloured badge (verbatim from the reference). */
  index: number;
  title: string;
  subtitle: string;
  /** "08:00 AM - 10:40 AM" — rendered next to the clock glyph. */
  time: string;
  state: RouteState;
  /** "40m-8s" — right-aligned on the title line. */
  duration: string;
  /** F8: only route 1's subtitle is tinted blue in the reference. */
  subBlue?: boolean;
}

/** Icon key for an S7 control row. */
export type ControlIconKey = 'pin' | 'clock';

/** One S7 "Control Vehicle" row. */
export interface ControlRow {
  id: string;
  icon: ControlIconKey;
  label: string;
}

/** One S2 vehicle card pair (car + live status). */
export interface EngineVehicle {
  /** Caption is split so "Car |" stays regular and the name stays bold. */
  captionPrefix: string;
  name: string;
  /** Right-card pill copy. */
  fenceState: string;
  /** Hero status under the pill. */
  status: string;
  addressLines: string[];
}

/** S4 geofence map state. */
export interface EngineMapState {
  lastUpdatedLabel: string;
  lastUpdatedValue: string;
  fenceLabel: string;
  /** Map camera seeded from the reference framing (Lahore / Gulberg III). */
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  /** Geofence circle centre + radius in metres. */
  fence: { latitude: number; longitude: number; radius: number };
  /** Vehicle pin — the RED teardrop at the fence centre. */
  pin: { latitude: number; longitude: number };
  /** F10: second RED teardrop marker, lower-right of the fence. */
  teardrop: { latitude: number; longitude: number };
  /** Secondary blue dots (fleet members inside the fence). */
  dots: { id: string; latitude: number; longitude: number }[];
}

/** One S11 FAQ entry. */
export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

/** Everything the Engine Control screen renders. */
export interface EngineControlData {
  vehicle: EngineVehicle;
  alert: string;
  map: EngineMapState;
  changeFenceLabel: string;
  routesSectionTitle: string;
  routes: ControlRoute[];
  controlSectionTitle: string;
  controls: ControlRow[];
  lockLabel: string;
  unlockLabel: string;
  privacyLabel: string;
  slideLabel: string;
  faqTitle: string;
  faq: FaqEntry[];
  supportLabel: string;
}

/** Raw JSON payload shape as imported from the mock (identical today). */
export type EngineControlMockPayload = EngineControlData;
