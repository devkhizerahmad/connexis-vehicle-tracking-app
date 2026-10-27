// colors.ts — semantic typed token module for colors
export const colors = {
  brand: {},
  status: {
    running: '#5FCC00',
    idle: '#EFAF00',
    stop: '#C62828',
    noData: '#ABABAB',
  },
  surface: {
    page: '#F5F6F8',
    card: '#FFFFFF',
    navy: '#1B2430',
    maroon: '#4A0E0E',
    cyan: '#45E3F0',
    cyanText: '#0C2340',
    alertBg: '#F7C7CB',
    alertText: '#D42B2B',
    bannerGreen: '#44C62F',
    tabIdle: '#E4E7EA',
    track: '#E8EAED',
    border: '#C9CED4',
    badgeAmber: '#F0B429',
    dash: '#D7DBE0',
    hairline: '#ECEEF1',
  },
  /**
   * PATCH UI-POLISH: structural outlines. `surface.border` is a soft grey for
   * quiet separators; `line.strong` is the near-black 1pt hairline the asset
   * cards and the sensor "Select" areas need to read as real edges.
   */
  line: {
    strong: '#d6d3d3',
  },
  text: {
    primary: '#222222',
    secondary: '#7A8288',
    /**
     * AUTH CONTRAST FIX: `secondary` (#7A8288) is 3.9:1 on white and 3.6:1 on
     * the page fill, below the 4.5:1 WCAG AA bar for the 13-14pt copy on the
     * login card. These two derived greys are the AA-safe pair used there.
     * FLAGGED: added tokens, not a global palette change.
     */
    secondaryStrong: '#5F6771', // 5.7:1 on white, 5.3:1 on page
    placeholder: '#667077', // 5.1:1 on white, 4.7:1 on page
    onDark: '#FFFFFF',
    label: '#4A4F54',
    dark: '#3A3F45',
    mid: '#444444',
    sub: '#9AA0A6',
    score: '#333333',
    grayText: '#7A8288',
    grayStrong: '#4A4F54',
  },
  icon: {
    brickRed: '#C4454A',
    blue: '#29B6F6',
    orange: '#F5A623',
    dotOrange: '#F79C1D',
    green: '#35CB35',
    yellow: '#F5B800',
    purple: '#6A4FC0',
    arcGray: '#5F656C',
    btnPin: '#6B7280',
    navGray: '#8A9199',
    outlineGray: '#8A9199',
  },
  // Flattened exact tokens
  bg: '#F5F6F8',
  white: '#FFFFFF',
  /**
   * HOME STATUS BOXES — the ONE shared "text on a saturated fill" colour.
   *
   * Every status box (Total / Running / Idle / Stop / No Data) paints its title
   * AND its number in this ONE pure white, so no box shows a muted number under
   * a white title. Sizes and weights are unchanged — only the colour.
   *
   * Measured white-on-fill contrast (WCAG): Total 7.5-15.2:1, Stop 5.6:1,
   * Running 2.1:1, Idle 1.9:1, No Data 2.3:1 — the last three sit below the
   * 3:1 large-bold-text bar on their bright fills.
   */
  onAccent: '#FFFFFF',
  black: '#0F0F0F',
  red: '#E03131',
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
  sadRed: '#D93025',
  ringGray: '#5F656C',
  orangeDot: '#F79C1D',
  trackGray: '#E8EAED',
  grayText: '#7A8288',
  border: '#C9CED4',
  tabIdle: '#E4E7EA',
  plateGreen: '#5FCC00',
  brick: '#C4454A',
  grayStrong: '#4A4F54',
  outlineGray: '#8A9199',
  btnPin: '#6B7280',
  navyLine: '#3A4450',
  textDark: '#222222',
  mid: '#444444',
  sub: '#9AA0A6',
  navGray: '#8A9199',
  dark: '#3A3F45',
  badgeAmber: '#F0B429',
  dash: '#D7DBE0',
  hairline: '#ECEEF1',
  reportBlue: '#1E88E5',
  reportSlate: '#37474F',
  reportSky: '#29B6F6',
  reportTeal: '#009688',
  reportBrick: '#C0392B',
  reportGold: '#EFAF00',
  // DERIVED (auth): primary-red opacity variants for login icon-square tint
  // and bottom-left pink decorative arc. Derived from gradientHeader's brand-red
  // stop (#C0110F). FLAGGED: these are opacity overlays, not arbitrary hex.
  authIconTint: 'rgba(192, 17, 15, 0.10)',
  authDecorArc: 'rgba(192, 17, 15, 0.10)',
  // AUTH FORM STATES: inline error surface + ink. `surface.alertText` on
  // `surface.alertBg` is ~3.3:1, too low for 13pt form copy; this pair is
  // 6.4:1 and reads as an error without competing with the brand red.
  // FLAGGED: added tokens for the login form only.
  authErrorBg: '#FDECEA',
  authErrorText: '#B00020',
  authErrorBorder: '#F2B8B5',
  // LOGIN RESTYLE (reference mock): light page behind the red hero, navy title,
  // blue-grey copy, pale field outline. Sampled from design-references/
  // Login Screen.png. FLAGGED: auth-only additions, no global palette change.
  authPage: '#F7F7FB',
  authTitle: '#172136',
  authMuted: '#5F6D87',
  authFieldBorder: '#E6EAF2',
  // DERIVED (auth/login footer on red-bg image): light-on-red opacity variants.
  // Reused from colors.white (#FFFFFF) — NOT arbitrary hex.
  // FLAGGED: documented derived tokens only.
  authFooterDim: 'rgba(255, 255, 255, 0.70)',
  authFooterLink: '#FFFFFF',

  // PATCH J1: shared AppHeader gradient — Figma-exact stops:
  // 0% #B2250C (opacity 100) -> 100% #160F12 (opacity 100), Linear 180° (vertical).
  // Used by react-native-linear-gradient (LinearGradient) in AppHeader.
  //
  // PATCH TOP-HEADER STANDARD: the shared header ramp is now the DIAGONAL pair
  // adopted from the "Engine Control Vehicle Dashboard" reference — a near-black
  // maroon (#2A0508) easing into the brand red (#C0110F). It is the ONE ramp for
  // EVERY screen; the axis and the 56dp strip scope live in `headerSpec`
  // (shared/theme/header.ts).
  gradientHeader: ['#2A0508', '#C0110F'] as const,
  // PATCH HOME: HomeScreen tokens (reference mock; summary cards / chip / sensor strip)
  home: {
    totalGradStart: '#4E555E',
    totalGradEnd: '#22262B',
    // `runningValueGreen` / `idleValueAmber` / `stopValueRed` were the MUTED
    // per-hue number inks that made the status boxes inconsistent (a muted
    // number under a white title, at 1.1-1.6:1 against its own fill). The
    // status row now uses ONE shared ink for every title+number pair —
    // `colors.onAccent` — so those three tokens were removed.
    chipGray: '#B9B9B9',
    sensorDivider: '#E0E0E0',
    thermoOrange: '#F57C00',
    doorPurple: '#6A4FC0',
    premiumMaroon: '#4A0E0E',
    bodyText: '#333333',
    // PATCH HOME/H-C: Assets List title + refresh icon ink
    assetsTitle: '#1A1A1A',
    // PATCH HOME/H-D: "More Details" link ink + premium bar label ink
    moreDetails: '#8A9199',
    premiumLabel: '#C9CED4',
    // PATCH HOME/H-D: Reports button fill
    reportsBtn: '#9AA0A6',
  },
  // PATCH H1: splash bg — must match android .../values/colors.xml splashBackground
  splash: '#F8F3F3',
} as const;

export const statusColor = (k: string): string =>
  ({red: colors.red, green: colors.tileGreen, orange: colors.orange, amber: colors.badgeAmber, black: colors.textDark}[k] ?? colors.textDark);

export const badgeColor = (k: string): string =>
  ({green: colors.tileGreen, amber: colors.badgeAmber, red: colors.red}[k] ?? colors.tileGreen);

export const reportColor = (k: string): string =>
  ({
    blue1: colors.reportBlue,
    slate: colors.reportSlate,
    sky: colors.reportSky,
    teal: colors.reportTeal,
    brick: colors.reportBrick,
    gold: colors.reportGold,
  }[k] ?? colors.reportBlue);
