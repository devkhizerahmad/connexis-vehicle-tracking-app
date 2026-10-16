// styles.ts — shared S4 dark range calendar.
//
// ONE visual language for BOTH History and Reports (unified on the Reports
// reference, which is the richer artboard): an inset rounded card, a
// FROM-left / UNTIL-right read-out, the library's own month+year caption, a
// pink weekday row and per-cell rounded range highlights.
//
// FLAG — UI-FREEZE EXCEPTION (calendar container only, both screens):
// History's S4 previously used its own geometry (full-bleed #1E2128 panel, no
// radius, 44pt day pitch, 12pt weekday letters, a continuous range band, plus a
// tooltip triangle under the S3 field). Unifying both screens onto one shared
// component moves History onto the tokens below, so History's calendar container
// is INTENTIONALLY not pixel-identical to its previous rest state. Nothing
// outside the S4 calendar container is touched on either screen.
//
// Tokens come from the Reports palette because that palette is now the shared
// calendar's source of truth; the frozen History palette in `theme/history.ts`
// stays byte-identical for every other History section.
import { StyleSheet } from 'react-native';
import { reportColors, reportSizes } from '@shared/theme';

/** S4 card + read-out chrome owned by this component (not the library). */
export const styles = StyleSheet.create({
  /**
   * DEFECT 4 (alignment): this card deliberately carries NO `marginHorizontal`.
   *
   * A shared control must not impose a page gutter — its host owns the page
   * rhythm. Reports hosts it inside `scrollContent` (no horizontal padding), so
   * it wrapped the calendar in a `marginHorizontal: gutter` block; the pixels
   * there are unchanged. History hosts it inside `styles.header`, which ALREADY
   * pads by `historySizes.gutter` for S2–S9, so the card's own margin stacked on
   * top and inset the calendar to 32dp while the "Select Date & Time" field
   * above it stayed at 16dp. Measured on device before the fix (390dp wide):
   * field left/right 16dp, calendar left/right 32dp. Owning the margin per host
   * is what makes both align again.
   *
   * `overflow: hidden` (DEFECTS 2+3) clips the library's day grid, whose
   * container is intrinsically taller than the box it is given — see the
   * `days` override below.
   */
  card: {
    marginTop: 8,
    padding: 12,
    borderRadius: 4,
    backgroundColor: reportColors.calBg,
    overflow: 'hidden',
  },
  readout: {
    height: reportSizes.calHeaderH,
    flexDirection: 'row',
  },
  readoutCol: {
    flex: 1,
    justifyContent: 'center',
  },
  readoutLabel: {
    fontSize: 8,
    color: reportColors.calLabel,
  },
  readoutValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '700',
    color: reportColors.calValue,
    textDecorationLine: 'underline',
  },
  readoutValueUntil: {
    color: reportColors.calValueDim,
    textAlign: 'right',
  },
  navButton: {
    width: reportSizes.calNavBtn,
    height: reportSizes.calNavBtn,
    borderRadius: reportSizes.calNavBtn / 2,
    backgroundColor: reportColors.calMonthArrowBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 10,
    lineHeight: 12,
    color: reportColors.calMonthInk,
  },
  /**
   * DEFECT 1: the library hands the whole weekday cell to `components.Weekday`,
   * so it never applies `weekday_label` — the replacement Text has to carry the
   * type itself. Matches the reference's 8pt pink letters.
   */
  weekdayLabel: {
    fontSize: 8,
    color: reportColors.weekdayPink,
  },
});

/**
 * `react-native-ui-datepicker` theme overrides.
 *
 * The library does NOT merge `styles` over its own defaults — whatever is passed
 * becomes the resolved theme — so the component layers this on top of
 * `useDefaultStyles('dark')`. Keys are the library's real enum names
 * (`day_label`, `weekday_label`, `button_prev`, `range_start`, ...).
 *
 * `range_fill` is deliberately TRANSPARENT: the reference paints each selected
 * day as its own rounded cell rather than a full-bleed band, so the per-cell
 * `range_start` / `range_middle` / `range_end` fills carry the whole highlight
 * and nothing bleeds past the card's rounded corners.
 */
export const calendarOverrides = StyleSheet.create({
  /**
   * DEFECTS 2 + 3 (black bar / stray bottom edge).
   *
   * The library nests three boxes: `Calendar` gives the body a fixed
   * `height: containerHeight`; `Days` fills that box; inside `Days` sit the
   * weekday row (height `weekdaysHeight`) AND the day grid, whose container is
   * `height: '100%'` — i.e. the FULL body height again. So the children total
   * `containerHeight + weekdaysHeight` and always overhang the parent by exactly
   * `weekdaysHeight`, which is what painted the dark bar under the last week.
   *
   * This height therefore cannot be fixed by changing `containerHeight` (the
   * overhang is constant regardless of its value). The grid has to be pinned to
   * the space actually left after the weekday row:
   *     containerHeight - weekdaysHeight = calDayRowH * 6
   * which is also exactly 6 rows at the reference's day pitch.
   */
  days: {
    height: reportSizes.calDayRowH * 6,
    backgroundColor: reportColors.calBg,
  },
  day_cell: {
    padding: 0,
  },
  day: {
    width: '86%',
    height: '86%',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day_label: {
    fontSize: 11,
    color: reportColors.dayInk,
  },
  outside_label: {
    color: reportColors.calValueDim,
  },

  // "Today" is never part of a frozen reference; keep it invisible so it can
  // never be mistaken for a selection highlight.
  today: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  today_label: {
    color: reportColors.dayInk,
  },

  // Single-day selection (start === end renders no range, only `selected`).
  selected: {
    backgroundColor: reportColors.dayBlueBg,
    borderRadius: 4,
  },
  selected_label: {
    color: reportColors.dayBlueInk,
    fontWeight: '700',
  },

  // Contiguous range: white start cell, blue run through the end cell.
  range_start: {
    backgroundColor: reportColors.dayStartBg,
    borderRadius: 4,
  },
  range_start_label: {
    color: reportColors.dayStartInk,
    fontWeight: '700',
  },
  range_middle: {
    backgroundColor: reportColors.dayBlueBg,
  },
  range_middle_label: {
    color: reportColors.dayBlueInk,
  },
  range_end: {
    backgroundColor: reportColors.dayBlueBg,
    borderRadius: 4,
  },
  range_end_label: {
    color: reportColors.dayBlueInk,
  },
  range_fill: {
    backgroundColor: 'transparent',
  },

  weekday_label: {
    fontSize: 8,
    textTransform: 'none',
    color: reportColors.weekdayPink,
  },
  month_selector_label: {
    fontSize: 12,
    fontWeight: '400',
    color: reportColors.calMonthInk,
  },
  year_selector_label: {
    fontSize: 12,
    fontWeight: '400',
    color: reportColors.calMonthInk,
  },

  header: {
    marginBottom: 0,
    paddingVertical: 0,
  },

  // The library wraps each chevron in an `iconContainer` that carries
  // `padding: 4` + a 3pt side margin; the override neutralises both so the
  // button reads as the reference's 22pt navy disc.
  button_prev: {
    width: reportSizes.calNavBtn,
    height: reportSizes.calNavBtn,
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: reportSizes.calNavBtn / 2,
    backgroundColor: reportColors.calMonthArrowBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_next: {
    width: reportSizes.calNavBtn,
    height: reportSizes.calNavBtn,
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: reportSizes.calNavBtn / 2,
    backgroundColor: reportColors.calMonthArrowBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/** Geometry the library takes as plain numbers rather than as styles. */
export const calendarMetrics = {
  /**
   * The library derives each day row's `minHeight` as
   * `(containerHeight - weekdaysHeight) / 6`, so these two together reproduce
   * the reference's 32pt day pitch exactly.
   */
  containerHeight: reportSizes.calDayRowH * 6 + reportSizes.calWeekdayH,
  weekdaysHeight: reportSizes.calWeekdayH,
} as const;