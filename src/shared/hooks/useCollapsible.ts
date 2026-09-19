// RESERVED: pending History/Reports screens (collapsible sections)

// useCollapsible.ts — decoupled collapse state hook with animated height/opacity controller
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { spacing } from '@shared/theme';

export function useCollapsible(initialOpen = true) {
  const [open, setOpen] = useState(initialOpen);
  const [contentH, setContentH] = useState<number | null>(null);
  const anim = useRef(new Animated.Value(initialOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: spacing.collapseMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [open, anim]);

  const toggle = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const onMeasureLayout = useCallback((h: number) => {
    setContentH(prev => (prev === null || Math.abs(prev - h) > 0.5 ? h : prev));
  }, []);

  const animatedHeight =
    contentH === null
      ? undefined
      : anim.interpolate({ inputRange: [0, 1], outputRange: [0, contentH] });

  return {
    open,
    toggle,
    anim,
    animatedHeight,
    onMeasureLayout,
  };
}
