import { StyleSheet } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@shared/theme';

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
  },
  badgeColumn: {
    width: sizes.badge,
    alignItems: 'center',
  },
  badge: {
    width: sizes.badge,
    height: sizes.badge,
    borderRadius: radii.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  dashedConnector: {
    width: 0,
    flex: 1,
    minHeight: 26,
    borderLeftWidth: 1,
    borderLeftColor: colors.surface.dash,
    borderStyle: 'dashed',
    marginVertical: 2,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 10,
  },
  addressText: {
    color: colors.text.mid,
    fontSize: 12,
    lineHeight: 16,
  },
  timeText: {
    color: colors.text.sub,
    fontSize: 10,
    marginTop: 2,
  },
  statusText: {
    fontSize: typography.body.fontSize, // 11
    marginTop: 2,
    fontWeight: '600',
  },
  durationText: {
    color: colors.text.sub,
    fontSize: 10,
    paddingTop: 2,
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
