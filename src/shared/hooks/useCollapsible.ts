// // useCollapsible.ts — decoupled collapse state hook with animated height/opacity controller
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { spacing } from '@shared/theme';

export function useCollapsible(initialOpen = true) {
  const [isExpanded, setIsExpanded] = useState(initialOpen);
  const [contentH, setContentH] = useState<number | null>(null);
  const anim = useRef(new Animated.Value(initialOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isExpanded ? 1 : 0,
      duration: spacing.collapseMs,
      easing: Easing.out(Easing.cubic),
      // height + opacity are layout props; the native driver cannot drive them.
      useNativeDriver: false,
    }).start();
  }, [isExpanded, anim]);

  const toggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  /**
   * FIX 1 (S3 toggle, root cause): the measured View lives INSIDE the wrapper we
   * are animating, so while the wrapper is at `height: 0` the child lays out
   * clipped and reports 0. Accepting that reading latches contentH to 0, and
   * then `interpolate([0,1] -> [0,0])` can never grow again -- the body is stuck
   * closed forever even though `isExpanded` is true. A collapsed body has no
   * real zero-height state, so a 0 reading is always a clipped measurement and
   * is never worth storing. Keeping the last known-good height is what makes
   * re-opening reliable.
   */
  const onMeasureLayout = useCallback((h: number) => {
    setContentH(prev => {
      if (!(h > 0)) {
        return prev;
      }
      return prev === null || Math.abs(prev - h) > 0.5 ? h : prev;
    });
  }, []);

  // FIX 1 (S3 toggle): a collapsed-but-unmeasured body MUST resolve to 0, never
  // `undefined`. An undefined height lets the wrapper fall back to its natural
  // height, which leaves the calendar on screen while the state reads "closed".
  // Expanded-but-unmeasured stays `undefined` for a single frame so the first
  // paint is not a 0-height flash before onLayout lands.
  const animatedHeight =
    contentH === null
      ? isExpanded
        ? undefined
        : 0
      : anim.interpolate({ inputRange: [0, 1], outputRange: [0, contentH] });

  return {
    isExpanded,
    toggle,
    anim,
    animatedHeight,
    onMeasureLayout,
  };
}
