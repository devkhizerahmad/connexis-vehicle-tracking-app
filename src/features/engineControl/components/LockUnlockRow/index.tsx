// LockUnlockRow (S8) — red-bordered "Lock" + blue-bordered "Unlock" selectors.
//
// PATCH EC-SWIPE: these stopped being action buttons and became SELECTORS. Tapping
// one only arms it (accent tint + heavier border); nothing is locked until the
// swipe rail below is dragged. The armed value is owned by ControlSwipeCard so
// that arming re-renders this subtree alone, never the map or the routes list.
//
// Glyph + label ink follow the NEW reference: RED on Lock, BLUE on Unlock
// (they used to be a shared dark navy that only the border differentiated).
import React, { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LockGlyph, UnlockGlyph } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import type { LockUnlockAction } from '@features/engineControl/types/engineControl';
import { styles } from './styles';

export interface LockUnlockRowProps {
  lockLabel: string;
  unlockLabel: string;
  /** Which selector is armed, or null when neither is. */
  selected: LockUnlockAction | null;
  /** True while a confirmed action is in flight — selection is frozen. */
  disabled?: boolean;
  onSelect: (action: LockUnlockAction) => void;
}

function LockUnlockRowImpl({
  lockLabel,
  unlockLabel,
  selected,
  disabled,
  onSelect,
}: LockUnlockRowProps) {
  const handleLock = useCallback(() => onSelect('lock'), [onSelect]);
  const handleUnlock = useCallback(() => onSelect('unlock'), [onSelect]);

  const lockSelected = selected === 'lock';
  const unlockSelected = selected === 'unlock';

  return (
    <View style={styles.row} testID="ec-lock-unlock">
      <Pressable
        onPress={handleLock}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={lockLabel}
        accessibilityState={{ selected: lockSelected, disabled: !!disabled }}
        accessibilityHint="Selects Lock. Swipe the rail below to confirm."
        style={({ pressed }) => [
          styles.card,
          styles.lockBorder,
          // Selected state is a fill + outline weight change, never a colour swap:
          // Lock gains the pale red tint that mirrors Unlock's resting blue tint.
          lockSelected ? styles.cardSelected : null,
          lockSelected ? styles.lockSelectedFill : null,
          pressed ? styles.pressed : null,
        ]}
        testID="ec-lock">
        <View style={styles.glyph}>
          <LockGlyph color={ecColors.lockBorder} size={16} />
        </View>
        <Text style={[styles.label, styles.lockLabel]}>{lockLabel}</Text>
      </Pressable>
      <Pressable
        onPress={handleUnlock}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={unlockLabel}
        accessibilityState={{ selected: unlockSelected, disabled: !!disabled }}
        accessibilityHint="Selects Unlock. Swipe the rail below to confirm."
        style={({ pressed }) => [
          styles.card,
          styles.cardRight,
          styles.unlockBorder,
          // Resting state is PLAIN WHITE in the NEW reference; the pale blue
          // tint is only an ARMED-state affordance (behaviour unchanged).
          unlockSelected ? styles.unlockFill : null,
          unlockSelected ? styles.cardSelected : null,
          pressed ? styles.pressed : null,
        ]}
        testID="ec-unlock">
        <View style={styles.glyph}>
          <UnlockGlyph color={ecColors.unlockBorder} size={16} />
        </View>
        <Text style={[styles.label, styles.unlockLabel]}>{unlockLabel}</Text>
      </Pressable>
    </View>
  );
}

export const LockUnlockRow = memo(LockUnlockRowImpl);
export default LockUnlockRow;