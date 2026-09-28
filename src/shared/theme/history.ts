// history.ts — History (route playback) screen design tokens (S1–S9).
// Kept in its own module (not in colors.ts) so the frozen Home/Details/Profile/
// LiveMap token blocks stay byte-identical; the barrel re-export is additive.

/** History-only palette. Values sampled from the 318x1280 reference capture. */
export const historyColors = {
  // S4 calendar + S7 playback title strip + S9 section bar share one navy-black surface
  panel: '#1E2128',
  // PATCH T-HISTORY: S7 panel BODY is a lighter charcoal than its title strip (sampled #323234)
  panelSoft: '#323234',
  panelBorder: '#2E3238',
  panelTitle: '#F2F3F5',

  // S4 calendar
  fromLabel: '#9AA0A6',
  untilLabel: '#9AA0A6',
  fromValue: '#FFFFFF',
  untilValue: '#6B7280',
  // PATCH T-HISTORY: caption is dimmed in the reference, not pure white
  monthCaption: '#C7CCD4',
  monthNavBg: '#2F5FA8',
  // PATCH T-HISTORY: weekday letters sampled dark rose (#5C3C4D avg -> lifted)
  weekdayInk: '#96414E',
  dayInk: '#DDE1E6',
  dayOutsideInk: '#5A6068',
  // PATCH T-HISTORY: range band sampled #466EB6
  rangeFill: '#466EB6',
  rangeEdge: '#5E86C9',
  startFill: '#FFFFFF',
  startInk: '#1E2128',

  // S5 summary
  summaryLabel: '#9AA0A6',
  summaryValue: '#FFFFFF',
  // PATCH T-HISTORY: "Total KM Driven" card sampled #374955 (slate), was the near-black panel
  summaryCardBg: '#374955',
  summaryTitleInk: '#22262B',
  // PATCH T-HISTORY: sampled route-icon green
  runningInk: '#29D67A',
  idleInk: '#F0B429',
  // PATCH T-HISTORY: BOTH progress bars are navy in the reference (sampled #0F3A5C)
  barFill: '#0F3A5C',
  barTrack: '#E0E4E7',
  totalKmInk: '#29D67A',

  // S6 mini map
  mapRouteRed: '#E2545F',
  mapRouteGreen: '#5CC93F',
  mapPinInk: '#0F0F0F',
  alertBg: '#DE3B40',
  alertInk: '#FFFFFF',

  // S7 playback
  speedInk: '#F2F3F5',
  movingPillBg: '#FFFFFF',
  movingPillInk: '#4A4F54',
  movingInk: '#F2F3F5',
  // PATCH T-HISTORY: white car/calendar glyphs on the play panel are RED in the reference
  playIconInk: '#DE3B40',
  ctrlBtnBg: '#6E7376',
  ctrlBtnInk: '#FFFFFF',
  scrubRed: '#EC8C8E',
  scrubGreen: '#7AE89F',
  // PATCH T-HISTORY: tick ruler is a dark comb on white
  scrubTick: '#22262B',
  chipIdleBg: '#EBECEE',
  chipIdleInk: '#3A3F45',
  chipActiveBg: '#A31F2B',
  chipActiveInk: '#FFFFFF',
  // PATCH T-HISTORY: caret buttons that flank the Hour/Min chip strips
  chipArrowInk: '#2F5FA8',
  filterLabel: '#9AA0A6',

  // S9 list rows
  sectionBarBg: '#1E2128',
  sectionBarInk: '#FFFFFF',
  rowTime: '#9AA0A6',
  rowAddress: '#22262B',
  // PATCH T-HISTORY: locality half of the address line renders lighter
  rowCity: '#7A8288',
  rowChipBg: '#E0E4E7',
  rowChipInk: '#3A3F45',
  rowChipIconInk: '#4A7FB5',
  rowArrow: '#9AA0A6',
  // PATCH T-HISTORY: badge colours match the app's status tokens (sampled #5CDA04 / #F4AF23)
  stopMoving: '#5FCC00',
  stopIdle: '#F0B429',
  stopStop: '#D9312F',

  // S2 chip
  chipBg: '#1A1A1A',
  chipInk: '#FFFFFF',
  viewLiveInk: '#29B6F6',
} as const;

/** History-only metrics. */
export const historySizes = {
  /** S2 vehicle chip height (reference 29px @1.3732 = 39.8pt). */
  vehicleChipH: 40,
  /** S2 car photo inside the chip — fills most of the chip height. */
  vehiclePhotoW: 34,
  vehiclePhotoH: 24,
  /** S3 filter field height (reference 32px = 44pt). */
  filterFieldH: 44,
  /** S4 calendar day cell (reference white start square = 26px = 35.7pt). */
  dayCell: 36,
  /** S4 day row pitch. */
  dayRowH: 44,
  /** S4 weekday header height. */
  weekdayRowH: 26,
  /** S4 month caption row height. */
  monthRowH: 40,
  /** S4 side padding of the 7 column grid inside the full-bleed panel. */
  calGridPadH: 22,
  /** S5 left "Total KM Driven" card width. */
  totalCardW: 104,
  /** S5 left card height. */
  totalCardH: 84,
  /** S5 progress bar height. */
  barH: 10,
  /** S6 mini-map height. */
  miniMapH: 220,
  /** S6 alert banner height. */
  alertBannerH: 44,
  /** S6 alert banner inset from the map edges. */
  alertBannerInset: 12,
  /** S7 playback control button diameter (side buttons). */
  ctrlBtn: 32,
  /** S7 playback control button diameter (larger centre play). */
  ctrlBtnBig: 40,
  /** S7 playback title strip height (= S9 section bar). */
  panelTitleH: 26,
  /** S7 scrubber band height (reference 28px = 38pt). */
  scrubBandH: 38,
  /** S7 scrubber tick comb height. */
  scrubTickH: 26,
  /** S7/S8 hour + minute chip height. */
  chipH: 34,
  /** S9 circular state badge diameter. */
  stopGlyph: 30,
  /** S9 badge column width (time + badge + connector). */
  stopColW: 52,
  /** Horizontal page gutter shared by S2–S9. */
  gutter: 16,
} as const;

