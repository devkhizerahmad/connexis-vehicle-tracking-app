// styles.ts — the app-owned chrome around the shared calendar: the dark card
// surface and the FROM / UNTIL read-out chips.
//
// The LIBRARY's look (day cells, band, weekday row, header, month/year
// selectors) is themed in `theme.ts` — this file only styles what the app
// owns.
//
// The old "S M T W T F S" weekday override, the navy-disc chevrons, the
// `days` height hack and the card's `overflow: 'hidden'` clip are all GONE: the
// demo (`design-references/date range ui.png`) is the library's own stock
// render, and the clip is what used to cut the grid into a black bar.
import { StyleSheet } from 'react-native';
import { reportColors } from '@shared/theme';

/** S4 card + read-out chrome owned by this component (not the library). */
export const styles = StyleSheet.create({
  /**
   * The calendar card. It deliberately carries NO `marginHorizontal` — a shared
   * control must not impose a page gutter, its host owns the page rhythm.
   * It also carries NO `overflow: 'hidden'`: clipping the library's grid is what
   * produced the black bar under the last week.
   */
  card: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: reportColors.calBg,
  },
  /**
   * FROM / UNTIL read-out — the selection summary, above the calendar. Two
   * columns, each a muted label over a white chip (the same white-chip language
   * the demo's selected days use). An unset side shows an em dash.
   */
  readout: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  readoutCol: {
    flex: 1,
  },
  readoutLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: reportColors.calLabel,
    marginBottom: 4,
  },
  /**
   * The UNTIL label is right-aligned so it sits DIRECTLY ABOVE its chip, the
   * mirror of FROM (label + chip both flush left). Without this the label
   * stranded itself at the left edge of the right-hand column while its chip
   * sat flush right, so the two did not read as one block.
   */
  readoutLabelUntil: {
    textAlign: 'right',
  },
  readoutValue: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: reportColors.dayStartBg,
    fontSize: 12.5,
    fontWeight: '700',
    color: reportColors.dayStartInk,
  },
  readoutValueUntil: {
    alignSelf: 'flex-end',
  },
});
