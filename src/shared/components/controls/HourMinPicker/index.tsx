// HourMinPicker — S8: a labelled chip strip used for both the Hour and the
// Minute jump rows on the History playback panel.
// PATCH T-HISTORY (reference match):
//   * the reference flanks the strip with small caret buttons (◀ / ▶) that step
//     the selection, so the component takes an optional onStep;
//   * chips stretch to fill the row (flex: 1) instead of hugging their text;
//   * the active chip is the reference's red (#A31F2B) with white type.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CaretSolid } from '@shared/components/icons';
import { historyColors, historySizes } from '@shared/theme';

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
  /** Test hook for the row. */
  testID?: string;
}

export const HourMinPicker = ({
  label,
  options,
  selected,
  format = value => value,
  onSelect,
  testID,
}: HourMinPickerProps) => {
  const index = options.indexOf(selected);
  /** Step the selection by one chip; a no-op at the ends. */
  const step = (delta: number) => () => {
    const next = options[index + delta];
    if (next !== undefined) {
      onSelect?.(next);
    }
  };

  return (
    <View style={styles.row} testID={testID}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={styles.arrow}
        onPress={step(-1)}
        hitSlop={6}
        disabled={index <= 0}
        accessibilityLabel={`Previous ${label}`}
        testID={testID ? `${testID}-prev` : undefined}>
        <CaretSolid dir="left" color={historyColors.chipArrowInk} size={9} />
      </Pressable>
      <View style={styles.chips}>
        {options.map(option => {
          const active = option === selected;
          return (
            <Pressable
              key={option}
              style={[styles.chip, active ? styles.chipActive : null]}
              onPress={() => onSelect?.(option)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              testID={testID ? `${testID}-${option}` : undefined}>
              <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                {format(option)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable
        style={styles.arrow}
        onPress={step(1)}
        hitSlop={6}
        disabled={index < 0 || index >= options.length - 1}
        accessibilityLabel={`Next ${label}`}
        testID={testID ? `${testID}-next` : undefined}>
        <CaretSolid dir="right" color={historyColors.chipArrowInk} size={9} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    width: 32,
    fontSize: 12,
    color: historyColors.filterLabel,
  },
  arrow: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    flex: 1,
    height: historySizes.chipH,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    backgroundColor: historyColors.chipIdleBg,
  },
  chipActive: {
    backgroundColor: historyColors.chipActiveBg,
  },
  chipText: {
    fontSize: 12,
    color: historyColors.chipIdleInk,
  },
  chipTextActive: {
    color: historyColors.chipActiveInk,
  },
});

export default HourMinPicker;

