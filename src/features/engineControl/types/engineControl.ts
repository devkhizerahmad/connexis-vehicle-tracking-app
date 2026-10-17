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
  /**
   * PHASE-1 (P6): retained by the payload but NO LONGER CONSUMED. The old
   * "F8" note said route 1's subtitle was the only blue sub-line; the reference
   * actually paints every subtitle the same grey, so the override and its
   * `routeSubBlue` token are gone. The mock key is left untouched.
   */
  subBlue?: boolean;
}

/** Icon key for an S7 control row. */
export type ControlIconKey = 'pin' | 'clock';

/**
 * PATCH EC-SWIPE: which of Lock / Unlock is currently ARMED for the swipe
 * confirmation. Exactly one can be pending at a time, and `null` means the user
 * has not chosen — in which case a completed swipe must NOT perform any action.
 */
export type LockUnlockAction = 'lock' | 'unlock';

/** One S7 "Control Vehicle" row. */
export interface ControlRow {
  id: string;
  icon: ControlIconKey;
  label: string;
}

/** One S2 vehicle card pair (car + live status). */
export interface EngineVehicle {
  /**
   * PHASE-1 (P1): the photo caption. The reference captions the car with a
   * "Last Updated <time>" line — a grey label and a bold time — rather than with
   * the model's name. Split in two so the label stays regular grey and the time
   * stays bold; both values are the mock's own, unmodified.
   */
  lastUpdatedLabel: string;
  lastUpdatedValue: string;
  /** Vehicle model name. Retained by the payload; no longer painted (P1). */
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
