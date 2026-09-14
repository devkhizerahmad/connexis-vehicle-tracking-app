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
  ringGray: '#9AA0A6',
  grayText: '#7A8288',
  border: '#C9CED4',
  tabIdle: '#E4E7EA',
  // Phase 1 additions (PlateRow + VehicleInfoCard)
  plateGreen: '#5FCC00',
  brick: '#C4454A',
  grayStrong: '#4A4F54',
  outlineGray: '#8A8F98',
  navyLine: '#3A4450',
  // Support colors (from spec texts)
  white: '#FFFFFF',
  textDark: '#222222',
  mid: '#444444',
  sub: '#9AA0A6',
  navGray: '#8A9199',
  dark: '#333333',
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
  cyanTitle: 12,
  cyanBody: 11.5,
  cyanBodyLh: 17.25,
  spLabel: 12,
  spValue: 12,
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
  imgT: 26,
  cardBottomPad: 24,
  colGap: 22,
  cyanTopGap: 12,
  cyanPad: 12,
  kpiAfterCyan: 18,
  btnH: 26,
  btnPadH: 14,
  leftColPct: 45,
  rightColPct: 55,
  cyanWpct: 52,
  donut: 84,
  ringW: 10,
  dotSize: 8,
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
