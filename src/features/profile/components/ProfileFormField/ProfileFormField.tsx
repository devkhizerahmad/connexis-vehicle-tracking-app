// ProfileFormField.tsx — memoized label + editable value + optional divider row
import React, { memo, useCallback } from 'react';
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { profileTokens } from '@shared/theme';
import { ProfileFieldKey } from '@features/profile/types/profile';
import { styles } from './styles';

/**
 * B13: autofill + keyboard contract per field. Without these, TalkBack
 * announced five identical "edit box" fields and email auto-capitalised.
 */
const FIELD_PROPS: Record<
  ProfileFieldKey,
  Pick<TextInputProps, 'autoComplete' | 'textContentType' | 'autoCapitalize' | 'returnKeyType'>
> = {
  firstName: {
    autoComplete: 'given-name',
    textContentType: 'givenName',
    autoCapitalize: 'words',
    returnKeyType: 'next',
  },
  lastName: {
    autoComplete: 'family-name',
    textContentType: 'familyName',
    autoCapitalize: 'words',
    returnKeyType: 'next',
  },
  dob: {
    autoComplete: 'off',
    textContentType: 'none',
    autoCapitalize: 'none',
    returnKeyType: 'next',
  },
  email: {
    autoComplete: 'email',
    textContentType: 'emailAddress',
    autoCapitalize: 'none',
    returnKeyType: 'next',
  },
  phone: {
    autoComplete: 'tel',
    textContentType: 'telephoneNumber',
    autoCapitalize: 'none',
    returnKeyType: 'done',
  },
};

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
        accessibilityLabel={label}
        accessibilityHint={placeholder}
        {...FIELD_PROPS[fieldKey]}
      />
      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

export const ProfileFormField = memo(ProfileFormFieldBase);
export default ProfileFormField;