// HourMinPicker — S5/S6 on Reports, S8 on the History playback panel.
// PATCH T-HISTORY (reference match):
//   * the reference flanks the strip with small caret buttons (◀ / ▶) that step
//     the selection, so the component takes an optional onStep;
//   * chips stretch to fill the row (flex: 1) instead of hugging their text;
//   * the active chip is the reference's red (#A31F2B) with white type.
// PATCH T-REPORTS: added a `variant` prop. 'history' (the DEFAULT) keeps the
// frozen History geometry byte-identical; 'reports' restates the smaller Reports
// strip (22pt chips, 10pt type, #C62828 selection) sampled from the Reports
// reference. Reports reuses this component through the variant rather than
// forking a near-duplicate picker, so the two rows cannot drift apart.
import React, { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CaretSolid } from '@shared/components/icons';
import { historyColors, historySizes, reportColors, reportSizes } from '@shared/theme';

export type HourMinPickerVariant = 'history' | 'reports';

export interface HourMinPickerProps {
  /** Row caption, e.g. "Hour" or "Min". */
  label: string;
  /** Candidate values, e.g. ["1","2","3","4"]. */
  options: string[];
  /** Currently selected value. */
  selected: string;
  /** Renders a value for display; lets Hour append " AM" and Min stay bare. */
  format?: (value: string) => string;
  onSelect?: (value: string) => void;
  /** Geometry/palette switch; defaults to the frozen History presentation. */
  variant?: HourMinPickerVariant;
  /** Test hook for the row. */
  testID?: string;
}

interface VariantTokens {
  /** Fixed row height; `undefined` keeps the History row auto-sized. */
  rowH: number | undefined;
  labelW: number;
  labelSize: number;
  labelInk: string;
  arrowSize: number;
  arrowInk: string;
  arrowW: number;
  chipH: number;
  chipRadius: number;
  chipPadH: number;
  chipGap: number;
  chipFont: number;
  chipIdleBg: string;
  chipIdleInk: string;
  chipActiveBg: string;
  chipActiveInk: string;
}

/** Per-variant tokens. `history` MUST stay identical to the pre-Reports values. */
const VARIANTS: Record<HourMinPickerVariant, VariantTokens> = {
  history: {
    rowH: undefined,
    labelW: 32,
    labelSize: 12,
    labelInk: historyColors.filterLabel,
    arrowSize: 9,
    arrowInk: historyColors.chipArrowInk,
    arrowW: 16,
    chipH: historySizes.chipH,
    chipRadius: 3,
    chipPadH: 0,
    chipGap: 6,
    chipFont: 12,
    chipIdleBg: historyColors.chipIdleBg,
    chipIdleInk: historyColors.chipIdleInk,
    chipActiveBg: historyColors.chipActiveBg,
    chipActiveInk: historyColors.chipActiveInk,
  },
  reports: {
    rowH: reportSizes.pickerRowH,
    labelW: 40,
    labelSize: 11,
    labelInk: reportColors.pickerLabel,
    arrowSize: 8,
    arrowInk: reportColors.pickerArrow,
    arrowW: 12,
    chipH: reportSizes.chipH,
    chipRadius: 4,
    chipPadH: 10,
    chipGap: reportSizes.chipGap,
    chipFont: 10,
    chipIdleBg: reportColors.chipDef,
    chipIdleInk: reportColors.chipDefInk,
    chipActiveBg: reportColors.chipSel,
    chipActiveInk: reportColors.chipSelInk,
  },
};

function HourMinPickerBase({
  label,
  options,
  selected,
  format = value => value,
  onSelect,
  variant = 'history',
  testID,
}: HourMinPickerProps) {
  const v = VARIANTS[variant];
  const index = options.indexOf(selected);

  /** Step the selection by one chip; a no-op at the ends. */
  const step = useCallback(
    (delta: number) => () => {
      const next = options[index + delta];
      if (next !== undefined) {
        onSelect?.(next);
      }
    },
    [index, options, onSelect],
  );

  const stepPrev = useMemo(() => step(-1), [step]);
  const stepNext = useMemo(() => step(1), [step]);

  const chips = useMemo(
    () =>
      options.map(option => {
        const active = option === selected;
        return (
          <Pressable
            key={option}
            style={[
              styles.chip,
              { height: v.chipH, borderRadius: v.chipRadius, paddingHorizontal: v.chipPadH },
              active
                ? { backgroundColor: v.chipActiveBg }
                : { backgroundColor: v.chipIdleBg },
            ]}
            onPress={() => onSelect?.(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            testID={testID ? `${testID}-${option}` : undefined}>
            <Text
              style={[
                styles.chipText,
                { fontSize: v.chipFont },
                active ? { color: v.chipActiveInk } : { color: v.chipIdleInk },
              ]}>
              {format(option)}
            </Text>
          </Pressable>
        );
      }),
    [options, selected, format, onSelect, testID, v],
  );

  return (
    <View style={[styles.row, v.rowH ? { height: v.rowH } : null]} testID={testID}>
      <Text style={[styles.label, { width: v.labelW, fontSize: v.labelSize, color: v.labelInk }]}>
        {label}
      </Text>
      <Pressable
        style={[styles.arrow, { width: v.arrowW }]}
        onPress={stepPrev}
        hitSlop={6}
        disabled={index <= 0}
        accessibilityLabel={`Previous ${label}`}
        testID={testID ? `${testID}-prev` : undefined}>
        <CaretSolid dir="left" color={v.arrowInk} size={v.arrowSize} />
      </Pressable>
      <View style={[styles.chips, { gap: v.chipGap }]}>{chips}</View>
      <Pressable
        style={[styles.arrow, { width: v.arrowW }]}
        onPress={stepNext}
        hitSlop={6}
        disabled={index < 0 || index >= options.length - 1}
        accessibilityLabel={`Next ${label}`}
        testID={testID ? `${testID}-next` : undefined}>
        <CaretSolid dir="right" color={v.arrowInk} size={v.arrowSize} />
      </Pressable>
    </View>
  );
}

export const HourMinPicker = memo(HourMinPickerBase);
export default HourMinPicker;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 12,
  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flex: 1,
    flexDirection: 'row',
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
  },
});

