// styles.ts — S10: "Slide to Proceed" navy pill (1661..1719 px → 32 pt).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  bar: {
    height: ecSizes.slideH,
    marginTop: 4,
    borderRadius: ecSizes.slideRadius,
    backgroundColor: ecColors.slideBg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  /** The reference label sits left-of-centre with a 28 pt lead-in. */
  label: {
    flex: 1,
    color: ecColors.slideInk,
    fontSize: 14,
    fontWeight: '700',
    paddingLeft: 28,
  },
  chevrons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 18,
  },
  chevron: {
    marginLeft: -4,
  },
  dragging: {
    opacity: 0.9,
  },
});

export default styles;
