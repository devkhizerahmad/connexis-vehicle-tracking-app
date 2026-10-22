// ControlSwipeCard (S8 + S10) — the swipe-to-confirm lock/unlock control.
//
// WHY THIS IS ITS OWN COMPONENT (Performance G2/G10): `pendingAction` and
// `processing` change on every tap and every completed swipe. If that state
// lived on EngineControlScreen, arming Lock or Unlock — or the ~800 ms the rail
// spends filled after a confirmed swipe — would re-render the whole screen:
// the MapView, the routes list, the FAQ card, the header and the bottom nav.
// Confining the state here means a swipe repaints this subtree and nothing else.
// The screen hands us a STABLE `onNotice` callback (its toast), so crossing the
// boundary does not drag the screen's state into the render path either.
//
// THE MODEL: Lock and Unlock are selectors, not buttons. Tapping one arms it
// (tint + heavier border); it does NOT lock anything. The only thing that can
// perform an action is a completed swipe, and only when something is armed.
// A swipe with nothing armed is a no-op that says so.
//
// ACCESSIBILITY: `screenReaderEnabled` is left on auto-detect. rn-swipe-button
// renders as an ordinary button in that mode and fires `onSwipeSuccess` from its
// press handler (SwipeButton/index.tsx `handlePress`), which is the SAME handler
// the gesture uses — so a screen-reader user gets the identical arm → confirm →
// toast flow, just without the drag.
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import SwipeButton from 'rn-swipe-button';
import { Chevron } from '@shared/components/icons';
import { ecColors, ecSizes } from '@shared/theme';
import { engineControlService } from '@features/engineControl/services/engineControlService';
import type { LockUnlockAction } from '@features/engineControl/types/engineControl';
import LockUnlockRow from '../LockUnlockRow';
import { styles } from './styles';

/** Shown when the rail completes with nothing armed. Deliberately gentle. */
const NEEDS_SELECTION_MESSAGE = 'Select Lock or Unlock first';
const LOCKED_MESSAGE = 'Vehicle locked';
const UNLOCKED_MESSAGE = 'Vehicle unlocked';

/**
 * Share of the rail that must be crossed before the swipe counts. 80 (not the
 * library's 70) so a lazy flick cannot arm an action by accident — this control
 * locks a vehicle, so it should take a deliberate pull.
 */
const SWIPE_SUCCESS_THRESHOLD = 80;

/** Delay used by the library when it does self-reset; we reset manually. */
const RESET_ANIM_DELAY_MS = 250;

/**
 * rn-swipe-button's published `types.d.ts` declares only its own props, but the
 * implementation is `...rest`-forwarded onto a TouchableOpacity and spreads
 * `rest` LAST — so accessibility props and `testID` really do reach the
 * touchable at runtime (this is how `ec-slide-to-proceed` is addressable from
 * the device a11y tree). This narrow cast exists only to supply those two; the
 * library's own default hint merely repeats the title, which tells a
 * screen-reader user nothing about needing to arm Lock/Unlock first.
 */
const SwipeRail = SwipeButton as unknown as React.ComponentType<
  React.ComponentProps<typeof SwipeButton> & {
    accessibilityHint?: string;
    testID?: string;
  }
>;

export interface ControlSwipeCardProps {
  lockLabel: string;
  unlockLabel: string;
  slideLabel: string;
  /** The screen's toast reporter. Must be referentially stable. */
  onNotice: (message: string) => void;
  /** Rendered between the selectors and the rail (the Privacy Policy row). */
  children?: React.ReactNode;
}

function ControlSwipeCardImpl({
  lockLabel,
  unlockLabel,
  slideLabel,
  onNotice,
  children,
}: ControlSwipeCardProps) {
  const [pendingAction, setPendingAction] = useState<LockUnlockAction | null>(null);
  const [processing, setProcessing] = useState(false);

  /**
   * Ref mirrors of the two flags above.
   *
   * These are NOT redundant. `setProcessing` does not take effect until React
   * re-renders, so a guard written against the state closure would still let a
   * second swipe through if it landed inside the same tick as the first. The
   * refs flip synchronously, which is what actually closes the double-fire
   * window — the state exists only to drive the disabled styling.
   */
  const pendingActionRef = useRef<LockUnlockAction | null>(null);
  const processingRef = useRef(false);
  /**
   * rn-swipe-button hands its internal `reset` / `forceComplete` functions to us
   * on mount (SwipeThumb/index.tsx fires `forceReset(reset)` from an effect).
   * With `shouldResetAfterSuccess={false}` the library never resets on its own,
   * so this ref is the ONLY way to snap the rail back after our async action
   * settles. Both are captured through stable callbacks so the library's
   * `[forceReset]` effect does not re-run on every render.
   */
  const forceResetRef = useRef<(() => void) | null>(null);
  const forceCompleteRef = useRef<(() => void) | null>(null);

  /**
   * The mock action settles ~800 ms after the swipe resolves. Without this the
   * promise would still call setState after the screen has been torn down.
   */
  const mountedRef = useRef(true);

  useEffect(
    () => () => {
      mountedRef.current = false;
      forceResetRef.current = null;
      forceCompleteRef.current = null;
      pendingActionRef.current = null;
      processingRef.current = false;
    },
    [],
  );

  /** Arm one of the two selectors. Ignored while an action is in flight. */
  const handleSelect = useCallback((action: LockUnlockAction) => {
    if (processingRef.current) {
      return;
    }
    pendingActionRef.current = action;
    setPendingAction(action);
  }, []);

  const captureForceReset = useCallback((reset: () => void) => {
    forceResetRef.current = reset;
  }, []);

  const captureForceComplete = useCallback((complete: () => void) => {
    forceCompleteRef.current = complete;
  }, []);

  /**
   * Intentionally empty.
   *
   * This fires on every frame of the drag's start. The thumb's travel is driven
   * by the library's own Animated value on the native side, so there is nothing
   * to do here — and anything added would run per-frame on the JS thread, which
   * is exactly the jank G2/G10 forbids.
   */
  const handleSwipeStart = useCallback(() => {}, []);

  /** A partial drag released short of the threshold. The library snaps back. */
  const handleSwipeFail = useCallback(() => {}, []);

  const handleSwipeSuccess = useCallback(
    (_isRealGesture: boolean) => {
      // Guard 1 — an action is already running. Reset so the rail cannot sit
      // filled behind a second confirmation.
      if (processingRef.current) {
        forceResetRef.current?.();
        return;
      }

      // Guard 2 — nothing armed. Say so and snap back; perform NO action.
      const action = pendingActionRef.current;
      if (!action) {
        onNotice(NEEDS_SELECTION_MESSAGE);
        forceResetRef.current?.();
        return;
      }

      processingRef.current = true;
      setProcessing(true);

      engineControlService
        .requestLockUnlock(action)
        .then(() => {
          if (!mountedRef.current) {
            return;
          }
          onNotice(action === 'lock' ? LOCKED_MESSAGE : UNLOCKED_MESSAGE);
          pendingActionRef.current = null;
          setPendingAction(null);
        })
        .catch(() => {
          if (!mountedRef.current) {
            return;
          }
          // B17: a rejected request used to leave the card stuck in the
          // processing state with no feedback at all.
          onNotice('Could not reach the vehicle. Try again.');
        })
        .finally(() => {
          if (!mountedRef.current) {
            return;
          }
          // Snap the rail back only now, so it reads as filled for the whole
          // in-flight window instead of resetting the instant the swipe landed.
          forceResetRef.current?.();
          processingRef.current = false;
          setProcessing(false);
        });
    },
    [onNotice],
  );

  /** The rail's thumb face: a SINGLE right chevron (NEW reference). */
  const renderThumb = useCallback(
    () => (
      <View style={styles.thumbIcon}>
        <Chevron dir="right" color={ecColors.slideThumbInk} size={12} />
      </View>
    ),
    [],
  );

  const railHint = pendingAction
    ? `Swipe to ${pendingAction === 'lock' ? 'lock' : 'unlock'} the vehicle`
    : 'Select Lock or Unlock first, then swipe to confirm';

  return (
    <View style={styles.wrap} testID="ec-control-swipe">
      <LockUnlockRow
        lockLabel={lockLabel}
        unlockLabel={unlockLabel}
        selected={pendingAction}
        disabled={processing}
        onSelect={handleSelect}
      />
      {children}
      {/*
       * TODO(V9-a11y): the screen-reader path is UNVERIFIED on device.
       *
       * By code path it should hold: `screenReaderEnabled` makes rn-swipe-button
       * render a focusable button whose activation calls `onSwipeSuccess`
       * (SwipeButton/index.tsx `handlePress`), and `handleSwipeSuccess` below is
       * gesture-source-agnostic — it never inspects `isRealGesture`. So a
       * screen-reader user reaches the same arm -> confirm -> toast flow.
       *
       * That is an ARGUMENT, not a run. TalkBack was NOT exercised on device.
       * Next session: enable TalkBack (<=2 adb steps), then (a) with a pending
       * Lock selection, activate the control and confirm the lock fires;
       * (b) with no selection, activate and confirm the hint appears instead;
       * (c) disable TalkBack to restore normal state.
       * Do NOT claim V9 PASS until that run exists.
       */}
      <SwipeRail
        containerStyles={styles.swipeContainer}
        railStyles={styles.swipeRail}
        railBackgroundColor={ecColors.slideBg}
        railBorderColor="transparent"
        railFillBackgroundColor={ecColors.slideTrail}
        railFillBorderColor="transparent"
        // Keep the pill navy while disabled so the in-flight window does not
        // flash a different colour at the moment the action is running.
        disabledRailBackgroundColor={ecColors.slideBg}
        height={ecSizes.slideH}
        thumbIconBackgroundColor={ecColors.slideThumbBg}
        thumbIconBorderColor="transparent"
        thumbIconComponent={renderThumb}
        title={slideLabel}
        titleColor={ecColors.slideInk}
        titleFontSize={14}
        // Rail stays filled while the mock action "runs" — no premature snap.
        shouldResetAfterSuccess={false}
        resetAfterSuccessAnimDelay={RESET_ANIM_DELAY_MS}
        swipeSuccessThreshold={SWIPE_SUCCESS_THRESHOLD}
        disabled={processing}
        onSwipeStart={handleSwipeStart}
        onSwipeSuccess={handleSwipeSuccess}
        onSwipeFail={handleSwipeFail}
        forceReset={captureForceReset}
        forceCompleteSwipe={captureForceComplete}
        accessibilityHint={railHint}
        testID="ec-slide-to-proceed"
      />
    </View>
  );
}

export const ControlSwipeCard = memo(ControlSwipeCardImpl);
export default ControlSwipeCard;