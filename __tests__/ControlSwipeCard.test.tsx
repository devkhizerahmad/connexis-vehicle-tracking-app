// ControlSwipeCard.test.tsx — B17: the swipe-to-lock guard matrix.
//
// This control LOCKS A VEHICLE, so the guards are the contract:
//   1. a swipe with nothing armed must only say so — never call the service;
//   2. an armed action performs exactly ONE call;
//   3. two successes in the same tick still perform exactly ONE call (that is
//      what `pendingActionRef` / `processingRef` exist for — the state closure
//      has not re-rendered yet);
//   4. arming a different selector while an action is in flight is ignored;
//   5. a payload that settles after unmount must not touch state or toast.
//
// `rn-swipe-button` is mocked to a plain host view that captures the props the
// real library receives, so the test drives `onSwipeSuccess` directly and can
// observe the `forceReset` callback the library hands back on mount. The 800 ms
// service seam is real (`engineControlService.requestLockUnlock`), driven by fake
// timers — no injected delay, no mocked promise.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { engineControlService } from '../src/features/engineControl/services/engineControlService';
import { ControlSwipeCard } from '../src/features/engineControl/components/ControlSwipeCard';

const { act } = ReactTestRenderer;

/** Shared with the module mock below (jest hoists the factory above imports). */
const mockSwipeState = {
  props: null as null | {
    onSwipeSuccess: (isRealGesture: boolean) => void;
    disabled?: boolean;
    forceReset?: (reset: () => void) => void;
    forceCompleteSwipe?: (complete: () => void) => void;
  },
  resets: 0,
};

jest.mock('rn-swipe-button', () => {
  const MockReact = require('react');
  const { View } = require('react-native');

  function SwipeButtonMock(props: any) {
    mockSwipeState.props = props;
    // The real library hands `reset` / `forceComplete` to the parent from an
    // effect on mount; mirror that so the card's ref capture is exercised.
    MockReact.useEffect(() => {
      props.forceReset?.(() => {
        mockSwipeState.resets += 1;
      });
      props.forceCompleteSwipe?.(() => {});
    }, [props.forceReset, props.forceCompleteSwipe]);
    return MockReact.createElement(View, { testID: props.testID });
  }

  return { __esModule: true, default: SwipeButtonMock };
});

function setup(onNotice = jest.fn()) {
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  act(() => {
    renderer = ReactTestRenderer.create(
      <ControlSwipeCard
        lockLabel="Lock"
        unlockLabel="Unlock"
        slideLabel="Slide to proceed"
        onNotice={onNotice}
      />,
    );
  });

  /** Press a selector (the Pressable carries onPress; its host view does not). */
  const press = (testID: string) =>
    act(() => {
      const node = renderer.root
        .findAllByProps({ testID })
        .find(candidate => typeof candidate.props.onPress === 'function');
      if (!node) {
        throw new Error(`no pressable with testID ${testID}`);
      }
      node.props.onPress();
    });

  /** Complete the rail, as both the drag and the screen-reader press do. */
  const swipe = (isRealGesture = true) =>
    act(() => {
      mockSwipeState.props?.onSwipeSuccess(isRealGesture);
    });

  /** Let the 800 ms service seam settle and flush its promise chain. */
  const settle = () =>
    act(async () => {
      jest.advanceTimersByTime(800);
      await Promise.resolve();
    });

  return { renderer, press, swipe, settle, onNotice };
}

describe('ControlSwipeCard (B17)', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockSwipeState.props = null;
    mockSwipeState.resets = 0;
    spy = jest.spyOn(engineControlService, 'requestLockUnlock');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('does not act when nothing is armed — it says so and snaps back', () => {
    const { swipe, onNotice } = setup();

    swipe();

    expect(spy).not.toHaveBeenCalled();
    expect(onNotice).toHaveBeenCalledTimes(1);
    expect(onNotice).toHaveBeenCalledWith('Select Lock or Unlock first');
    expect(mockSwipeState.resets).toBe(1);
  });

  it('performs exactly one call for an armed action and reports it', async () => {
    const { press, swipe, settle, onNotice } = setup();

    press('ec-lock');
    swipe();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('lock');
    // In flight: the rail is disabled and has not snapped back yet.
    expect(mockSwipeState.props?.disabled).toBe(true);
    expect(mockSwipeState.resets).toBe(0);

    await settle();

    expect(onNotice).toHaveBeenCalledWith('Vehicle locked');
    expect(mockSwipeState.resets).toBe(1);
    expect(mockSwipeState.props?.disabled).toBe(false);
  });

  it('collapses two successes in the same tick into one call', async () => {
    const { press, settle, onNotice } = setup();

    press('ec-lock');
    // Both land before React can re-render, so only the refs can stop the second.
    act(() => {
      mockSwipeState.props?.onSwipeSuccess(true);
      mockSwipeState.props?.onSwipeSuccess(true);
    });

    expect(spy).toHaveBeenCalledTimes(1);

    await settle();

    expect(onNotice).toHaveBeenCalledTimes(1);
    expect(onNotice).toHaveBeenCalledWith('Vehicle locked');
    // Two resets: one for the blocked second success (it snaps the rail back so
    // it cannot sit filled behind a confirmation), one when the action settles.
    expect(mockSwipeState.resets).toBe(2);
  });

  it('ignores a new selection while an action is in flight', async () => {
    const { press, swipe, settle } = setup();

    press('ec-lock');
    swipe();
    press('ec-unlock');

    await settle();

    // The armed action stayed 'lock'; the mid-flight tap did not re-arm it.
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('lock');
  });

  it('drops the result when the card unmounts mid-flight', async () => {
    const { renderer, press, swipe, settle, onNotice } = setup();

    press('ec-lock');
    swipe();
    expect(spy).toHaveBeenCalledTimes(1);

    act(() => {
      renderer.unmount();
    });

    await settle();

    expect(onNotice).not.toHaveBeenCalled();
    // The unmount effect nulls the captured reset, so nothing touches the rail.
    expect(mockSwipeState.resets).toBe(0);
  });
});
