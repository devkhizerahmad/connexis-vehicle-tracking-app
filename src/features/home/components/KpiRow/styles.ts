import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.gridGap,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.tilePad + 2,
    alignItems: 'center',
    gap: 3,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    color: colors.text.grayText,
    fontSize: 9.5, // KPI label — 9.5pt (verbatim)
    textAlign: 'center',
  },
  value: {
    color: colors.text.primary,
    fontSize: typography.body.fontSize + 2, // = 13pt (verbatim KPI value size)
    fontWeight: '700',
  },
});
