// routeRows.ts — CANONICAL route-row design tokens.
//
// ROUTES LIST CONVERGENCE (Engine Control "Driving Routes" + Details "Routes"):
// the two lists are SEPARATE components with separate mocks (measured in STEP 0
// — see the report), so they are converged by sharing THIS ONE token block
// instead of duplicating values in two features. The Engine Control row design
// is the donor; the Details list was restyled onto it.
//
// The connector spec below was MEASURED on device on the Details list, which is
// the source of truth for it:
//   • vertical, on the number badge's centre line
//   • 1 dp stroke, colour `colors.surface.dash` (#D7DBE0)
//   • dash 3 dp / gap 3 dp (Android's default for a dashed 1 dp border)
//   • runs from the lower badge's BOTTOM edge + 2 dp to the next badge's TOP
//     edge − 2 dp, i.e. it FILLS the gap between two consecutive badges — it is
//     NOT drawn centre-to-centre
//   • drawn between consecutive badges only (never below the last one)
// RN has no per-side border style, so a dashed LEFT edge is painted by setting
// only `borderLeftWidth` — the other three edges stay unpainted.

/** The three row tones: 1 green / 2 amber / 3 red. */
export type RouteRowTone = 'green' | 'amber' | 'red';

export const routeRowColors = {
  // Number-badge fills (one per tone).
  badgeGreen: '#55D003',
  badgeOrange: '#F0941F',
  badgeRed: '#E90821',
  /** Badge numeral ink. */
  badgeInk: '#FFFFFF',

  // Left column.
  /** Route title ink (near-black). */
  titleInk: '#1A1A1A',
  /** Sub-line ink (grey) — also the pin glyph's ink. */
  subInk: '#8A9199',

  // Right column.
  durationInk: '#9AA0A6',

  // Status-pill ink per tone.
  movingInk: '#43A047',
  idleInk: '#E07B00',
  stopInk: '#E53935',

  // Status-pill fill per tone.
  movingPillBg: '#E3F8E8',
  pendingPillBg: '#FDF1DB',
  stopPillBg: '#FDE5E7',
} as const;

export const routeRowSizes = {
  // Number badge.
  badge: 24,
  badgeRadius: 6,
  badgeText: 12.5,

  // Left column.
  title: 12.5,
  sub: 10.5,
  /** Pin glyph size in the sub-line. */
  subIcon: 11,

  // Right column.
  duration: 11.5,
  state: 10.5,
  statePillRadius: 10,
  statePillPadH: 8,
  statePillPadV: 2,

  // Row metrics.
  rowPadH: 12,
  rowPadV: 8,
  /** Row pitch (min height) — shared so both lists' rows are the same height. */
  rowMinH: 60,
  /** Gap between the badge column and the text column. */
  bodyGap: 10,
  /** Gap between the text column and the right column. */
  rightGap: 8,

  // Vertical connector (see the header block for the measured spec).
  connectorWidth: 1,
  /** Clearance between a badge edge and the connector's end, in dp. */
  connectorClearance: 2,
  connectorMinH: 26,
} as const;

/** Number-badge fill per tone. */
export const routeRowBadgeFill: Record<RouteRowTone, string> = {
  green: routeRowColors.badgeGreen,
  amber: routeRowColors.badgeOrange,
  red: routeRowColors.badgeRed,
};

/** Status-pill fill per tone. */
export const routeRowPillFill: Record<RouteRowTone, string> = {
  green: routeRowColors.movingPillBg,
  amber: routeRowColors.pendingPillBg,
  red: routeRowColors.stopPillBg,
};

/** Status-pill ink per tone. */
export const routeRowStateInk: Record<RouteRowTone, string> = {
  green: routeRowColors.movingInk,
  amber: routeRowColors.idleInk,
  red: routeRowColors.stopInk,
};
