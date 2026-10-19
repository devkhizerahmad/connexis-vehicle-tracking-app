// styles.ts — S9: Support button.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): an INSET, ROUNDED, BLUE
// FILLED full-width pill aligned to the same page gutter as every card above it
// (it used to sit deeper at `innerGutter` with a tighter radius).
import { StyleSheet } from 'react-native';
import { ecCardRadius, ecColors, ecShadow, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  button: {
    height: ecSizes.supportH + 8,
    marginHorizontal: ecSizes.pageGutter,
    borderRadius: ecCardRadius,
    backgroundColor: ecColors.supportBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // NEW design language: the pills lift off the page like the cards do.
    ...ecShadow,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    color: ecColors.supportInk,
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;
