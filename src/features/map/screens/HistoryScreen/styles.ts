// styles.ts — HistoryScreen layout (S2 chip row, list gutters, S9 section bar).
import { StyleSheet } from 'react-native';
import { colors } from '@shared/theme';
import {
  ecCardRadius,
  ecShadow,
  historyColors,
  historySizes,
} from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  /**
   * PATCH T-HISTORY (route card): the rows no longer live in the screen-wide
   * list — they sit inside an inset card (see `cardOuter`/`card`), so this is a
   * plain scroller and the card owns the rounding + clipping.
   */
  list: {
    flex: 1,
  },
  listContent: {
    // V5-PART1: paddingBottom is applied dynamically in HistoryScreen as
    // `sizes.bottomNav + insets.bottom + 12` — the shared BottomNav is an absolute
    // overlay, so a constant here would let the last history row sit under it.
  },
  /**
   * S9 route card. Same chrome as the Engine Control "Driving Routes" card:
   * the OUTER shell carries the shadow (so the blur is never cut by a clip) and
   * the INNER card rounds + clips the section bar and the rows.
   */
  cardOuter: {
    marginHorizontal: historySizes.gutter,
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: ecCardRadius,
    ...ecShadow,
  },
  card: {
    overflow: 'hidden',
    borderRadius: ecCardRadius,
    backgroundColor: colors.white,
  },
  /** S2–S8 stack above the S9 list. */
  header: {
    paddingHorizontal: historySizes.gutter,
    paddingTop: 10,
    gap: 10,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: historySizes.vehicleChipH,
    paddingHorizontal: 10,
    // PATCH T-HISTORY: the reference chip is a rounded rect (~7pt), not a full pill
    borderRadius: 8,
    backgroundColor: historyColors.chipBg,
    maxWidth: '68%',
  },
  vehiclePhoto: {
    // PATCH T-HISTORY: the reference car photo fills most of the chip height
    width: historySizes.vehiclePhotoW,
    height: historySizes.vehiclePhotoH,
    resizeMode: 'contain',
  },
  vehicleName: {
    color: historyColors.chipInk,
    fontSize: 13,
    fontWeight: '700',
  },
  viewLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  viewLiveText: {
    color: historyColors.viewLiveInk,
    fontSize: 13,
  },
  /**
   * S3–S4 collapse (DEFECT 5): the calendar stays mounted and only this
   * in-flow wrapper changes size, mirroring Reports' `collapseWrap`. `overflow:
   * hidden` clips the still-mounted calendar at height 0 so collapsing never
   * unmounts and re-opening always has content to reveal.
   */
  collapseWrap: {
    overflow: 'hidden',
  },
  /**
   * PATCH T-HISTORY (route card): the dark "History" bar is now the card's top
   * row, so it is square and the CARD clips it to `ecCardRadius` (its own radii
   * would leave white slivers in the corners).
   */
  sectionBar: {
    paddingHorizontal: 12,
    height: historySizes.panelTitleH,
    justifyContent: 'center',
    backgroundColor: historyColors.sectionBarBg,
  },
  sectionBarText: {
    color: historyColors.sectionBarInk,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default styles;
