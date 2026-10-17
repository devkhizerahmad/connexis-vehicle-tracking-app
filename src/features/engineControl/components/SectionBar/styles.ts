// styles.ts — S6/S7 section bar: dark maroon gradient with a diagonal red block.
//
// PHASE-1 (P7): `barEdge` / `redBlockEdge` / `titleEdge` are the SHARP, toned-down
// variants used by the Phase-1 "Driving Routes" bar. The default entries are the
// original rounded / full-swoosh / 14 pt styles and stay in place for the
// Phase-2 "Control Vehicle" bar.
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
  /** P7: no top rounding — the card under this bar is flat (radius 0). */
  barEdge: {
    borderTopLeftRadius: ecSizes.flat,
    borderTopRightRadius: ecSizes.flat,
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
  /**
   * P7: the Phase-1 bar keeps the diagonal DIRECTION and lands just right of the
   * title. Measured off the reference bar (dark x 25..282, red x 133..277) the
   * red block covers ~56% of the bar; the old 54% plus its -12 deg over-size read
   * as a slab reaching into the title, so the Phase-1 bar pulls it back to 38%.
   */
  redBlockEdge: {
    position: 'absolute',
    top: -14,
    bottom: -14,
    right: -12,
    width: '38%',
    transform: [{ rotate: '-12deg' }],
  },
  title: {
    color: ecColors.barInk,
    fontSize: 14,
    fontWeight: '700',
    paddingLeft: 14,
  },
  /** P7: smaller and semi-bold (14/700 -> 12.5/600). */
  titleEdge: {
    fontSize: ecSizes.barTitleSize,
    fontWeight: '600',
  },
});

export default styles;