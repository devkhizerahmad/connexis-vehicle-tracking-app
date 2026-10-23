import { StyleSheet } from 'react-native';
import { colors, spacing } from '@shared/theme';

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
});
