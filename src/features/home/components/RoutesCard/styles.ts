// styles.ts — Details "Routes" card.
//
// ROUTES LIST CONVERGENCE (3a): the row internal design is now the Engine
// Control "Driving Routes" row design — same number-badge shape and colour
// logic, same title + pin/grey sub-line type, same right-hand duration over a
// tinted status pill, same paddings. Every value comes from the shared
// canonical block `@shared/theme/routeRows`.
//
// 3b — the chrome: the VERTICAL DASHED CONNECTOR between the number badges is
// the measured source of truth for both lists, and this list has NO horizontal
// dividers between rows (the `row` style paints no border). 3c — the header
// bar is unchanged.
import { StyleSheet } from 'react-native';
import { colors, radii, routeRowColors, routeRowSizes, sizes, spacing, typography } from '@shared/theme';

export const styles = StyleSheet.create({
  header: {
    height: sizes.sectionHeader,
    backgroundColor: colors.surface.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sectionPadH,
    borderRadius: radii.card,
  },
  headerTitle: {
    color: colors.white,
    fontSize: typography.sectionTitle.fontSize, // 14
    fontWeight: '700',
    marginLeft: 6,
  },
  spacer: {
    flex: 1,
  },
  body: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.tilePad + 2,
    marginTop: spacing.gridGap,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: routeRowSizes.rowMinH,
    paddingVertical: routeRowSizes.rowPadV,
  },
  /** Badge column: the number badge + the dashed connector below it. */
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
  /**
   * The VERTICAL DASHED CONNECTOR — the canonical spec both lists share.
   * `borderStyle: 'dashed'` with ONLY `borderLeftWidth` set paints exactly one
   * dashed edge; the 2 dp vertical margin is the clearance between a badge edge
   * and the connector's end.
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
  contentColumn: {
    flex: 1,
    marginLeft: routeRowSizes.bodyGap,
  },
  /** Route title — same weight/size/ink as the Engine Control row. */
  addressText: {
    color: routeRowColors.titleInk,
    fontSize: routeRowSizes.title,
    fontWeight: '700',
    lineHeight: 16,
  },
  /** Sub-line: pin glyph + grey text, exactly as the Engine Control row. */
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subtitleIcon: {
    marginRight: 3,
  },
  timeText: {
    color: routeRowColors.subInk,
    fontSize: routeRowSizes.sub,
    lineHeight: 13,
  },
  /** Right column: duration above the status pill, both right-aligned. */
  rightColumn: {
    alignItems: 'flex-end',
    marginLeft: routeRowSizes.rightGap,
  },
  durationText: {
    color: routeRowColors.durationInk,
    fontSize: routeRowSizes.duration,
    fontWeight: '400',
  },
  /** Status pill: tinted capsule, same metrics as the Engine Control row. */
  statePill: {
    marginTop: 4,
    paddingHorizontal: routeRowSizes.statePillPadH,
    paddingVertical: routeRowSizes.statePillPadV,
    borderRadius: routeRowSizes.statePillRadius,
  },
  stateText: {
    fontSize: routeRowSizes.state,
    fontWeight: '600',
    lineHeight: 13,
  },
  viewMoreButton: {
    alignSelf: 'flex-end',
    padding: 2,
  },
  viewMoreText: {
    color: colors.surface.navy,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
});

export default styles;
