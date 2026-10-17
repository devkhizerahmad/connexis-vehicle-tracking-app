// styles.ts — S6: "Driving Routes" card (header bar + 3 route rows).
//
// PHASE-1 DESIGN LANGUAGE (P6). Reference intent, all read off
// `design-references/engine control.jpeg`:
//   - the card is a FLAT, sharp, square-cornered white plane (not a 10 pt pill);
//   - the row state ("Moving" / "Idle" / "Stop") is PLAIN COLOURED TEXT — there
//     is NO chip, pill or tinted background behind it, so `chipFill`/`chipInk`
//     and every chip metric token are gone;
//   - EVERY sub-line is grey. Route 1's subtitle used to be tinted blue
//     (`routeSubBlue`), which no longer exists as a token;
//   - the time line has NO clock glyph;
//   - there are NO hairline separators between rows;
//   - a clearly VISIBLE dotted line chains the number badges top to bottom
//     (it was `divider` #EDF1F5 on white, i.e. invisible);
//   - route 2's badge is ORANGE, and the badges/rows/fonts are all smaller.
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';
import type { RouteState } from '@features/engineControl/types/engineControl';

/** Badge fill per route state. */
const BADGE_FILL: Record<RouteState, string> = {
  Moving: ecColors.badgeGreen,
  Idle: ecColors.badgeOrange,
  Stop: ecColors.badgeRed,
};

/** P6: plain coloured text — ink only, no background. */
const STATE_INK: Record<RouteState, string> = {
  Moving: ecColors.movingInk,
  Idle: ecColors.idleInk,
  Stop: ecColors.stopInk,
};

export const badgeFill = (state: RouteState): ViewStyle => ({
  backgroundColor: BADGE_FILL[state],
});

export const stateInk = (state: RouteState): TextStyle => ({
  color: STATE_INK[state],
});

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: ecSizes.pageGutter,
    backgroundColor: ecColors.card,
    borderRadius: ecSizes.flat,
  },
  /** P6: tighter padding and a shorter min-height (73 -> 60). */
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: ecSizes.routeRowH,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  /** P6: smaller number badge (24 -> 20). */
  badge: {
    width: ecSizes.badge,
    height: ecSizes.badge,
    borderRadius: ecSizes.badgeRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /**
   * P6: the dashed vertical connector down the badge column. Drawn on EVERY row
   * — the reference's dashes run the full height of the list and continue a
   * little below the last badge — so consecutive segments meet and the badges
   * read as one chain. `left` is the badge's centre line (row padH + badge/2);
   * `top` clears that row's badge.
   */
  connector: {
    position: 'absolute',
    left: 10 + ecSizes.badge / 2,
    top: 5 + ecSizes.badge,
    bottom: 0,
    width: 0,
    borderLeftWidth: 1,
    // RN has no per-side border style (`borderLeftStyle` is not in ViewStyle),
    // but `borderStyle` applies to whichever edges have a width. Only
    // `borderLeftWidth` is set here, so exactly one dashed edge is painted.
    borderStyle: 'dashed',
    borderLeftColor: ecColors.connectorInk,
  },
  badgeText: {
    color: ecColors.badgeInk,
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    marginLeft: 8,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /** P6: 12 -> 11 pt, and the title must not out-weigh the section bar title. */
  title: {
    flex: 1,
    color: ecColors.routeTitleInk,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  duration: {
    color: ecColors.durationInk,
    fontSize: 9,
    fontWeight: '400',
    marginLeft: 8,
  },
  /** P6: EVERY subtitle is grey — the blue override is gone. 10 -> 9 pt. */
  subtitle: {
    color: ecColors.routeSubInk,
    fontSize: 9,
    lineHeight: 12,
  },
  /** P6: the clock glyph is gone; the time is a bare grey line. */
  time: {
    color: ecColors.timeInk,
    fontSize: 9,
    lineHeight: 12,
    marginTop: 1,
  },
  /** P6: the state is plain text, so this is a block, not a chip. */
  state: {
    fontSize: 10.5,
    fontWeight: '600',
    lineHeight: 14,
    marginTop: 1,
  },
});

export default styles;