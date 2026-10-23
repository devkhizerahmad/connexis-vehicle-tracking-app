// useToast.ts — M17/S3: the ONE toast state machine.
//
// Before this hook, five screens (Home, Details, EngineControl, Profile,
// Reports) each carried a copy of `showToast` with its own timer ref, its own
// fade timings and its own cleanup — or, in two cases, NO cleanup at all, so a
// pending `setState` could fire after unmount. The copies had also drifted:
// only EngineControl reset the animation value, only EngineControl/Reports
// cleared the message after the fade.
//
// This hook owns:
//   * the message state (null when hidden),
//   * the single Animated.Value the fade runs on,
//   * the dismiss timer (cleared on every re-show and on unmount),
//   * the S3 reset: the message is set back to null once the fade-out has
//     finished, so a hidden toast is not left mounted at opacity 0.
//
// The visual shell lives in `@shared/components/feedback/Toast`.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { spacing } from '@shared/theme';

/** Fade-in / fade-out durations shared by every toast in the app. */
export const TOAST_FADE_IN_MS = 180;
export const TOAST_FADE_OUT_MS = 180;

export interface UseToastResult {
  /** Current message, or null when nothing is showing. */
  message: string | null;
  /** Driver for the fade (opacity / translate). */
  anim: Animated.Value;
  /** Show a message, restarting the dismiss timer. */
  showToast: (message: string) => void;
}

export function useToast(durationMs: number = spacing.toastMs): UseToastResult {
  const [message, setMessage] = useState<string | null>(null);
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimer();
      anim.stopAnimation();
    };
  }, [anim, clearTimer]);

  const showToast = useCallback(
    (next: string) => {
      clearTimer();
      setMessage(next);
      Animated.timing(anim, {
        toValue: 1,
        duration: TOAST_FADE_IN_MS,
        useNativeDriver: true,
      }).start();

      timer.current = setTimeout(() => {
        Animated.timing(anim, {
          toValue: 0,
          duration: TOAST_FADE_OUT_MS,
          useNativeDriver: true,
        }).start(({ finished }) => {
          // S3: drop the message (and the mounted view) after the fade-out.
          if (finished && mounted.current) {
            setMessage(null);
          }
        });
      }, durationMs);
    },
    [anim, clearTimer, durationMs],
  );

  return { message, anim, showToast };
}

export default useToast;
