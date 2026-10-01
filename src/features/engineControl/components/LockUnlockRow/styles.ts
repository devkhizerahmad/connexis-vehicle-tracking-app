// styles.ts — S8: Lock / Unlock card pair (1535..1603 px → 37 pt).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 3,
  },
  card: {
    flex: 1,
    height: ecSizes.actionCardH,
    borderRadius: ecSizes.radiusSm,
    backgroundColor: ecColors.card,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Unlock card sits to the right of the Lock card with an 11 pt seam. */
  cardRight: {
    marginLeft: ecSizes.actionCardGap,
  },
  /** Reference: the Unlock card carries a pale blue tint under its blue border. */
  unlockFill: {
    backgroundColor: ecColors.unlockBg,
  },
  lockBorder: {
    borderColor: ecColors.lockBorder,
  },
  unlockBorder: {
    borderColor: ecColors.unlockBorder,
  },
  /** Glyph stacks above the label, both centred (reference S8). */
  glyph: {
    marginBottom: 2,
  },
  label: {
    color: ecColors.actionInk,
    fontSize: 13.5,
    fontWeight: '600',
  },
  lockLabel: {
    color: ecColors.lockInk,
  },
  unlockLabel: {
    color: ecColors.unlockInk,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;
