// styles.ts — ReportsScreen assembly (scroll gutters, picker rows, toast, avatar).
import { StyleSheet } from 'react-native';
import { colors, reportColors, reportSizes, sizes } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  /**
   * FIX 2 (scroll): paddingBottom was a CONSTANT 24 — never tuned per collapse state,
   * so collapsing the S4–S6 body reflowed the list upward with no ghost gap.
   *
   * V5-PART1: that constant was also what let the last category card sit underneath
   * the absolute BottomNav overlay at extreme scroll. paddingBottom is now applied
   * dynamically in ReportsScreen as `sizes.bottomNav + insets.bottom + 12` — still a
   * constant (collapse-independent), but sized to clear the bar.
   */
  scrollContent: {
    paddingTop: 16,
  },
  /** S2 / S3 field blocks: stacked with the reference's 8pt rhythm. */
  fieldBlock: {
    marginTop: 8,
  },
  /**
   * FIX 1 (S3 toggle): the S4–S6 body stays MOUNTED forever; this in-flow
   * wrapper is the only thing that changes size. `overflow: hidden` clips the
   * still-mounted children at height 0, so collapsing never unmounts and
   * re-opening always has content to reveal.
   */
  collapseWrap: {
    overflow: 'hidden',
  },
  /** S5 / S6 chip rows: full-bleed gutters, 10pt above each row. */
  pickerRow: {
    marginHorizontal: reportSizes.gutter,
    marginTop: 10,
  },
  /** S1 right slot avatar (32pt circle, same metric as the shared header's). */
  avatar: {
    width: sizes.avatar,
    height: sizes.avatar,
    borderRadius: sizes.avatar / 2,
  },
  toast: {
    position: 'absolute',
    left: reportSizes.gutter * 2,
    right: reportSizes.gutter * 2,
    bottom: 32,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: reportColors.toastBg,
    alignItems: 'center',
  },
  toastText: {
    color: reportColors.toastInk,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default styles;
