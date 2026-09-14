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
  statusPadH: 16,
  chipPadH: 8,
};

export const R = {
  vehicleCard: 10,
  card: 8,
  tile: 8,
  banner: 6,
  tab: 4,
  plateRow: 6,
  navActive: 10,
  button: 6,
  badge: 4,
  chip: 6,
};

export const H = {
  plateRow: 38,
  sectionHeader: 40,
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
  plate: 12,
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
  cyanBody: 10.5,
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
  sedanW: 110,
  sedanH: 70,
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
};

export const L = {
  dropdownWpct: 30,
  calloutFlex: 3,
  sideFlex: 2,
  donutDotDeg: 140,
  gridGap: 8,
  toastMs: 1800,
  collapseMs: 200,
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
