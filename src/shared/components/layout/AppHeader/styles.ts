import { StyleSheet } from 'react-native';
import { colors, sizes, spacing, typography } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // PATCH I3/K2: keep the gradient inside the header bounds (no bleed)
    overflow: 'hidden',
  },
  // PATCH I3/K2: gradient band fills the whole header behind all content
  gradientFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  // PATCH I3/K2: chevron + title + avatar sit above the gradient
  contentLayer: {
    zIndex: 1,
  },
  // PATCH K2: Zone 2 nav row — FIXED height on every screen, centre = inset + 28
  navRow: {
    height: sizes.navRowH,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.headerPadH,
  },
  // PATCH K2: Zone 3 extended band (variant="extended")
  extendedBand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // PATCH K2: immersive variant — floating header, no row background
  immersiveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  // PATCH K2: floating circular back button (48dp) for immersive
  immersiveBack: {
    width: sizes.immersiveBackSize,
    height: sizes.immersiveBackSize,
    borderRadius: sizes.immersiveBackSize / 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // PATCH K2: nav-row right actions slot (matches frozen left/right slot width)
  actionsContainer: {
    width: sizes.avatar,
    alignItems: 'flex-end',
  },
  leftContainer: {
    width: sizes.avatar,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    color: colors.white,
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight as any,
  },
  avatarContainer: {
    width: sizes.avatar,
  },
  avatarImage: {
    width: sizes.avatar,
    height: sizes.avatar,
    borderRadius: sizes.avatar / 2,
  },
});
