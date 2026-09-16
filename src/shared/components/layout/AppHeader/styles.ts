import { StyleSheet } from 'react-native';
import { colors, sizes, spacing, typography } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
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
