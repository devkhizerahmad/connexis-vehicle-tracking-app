// engineControl.ts — Engine Control screen design tokens (S1–S12).
// Kept in its own module (like reports.ts / history.ts) so the frozen
// Home/Details/Profile/LiveMap/History/Reports token blocks stay byte-identical;
// the barrel re-export is additive.
//
// PROVENANCE: every value below was sampled from the 390x844 reference artboard
// (`design-references/engine control enhance version.png`, 724x2172 px) with the
// GDI+ pixel probe in `ui-after/` (rows / quant ops). The artboard is 1.856x the
// 390pt grid, so pixel measurements were divided by 1.856 and rounded.

/** Engine Control palette. */
export const ecColors = {
  // S1 header ink (gradient header comes from colors.gradientHeader)
  headerInk: '#FFFFFF',

  // S2 vehicle cards
  card: '#FFFFFF',
  cardBorder: '#E8EEF4',
  captionInk: '#5A626C',
  nameInk: '#1A1A1A',
  statusInk: '#1F2A37',
  addressInk: '#8A9199',
  /** S2 right card "Out of Fence" pill (sampled #EA061D — flat fill, no gradient). */
  fencePillBg: '#EA061D',
  fencePillInk: '#FFFFFF',
  /** S2 "Running" flag + S6 route-1 badge (sampled #55D003 / #55DA06). */
  runningGreen: '#55D003',

  // S3 out-of-geofence alert banner (sampled #FEE3E7 bg / #EB0518 ring + ink)
  alertBg: '#FEE3E7',
  alertInk: '#EA061D',

  /** S4 geofence map overlays (sampled #082339 / #8AF96A lime chip) */
  mapBoxBg: '#082339',
  mapBoxInk: '#FFFFFF',
  mapBoxLabel: '#C9CED4',
  mapChipBg: '#8AF96A',
  mapChipInk: '#FFFFFF',
  /** Dark-green fence glyph inside the lime chip (sampled #036D37). */
  mapChipIconInk: '#036D37',
  mapDot: '#2196F3',
  mapPin: '#EA061D',
  mapFence: '#0F1723',
  /** Barely-there tint inside the geofence ring (the reference fill is clear). */
  mapFenceFill: 'rgba(15, 23, 35, 0.02)',
  /**
   * F10: the two blue diamond markers + the lower-right red teardrop sit on the
   * LIGHT map, so they need their own inks (the old `mapDot` blue is the
   * dark-map dot colour).
   */
  mapDiamond: '#1E88E5',
  /** F1: last-resort avatar tint so the header can never show a blank white disc. */
  avatarFallback: '#7A4A3A',

  // S5 change-fence button (sampled #00873A deep green — NOT the #4CAF50 family)
  fenceGreen: '#00873A',

  // S6/S7 section bars — dark maroon base + the diagonal bright-red block
  barDark: '#220C0F',
  barDarkEdge: '#1A0709',
  barRed: '#B00101',
  /** Gradient stops of the diagonal block itself (sampled #8B0201 → #D60101). */
  barRedDeep: '#8B0201',
  barRedBright: '#D60101',
  barInk: '#FFFFFF',

  // S6 route rows
  badgeGreen: '#55D003',
  /** Route-2 amber badge (sampled #FEBE0A). */
  badgeAmber: '#FDBE07',
  badgeRed: '#E90821',
  badgeInk: '#FFFFFF',
  durationInk: '#7C93AE',
  routeTitleInk: '#1A1A1A',
  routeSubInk: '#8A9199',
  /** F8: route-1's subtitle is the only BLUE sub-line in the reference. */
  routeSubBlue: '#29B6F6',
  timeInk: '#7A8288',
  divider: '#EDF1F5',
  /** Route state chips: Moving / Idle / Stop. */
  movingBg: '#E0F8CC',
  movingInk: '#43A047',
  idleBg: '#FDF0D0',
  idleInk: '#E5A200',
  stopBg: '#FEE3E7',
  stopInk: '#E53935',

  // S7 control rows (sampled #EAF4FC row fill, #071A34 ink)
  rowBg: '#EAF4FC',
  rowInk: '#0B1F37',
  chevronInk: '#8A9199',

  // S8 lock / unlock cards (sampled #E53935 + #1599FD borders, #0B1B36 / #00295F inks)
  lockBorder: '#E53935',
  unlockBorder: '#0097FE',
  /** The Unlock card carries a pale blue tint under its blue border. */
  unlockBg: '#F1F9FE',
  lockInk: '#0B1B36',
  unlockInk: '#00295F',
  actionInk: '#1F2A37',

  // S9 privacy policy row (sampled #F4F9FD fill, #374864 ink)
  privacyBg: '#F4F9FD',
  privacyInk: '#374864',

  // S10 slide to proceed (sampled #03203B)
  slideBg: '#03203B',
  slideInk: '#FFFFFF',

  // S11 FAQ card
  faqTitleInk: '#03203B',
  faqQInk: '#1F2A37',
  faqAInk: '#8A9199',

  // S12 support button (sampled #0097FE)
  supportBg: '#0097FE',
  supportInk: '#FFFFFF',
} as const;

/**
 * Engine Control metrics, in points.
 *
 * Multipliers in the comments are the raw artboard pixel reads (/1.856).
 */
export const ecSizes = {
  /** S3–S6/S11 page gutter — cards measured at x=26..697 px. */
  gutter: 14,
  /** S2 vehicle cards — measured at x=20..702 px. */
  vehicleGutter: 11,
  /** S3 alert banner — measured at x=28..695 px. */
  bannerGutter: 15,
  /** S5 change-fence button — measured at x=30..694 px. */
  fenceGutter: 16,
  /** S8/S10/S12 — measured at x=48..676 px (the cards' inner gutter). */
  innerGutter: 26,

  /** Vertical rhythm between sections (rowmap gaps ≈ 10–17 px). */
  sectionGap: 8,
  /** Gap between the two S2 cards (measured ≈ 4 px at x=402..406). */
  vehicleCardGap: 2,
  /** Scroll padding: 18 px above S2, 44 px below S12. */
  scrollTopPad: 10,
  scrollBottomPad: 24,
  /**
   * F13: extra breathing room between S12 (Support) and the top of the absolute
   * BottomNav overlay, added on top of `sizes.bottomNav + insets.bottom`.
   */
  scrollNavBuffer: 12,

  // S2 cards (left 20..402 px, right 404..706 px — both 158..357 px tall)
  /** Right status card width (x=404..706 px → 163 pt). */
  statusCardW: 163,
  carW: 135,
  carH: 68,
  /** Inner top/bottom pad of the car card: (103 - 68 - 18 - 4) / 2 ≈ 7 pt. */
  vehicleCardTopPad: 7,
  captionH: 18,
  /** Fence pill: flush with the card's top border, y=159..213 px → 29 pt. */
  pillH: 29,
  /** F3: the reference pill is a lightly rounded rectangle, NOT a full capsule. */
  pillRadius: 8,
  statusRowH: 24,
  /** Address lines align with the "Running" label (464 px → 250 pt), not the flag. */
  addressIndent: 20,
  addressLineH: 17.5,

  // S3 banner (368..423 px → 30 pt)
  bannerH: 30,

  // S4 map (424..786 px, x=24..699 px → 195 pt tall, 13 pt gutter)
  mapH: 195,
  mapBoxW: 58,
  mapChipW: 111,
  /** F5/F6: inset of both corner pills from the map's rounded edge. */
  mapInset: 12,

  // S5 change-fence button (790..849 px → 32 pt)
  fenceBtnH: 32,

  // S6/S7 section bars (43 px → 23 pt)
  barH: 23,

  // S6 route rows (917..1325 px / 3 rows → 73 pt each)
  routeRowH: 73,
  badge: 24,
  badgeRadius: 6,
  chipH: 16,
  chipPadH: 8,

  // S7 control rows (1400..1452 px → 29 pt)
  controlRowH: 29,
  controlRowPadH: 12,

  // S8 lock / unlock cards (1535..1603 px → 37 pt)
  actionCardH: 37,
  /** Seam between the two cards (x=188..201 px → 11 pt). */
  actionCardGap: 11,

  // S9 privacy row (1606..1657 px → 27 pt)
  privacyRowH: 27,

  // S10 slide to proceed (1661..1719 px → 32 pt)
  slideH: 32,
  slideRadius: 16,

  // S11 FAQ card (1747..2009 px → 141 pt)
  faqPadH: 14,
  faqPadV: 12,
  faqGap: 8,
  faqIndent: 22,

  // S12 support button (2014..2051 px → 20 pt)
  supportH: 20,

  // shared radii
  cardRadius: 10,
  radiusSm: 8,
  radiusChip: 6,

  // glyph sizes
  iconSm: 14,
  iconMd: 18,
} as const;
