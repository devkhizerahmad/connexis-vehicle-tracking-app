import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.text.primary,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.text.label,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.sm,
    minHeight: 44,
    minWidth: 120,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.button,
    backgroundColor: colors.reportBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionText: {
    ...typography.button,
    color: colors.white,
  },
});
