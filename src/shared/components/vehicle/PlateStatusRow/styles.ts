import { StyleSheet } from 'react-native';
import { colors, radii, sizes, typography } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    height: sizes.plateRow,
    borderRadius: radii.plateRow,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  blackSeg: {
    flex: sizes.plateBlackPct,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  plateText: {
    color: colors.white,
    fontSize: typography.body.fontSize + 2, // = 13pt plate text (verbatim)
    fontWeight: '700',
    marginLeft: 12,
  },
  greenSeg: {
    flex: sizes.plateGreenPct,
    backgroundColor: colors.plateGreen,
    justifyContent: 'center',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusText: {
    color: colors.white,
    fontSize: typography.body.fontSize + 2,
    fontWeight: '700',
  },
});
