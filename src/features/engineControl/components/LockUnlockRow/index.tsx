// LockUnlockRow (S8) — red-bordered "Lock" + blue-bordered "Unlock" cards.
// Glyph ink stays dark in both cards; only the border colour differs (reference).
import React, { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LockGlyph, UnlockGlyph } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import { styles } from './styles';

export interface LockUnlockRowProps {
  lockLabel: string;
  unlockLabel: string;
  onLock: () => void;
  onUnlock: () => void;
}

function LockUnlockRowImpl({ lockLabel, unlockLabel, onLock, onUnlock }: LockUnlockRowProps) {
  const handleLock = useCallback(() => onLock(), [onLock]);
  const handleUnlock = useCallback(() => onUnlock(), [onUnlock]);

  return (
    <View style={styles.row} testID="ec-lock-unlock">
      <Pressable
        onPress={handleLock}
        accessibilityRole="button"
        accessibilityLabel={lockLabel}
        style={({ pressed }) => [styles.card, styles.lockBorder, pressed ? styles.pressed : null]}
        testID="ec-lock">
        <View style={styles.glyph}>
          <LockGlyph color={ecColors.lockInk} size={16} />
        </View>
        <Text style={[styles.label, styles.lockLabel]}>{lockLabel}</Text>
      </Pressable>
      <Pressable
        onPress={handleUnlock}
        accessibilityRole="button"
        accessibilityLabel={unlockLabel}
        style={({ pressed }) => [
          styles.card,
          styles.cardRight,
          styles.unlockBorder,
          styles.unlockFill,
          pressed ? styles.pressed : null,
        ]}
        testID="ec-unlock">
        <View style={styles.glyph}>
          <UnlockGlyph color={ecColors.unlockInk} size={16} />
        </View>
        <Text style={[styles.label, styles.unlockLabel]}>{unlockLabel}</Text>
      </Pressable>
    </View>
  );
}

export const LockUnlockRow = memo(LockUnlockRowImpl);
export default LockUnlockRow;
