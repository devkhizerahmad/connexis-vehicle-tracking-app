// Toast/Toast.tsx — M17: the single toast shell rendered by every screen.
//
// The state machine lives in `@shared/hooks/useToast`; this component only
// renders `message` with the fade the hook drives. It is deliberately
// `pointerEvents="none"` so a visible toast can never eat a tap, and it
// announces itself (M56) so TalkBack reads "Vehicle locked" / "Profile saved".
import React from 'react';
import { Animated, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { sizes } from '@shared/theme';
import { styles } from './styles';

export interface ToastProps {
  /** Current message; null renders nothing. */
  message: string | null;
  /** Fade driver owned by `useToast`. */
  anim: Animated.Value;
  /**
   * Distance from the bottom edge. Defaults to clearing the shared BottomNav
   * overlay (its height + the device gesture inset + 12).
   */
  bottom?: number;
  testID?: string;
}

export function Toast({ message, anim, bottom, testID }: ToastProps) {
  const insets = useSafeAreaInsets();

  if (!message) {
    return null;
  }

  const offset = bottom ?? sizes.bottomNav + insets.bottom + 12;

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.toast,
        {
          bottom: offset,
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }),
            },
          ],
        },
      ]}
      testID={testID}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

export default Toast;
