// RESERVED: pending History/Reports screens (filter dropdown)
// SelectField index.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@shared/theme';
import { Chevron } from '@shared/components/icons';

interface SelectFieldProps {
  label?: string;
  onPress?: () => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label = 'Select', onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.text}>{label}</Text>
    <Chevron dir="down" color={colors.text.secondary} size={10} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.surface.page,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  text: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '600',
  },
});

export default SelectField;
