// playbackScrubber.test.tsx — B16: the playback scrubber's pure interaction maths.
//
// The scrubber owns three behaviours that no other test can see:
//   * the div-by-zero guard — a release BEFORE the first layout must report 0
//     (not NaN, not Infinity) and must not crash;
//   * `skip(±1)` — one transport press moves the playhead by exactly 1/12 and
//     clamps at both ends;
//   * `setProgress` — the B4 play loop drives the same shared value, so it must
//     clamp too, and it must stay SILENT (it repaints ~10x/s; calling onScrub
//     there would re-enter the parent's state at frame rate).
//
// Reanimated is replaced by __mocks__/react-native-reanimated.js: worklets run
// inline at render, so a re-render after a shared-value write exposes the new
// car offset as a plain style object.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { StyleSheet } from 'react-native';
import {
  PlaybackScrubber,
  type PlaybackScrubberHandle,
} from '../src/features/map/components/PlaybackPanel/PlaybackScrubber';
import type { HistoryPlayback } from '../src/features/map/types/history';

const { act } = ReactTestRenderer;

const playback: HistoryPlayback = {
  speed: '1x',
  state: 'Moving',
  stateLabel: 'Moving',
  stamp: '28-April-2024 (2:45 AM)',
  durationMinutes: 18,
  initialProgress: 0.5,
};

/** Width of the car asset — mirrored from the component (keeps it on the track). */
const CAR_W = 46;
const TRACK_W = 200;
const TRAVEL = TRACK_W - CAR_W;

/**
 * PanResponder's grant/release wrappers read `event.touchHistory`, so the fake
 * touch carries an empty one (PanResponder then treats the centroid as 0 and
 * still forwards the event to our handler).
 */
const touchHistory = {
  numberActiveTouches: 0,
  indexOfSingleActiveTouch: 0,
  mostRecentTimeStamp: 0,
  touchBank: [],
};
const touch = (locationX: number) => ({ nativeEvent: { locationX }, touchHistory });

function setup(onScrub = jest.fn()) {
  const ref = React.createRef<PlaybackScrubberHandle>();
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  const element = (payload: HistoryPlayback) => (
    <PlaybackScrubber ref={ref} playback={payload} onScrub={onScrub} />
  );

  act(() => {
    renderer = ReactTestRenderer.create(element(playback));
  });

  const track = () => renderer.root.findByProps({ testID: 'playback-scrubber-track' });

  /** The car's current x offset, read from the rendered animated style. */
  const carX = () => {
    const style = StyleSheet.flatten(
      renderer.root.findByProps({ testID: 'playback-car' }).props.style,
    );
    return style.transform[0].translateX as number;
  };

  const layout = (width: number) =>
    act(() => {
      track().props.onLayout({ nativeEvent: { layout: { width } } });
    });

  const release = (locationX: number) =>
    act(() => {
      track().props.onResponderRelease(touch(locationX));
    });

  /** Re-render so the inline worklet re-reads the shared values. */
  const update = (payload: HistoryPlayback = playback) =>
    act(() => {
      renderer.update(element(payload));
    });

  return { ref, track, carX, layout, release, update, onScrub };
}

describe('PlaybackScrubber (B16)', () => {
  it('reports 0 when a touch is released before the track has been measured', () => {
    const { release, onScrub } = setup();

    // No onLayout yet: trackWidth is 0, so the fraction must be 0, not NaN.
    expect(() => release(120)).not.toThrow();
    expect(onScrub).toHaveBeenCalledTimes(1);
    expect(onScrub).toHaveBeenCalledWith(0);
    expect(Number.isNaN(onScrub.mock.calls[0][0])).toBe(false);
  });

  it('maps the release position to a clamped 0..1 fraction of the track', () => {
    const { layout, release, onScrub } = setup();
    layout(TRACK_W);

    release(TRACK_W / 2);
    expect(onScrub).toHaveBeenLastCalledWith(0.5);

    release(TRACK_W * 1.5);
    expect(onScrub).toHaveBeenLastCalledWith(1);

    release(-40);
    expect(onScrub).toHaveBeenLastCalledWith(0);
  });

  it('moves one skip step of 1/12 and clamps at both ends', () => {
    const { ref, layout, onScrub } = setup();
    layout(TRACK_W);

    ref.current?.skip(1);
    expect(onScrub).toHaveBeenLastCalledWith(0.5 + 1 / 12);

    ref.current?.skip(-1);
    expect(onScrub).toHaveBeenLastCalledWith(0.5);

    // Forward to the end, then one press too many.
    for (let i = 0; i < 12; i += 1) {
      ref.current?.skip(1);
    }
    expect(onScrub).toHaveBeenLastCalledWith(1);
    ref.current?.skip(1);
    expect(onScrub).toHaveBeenLastCalledWith(1);

    // ...and back to the start, then one press too many.
    for (let i = 0; i < 12; i += 1) {
      ref.current?.skip(-1);
    }
    expect(onScrub).toHaveBeenLastCalledWith(0);
    ref.current?.skip(-1);
    expect(onScrub).toHaveBeenLastCalledWith(0);
  });

  it('clamps setProgress and drives the car, without firing onScrub', () => {
    const { ref, layout, update, carX, onScrub } = setup();
    layout(TRACK_W);

    ref.current?.setProgress(0.75);
    update();
    expect(carX()).toBeCloseTo(0.75 * TRAVEL, 6);

    ref.current?.setProgress(5);
    update();
    expect(carX()).toBeCloseTo(TRAVEL, 6);

    ref.current?.setProgress(-2);
    update();
    expect(carX()).toBeCloseTo(0, 6);

    // The play loop writes this value ~10x/s; it must not re-enter the parent.
    expect(onScrub).not.toHaveBeenCalled();
  });

  it('re-seeds the playhead when a new payload arrives (M8)', () => {
    const { ref, layout, update, carX } = setup();
    layout(TRACK_W);

    ref.current?.setProgress(1);
    update();
    expect(carX()).toBeCloseTo(TRAVEL, 6);

    // The re-seed is an effect: it lands after the render that changed the
    // payload, so the next paint shows it (exactly what the device does).
    update({ ...playback, initialProgress: 0.25 });
    update({ ...playback, initialProgress: 0.25 });
    expect(carX()).toBeCloseTo(0.25 * TRAVEL, 6);
  });
});
