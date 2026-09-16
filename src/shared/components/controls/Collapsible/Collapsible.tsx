// Collapsible.tsx — 250ms ease-out height+opacity expand/collapse
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { spacing } from '@shared/theme';
import { styles } from './styles';

export function Collapsible({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  const [contentH, setContentH] = useState<number | null>(null);
  const anim = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: spacing.collapseMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [open, anim]);

  const height =
    contentH === null
      ? undefined
      : anim.interpolate({ inputRange: [0, 1], outputRange: [0, contentH] });

  return (
    <Animated.View style={[styles.container, { height, opacity: anim }]}>
      <View
        style={styles.measuringLayer}
        onLayout={e => {
          const h = e.nativeEvent.layout.height;
          setContentH(prev => (prev === null || Math.abs(prev - h) > 0.5 ? h : prev));
        }}>
        {children}
      </View>
    </Animated.View>
  );
}

export default Collapsible;
