// loginScroll.test.ts — focus-scroll math for the login form.
//
// A focused field must clear the keyboard on BOTH platforms. On Android the
// window does not shrink (Dimensions stays at the full height), so the keyboard
// height has to be subtracted explicitly.
import {
  FOCUS_GAP,
  SAFE_BOTTOM_PAD,
  focusScrollDelta,
} from '../src/features/auth/screens/LoginScreen/scrollMath';

const WINDOW_HEIGHT = 844;
const KEYBOARD_HEIGHT = 300;

describe('focusScrollDelta', () => {
  it('does not scroll when the field already clears the keyboard', () => {
    expect(
      focusScrollDelta({
        fieldY: 300,
        fieldHeight: 50,
        windowHeight: WINDOW_HEIGHT,
        keyboardHeight: KEYBOARD_HEIGHT,
      }),
    ).toBe(0);
  });

  it('scrolls the overflow plus a breathing gap when the keyboard covers the field', () => {
    // keyboard top = 844 - 300 - 24 = 520; field bottom = 541 → 21 + 12.
    expect(
      focusScrollDelta({
        fieldY: 491,
        fieldHeight: 50,
        windowHeight: WINDOW_HEIGHT,
        keyboardHeight: KEYBOARD_HEIGHT,
      }),
    ).toBe(21 + FOCUS_GAP);
  });

  it('does not scroll while the keyboard height is still unmeasured', () => {
    expect(
      focusScrollDelta({
        fieldY: 491,
        fieldHeight: 50,
        windowHeight: WINDOW_HEIGHT,
        keyboardHeight: 0,
      }),
    ).toBe(0);
  });

  it('keeps the documented safe gap', () => {
    expect(SAFE_BOTTOM_PAD).toBe(24);
    expect(FOCUS_GAP).toBe(12);
  });
});
