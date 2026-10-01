// styles.ts — S9: privacy policy row (1606..1657 px → 27 pt, #F4F9FD).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    height: ecSizes.privacyRowH,
    marginTop: 4,
    borderRadius: ecSizes.radiusSm,
    backgroundColor: ecColors.privacyBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    color: ecColors.privacyInk,
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;
