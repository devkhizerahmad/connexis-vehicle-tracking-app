// ChangeFenceButton (S5) — outlined deep-green button under the map.
//
// PHASE-1 (P7): the shuffle-arrows glyph is replaced by a FENCE glyph. The
// shuffle read as a "shuffle/reorder" affordance; the reference pairs the label
// with a fence mark. The Pressable, its role, its label and its onPress are
// untouched — this is a glyph swap only, no behaviour change.
import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Fence } from '@shared/components/icons';
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
        <Fence color={ecColors.fenceGreen} size={14} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

export const ChangeFenceButton = memo(ChangeFenceButtonImpl);
export default ChangeFenceButton;
