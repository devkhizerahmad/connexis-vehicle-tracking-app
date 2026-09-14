// Collapsible.tsx — 200ms animated expand/collapse wrapper (for Routes / Quick Report)
import React, {useState} from 'react';
import {Animated, View} from 'react-native';
import {L} from '../../theme/detailsTokens';

export function Collapsible({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  const [maxH, setMaxH] = useState<number | null>(null);
  const anim = React.useRef(new Animated.Value(open ? 1 : 0)).current;

  React.useEffect(() => {
    if (maxH === null) {
      return;
    }
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: L.collapseMs,
      useNativeDriver: false,
    }).start();
  }, [open, maxH, anim]);

  const height =
    maxH === null ? undefined : anim.interpolate({inputRange: [0, 1], outputRange: [0, maxH]});

  return (
    <Animated.View style={{height, overflow: 'hidden'}}>
      <View onLayout={e => setMaxH(e.nativeEvent.layout.height)}>{children}</View>
    </Animated.View>
  );
}
