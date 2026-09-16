import { StyleSheet } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@shared/theme';

export const styles = StyleSheet.create({
  title: {
    color: colors.text.dark,
    fontSize: 13, // activity title — 13pt (verbatim)
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    height: sizes.tabRow,
    borderRadius: radii.tab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.red,
  },
  tabIdle: {
    backgroundColor: colors.tabIdle,
  },
  tabText: {
    fontSize: typography.body.fontSize, // 11
  },
  tabTextActive: {
    fontWeight: '700',
    color: colors.white,
  },
  tabTextIdle: {
    fontWeight: '500',
    color: colors.text.grayText,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  sadCircle: {
    width: sizes.sadCircle,
    height: sizes.sadCircle,
    borderRadius: sizes.sadCircle / 2,
    backgroundColor: colors.sadRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adviceText: {
    flex: 1,
    color: colors.navGray,
    fontSize: 11, // advice text — 11pt (verbatim)
    textAlign: 'center',
    lineHeight: 16,
  },
  placeholderBox: {
    height: 90,
    marginTop: spacing.gridGap,
    borderRadius: radii.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
});
