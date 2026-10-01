// ChangeFenceButton (S5) — outlined deep-green button under the map.
import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ShuffleGlyph } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import { styles } from './styles';

export interface ChangeFenceButtonProps {
  label: string;
  onPress: () => void;
}

function ChangeFenceButtonImpl({ label, onPress }: ChangeFenceButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
      testID="ec-change-fence">
      <View style={styles.icon}>
        <ShuffleGlyph color={ecColors.fenceGreen} size={16} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

export const ChangeFenceButton = memo(ChangeFenceButtonImpl);
export default ChangeFenceButton;
