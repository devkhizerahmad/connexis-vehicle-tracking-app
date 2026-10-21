// theme.ts — the ONE calendar theme, shared by the range picker (History +
// Reports) and the single picker (Profile).
//
// The library's own DARK defaults ARE the clean demo look
// (`design-references/date range ui.png` + `single date ui.png`): near-black
// surface, near-white selection chip with dark text, a continuous dark-grey
// range band, "Su Mo Tu We Th Fr Sa" weekday row, plain "‹ October 2026 ›"
// header. So this file starts from `useDefaultStyles('dark')` and applies only
// the handful of deltas the demo actually needs.
//
// DELTA LIST (and why each one exists):
//   weekday_label.textTransform  the library default is UPPERCASE ("SU MO TU");
//                                    the demo is title case ("Su Mo Tu We Th Fr Sa")
//   weekday_label.color          app token (the demo's muted grey)
//   day_label.color              app token (the demo's light-grey day text)
//   outside_label.color          app token (the demo's dimmed outside days)
//   selected / range_start /
//   range_end                    the demo paints BOTH range end-points as WHITE
//                                    rounded chips with DARK text; the library
//                                    leaves range_start/range_end transparent so
//                                    only the band shows through
//   *_label colours              app tokens (dark ink on the white chips)
//   month/year_selector_label    app token + semibold (the demo's title weight)
//
// Everything else is left to the library — the old per-cell colour overrides,
// the weekday-format override, the `days` height hack, the navy-disc chevrons
// and the container/row height overrides are all GONE.
import { StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useDefaultStyles } from 'react-native-ui-datepicker';
import { reportColors } from '@shared/theme';

/** The demo-matching deltas, applied on top of the library's dark defaults. */
export const calendarOverrides = StyleSheet.create({
  weekday_label: {
    textTransform: 'none',
    color: reportColors.calLabel,
  },
  day_label: {
    color: reportColors.dayInk,
  },
  outside_label: {
    color: reportColors.calValueDim,
  },
  // Single-mode selection: a white chip with dark text (the demo's single card).
  selected: {
    backgroundColor: reportColors.dayStartBg,
    borderRadius: 5,
  },
  selected_label: {
    color: reportColors.dayStartInk,
    fontWeight: '700',
  },
  // Range end-points: BOTH ends are white chips (the demo's range card).
  range_start: {
    backgroundColor: reportColors.dayStartBg,
    borderRadius: 5,
  },
  range_start_label: {
    color: reportColors.dayStartInk,
    fontWeight: '700',
  },
  range_end: {
    backgroundColor: reportColors.dayStartBg,
    borderRadius: 5,
  },
  range_end_label: {
    color: reportColors.dayStartInk,
    fontWeight: '700',
  },
  // The header title ("October 2026") — the month and the year are SEPARATE
  // pressable buttons, so tapping either opens the library's own month / year
  // picker view.
  month_selector_label: {
    color: reportColors.calMonthInk,
    fontWeight: '600',
  },
  year_selector_label: {
    color: reportColors.calMonthInk,
    fontWeight: '600',
  },
});

/**
 * The resolved calendar theme.
 *
 * 'dark' is passed explicitly so the resolved theme does not depend on the
 * device's system appearance — the calendar must look identical on every unit.
 */
export function useCalendarTheme() {
  const libraryDefaults = useDefaultStyles('dark');
  return useMemo(
    () => ({ ...libraryDefaults, ...calendarOverrides }),
    [libraryDefaults],
  );
}
