// styles.ts — S6: "Driving Routes" card (gradient header + 3 route rows).
//
// ROUTES LIST CONVERGENCE: the row design is the DONOR for the Details "Routes"
// list, so every value here now comes from the shared canonical block
// (`@shared/theme/routeRows`) — one source of truth for both lists.
//
//   - the HORIZONTAL dividers between rows are GONE (2a);
//   - the VERTICAL DASHED CONNECTOR between the number badges is BACK (2b),
//     matching the Details spec measured on device: vertical, on the badge
//     centre line, 1 dp, colors.surface.dash, 3 dp dash / 3 dp gap, running
//     from the lower badge's bottom edge + 2 dp to the next badge's top edge
//     − 2 dp, and only BETWEEN consecutive badges.
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import {
  colors,
  ecCardRadius,
  ecColors,
  ecShadow,
  ecSizes,
  routeRowColors,
  routeRowSizes,
} from '@shared/theme';
import type { RouteState } from '@features/engineControl/types/engineControl';

/** Number-badge fill per route state. */
const BADGE_FILL: Record<RouteState, string> = {
  Moving: routeRowColors.badgeGreen,
  Pending: routeRowColors.badgeOrange,
  Stop: routeRowColors.badgeRed,
};

/** Status-PILL tint behind each state label. */
const PILL_FILL: Record<RouteState, string> = {
  Moving: routeRowColors.movingPillBg,
  Pending: routeRowColors.pendingPillBg,
  Stop: routeRowColors.stopPillBg,
};

/** Status-PILL text ink — same hue family as the badge it sits beside. */
const STATE_INK: Record<RouteState, string> = {
  Moving: routeRowColors.movingInk,
  Pending: routeRowColors.idleInk,
  Stop: routeRowColors.stopInk,
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
  /** Rows are centred on their title line. NO horizontal divider (2a). */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: routeRowSizes.rowMinH,
    paddingVertical: routeRowSizes.rowPadV,
    paddingHorizontal: routeRowSizes.rowPadH,
  },
  /**
   * The badge column: the number badge plus the dashed connector below it.
   * Its width IS the badge width and it centres its children, so the
   * connector lands exactly on the badge's centre line.
   */
  badgeColumn: {
    width: routeRowSizes.badge,
    alignItems: 'center',
  },
  badge: {
    width: routeRowSizes.badge,
    height: routeRowSizes.badge,
    borderRadius: routeRowSizes.badgeRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /**
   * The VERTICAL DASHED CONNECTOR (2b) — Details' canonical spec.
   * `borderStyle: 'dashed'` with ONLY `borderLeftWidth` set paints exactly one
   * dashed edge. The 2 dp vertical margin is the clearance between a badge
   * edge and the connector's end.
   */
  dashedConnector: {
    width: 0,
    flex: 1,
    minHeight: routeRowSizes.connectorMinH,
    borderLeftWidth: routeRowSizes.connectorWidth,
    borderLeftColor: colors.surface.dash,
    borderStyle: 'dashed',
    marginVertical: routeRowSizes.connectorClearance,
  },
  badgeText: {
    color: routeRowColors.badgeInk,
    fontSize: routeRowSizes.badgeText,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    marginLeft: routeRowSizes.bodyGap,
  },
  title: {
    color: routeRowColors.titleInk,
    fontSize: routeRowSizes.title,
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
    color: routeRowColors.subInk,
    fontSize: routeRowSizes.sub,
    lineHeight: 13,
  },
  /** Right column: duration above the status pill, both right-aligned. */
  rightCol: {
    alignItems: 'flex-end',
    marginLeft: routeRowSizes.rightGap,
  },
  duration: {
    color: routeRowColors.durationInk,
    fontSize: routeRowSizes.duration,
    fontWeight: '400',
  },
  /** Status pill: tinted capsule. */
  statePill: {
    marginTop: 4,
    paddingHorizontal: routeRowSizes.statePillPadH,
    paddingVertical: routeRowSizes.statePillPadV,
    borderRadius: routeRowSizes.statePillRadius,
  },
  state: {
    fontSize: routeRowSizes.state,
    fontWeight: '600',
    lineHeight: 13,
  },
});

export default styles;
