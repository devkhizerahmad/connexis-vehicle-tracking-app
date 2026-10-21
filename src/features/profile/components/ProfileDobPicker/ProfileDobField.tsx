// ProfileDobField.tsx — the tappable "Date of Birth" row.
//
// The row keeps the other Profile form rows' typography, geometry and divider
// EXACTLY; the only changes are that it is a button (not a text input) and that
// it carries a right-side caret affordance.
//
// The LABEL + VALUE are one Pressable, so the touch target is the whole row
// (~59dp tall) WITHOUT growing the row — the rows below it stay exactly where
// they were.
//
// The value DISPLAYS in the international human format ("January 1, 1990") while
// the state it edits stays ISO ("1990-01-01").
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronDown } from '@shared/components/icons';
import { profileTokens } from '@shared/theme';
import { formatDob } from './dob';
import { styles } from './styles';

export interface ProfileDobFieldProps {
  /** The DOB as ISO ("1990-01-01"). */
  value: string | null | undefined;
  /** Placeholder shown when nothing is set. */
  placeholder?: string;
  /** Opens the 3-segment sheet. */
  onPress: () => void;
  /** The row divider (the other rows draw one after themselves). */
  showDivider?: boolean;
}

export function ProfileDobField({
  value,
  placeholder = 'YYYY-MM-DD',
  onPress,
  showDivider = true,
}: ProfileDobFieldProps) {
  const display = formatDob(value);
  return (
    <View>
      <Pressable
        style={styles.field}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Change date of birth"
        testID="profile-dob-field">
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.valueLine}>
          <Text
            style={[styles.value, display ? null : styles.valuePlaceholder]}
            numberOfLines={1}>
            {display || placeholder}
          </Text>
          <ChevronDown color={profileTokens.color.fieldValue} size={14} />
        </View>
      </Pressable>
      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

export default ProfileDobField;
