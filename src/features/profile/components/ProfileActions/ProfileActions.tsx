// ProfileActions.tsx — Update Profile button + Logout text button
import React, { memo } from 'react';
import { Pressable, PressableStateCallbackType, Text, View } from 'react-native';
import { styles } from './styles';

/** Module-scope pressable style resolver — no per-render allocation. */
const resolveButtonStyle = ({ pressed }: PressableStateCallbackType) => [
  styles.button,
  pressed && styles.buttonPressed,
];

export interface ProfileActionsProps {
  onUpdate: () => void;
  onLogout: () => void;
  saving?: boolean;
}

function ProfileActionsBase({ onUpdate, onLogout, saving = false }: ProfileActionsProps) {
  return (
    <View>
      <Pressable
        onPress={onUpdate}
        disabled={saving}
        style={resolveButtonStyle}
        accessibilityRole="button">
        <Text style={styles.buttonLabel}>UPDATE PROFILE</Text>
      </Pressable>

      <Pressable onPress={onLogout} hitSlop={12} style={styles.logoutBtn} accessibilityRole="button">
        <Text style={styles.logoutLabel}>LOGOUT</Text>
      </Pressable>
    </View>
  );
}

export const ProfileActions = memo(ProfileActionsBase);
export default ProfileActions;