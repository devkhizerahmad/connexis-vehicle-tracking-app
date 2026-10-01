// styles.ts — S7: "Control Vehicle" card (header bar + 2 tappable rows).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: ecSizes.gutter,
    backgroundColor: ecColors.card,
    borderRadius: ecSizes.cardRadius,
    paddingHorizontal: 12,
    paddingBottom: 8,
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
