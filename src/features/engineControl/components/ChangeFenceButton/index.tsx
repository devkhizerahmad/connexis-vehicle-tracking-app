// ChangeFenceButton (S5) — inset white, rounded, green-hairline button.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): the glyph is the PERSON +
// FENCE mark (GeofenceGlyph), the border is a ~1px green hairline and the
// radius matches the rest of the screen. The Pressable, its role, its label and
// its onPress are untouched — styling only, no behaviour change.
import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GeofenceGlyph } from '@shared/components/icons';
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
        <GeofenceGlyph color={ecColors.fenceGreen} size={14} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

export const ChangeFenceButton = memo(ChangeFenceButtonImpl);
export default ChangeFenceButton;
