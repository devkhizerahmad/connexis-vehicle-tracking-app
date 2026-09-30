// SelectField index.tsx — S2/S3 "Select Vehicle" / "Select Date & Time" trigger.
// PATCH T-REPORTS: the RESERVED 10pt token sizing did not match the Reports
// reference (44pt white field, 14pt #333 caption, V-chevron 14pt, padH 14), so
// the geometry is restated here. The component is intentionally *generic*: the
// screen owns the open/closed state and the selected label, so the same
// primitive serves both S2 (dropdown list) and S3 (collapsible toggle).
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from '@shared/components/icons';
import { reportColors, reportSizes, shadows, spacing } from '@shared/theme';

/** One row of the S2 dropdown. */
export interface SelectFieldOption {
  id: string;
  label: string;
}

export interface SelectFieldProps {
  /** Caption shown inside the field (placeholder or the current selection). */
  label: string;
  onPress: () => void;
  /** S2 only: when provided the field renders its own inline option list. */
  options?: SelectFieldOption[];
  /** S2 only: id of the currently selected option. */
  selectedId?: string;
  /** S2 only: invoked with the tapped option. */
  onSelect?: (option: SelectFieldOption) => void;
  /** S3 only: draws the 8pt triangle that ties the field to the S4 calendar. */
  showPointer?: boolean;
  /**
   * S3 only: the collapse state of the body this field controls. The chevron
   * (0deg = open, 180deg = closed) and the pointer triangle both read THIS
   * value, so the header can never disagree with the body it controls.
   * Defaults to `true`, so S2 and any other caller keep the static chevron.
   */
  expanded?: boolean;
  testID?: string;
}

function SelectFieldBase({
  label,
  onPress,
  options,
  selectedId,
  onSelect,
  showPointer = false,
  expanded = true,
  testID,
}: SelectFieldProps) {
  const handleOption = useCallback(
    (option: SelectFieldOption) => {
      onSelect?.(option);
    },
    [onSelect],
  );

  // FIX 1 (S3 toggle): the chevron rotation is DERIVED from `expanded` — the same
  // value the S4–S6 body animates from — so the header and the body can never
  // disagree. Rotation is a transform, so it runs on the native driver; the
  // body itself must stay on the JS driver because it animates height.
  const chevronAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(chevronAnim, {
      toValue: expanded ? 1 : 0,
      duration: spacing.collapseMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [expanded, chevronAnim]);

  const rows = useMemo(
    () =>
      (options ?? []).map(option => (
        <Pressable
          key={option.id}
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => handleOption(option)}
          accessibilityRole="button"
          accessibilityState={{ selected: option.id === selectedId }}
          testID={testID ? `${testID}-option-${option.id}` : undefined}>
          <Text style={styles.optionText} numberOfLines={1}>
            {option.label}
          </Text>
        </Pressable>
      )),
    [options, selectedId, handleOption, testID],
  );

  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.field}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        testID={testID}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        {/* FIX 1: 0deg = open, 180deg = closed, driven by the same `expanded`
            value as the S4–S6 body. pointerEvents none so the whole row — label,
            empty space and chevron — is one tap target. */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              transform: [
                {
                  rotate: chevronAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}>
          <ChevronDown color={reportColors.fieldInk} size={14} />
        </Animated.View>
      </Pressable>

      {/* FIX 1: the pointer is the visual tie from S3 to the S4 calendar, so it is
          shown only while the calendar is actually revealed. Stays absolute and
          zero-size in the layout — purely decorative (FIX 2). */}
      {showPointer && expanded ? (
        <View
          style={styles.pointer}
          pointerEvents="none"
          testID={testID ? `${testID}-pointer` : undefined}
        />
      ) : null}

      {rows.length > 0 ? <View style={styles.menu}>{rows}</View> : null}
    </View>
  );
}

export const SelectField = memo(SelectFieldBase);
export default SelectField;

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: reportSizes.gutter,
  },
  field: {
    height: reportSizes.fieldH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderRadius: 4,
    backgroundColor: reportColors.fieldBg,
    // FIX 1: guarantee the Pressable fills the row so the ENTIRE S3 strip
    // (label + gap + chevron) is the tap target, not just the chevron.
    alignSelf: 'stretch',
    ...shadows.card,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: reportColors.fieldInk,
  },
  /** S3: small dark triangle sitting in the gap, pointing up at the field. */
  pointer: {
    position: 'absolute',
    top: reportSizes.fieldH,
    left: 24,
    width: 0,
    height: 0,
    borderLeftWidth: reportSizes.pointerSize,
    borderRightWidth: reportSizes.pointerSize,
    borderTopWidth: reportSizes.pointerSize,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: reportColors.fieldPointer,
  },
  menu: {
    backgroundColor: reportColors.fieldBg,
    borderRadius: 4,
    overflow: 'hidden',
    ...shadows.card,
    elevation: 6,
  },
  option: {
    height: reportSizes.fieldH,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  optionPressed: {
    backgroundColor: reportColors.chipDef,
  },
  optionText: {
    fontSize: 14,
    color: reportColors.fieldInk,
  },
});

