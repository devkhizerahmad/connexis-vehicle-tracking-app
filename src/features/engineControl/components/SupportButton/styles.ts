// styles.ts — S12: Support button (x=48..676 px, #0097FE).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  button: {
    height: ecSizes.supportH,
    marginHorizontal: ecSizes.innerGutter,
    borderRadius: ecSizes.radiusSm,
    backgroundColor: ecColors.supportBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    color: ecColors.supportInk,
    fontSize: 12.5,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;
