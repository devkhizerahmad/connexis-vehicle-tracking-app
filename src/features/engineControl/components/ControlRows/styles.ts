// styles.ts — S7: "Control Vehicle" card (gradient header + rows + swipe rail).
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): same INSET, ROUNDED,
// SHADOWED treatment as every other card on the screen. The light-grey rounded
// rows inside already match the reference and are unchanged.
import { StyleSheet } from 'react-native';
import { ecCardRadius, ecColors, ecShadow, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: ecSizes.gutter,
    backgroundColor: ecColors.card,
    borderRadius: ecCardRadius,
    paddingHorizontal: ecSizes.controlCardPadH,
    paddingBottom: 8,
    // NEW design language: shadows are back on every card.
    ...ecShadow,
  },
  /**
   * HEADER-ATTACH: the card pads its content, which used to inset the gradient
   * header bar by `controlCardPadH` on each side — so the bar floated inside the
   * card with a white seam and a corner-radius that did not line up with the
   * card's. Bleeding it back out by that same amount makes it span the full card
   * width and share the card's top corners; its bottom stays square/flush.
   */
  barWrap: {
    marginHorizontal: -ecSizes.controlCardPadH,
  },
  /** Inner gutter: rows sit at x=48..676 px inside the x=26..697 px card. */
  row: {
    height: ecSizes.controlRowH,
    marginTop: 5,
    borderRadius: ecSizes.radiusSm,
    backgroundColor: ecColors.rowBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ecSizes.controlRowPadH,
  },
  rowIcon: {
    marginRight: 10,
  },
  rowLabel: {
    flex: 1,
    color: ecColors.rowInk,
    fontSize: 13.5,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;
