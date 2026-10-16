// styles.ts — S2: vehicle identity card (left) + live status card (right).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  /**
 * PATCH UI-POLISH (PART 7): the two boxes now share one height and one width
 * split. This row used to be `alignItems: 'flex-start'` with a FIXED-width
 * right card (163pt), so the left box measured ~103pt tall against the right's
 * ~92pt and they visibly disagreed at both the top and bottom edges.
 *
 * `stretch` + `flex: 1` on both makes them resolve to the taller of the two, and
 * the gap is a real 12pt instead of the old 2pt sliver.
 */
row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    paddingHorizontal: ecSizes.vehicleGutter,
  },
  /**
   * Left card: car photo + "Car | <model>" caption. Content is centred so the
   * photo and caption sit balanced inside whatever height the row resolves to.
   */
  vehicleCard: {
    flex: 1,
    backgroundColor: ecColors.card,
    borderRadius: ecSizes.cardRadius,
    borderWidth: 1,
    borderColor: ecColors.cardBorder,
    paddingTop: ecSizes.vehicleCardTopPad,
    paddingBottom: ecSizes.vehicleCardTopPad,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  car: {
    width: ecSizes.carW,
    height: ecSizes.carH,
  },
  caption: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ecSizes.captionH,
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingLeft: 4,
  },
  captionPrefix: {
    color: ecColors.captionInk,
    fontSize: 10,
    fontWeight: '400',
  },
  captionName: {
    color: ecColors.nameInk,
    fontSize: 11,
    fontWeight: '700',
  },
  /**
   * Right card: fence pill + hero status + address. PATCH UI-POLISH (PART 7):
   * fixed `width: statusCardW` (163) replaced with `flex: 1` so it matches the
   * left card's width AND height; the row's `gap: 12` supplies the separation,
   * so the old `marginLeft: vehicleCardGap` (2pt) is gone.
   */
  statusCard: {
    flex: 1,
    backgroundColor: ecColors.card,
    borderRadius: ecSizes.cardRadius,
    borderWidth: 1,
    borderColor: ecColors.cardBorder,
    // The pill is flush with the card's top border and only 1 pt away from its
    // right border (reference: 12 pt left inset, 2 pt right inset).
    paddingLeft: 11,
    paddingRight: 1,
    paddingTop: 0,
    paddingBottom: 10,
  },
  /**
   * F3: the pill stretches to the card's content width (matching the reference
   * where it nearly fills the card) and distributes its three children with
   * `space-between`: camera-lock | label | external-link. The label itself is
   * NOT flex-sized, so it can never be ellipsised mid-word.
   */
  fencePill: {
    height: ecSizes.pillH,
    borderRadius: ecSizes.pillRadius,
    backgroundColor: ecColors.fencePillBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  fencePillText: {
    color: ecColors.fencePillInk,
    fontSize: 13.5,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ecSizes.statusRowH,
    marginTop: 7,
  },
  /** F4: right-pointing play triangle wrapper (fixed frame, centred). */
  flag: {
    width: 16,
    height: 16,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: ecColors.statusInk,
    fontSize: 19,
    fontWeight: '700',
  },
  address: {
    color: ecColors.addressInk,
    fontSize: 12.5,
    lineHeight: ecSizes.addressLineH,
    marginLeft: ecSizes.addressIndent,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;
