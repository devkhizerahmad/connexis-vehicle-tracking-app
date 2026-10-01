// styles.ts — S6: "Driving Routes" card (header bar + 3 route rows).
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';
import type { RouteState } from '@features/engineControl/types/engineControl';

/** Badge fill per route state (sampled #55D003 / #F0B429 / #E90821). */
const BADGE_FILL: Record<RouteState, string> = {
  Moving: ecColors.badgeGreen,
  Idle: ecColors.badgeAmber,
  Stop: ecColors.badgeRed,
};

const CHIP_FILL: Record<RouteState, string> = {
  Moving: ecColors.movingBg,
  Idle: ecColors.idleBg,
  Stop: ecColors.stopBg,
};

const CHIP_INK: Record<RouteState, string> = {
  Moving: ecColors.movingInk,
  Idle: ecColors.idleInk,
  Stop: ecColors.stopInk,
};

export const badgeFill = (state: RouteState): ViewStyle => ({
  backgroundColor: BADGE_FILL[state],
});

export const chipFill = (state: RouteState): ViewStyle => ({
  backgroundColor: CHIP_FILL[state],
});

export const chipInk = (state: RouteState): TextStyle => ({
  color: CHIP_INK[state],
});

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: ecSizes.gutter,
    backgroundColor: ecColors.card,
    borderRadius: ecSizes.cardRadius,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: ecSizes.routeRowH,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  /** Hairline between rows — never above the first or below the last. */
  separator: {
    height: 1,
    marginHorizontal: 12,
    backgroundColor: ecColors.divider,
  },
  badge: {
    width: ecSizes.badge,
    height: ecSizes.badge,
    borderRadius: ecSizes.badgeRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  badgeText: {
    color: ecColors.badgeInk,
    fontSize: 14,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    marginLeft: 10,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /** F9: route title is 12 pt — it must not out-weigh the section bar title. */
  title: {
    flex: 1,
    color: ecColors.routeTitleInk,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
  },
  duration: {
    color: ecColors.durationInk,
    fontSize: 10,
    fontWeight: '400',
    marginLeft: 8,
  },
  /** F9: 10 pt sub-line; F8 tints ONLY route 1 blue. */
  subtitle: {
    color: ecColors.routeSubInk,
    fontSize: 10,
    lineHeight: 12,
  },
  subtitleBlue: {
    color: ecColors.routeSubBlue,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 14,
    marginTop: 2,
  },
  timeIcon: {
    marginRight: 4,
  },
  time: {
    color: ecColors.timeInk,
    fontSize: 10,
  },
  chip: {
    alignSelf: 'flex-start',
    height: ecSizes.chipH,
    borderRadius: ecSizes.radiusChip,
    paddingHorizontal: ecSizes.chipPadH,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
    lineHeight: 14,
  },
});

export default styles;
