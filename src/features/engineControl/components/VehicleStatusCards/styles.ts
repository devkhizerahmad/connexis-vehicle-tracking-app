// styles.ts — S2: ONE inset, rounded, shadowed vehicle + status card.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): the previous PHASE-1
// language — a FLAT, EDGE-TO-EDGE, SQUARE, SHADOW-FREE plane attached under the
// header — is VOID. The new artboard draws an INSET WHITE ROUNDED CARD WITH A
// SOFT SHADOW, a light-grey caption PILL under the van reading
// "Vehicle No: <plate>", a hairline column divider, and a rounded red
// "Out of Fence" pill that is inset rather than flush in the corner.
//
// The "Running" row keeps its explicit lineHeight + `overflow: visible` so the
// descender of "g" is never clipped (that fix is unaffected by the redesign).
import { StyleSheet } from 'react-native';
import { ecCardRadius, ecColors, ecShadow, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  /**
   * The inset card: rounded corners + soft shadow on all four sides.
   *
   * LIVE CORRECTION (C3): the card is now a COLUMN — the vehicle + live-status
   * body on top and the pink geofence alert as its BOTTOM footer. The card's own
   * padding moved onto `body` so the footer can run edge-to-edge and sit flush
   * with the card's bottom corners.
   */
  card: {
    flexDirection: 'column',
    marginHorizontal: ecSizes.pageGutter,
    backgroundColor: ecColors.card,
    borderRadius: ecCardRadius,
    // NEW design language: shadows are back on every card.
    ...ecShadow,
  },
  /** The identity | status row that sits above the alert footer. */
  body: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  /** Left column — van photo + the caption pill. */
  identity: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 10,
  },
  /** Hairline that splits the identity and status halves of the card. */
  divider: {
    width: 1,
    backgroundColor: ecColors.cardBorder,
    marginVertical: 4,
  },
  car: {
    width: ecSizes.carW,
    height: ecSizes.carH,
    alignSelf: 'center',
  },
  /**
   * S2 caption: a light-grey ROUNDED PILL holding a grey "Vehicle No:" label
   * and the BOLD plate. Values are the mock's own, verbatim.
   */
  caption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'center',
    backgroundColor: ecColors.rowBg,
    borderRadius: ecSizes.radiusChip,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  captionLabel: {
    color: ecColors.captionInk,
    fontSize: 9.5,
  },
  captionValue: {
    color: ecColors.nameInk,
    fontSize: 10.5,
    fontWeight: '700',
    marginLeft: 4,
  },
  /**
   * The live-status column, right half. It is a normal flex column now — no
   * reserved top band — because the red pill is no longer absolutely flush to
   * the card's corner.
   */
  statusCol: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  /**
   * S2 "Out of Fence": a rounded red pill INSET inside the card (the flush,
   * square, corner-anchored badge of the old flat language is VOID). It fills
   * the status column and carries the target glyph on the left and the
   * external-link arrow on the right.
   */
  fencePill: {
    alignSelf: 'stretch',
    height: ecSizes.pillH,
    borderRadius: ecSizes.radiusSm,
    backgroundColor: ecColors.fencePillBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  fencePillLeading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fencePillText: {
    color: ecColors.fencePillInk,
    fontSize: 12.5,
    fontWeight: '700',
  },
  fencePillIcon: {
    marginLeft: 6,
  },
  /**
   * "Running" leads with a GREEN DOT (the reference), not the old play
   * triangle. `overflow: visible` + the explicit lineHeight keep the "g"
   * descender from being clipped.
   */
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
    marginBottom: 4,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: ecColors.runningGreen,
    marginRight: 7,
  },
  statusText: {
    color: ecColors.statusInk,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    overflow: 'visible',
  },
  /** Address block: leading pin glyph + the two mock address lines. */
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    marginTop: 1,
    marginRight: 4,
  },
  addressLines: {
    flex: 1,
  },
  address: {
    color: ecColors.addressInk,
    fontSize: 11.5,
    lineHeight: ecSizes.addressLineH,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;