// SupportButton (S12) — full-width blue CTA at the foot of the screen.
import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SupportGlyph } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import { styles } from './styles';

export interface SupportButtonProps {
  label: string;
  onPress: () => void;
}

function SupportButtonImpl({ label, onPress }: SupportButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
      testID="ec-support">
      <View style={styles.icon}>
        <SupportGlyph color={ecColors.supportInk} size={13} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

export const SupportButton = memo(SupportButtonImpl);
export default SupportButton;
