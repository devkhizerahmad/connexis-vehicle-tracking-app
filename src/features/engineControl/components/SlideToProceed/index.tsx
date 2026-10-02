// SlideToProceed (S10) — navy pill. The reference draws no thumb, so the pill is
// the whole control: dragging past SLIDE_THRESHOLD of the knob's travel fires
// onProceed, and a plain tap is accepted as the accessibility fallback.
//
// PATCH S10-ANIM: the drag now reads as a real slider. The travel fraction lives
// in a Reanimated shared value whose useAnimatedStyle consumers run on the UI
// thread — a trail that grows under the drag and a knob that fades in as the
// finger takes hold — so nothing re-renders React per frame. Letting go short of
// the threshold springs the knob back to the start; crossing it runs the knob to
// the end of the track and then fires onProceed.
//
// The knob and trail are the slider's own feedback: they start hidden so the
// resting pill is still the artboard's flat navy with just the label and the
// trailing chevrons.
//
// Gesture input uses RN's built-in PanResponder rather than react-native-
// gesture-handler, which is NOT a dependency of this project (the same choice
// PlaybackScrubber makes). The handlers themselves run on the JS thread — it is
// the style application that is handed to the UI thread.
import React, { memo, useCallback, useMemo } from 'react';
import { PanResponder, Pressable, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Chevron } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import { KNOB, KNOB_INSET, styles } from './styles';

export interface SlideToProceedProps {
  label: string;
  onProceed: () => void;
}

/** Fraction of the knob's travel the drag must cross before it counts. */
const SLIDE_THRESHOLD = 0.6;
/** Fade-in/out of the knob as a drag starts and settles. */
const KNOB_FADE = { duration: 120 };
/** Snap-back when the drag is released short of the threshold. */
const SNAP_BACK = { damping: 16, stiffness: 210, mass: 0.7 };
/** Run to the end of the track once the threshold has been crossed. */
const RUN_OUT = { duration: 180 };

/**
 * Horizontal distance the knob can cover inside a bar `width` pt wide.
 *
 * PATCH S10-ANIM: this is marked as a worklet because `knobStyle` below calls it
 * from the UI thread. A plain JS helper would throw "Tried to synchronously call
 * a Remote Function" the moment the worklet ran on a device — the JS-thread
 * `onPanResponderMove` handler can call the same function, since a worklet is
 * still an ordinary function when invoked from JS.
 */
const travelOf = (width: number) => {
  'worklet';
  return Math.max(1, width - KNOB - KNOB_INSET * 2);
};

function SlideToProceedImpl({ label, onProceed }: SlideToProceedProps) {
  /** 0..1 share of the travel the drag has covered (also the trail's width). */
  const travelled = useSharedValue(0);
  /** Knob opacity: 0 at rest, because the artboard's pill shows no thumb. */
  const knob = useSharedValue(0);
  /** Bar width in pt, held in a shared value so the worklets can read it. */
  const barWidth = useSharedValue(0);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      barWidth.value = event.nativeEvent.layout.width;
    },
    [barWidth],
  );

  /** Settle a finished drag: spring back, or run out and fire onProceed. */
  const settle = useCallback(
    (crossed: boolean) => {
      knob.value = withTiming(0, KNOB_FADE);
      if (!crossed) {
        travelled.value = withSpring(0, SNAP_BACK);
        return;
      }
      travelled.value = withTiming(1, RUN_OUT, finished => {
        if (finished) {
          runOnJS(onProceed)();
        }
      });
    },
    [knob, onProceed, travelled],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dx) > 6,
        onPanResponderGrant: () => {
          knob.value = withTiming(1, KNOB_FADE);
        },
        onPanResponderMove: (_event, gesture) => {
          const next = gesture.dx / travelOf(barWidth.value);
          travelled.value = Math.min(1, Math.max(0, next));
        },
        onPanResponderRelease: () => settle(travelled.value >= SLIDE_THRESHOLD),
        onPanResponderTerminate: () => settle(false),
      }),
    [barWidth, knob, settle, travelled],
  );

  /** The trail grows with the drag; the knob rides its leading edge. */
  const trailStyle = useAnimatedStyle(() => ({ width: `${travelled.value * 100}%` }));

  const knobStyle = useAnimatedStyle(() => ({
    opacity: knob.value,
    transform: [{ translateX: travelled.value * travelOf(barWidth.value) }],
  }));

  /** The label clears out from under the knob rather than showing through it. */
  const labelStyle = useAnimatedStyle(() => ({ opacity: 1 - travelled.value * travelled.value }));

  return (
    <Pressable
      onLayout={handleLayout}
      onPress={onProceed}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Swipe right or tap to proceed"
      style={styles.bar}
      testID="ec-slide-to-proceed"
      {...panResponder.panHandlers}>
      <Animated.View pointerEvents="none" style={[styles.trail, trailStyle]} testID="ec-slide-trail" />
      <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
        {label}
      </Animated.Text>
      <View style={styles.chevrons}>
        <Chevron dir="right" color={ecColors.slideInk} size={14} />
        <View style={styles.chevron}>
          <Chevron dir="right" color={ecColors.slideInk} size={14} />
        </View>
      </View>
      <Animated.View pointerEvents="none" style={[styles.knob, knobStyle]} testID="ec-slide-knob" />
    </Pressable>
  );
}

export const SlideToProceed = memo(SlideToProceedImpl);
export default SlideToProceed;
