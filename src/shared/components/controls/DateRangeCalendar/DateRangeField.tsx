// DateRangeField.tsx — S3: the "Select Date & Time" trigger that opens the
// react-native-paper-dates range modal.
// PATCH T-HISTORY (reference match):
//   * the reference has NO leading calendar glyph — the 📅 emoji was removed;
//   * the trailing affordance is a thin V chevron (ChevronDown), not the filled ▾;
//   * the field keeps its "Select Date & Time" caption even once a range exists
//     (the reference shows the caption, the range itself lives in the calendar).
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ChevronDown } from '@shared/components/icons';
import { colors, historySizes, radii } from '@shared/theme';

export interface DateRangeFieldProps {
  /** Trigger caption; defaults to the reference copy. */
  label?: string;
  /** Optional confirmed range read-out (kept in the a11y label, not on screen). */
  value?: string;
  onPress: () => void;
}

export const DateRangeField = ({
  label = 'Select Date & Time',
  value,
  onPress,
}: DateRangeFieldProps) => (
  <Pressable
    style={styles.field}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={value ? `${label}: ${value}` : label}
    testID="date-range-field">
    <Text style={styles.label} numberOfLines={1}>
      {label}
    </Text>
    <ChevronDown color={colors.text.primary} size={14} />
  </Pressable>
);

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: historySizes.filterFieldH,
    paddingHorizontal: 14,
    backgroundColor: colors.surface.card,
    borderRadius: radii.button,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.surface.border,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
  },
});

export default DateRangeField;
