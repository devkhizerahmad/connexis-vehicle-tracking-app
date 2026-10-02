import { StyleSheet } from 'react-native';
import { colors, sizes, spacing } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  // V5-PART1: paddingBottom is supplied dynamically in DetailsScreen as
  // `sizes.bottomNav + insets.bottom + 12`; this constant is the non-nav remainder.
  scrollViewContent: {},
  contentPadding: {
    paddingHorizontal: spacing.pageMargin,
    paddingTop: spacing.gridGap,
    gap: spacing.gridGap,
  },
  toast: {
    position: 'absolute',
    left: spacing.pageMargin,
    right: spacing.pageMargin,
    backgroundColor: colors.surface.navy,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    bottom: sizes.bottomNav + 16,
  },
  toastText: {
    color: colors.white,
    fontSize: 12,
  },
});
