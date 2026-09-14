// detailsTokens.ts — single source of truth for the Details screen (NO magic numbers elsewhere)
export const C = {
  // Spec tokens
  bg: '#F4F6F8',
  gradTop: '#7A1507',
  gradBottom: '#9E2A0B',
  black: '#0F0F0F',
  green: '#3ECF3E',
  cyan: '#45E3F0',
  cyanText: '#0C2340',
  navy: '#1B2430',
  amber: '#F5B800',
  tileGreen: '#35CB35',
  alertBg: '#F7C7CB',
  alertText: '#D42B2B',
  bannerGreen: '#44C62F',
  blue: '#29B6F6',
  orange: '#F5A623',
  red: '#E03131',
  sadRed: '#D93025',
  ringGray: '#5F656C', // Fix4: dark slate gray arc
  orangeDot: '#F79C1D', // Fix4: orange dot at start tip
  trackGray: '#E8EAED',
  grayText: '#7A8288',
  border: '#C9CED4',
  tabIdle: '#E4E7EA',
  // Phase 1 additions (PlateRow + VehicleInfoCard)
  plateGreen: '#5FCC00',
  brick: '#C4454A',
  grayStrong: '#4A4F54',
  outlineGray: '#8A9199', // Fix1: button border
  btnPin: '#6B7280', // Fix1: Live Location pin gray
  navyLine: '#3A4450',
  // Support colors (from spec texts)
  white: '#FFFFFF',
  textDark: '#222222',
  mid: '#444444',
  sub: '#9AA0A6',
  navGray: '#8A9199',
  dark: '#3A3F45', // Fix4: center score text bold 15pt #3A3F45
  badgeAmber: '#F0B429',
  dash: '#D7DBE0',
  hairline: '#ECEEF1',
  // Quick report tile colors
  reportBlue: '#1E88E5',
  reportSlate: '#37474F',
  reportSky: '#29B6F6',
  reportTeal: '#009688',
  reportBrick: '#C0392B',
  reportGold: '#EFAF00',
};

export const S = {
  pageMargin: 12,
  cardGap: 8,
  vehicleCardPad: 12,
  tilePad: 8,
  headerPadH: 12,
  sectionPadH: 14, // collapsible section headers (Routes / Quick Report) — spec pad 14
  statusPadH: 16,
  chipPadH: 8,
};

export const R = {
  vehicleCard: 4,
  card: 8,
  tile: 8,
  banner: 6,
  tab: 4,
  plateRow: 8,
  navActive: 10,
  button: 8,
  badge: 4,
  chip: 6,
};

export const H = {
  plateRow: 44,
  sectionHeader: 44,
  sensorTileMin: 64,
  reportTile: 62,
  tabRow: 30,
  bottomNav: 56,
  statusBar: 44,
  appBar: 56,
  chip: 26,
};

export const FS = {
  title: 18,
  plate: 13,
  sectionTitle: 14,
  body: 11,
  small: 10,
  micro: 9,
  kpiLabel: 9.5,
  kpiValue: 13,
  tileLabel: 10,
  tileValue: 13,
  trend: 10,
  cyanTitle: 11,
  cyanBody: 9,
  cyanBodyLh: 13.5,
  spLabel: 10.5,
  spValue: 10.5,
  spLh: 15, // Stat text line height
  navLabel: 9,
  advice: 11,
  banner: 11,
  badge: 11,
  address: 12,
  activityTitle: 13,
  statusTime: 15,
};

export const SZ = {
  avatar: 32,
  sedanW: 115,
  sedanH: 68,
  imgL: 14,
  imgT: 27,
  cardBottomPad: 23, // Fix1: card bottom = Live Location button bottom + 23
  colGap: 20, // Fix1: right column vertical row gap
  cyanTopGap: 22, // Fix1: cyan top = car-image bottom + 22
  cyanPad: 12,
  kpiAfterCyan: 18,
  btnH: 30, // Fix1: Live Location button height
  btnPadH: 14,
  leftColPct: 45,
  rightColPct: 55,
  rightColPadL: 4, // Fix1: column left = cyan right + gap
  colTopPad: 24, // Fix1: right column top padding
  btnPinGapL: 26, // Fix1: button left offset = icon 18 + gap 8
  cyanWpct: 56, // Fix1: cyan overlay width = 56% of card
  donut: 84,
  ringW: 18.5, // Fix4: stroke width = 22% of 84 = 18.5pt
  dotSize: 16, // Fix4: dot diameter = 0.85 * 18.5 = 16pt
  sadCircle: 40,
  badge: 22,
  kpiIcon: 22,
  tileIcon: 14,
  headerIcon: 18,
  navIcon: 16,
  reportIcon: 18,
  plateGreenPct: 41,
  plateBlackPct: 59,
};

export const L = {
  dropdownWpct: 30,
  calloutFlex: 3,
  sideFlex: 2,
  donutDotDeg: 140,
  gridGap: 8,
  toastMs: 1800,
  collapseMs: 250,
  gridCols: 3,
};

// Semantic color maps — components never hardcode these hex values
export const statusColor = (k: string): string =>
  ({red: C.red, green: C.tileGreen, orange: C.orange, amber: C.badgeAmber, black: C.textDark}[
    k
  ] ?? C.textDark);

export const badgeColor = (k: string): string =>
  ({green: C.tileGreen, amber: C.badgeAmber, red: C.red}[k] ?? C.tileGreen);

export const reportColor = (k: string): string =>
  ({
    blue1: C.reportBlue,
    slate: C.reportSlate,
    sky: C.reportSky,
    teal: C.reportTeal,
    brick: C.reportBrick,
    gold: C.reportGold,
  }[k] ?? C.reportBlue);
