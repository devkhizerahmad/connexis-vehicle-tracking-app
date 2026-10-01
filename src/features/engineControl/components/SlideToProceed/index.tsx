// SlideToProceed (S10) — navy pill. The reference draws no thumb, so the drag is
// read from the whole bar: dragging past 60% of the measured width fires
// onProceed, and a plain tap is accepted as the accessibility fallback.
// Movement is tracked in refs (no per-frame re-render).
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { Chevron } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import { styles } from './styles';

export interface SlideToProceedProps {
  label: string;
  onProceed: () => void;
}

/** Fraction of the bar the drag must cross before it counts as a slide. */
const SLIDE_THRESHOLD = 0.6;

function SlideToProceedImpl({ label, onProceed }: SlideToProceedProps) {
  const widthRef = useRef(0);
  const dxRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    widthRef.current = event.nativeEvent.layout.width;
  }, []);

  const release = useCallback(() => {
    const crossed = dxRef.current >= widthRef.current * SLIDE_THRESHOLD;
    dxRef.current = 0;
    setDragging(false);
    if (crossed) {
      onProceed();
    }
  }, [onProceed]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dx) > 6,
        onPanResponderGrant: () => {
          setDragging(true);
        },
        onPanResponderMove: (_event, gesture) => {
          dxRef.current = Math.max(0, gesture.dx);
        },
        onPanResponderRelease: release,
        onPanResponderTerminate: release,
      }),
    [release],
  );

  return (
    <Pressable
      onLayout={handleLayout}
      onPress={onProceed}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Swipe right or tap to proceed"
      style={[styles.bar, dragging ? styles.dragging : null]}
      testID="ec-slide-to-proceed"
      {...panResponder.panHandlers}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chevrons}>
        <Chevron dir="right" color={ecColors.slideInk} size={14} />
        <View style={styles.chevron}>
          <Chevron dir="right" color={ecColors.slideInk} size={14} />
        </View>
      </View>
    </Pressable>
  );
}

export const SlideToProceed = memo(SlideToProceedImpl);
export default SlideToProceed;
