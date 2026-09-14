// Collapsible.tsx — 250ms ease-out height+opacity expand/collapse (Routes / Quick Report).
// KEY FIX: content is ALWAYS mounted and is measured by an absolutely-positioned
// layer that is never constrained by the animating parent's height, so collapse
// can never corrupt the intrinsic height — re-opening always works.
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, View} from 'react-native';
import {L} from '../../theme/detailsTokens';

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
      duration: L.collapseMs,
      easing: Easing.out(Easing.cubic), // ease-out on BOTH height and opacity
      useNativeDriver: false, // height/opacity JS-driven together
    }).start();
  }, [open, anim]);

  const height =
    contentH === null
      ? undefined // first frame before measure: render at intrinsic height
      : anim.interpolate({inputRange: [0, 1], outputRange: [0, contentH]});

  return (
    <Animated.View style={{height, opacity: anim, overflow: 'hidden'}}>
      {/* Absolute measuring layer: sizes to intrinsic content height even while
          the animated parent has height 0, so measurement is never clamped. */}
      <View
        style={{position: 'absolute', top: 0, left: 0, right: 0}}
        onLayout={e => {
          const h = e.nativeEvent.layout.height;
          setContentH(prev => (prev === null || Math.abs(prev - h) > 0.5 ? h : prev));
        }}>
        {children}
      </View>
    </Animated.View>
  );
}
