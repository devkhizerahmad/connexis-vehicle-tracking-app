// styles.ts — S6/S7 section bar: dark maroon gradient with a diagonal red block.
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  bar: {
    height: ecSizes.barH,
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: ecSizes.cardRadius,
    borderTopRightRadius: ecSizes.cardRadius,
  },
  /**
   * Full-bleed dark base. Written out longhand because this RN version's
   * generated types no longer expose `StyleSheet.absoluteFillObject`.
   */
  darkFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  /**
   * Bright-red block, over-sized then rotated: the left edge reads as the
   * reference's diagonal seam while `overflow: hidden` clips it to the bar.
   */
  redBlock: {
    position: 'absolute',
    top: -14,
    bottom: -14,
    right: -12,
    width: '54%',
    transform: [{ rotate: '-12deg' }],
  },
  title: {
    color: ecColors.barInk,
    fontSize: 14,
    fontWeight: '700',
    paddingLeft: 14,
  },
});

export default styles;
