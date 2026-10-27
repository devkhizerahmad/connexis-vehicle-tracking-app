// scrollMath.ts — pure focus-scroll arithmetic for the login form.
//
// Kept separate from the screen so the keyboard behaviour is testable without
// a renderer. `windowHeight` is the FULL window height: on Android
// `adjustResize` does not shrink `Dimensions.get('window')`, so the keyboard
// height must be subtracted explicitly on every platform.
/** Space kept between the focused field and the keyboard edge. */
export const SAFE_BOTTOM_PAD = 24;
/** Extra breathing room added when a scroll is needed. */
export const FOCUS_GAP = 12;

export interface FocusScrollInput {
  /** Field's top edge in window coordinates (dp). */
  fieldY: number;
  fieldHeight: number;
  /** Full window height (dp). */
  windowHeight: number;
  /** Keyboard height (dp), or 0 while closed/unmeasured. */
  keyboardHeight: number;
}

/**
 * Distance to scroll so a focused field clears the keyboard, or 0 when it is
 * already visible. A zero keyboard height means "not measured yet" → no scroll.
 */
export function focusScrollDelta({
  fieldY,
  fieldHeight,
  windowHeight,
  keyboardHeight,
}: FocusScrollInput): number {
  const safeBottom = windowHeight - keyboardHeight - SAFE_BOTTOM_PAD;
  const overflow = fieldY + fieldHeight - safeBottom;
  return overflow > 0 ? overflow + FOCUS_GAP : 0;
}
