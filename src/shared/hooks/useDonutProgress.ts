// RESERVED: pending Home screen (donut score count-up)

// useDonutProgress.ts — memoized sweep angle + throttled count-up listener hook for donut animation
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export function useDonutProgress(targetScore: number, duration = 1200) {
  const animValue = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let lastTime = 0;
    const listenerId = animValue.addListener(({ value }) => {
      const now = Date.now();
      if (now - lastTime > 32 || value === targetScore) {
        lastTime = now;
        setDisplayScore(Math.round(value));
      }
    });

    Animated.timing(animValue, {
      toValue: targetScore,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      animValue.removeListener(listenerId);
    };
  }, [animValue, targetScore, duration]);

  return {
    animValue,
    displayScore,
  };
}
