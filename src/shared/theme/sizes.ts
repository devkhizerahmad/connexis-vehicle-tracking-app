// sizes.ts — semantic typed size definitions verbatim
export const sizes = {
  plateRowH: 44,
  sectionHeaderH: 40,
  sensorTileH: 64,
  reportTileH: 62,
  tabRowH: 30,
  bottomNavH: 56,
  carImgW: 115,
  carImgH: 68,
  donutD: 84,
  donutStroke: 19,
  kpiCardH: 62,

  // Verbatim component sizes
  avatar: 32,
  sedanW: 115,
  sedanH: 68,
  imgL: 14,
  imgT: 27,
  cardBottomPad: 23,
  colGap: 20,
  cyanTopGap: 22,
  cyanPad: 12,
  kpiAfterCyan: 18,
  btnH: 30,
  btnPadH: 14,
  leftColPct: 45,
  rightColPct: 55,
  rightColPadL: 4,
  colTopPad: 24,
  btnPinGapL: 26,
  cyanWpct: 56,
  donut: 84,
  ringW: 18.5,
  dotSize: 16,
  sadCircle: 40,
  badge: 22,
  kpiIcon: 22,
  tileIcon: 14,
  headerIcon: 18,
  navIcon: 16,
  reportIcon: 18,
  plateGreenPct: 41,
  plateBlackPct: 59,

  // PATCH K1 — HEADER STANDARD (3-zone model):
  // Zone 2 nav row: fixed height on EVERY screen; centre = safeAreaInset + navRowH / 2
  navRowH: 56,
  // Zone 3 extended band: optional per-screen band below the nav row (default height)
  extendedBandH: 44,
  // Minimum touch target for header interactive elements (back/actions)
  touchTarget: 48,
  // Immersive variant: floating circular back button diameter
  immersiveBackSize: 48,

  // Height definitions
  plateRow: 44,
  sectionHeader: 44,
  sensorTileMin: 64,
  reportTile: 62,
  tabRow: 30,
  bottomNav: 56,
  statusBar: 44,
  appBar: 56,
  chip: 26,
} as const;
