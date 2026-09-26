// SelectVehicleField.tsx — S2: 48pt "Select Vehicle" field + 4-option dropdown.
// Geometry per task spec S2 (h48/white/15pt #333 label/16pt chevron) — the shared
// SelectField (RESERVED, 10pt History/Reports filter sizing) doesn't carry this
// geometry, so this follows its TouchableOpacity pattern instead.
// PATCH L5: chevron is the V-shape ChevronDown (16pt #333, padR 14), not the filled ▾.
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ChevronDown } from '@shared/components/icons';
import { colors, shadows } from '@shared/theme';
import type { VehicleOption } from '@features/map/types/map';
import { styles as fieldStyles } from './styles';

export interface SelectVehicleFieldProps {
  /** Selected vehicle name; falls back to the "Select Vehicle" placeholder. */
  selectedName?: string;
  options: VehicleOption[];
  onSelect: (option: VehicleOption) => void;
}

const OPTION_H = 44;
const MENU_PAD_V = 4;
const MENU_GAP = 4;

function SelectVehicleFieldBase({ selectedName, options, onSelect }: SelectVehicleFieldProps) {
  const [open, setOpen] = useState(false);
  const { height: winH } = useWindowDimensions();

  const toggle = useCallback(() => setOpen(prev => !prev), []);
  const close = useCallback(() => setOpen(false), []);

  const handleSelect = useCallback(
    (option: VehicleOption) => {
      setOpen(false);
      onSelect(option);
    },
    [onSelect],
  );

  const items = useMemo(
    () =>
      options.map(option => (
        <Pressable
          key={option.id}
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => handleSelect(option)}>
          <Text style={styles.optionText} numberOfLines={1}>
            {option.name}
          </Text>
        </Pressable>
      )),
    [options, handleSelect],
  );

  return (
    <View style={fieldStyles.wrap}>
      <Pressable style={styles.field} onPress={toggle}>
        <Text style={styles.label} numberOfLines={1}>
          {selectedName ?? 'Select Vehicle'}
        </Text>
        <ChevronDown color={colors.text.score} size={16} />
      </Pressable>

      {open ? (
        <View
          pointerEvents="box-none"
          style={[styles.overlay, { height: winH }]}>
          {/* full-height scrim below the field: first tap outside closes (T3) */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={close}
            accessibilityLabel="Close vehicle list"
          />
          <View style={styles.menu}>
            {items}
          </View>
        </View>
      ) : null}
    </View>
  );
}

export const SelectVehicleField = memo(SelectVehicleFieldBase);
export default SelectVehicleField;

// dropdown geometry is screen-specific (T1 S2) — kept with the component
const styles = StyleSheet.create({
  field: {
    height: 48,
    backgroundColor: colors.white,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
    ...shadows.card,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: colors.text.score,
  },
  overlay: {
    position: 'absolute',
    top: 48 + MENU_GAP,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: MENU_PAD_V,
    ...shadows.card,
    elevation: 6,
  },
  option: {
    height: OPTION_H,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  optionPressed: {
    backgroundColor: colors.surface.track,
  },
  optionText: {
    fontSize: 13,
    color: colors.text.score,
  },
});