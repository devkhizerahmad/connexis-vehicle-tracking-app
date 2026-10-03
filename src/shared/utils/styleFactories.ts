// styleFactories.ts — dynamic style factories & calculation helpers with full comments
import { ViewStyle } from 'react-native';
import { profileTokens, sizes, spacing } from '@shared/theme';

/**
 * Calculates the dynamic gap below VehicleInfoCard for the CyanLocationBox overflow.
 * Behavior-identical to original measured-height logic:
 * cyanTop = SZ.imgT + SZ.sedanH + SZ.cyanTopGap
 * kpiGap = Math.max(L.gridGap, SZ.kpiAfterCyan + cyanTop + cyH - cardH)
 */
export const calculateKpiGap = (cardH: number, cyH: number): number => {
  const cyanTop = sizes.imgT + sizes.sedanH + sizes.cyanTopGap;
  if (cardH > 0 && cyH > 0) {
    return Math.max(spacing.gridGap, sizes.kpiAfterCyan + cyanTop + cyH - cardH);
  }
  return spacing.gridGap;
};

/**
 * Precomputes donut chart arc rotation & angles from percentage score.
 */
export const calculateDonutAngles = (score: number) => {
  const sweepAngle = (score / 100) * 260; // 260 deg total arc
  return {
    sweepAngle,
    startAngle: -130,
  };
};

/**
 * Dynamic height wrapper — used for safe-area spacers, gradient blocks and
 * any other runtime-measured height (never a static literal).
 */
export const makeHeightStyle = (height: number): ViewStyle => ({ height });

/**
 * Multi-stop gradient container (full width, clipped to the given height).
 */
export const makeGradientContainerStyle = (height: number): ViewStyle => ({
  height,
  width: '100%',
  overflow: 'hidden',
});

/**
 * Single gradient band — colour + height are computed per band at render time.
 */
export const makeGradientStripStyle = (color: string, height: number): ViewStyle => ({
  backgroundColor: color,
  height,
});

/**
 * Profile page scroll content padding so the form clears the home indicator
 * while the bottom tab bar is hidden on this screen.
 */
export const makeProfileScrollContentStyle = (insetBottom: number): ViewStyle => ({
  paddingBottom: profileTokens.space.scrollBottomPad + insetBottom,
});
