# Login Screen — Reference Restyle

**Goal:** Make the login screen match `design-references/Login Screen.png`: a red hero band, a white card overlapping it, a light page, a pinned footer, and the **all-white** wordmark with `TECHNOLOGIES` underneath.

**Approved corrections (override the reference):**
1. Login button keeps the app-header gradient (`#E03131 → #C0110F → #2A0508`), not the reference's lighter red.
2. `TECHNOLOGIES` is rendered under the logo; `Secure • Smart • Connected` is removed.
3. **Hero background uses the shared `headerSpec.background` gradient** — the same diagonal `#2A0508 → #C0110F` ramp as every internal screen header. No hero image is rendered.

**Kept intact:** testIDs, `StatusBar light-content`, `Welcome Back!`, red dash `#E03131`, auth behaviour, all existing tests.

---

## Architecture

The screen becomes three stacked regions inside one `ScrollView`:

```
ScrollView (flexGrow: 1, no horizontal padding)
├── hero            LinearGradient, 225dp tall, shared headerSpec ramp
│   └── content     logo (full-white asset) + TECHNOLOGIES
├── card            width 86% (max 340), marginTop: -64  ← overlaps hero
└── footer          marginTop: auto                      ← pinned to viewport bottom
```

The hero is inside the scroller so the keyboard can push it out of the way. The card's negative top margin produces the overlap; the footer's `marginTop: 'auto'` pins it to the bottom on tall screens and lets it follow the card on short screens (no fixed positioning, so keyboard scrolling still works).

**Tech:** React Native 0.87, TypeScript, `react-native-linear-gradient`, Jest + `react-test-renderer`, `mobile-mcp` for device verification.

---

## Task 1 — RED: lock the reference layout in tests

**File:** `__tests__/LoginScreen.test.tsx`

Add imports:

```ts
import { Image, StyleSheet } from 'react-native';
import {
  cardOverlap,
  styles as loginStyles,
} from '../src/features/auth/screens/LoginScreen/styles';

const croppedHero = require('../src/assets/login screen red background - Croped.png');
const fullHero = require('../src/assets/login screen red background.png');
const whiteLogo = require('../src/assets/full white color logo.png');
const oldLogo = require('../src/assets/connexis_logo_white_text.png');
```

Add a `describe('reference layout')` block with these tests:

1. **header-gradient hero**
   - `findByTestID('login-hero').type === LinearGradient`
   - `props.colors` equals `headerSpec.background.colors`
   - `props.start` / `props.end` equal `headerSpec.background`
   - `StyleSheet.flatten(loginStyles.hero).height === heroHeight` (225)
   - images contain **neither** `croppedHero` nor `fullHero`
2. **all-white wordmark**
   - images contain `whiteLogo`
   - images do **not** contain `oldLogo`
   - wordmark `resizeMode === 'contain'`
3. **TECHNOLOGIES replaces the tagline**
   - `findByTestID('login-brand-technologies').props.children === 'TECHNOLOGIES'`
   - `text('Secure • Smart • Connected')` is `undefined`
4. **light page**
   - `StyleSheet.flatten(loginStyles.root).backgroundColor === '#F7F7FB'`
5. **overlap**
   - `StyleSheet.flatten(findByTestID('login-card').props.style).marginTop === -cardOverlap`
6. **flat white fields**
   - `StyleSheet.flatten(loginStyles.inputRow)` matches
     `{ backgroundColor: '#FFFFFF', borderColor: '#E6EAF2', height: 52 }`
7. **footer is readable on the light page**
   - `footerText.color === '#5F6D87'` (was white-on-red)
   - `footerLink.color === '#E03131'`

**Run (expect RED):**

```
npx jest __tests__/LoginScreen.test.tsx
```

Expected: the new tests fail (card/testID missing, old assets rendered, white footer). Existing 137 tests still pass.

---

## Task 2 — GREEN (tokens)

**File:** `src/shared/theme/colors.ts`

Add next to the existing auth tokens:

```ts
// LOGIN RESTYLE (reference mock): light page behind the red hero, navy title,
// blue-grey copy, pale field outline. FLAGGED: auth-only additions.
authPage: '#F7F7FB',
authTitle: '#172136',
authMuted: '#5F6D87',
authFieldBorder: '#E6EAF2',
```

Check: `npx tsc --noEmit` still clean.

---

## Task 3 — GREEN (styles)

**File:** `src/features/auth/screens/LoginScreen/styles.ts`

- Delete `headerHeightPct`, `bgImage`, `header`, `tagline`.
- Logo: `logoW = 190`, `logoAspect = 2164 / 727`, `logoH = Math.round(logoW / logoAspect)` (=64).
- Add `heroHeight = 225`, `cardOverlap = 64`, `heroInsetTop = 12`.
- `root`: `backgroundColor: colors.authPage`.
- `scrollContent`: `flexGrow: 1` only (hero must be edge-to-edge).
- Add:
  - `hero`: `width: '100%'`, `height: heroHeight`, `overflow: 'hidden'`
  - `heroContent`: `flex: 1`, `alignItems: 'center'`
  - `technologies`: white, 13 / 600, `letterSpacing: 4.5`, `marginTop: 6`
- `logoImage`: `width: logoW`, `height: logoH`.
- `card`: `width: '86%'`, `maxWidth: cardW`, `marginTop: -cardOverlap`.
- `welcomeTitle.color`: `colors.authTitle`.
- `welcomeSub.color`, `fieldLabel.color`, `orText.color`: `colors.authMuted`.
- `inputRow`: `backgroundColor: colors.surface.card`, `borderColor: colors.authFieldBorder`.
- `inputRowFocused`: red border, white fill.
- `footer`: `marginTop: 'auto'`, `paddingTop: footerGap`, `paddingHorizontal: 20`.
- `footerText.color`: `colors.authMuted`; `footerLink.color`: `colors.red`.

Check: `npx jest __tests__/LoginScreen.test.tsx` moves closer to green (screen not updated yet; expect only screen-structure failures).

---

## Task 4 — GREEN (screen structure)

**File:** `src/features/auth/screens/LoginScreen/LoginScreen.tsx`

- Remove `useWindowDimensions` import and `const { height } = useWindowDimensions()`.
- Remove the full-bleed background `<Image source={...login screen red background.png} />`.
- Inside the `ScrollView`, replace the old `styles.header` block with the shared header gradient (add `headerSpec` to the theme import):

```tsx
<LinearGradient
  colors={[...headerSpec.background.colors]}
  start={headerSpec.background.start}
  end={headerSpec.background.end}
  style={styles.hero}
  testID="login-hero"
>
  <View style={[styles.heroContent, { paddingTop: insets.top + heroInsetTop }]}>
    <View style={styles.logoWrap}>
      <Image
        source={require('../../../../assets/full white color logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="Connexis"
      />
    </View>
    <Text testID="login-brand-technologies" style={styles.technologies}>
      TECHNOLOGIES
    </Text>
  </View>
</LinearGradient>
```

No hero image is rendered; the cropped asset stays unused.

- Add `testID="login-card"` to the card `View` and change the styles import from `{ headerHeightPct, styles }` to `{ heroInsetTop, styles }`.
- `scrollContent` inline padding becomes `{ paddingBottom: insets.bottom + 16 }`.

**Run (expect GREEN):**

```
npx jest __tests__/LoginScreen.test.tsx
npx jest
npx tsc --noEmit
npx eslint .
```

Expected: all tests pass; tsc 0 errors; eslint 0 errors (22 pre-existing warnings allowed).

---

## Task 4b — Fix: focused field hides behind the Android keyboard (found in Task 5)

**Evidence:** `ui-baseline/login-restyle/04-keyboard-password.png` — password field bottom at 541dp, keyboard top at 515dp, ScrollView did not move.

**Root cause:** `scrollToField` computes `covered` as `keyboardHeight.current` on iOS but `0` on Android, and `Dimensions.get('window').height` stays at the full 844dp under `adjustResize`. `safeBottom` is therefore 820dp and the overflow is never detected.

**Fix (TDD):**

1. RED — `__tests__/loginScroll.test.ts` against a new pure helper
   `src/features/auth/screens/LoginScreen/scrollMath.ts`:
   - no scroll when the field already clears the keyboard
   - field at y=491, h=50, window=844, keyboard=300 → delta 33 (21 overflow + 12 gap)
   - no scroll when the keyboard height is 0 and the field is visible
2. GREEN — implement
   `focusScrollDelta({ fieldY, fieldHeight, windowHeight, keyboardHeight })`
   with `SAFE_BOTTOM_PAD = 24` and `FOCUS_GAP = 12`.
3. Wire `LoginScreen.scrollToField` to the helper.
4. **Second device finding:** subtracting the keyboard from `Dimensions` still
   left the field ~4dp under the IME because the OS auto-scrolls and the real
   viewport is the resized ScrollView. Track `viewportHeight` via `onLayout`
   and use
   `min(viewportHeight, windowHeight - keyboardHeight)` as the usable height
   (keyboard = 0 to the helper, because the usable height already excludes it).
5. Re-run the suite, then repeat the password-focus device check.

---

## Task 5 — Device verification (`mobile-mcp`)

Prerequisites: Metro on 8081, device `192.168.0.198:34637` (390×844 dp), package `com.connexistracker`.

1. `mobile_list_available_devices` → select the device id.
2. Force-stop + relaunch (`adb shell am force-stop com.connexistracker`, then launch), wait 15–20 s.
3. Screenshot **at rest** → confirm: the shared header gradient fills the 225dp hero band (dark maroon top-right → brand red bottom-left, identical to an internal screen header), full-white wordmark, TECHNOLOGIES line, card overlap, flat white inputs, footer at the bottom, no clipped content.
4. Tap username → screenshot with keyboard → confirm card scrolls, no hero/card clipping, fields reachable.
5. Enter `demo` / wrong password → screenshot error banner.
6. Enter `demo` / `Demo@1234` → screenshot success (home) → log out to return to login.
7. Read the accessibility tree (`mobile_list_elements_on_screen`) and confirm the testIDs/labels are still exposed.

Save screenshots under `ui-baseline/login-restyle/`.

---

## Task 6 — Finish

- Update `PLAN-login-fix.md` with the restyle result + device evidence.
- Re-run the full gate: `npx jest && npx tsc --noEmit && npx eslint .`.
- Report: files changed, test counts, screenshots, any deviations.
- Commit/PR only on explicit request (the working tree already holds earlier uncommitted login work).
