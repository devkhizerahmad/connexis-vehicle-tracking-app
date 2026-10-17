// styles.ts — S2: ONE flat, edge-to-edge vehicle + status card.
//
// PHASE-1 DESIGN LANGUAGE (P1): this used to be TWO inset rounded boxes (a left
// "car card" and a right "status card"), each with its own 10 pt radius, 1 pt
// border and a 12 pt gutter between them, inside a row that itself carried an
// 11 pt horizontal margin. The reference has ONE white plane that runs the full
// page width, is attached directly under the header, and is SQUARE — no radius,
// no border, no shadow. The red "Out of Fence" badge is not a pill inside a
// card: it is flush against that plane's top-RIGHT corner.
//
// PHASE-1 (P2): the "Running" row was a fixed 24 pt box wrapping 19 pt text, so
// the descender of "g" was clipped. The row now owns its lineHeight and does not
// clip (`overflow: visible` on both the row and the Text).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  /**
   * The single flat plane. No radius, no border, no shadow, no horizontal
   * margin — P1/P7 edge-to-edge. Its only padding is INSIDE, so the badge can
   * sit flush in the corner while the identity/status columns stay indented.
   */
  card: {
    flexDirection: 'row',
    backgroundColor: ecColors.card,
    paddingHorizontal: ecSizes.vehicleCardPadH,
    paddingBottom: ecSizes.vehicleCardPadV,
  },
  /**
   * P1: the identity column (car photo + "Last Updated" caption). Its top band is
   * left empty because the red badge owns that band — matching the reference,
   * where the photo starts BELOW the badge's bottom edge.
   */
  identity: {
    flex: 1,
    paddingTop: ecSizes.pillH + ecSizes.statusTopGap,
    alignItems: 'flex-start',
  },
  car: {
    width: ecSizes.carW,
    height: ecSizes.carH,
  },
  /**
   * P1: the caption is now the reference's "Last Updated <time>" — a GREY small
   * label followed by the BOLD time, laid out inline and left-aligned under the
   * photo. The value is still the mock's; only the text/weight split changed.
   */
  caption: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  captionLabel: {
    color: ecColors.captionInk,
    fontSize: 8.5,
  },
  captionValue: {
    color: ecColors.nameInk,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  /**
   * The live-status column, right half. Same reserved top band as the identity
   * column so "Running" clears the absolutely-placed badge.
   */
  statusCol: {
    flex: 1,
    paddingTop: ecSizes.pillH + ecSizes.statusTopGap,
    paddingLeft: ecSizes.flagSize + ecSizes.flagGap,
  },
  /**
   * P3: "Out of Fence" — flush top-right of the card, SQUARE, and carrying only
   * the label + the external-link arrow. The camera-lock glyph that used to sit
   * on the left of this badge is gone (P3): it read as a camera/Instagram mark
   * and is not in the reference.
   */
  fencePill: {
    position: 'absolute',
    top: ecSizes.flat,
    right: ecSizes.flat,
    height: ecSizes.pillH,
    borderRadius: ecSizes.flat,
    backgroundColor: ecColors.fencePillBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  fencePillText: {
    color: ecColors.fencePillInk,
    fontSize: 12,
    fontWeight: '700',
  },
  fencePillIcon: {
    marginLeft: 5,
  },
  /**
   * P2 + P8: no fixed height and no clipping — the row simply grows to its
   * content, so the "g" descender in "Running" is never cut.
   */
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
  flag: {
    width: ecSizes.flagSize,
    height: ecSizes.flagSize,
    marginRight: ecSizes.flagGap,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /**
   * P2: an explicit lineHeight taller than the glyph box, plus
   * `overflow: visible`. P8: 19 -> 16.5 pt (≈13% down).
   */
  statusText: {
    color: ecColors.statusInk,
    fontSize: 16.5,
    lineHeight: 22,
    fontWeight: '700',
    overflow: 'visible',
  },
  address: {
    color: ecColors.addressInk,
    fontSize: 11.5,
    lineHeight: ecSizes.addressLineH,
    marginLeft: ecSizes.addressIndent,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;