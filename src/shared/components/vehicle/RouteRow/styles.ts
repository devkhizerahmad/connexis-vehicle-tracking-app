// styles.ts — the ONE route-row design (B10).
//
// ROUTES LIST CONVERGENCE: Engine Control's "Driving Routes" row was the donor;
// Details' "Routes" row was restyled onto it. Until now the two lists carried
// duplicate style blocks with identical values, so the "shared" claim lived only
// in `@shared/theme/routeRows`. These styles are the component-level single
// source of truth — both lists render THIS row.
//
// The VERTICAL DASHED CONNECTOR spec (measured on device on the Details list):
//   • vertical, on the number badge's centre line
//   • 1 dp stroke, colour `colors.surface.dash` (#D7DBE0)
//   • dash 3 dp / gap 3 dp (Android's default for a dashed 1 dp border)
//   • runs from the lower badge's BOTTOM edge + 2 dp to the next badge's TOP
//     edge − 2 dp, i.e. it FILLS the gap between two consecutive badges
//   • drawn between consecutive badges only (never below the last one)
// RN has no per-side border style, so a dashed LEFT edge is painted by setting
// only `borderLeftWidth` — the other three edges stay unpainted.
import { StyleSheet } from 'react-native';
import { colors, routeRowColors, routeRowSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  /** Row shell. `inset` adds the gutter Engine Control's card relies on. */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: routeRowSizes.rowMinH,
    paddingVertical: routeRowSizes.rowPadV,
  },
  rowInset: {
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
  badgeText: {
    color: routeRowColors.badgeInk,
    fontSize: routeRowSizes.badgeText,
    fontWeight: '700',
  },
  dashedConnector: {
    width: 0,
    flex: 1,
    minHeight: routeRowSizes.connectorMinH,
    borderLeftWidth: routeRowSizes.connectorWidth,
    borderLeftColor: colors.surface.dash,
    borderStyle: 'dashed',
    marginVertical: routeRowSizes.connectorClearance,
  },
  body: {
    flex: 1,
    marginLeft: routeRowSizes.bodyGap,
  },
  /** Route title / address — one type ramp for both lists. */
  title: {
    color: routeRowColors.titleInk,
    fontSize: routeRowSizes.title,
    fontWeight: '700',
    lineHeight: 16,
  },
  /** Sub-line: pin glyph + grey location, exactly as the reference. */
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
