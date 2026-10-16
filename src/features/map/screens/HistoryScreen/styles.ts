// styles.ts — HistoryScreen layout (S2 chip row, list gutters, S9 section bar).
import { StyleSheet } from 'react-native';
import { colors } from '@shared/theme';
import { historyColors, historySizes, radii } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  /**
   * PATCH UI-POLISH (PART 8): the history list is the tail of the rounded S9
   * block, so it closes the bottom corners that `sectionBar` opened at the top.
   * `overflow: hidden` clips the virtualised rows to the radius.
   */
  list: {
    flex: 1,
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
    overflow: 'hidden',
  },
  listContent: {
    // V5-PART1: paddingBottom is applied dynamically in HistoryScreen as
    // `sizes.bottomNav + insets.bottom + 12` — the shared BottomNav is an absolute
    // overlay, so a constant here would let the last history row sit under it.
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
   * PATCH UI-POLISH (PART 8): S9 dark section header now carries `radii.md` on
   * its top corners, matching the Playback title strip above it. `overflow:
   * hidden` clips the bar to them.
   */
  sectionBar: {
    paddingHorizontal: 12,
    height: historySizes.panelTitleH,
    justifyContent: 'center',
    backgroundColor: historyColors.sectionBarBg,
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    overflow: 'hidden',
  },
  sectionBarText: {
    color: historyColors.sectionBarInk,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default styles;
