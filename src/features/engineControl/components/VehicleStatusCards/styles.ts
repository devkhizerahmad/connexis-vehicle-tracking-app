// styles.ts — S2: vehicle identity card (left) + live status card (right).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: ecSizes.vehicleGutter,
  },
  /** Left card: car photo + "Car | <model>" caption (160..352 px → 103 pt). */
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
  /** Right card: fence pill + hero status + 2-line address (163 x 107 pt). */
  statusCard: {
    width: ecSizes.statusCardW,
    marginLeft: ecSizes.vehicleCardGap,
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
