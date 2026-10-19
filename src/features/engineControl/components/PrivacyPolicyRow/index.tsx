// PrivacyPolicyRow (S9) — centred shield + "Privacy Policy" flanked by thin
// divider lines, exactly as the NEW "Engine Control Vehicle Dashboard" reference.
import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Shield } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import { styles } from './styles';

export interface PrivacyPolicyRowProps {
  label: string;
  onPress: () => void;
}

function PrivacyPolicyRowImpl({ label, onPress }: PrivacyPolicyRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
      testID="ec-privacy-policy">
      <View style={styles.line} />
      <View style={styles.center}>
        <View>
          <Shield color={ecColors.privacyInk} size={14} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.line} />
    </Pressable>
  );
}

export const PrivacyPolicyRow = memo(PrivacyPolicyRowImpl);
export default PrivacyPolicyRow;
