// styles.ts — S6: "Driving Routes" card (gradient header + 3 route rows).
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference) — the whole section was
// re-derived; the old PHASE-1 flat/edge-to-edge target is VOID:
//   - the card is INSET, ROUNDED and SHADOWED (it was a flat, sharp plane);
//   - the header bar has ROUNDED TOP CORNERS (it was passed `edge` = square);
//   - each row's state is a tinted ROUNDED STATUS PILL (Moving green /
//     Pending amber / Stop red) — it was bare coloured text;
//   - every row ends in a RIGHT CHEVRON;
//   - rows are separated by HAIRLINE DIVIDERS;
//   - the dotted badge-column CONNECTOR is gone (that was the old reference);
//   - the time line is not painted (the new rows carry none).
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { ecCardRadius, ecColors, ecShadow, ecSizes } from '@shared/theme';
import type { RouteState } from '@features/engineControl/types/engineControl';

/** Number-badge fill per route state (1 green / 2 amber / 3 red). */
const BADGE_FILL: Record<RouteState, string> = {
  Moving: ecColors.badgeGreen,
  Pending: ecColors.badgeOrange,
  Stop: ecColors.badgeRed,
};

/** Status-PILL tint behind each state label. */
const PILL_FILL: Record<RouteState, string> = {
  Moving: ecColors.pillMovingBg,
  Pending: ecColors.pillPendingBg,
  Stop: ecColors.pillStopBg,
};

/** Status-PILL text ink — same hue family as the badge it sits beside. */
const STATE_INK: Record<RouteState, string> = {
  Moving: ecColors.movingInk,
  Pending: ecColors.idleInk,
  Stop: ecColors.stopInk,
};

export const badgeFill = (state: RouteState): ViewStyle => ({
  backgroundColor: BADGE_FILL[state],
});

export const pillFill = (state: RouteState): ViewStyle => ({
  backgroundColor: PILL_FILL[state],
});

export const stateInk = (state: RouteState): TextStyle => ({
  color: STATE_INK[state],
});

export const styles = StyleSheet.create({
  /**
   * Outer shell carries the SHADOW; the inner card clips the gradient bar to
   * its rounded top corners. Split so the blur is never cut by the clip.
   */
  cardOuter: {
    marginHorizontal: ecSizes.pageGutter,
    backgroundColor: ecColors.card,
    borderRadius: ecCardRadius,
    ...ecShadow,
  },
  card: {
    overflow: 'hidden',
    borderRadius: ecCardRadius,
    backgroundColor: ecColors.card,
  },
  /** Rows are centred on their title line. */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: ecSizes.routeRowH,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ecColors.cardBorder,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: ecColors.badgeInk,
    fontSize: 12.5,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: ecColors.routeTitleInk,
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 16,
  },
  /** Subtitle line: pin glyph + grey location, exactly as the reference. */
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subtitleIcon: {
    marginRight: 3,
  },
  subtitle: {
    color: ecColors.routeSubInk,
    fontSize: 10.5,
    lineHeight: 13,
  },
  /** Right column: duration above the status pill, both right-aligned. */
  rightCol: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  duration: {
    color: ecColors.durationInk,
    fontSize: 11.5,
    fontWeight: '400',
  },
  /** Status pill: tinted capsule (NEW reference — no longer bare text). */
  statePill: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  state: {
    fontSize: 10.5,
    fontWeight: '600',
    lineHeight: 13,
  },
  /** Drops the divider from the final row (reference divides BETWEEN rows). */
  rowLast: {
    borderBottomWidth: 0,
  },
});

export default styles;