// styles.ts — S10: "Slide to Proceed" navy pill (1659..1723 px → 35 pt).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

/**
 * PATCH S10-ANIM: the drag knob's geometry. It is inset from the pill's edge so
 * it clears the capsule's curve, which leaves `slideH - KNOB_INSET * 2` of
 * horizontal travel for the drag — the distance the threshold is measured over.
 */
export const KNOB_INSET = 6;
export const KNOB = ecSizes.slideH - KNOB_INSET * 2;

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
  /**
   * PATCH S10-ANIM: the trail behind the drag. It is 0 wide at rest, so the
   * pill the artboard draws (flat navy, no thumb) is what renders until the
   * user actually starts sliding.
   */
  trail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: ecColors.slideTrail,
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
  /**
   * PATCH S10-ANIM: the knob. The artboard shows no thumb, so it rides at
   * opacity 0 and is only faded in while a drag is live.
   */
  knob: {
    position: 'absolute',
    left: KNOB_INSET,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: ecColors.slideKnob,
  },
});

export default styles;
