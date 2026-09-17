import { StyleSheet } from 'react-native';
import { colors, sizes, spacing, typography } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // PATCH I3: keep the gradient inside the header bounds (no bleed)
    overflow: 'hidden',
  },
  // PATCH I3: gradient band fills the whole header behind all content
  gradientFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  // PATCH I3: chevron + title + avatar sit above the gradient
  contentLayer: {
    zIndex: 1,
  },
  appBar: {
    height: sizes.appBar,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.headerPadH,
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
