import { StyleSheet } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@shared/theme';

export const styles = StyleSheet.create({
  chip: {
    height: sizes.chip,
    paddingHorizontal: spacing.chipPadH,
    borderRadius: radii.chip,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.white,
  },
});
