// PlaybackScrubber.tsx — S7: the Reanimated timeline.
// PATCH T-HISTORY (reference match):
//   * the band is FULL-BLEED (edge to edge) with square ends, not an inset pill;
//   * the legs are the reference's soft red (#EC8C8E) -> mint (#7AE89F);
//   * the playhead is the sedan asset (the reference shows a car photo, not a glyph);
//   * the ruler under it is a DARK comb on white (two tick heights).
// A progress bar is split into a red "driven" leg and a green "remaining" leg,
// with the car parked at the playhead. Dragging writes a Reanimated shared value
// and the two useAnimatedStyle consumers re-run on the UI thread, so the car and
// the red/green split are not driven by a React re-render per frame.
//
// Gesture input uses RN's built-in PanResponder rather than react-native-
// gesture-handler, which is NOT a dependency of this project. Note the gesture
// handlers themselves run on the JS thread — it is the style application that
// is handed to the UI thread.
import React, { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import {
  Image,
  type LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { colors, historyColors, historySizes } from '@shared/theme';
import type { HistoryPlayback } from '@features/map/types/history';

/** Width of the car asset, used to keep it inside the track's right edge. */
const CAR_W = 46;
const CAR_H = 34;
/** Ruler density — every 5th tick is taller, matching the reference comb. */
const TICK_COUNT = 64;
/** One "skip" press moves the playhead by 1/12th of the clip. */
const SKIP_FRACTION = 1 / 12;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Imperative surface the S7 transport buttons drive. */
export interface PlaybackScrubberHandle {
  /** Move the playhead one skip step left (-1) or right (1). */
  skip: (direction: -1 | 1) => void;
}

export interface PlaybackScrubberProps {
  playback: HistoryPlayback;
  /** Fired on release with the settled 0..1 position. */
  onScrub?: (progress: number) => void;
}


export const PlaybackScrubber = forwardRef<PlaybackScrubberHandle, PlaybackScrubberProps>(
  function PlaybackScrubber({ playback, onScrub }, ref) {
    const progress = useSharedValue(clamp01(playback.initialProgress));
    // Track width in px, held in a shared value so the worklet can read it.
    const trackWidth = useSharedValue(0);

    /** Map an absolute touch x to a 0..1 fraction of the track. */
    const fractionFromX = useCallback(
      (x: number) => {
        if (trackWidth.value <= 0) {
          return 0;
        }
        return clamp01(x / trackWidth.value);
      },
      [trackWidth],
    );

    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: evt => {
            progress.value = fractionFromX(evt.nativeEvent.locationX);
          },
          onPanResponderMove: evt => {
            progress.value = fractionFromX(evt.nativeEvent.locationX);
          },
          onPanResponderRelease: evt => {
            const next = fractionFromX(evt.nativeEvent.locationX);
            progress.value = next;
            onScrub?.(next);
          },
        }),
      [fractionFromX, onScrub, progress],
    );

    // PATCH T-HISTORY: the transport buttons nudge the same shared value the drag writes.
    useImperativeHandle(
      ref,
      () => ({
        skip: (direction: -1 | 1) => {
          const next = clamp01(progress.value + direction * SKIP_FRACTION);
          progress.value = next;
          onScrub?.(next);
        },
      }),
      [onScrub, progress],
    );

    // The car rides the playhead.
    const carStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: progress.value * Math.max(0, trackWidth.value - CAR_W) }],
    }));

    // The red "driven" leg grows to the playhead; green fills the remainder.
    const drivenStyle = useAnimatedStyle(() => ({
      width: `${progress.value * 100}%`,
    }));

    const handleLayout = useCallback(
      (e: LayoutChangeEvent) => {
        trackWidth.value = e.nativeEvent.layout.width;
      },
      [trackWidth],
    );

    return (
      <View style={styles.wrap} testID="playback-scrubber">
        <View
          style={styles.track}
          onLayout={handleLayout}
          {...panResponder.panHandlers}
          testID="playback-scrubber-track">
          <Animated.View style={[styles.driven, drivenStyle]} />
          <View style={styles.remaining} />
        </View>

        {/* Dark tick comb under the band (minute ruler in the reference). */}
        <View style={styles.ticks} testID="playback-scrubber-ticks">
          {Array.from({ length: TICK_COUNT }, (_, i) => (
            <View key={`tick-${i}`} style={[styles.tick, i % 5 === 0 ? styles.tickMajor : null]} />
          ))}
        </View>

        <Animated.View style={[styles.car, carStyle]} pointerEvents="none" testID="playback-car">
          <Image source={require('../../../../assets/img_car_sedan.png')} style={styles.carImage} />
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrap: {
    height: historySizes.scrubBandH + historySizes.scrubTickH,
    justifyContent: 'flex-start',
  },
  // PATCH T-HISTORY: full-bleed with square ends (the reference band has no radius)
  track: {
    height: historySizes.scrubBandH,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  driven: {
    height: '100%',
    backgroundColor: historyColors.scrubRed,
  },
  remaining: {
    flex: 1,
    backgroundColor: historyColors.scrubGreen,
  },
  ticks: {
    height: historySizes.scrubTickH,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  tick: {
    width: 1,
    height: historySizes.scrubTickH * 0.42,
    backgroundColor: historyColors.scrubTick,
  },
  tickMajor: {
    height: historySizes.scrubTickH * 0.9,
  },
  // PATCH T-HISTORY: the playhead is the sedan asset, centred on the band
  car: {
    position: 'absolute',
    top: (historySizes.scrubBandH - CAR_H) / 2,
    left: 0,
    width: CAR_W,
    height: CAR_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: CAR_W,
    height: CAR_H,
    resizeMode: 'contain',
  },
});

export default PlaybackScrubber;
