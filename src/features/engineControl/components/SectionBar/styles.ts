// styles.ts — S6/S7 section bar: dark maroon gradient with a diagonal red block.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): the bar sits on an INSET
// ROUNDED card, so it keeps ROUNDED TOP CORNERS and the full red swoosh. The
// PHASE-1 sharp variants (`barEdge` / `redBlockEdge` / `titleEdge`) belonged to
// the old flat design language and are gone with it.
import { StyleSheet } from 'react-native';
import { ecCardRadius, ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  bar: {
    height: ecSizes.barH,
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: ecCardRadius,
    borderTopRightRadius: ecCardRadius,
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
   * Title lockup, layered over both gradients. The 14 pt left inset lives HERE
   * (was on `title`), so a leading glyph and a bare title start on the same x.
   */
  content: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
  },
  /** Gap before the title when the bar carries a glyph. */
  iconSlot: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: ecColors.barInk,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default styles;