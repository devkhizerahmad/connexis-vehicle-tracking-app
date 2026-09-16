// ProfileFormField.tsx — memoized label + editable value + optional divider row
import React, { memo, useCallback } from 'react';
import { KeyboardTypeOptions, Text, TextInput, View } from 'react-native';
import { profileTokens } from '@shared/theme';
import { ProfileFieldKey } from '@features/profile/types/profile';
import { styles } from './styles';

export interface ProfileFormFieldProps {
  fieldKey: ProfileFieldKey;
  label: string;
  value: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  /** Divider is rendered AFTER rows 1-4 only. */
  showDivider?: boolean;
  /** Stable callback from useProfile — keeps sibling rows from re-rendering. */
  onChange: (key: ProfileFieldKey, text: string) => void;
}

function ProfileFormFieldBase({
  fieldKey,
  label,
  value,
  placeholder,
  keyboardType,
  showDivider = true,
  onChange,
}: ProfileFormFieldProps) {
  const handleChangeText = useCallback(
    (text: string) => onChange(fieldKey, text),
    [fieldKey, onChange],
  );

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.value}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={profileTokens.color.fieldPlaceholder}
        keyboardType={keyboardType}
        editable
        autoCorrect={false}
        underlineColorAndroid="transparent"
      />
      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

export const ProfileFormField = memo(ProfileFormFieldBase);
export default ProfileFormField;