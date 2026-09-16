import { StyleSheet } from 'react-native';
import { colors, radii, sizes, typography } from '@shared/theme';

const cyanTop = sizes.imgT + sizes.sedanH + sizes.cyanTopGap;

export const styles = StyleSheet.create({
  cyanBox: {
    position: 'absolute',
    left: 0,
    top: cyanTop,
    width: `${sizes.cyanWpct}%`,
    backgroundColor: colors.cyan,
    borderRadius: radii.banner,
    padding: sizes.cyanPad,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: typography.body.fontSize, // 11
    fontWeight: '700',
    color: colors.cyanText,
  },
  locationText: {
    fontSize: 9, // cyan body — 9pt (verbatim)
    color: colors.cyanText,
    lineHeight: 13.5, // cyan body line-height (verbatim)
    marginTop: 3,
  },
});
