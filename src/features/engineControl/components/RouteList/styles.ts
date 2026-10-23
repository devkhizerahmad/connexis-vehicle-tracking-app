// styles.ts — S6: "Driving Routes" card shell.
//
// B10: the ROW styles moved to `@shared/components/vehicle/RouteRow` (the shared
// row both lists render), so this file only owns the card chrome — the outer
// shadow shell and the clipped card that rounds the gradient header's corners.
import { StyleSheet } from 'react-native';
import { ecCardRadius, ecColors, ecShadow, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  /**
   * Outer shell carries the SHADOW; the inner card clips the gradient bar to
   * its rounded top corners. Split so the blur is never cut by the clip.
   */
  cardOuter: {
    marginHorizontal: ecSizes.pageGutter,
    backgroundColor: ecColors.card,
    borderRadius: ecCardRadius,
    ...ecShadow,
  },
  card: {
    overflow: 'hidden',
    borderRadius: ecCardRadius,
    backgroundColor: ecColors.card,
  },
});

export default styles;
