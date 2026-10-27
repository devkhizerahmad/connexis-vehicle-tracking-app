# Login screen repair + auth-flow hardening — plan

## Evidence (Phase 1)
- `npx tsc --noEmit` → clean.
- `npx jest` → 14 suites / 119 tests pass.
- `npx eslint` → 3 errors (App.tsx x2 unused props, LoginScreen `SCREEN_W` unused).
- Device 780x1688 @2x (390x844 dp), app installed + focused, Metro up.
- `uiautomator dump` on the login screen:
  - logo `ImageView` bounds `[0,64][780,1613]` → fills the whole viewport.
  - tagline `TextView` bounds `[0,0][0,0]` → zero-size.
  - card / inputs / footer: not laid out at all (pushed off screen).
- Screenshot confirms: giant white letter art + no card.

## Root causes
1. `logoWrap` has no width/height while `logoImage` is `width:'100%' height:'100%'`
   → the image resolves against the ScrollView box and eats the whole screen.
2. Login button `TouchableOpacity` has no width; the gradient's `width:'100%'`
   resolves against the content-sized touchable → never full width.
3. `CARD_MARGIN_TOP` is computed from module-level `Dimensions` and a stub logo
   height → card lands off-screen once (1) is fixed.
4. No safe-area insets; content sits under the status bar and gesture bar.
5. `KeyboardAvoidingView behavior="height"` on Android while the manifest is
   `adjustResize` → double compensation; scroll math uses a hard-coded 260px.
6. Auth is a stub: `login()` with no args, no validation, no loading, no error
   handling, no session lifetime → not standards-compliant.
7. Accessibility: no labels/roles/states, no error announcements, "Remember Me"
   label is a bare `<Text onPress>`, eye toggle exposes no state.
8. Contrast: `#7A8288` body/placeholder text is 3.6–3.9:1 on white/page (needs
   ≥4.5:1).
9. Eye icon is a capsule/ellipse, not an almond; lock body is solid, reference
   is outlined.

## Work
- [x] `src/features/auth/types/auth.ts` — typed session + error contract.
- [x] `src/features/auth/services/authService.ts` — async mock auth, generic
      errors, attempt lockout, opaque expiring token, no password retention.
- [x] `src/features/auth/services/rememberedUsername.ts` — storage adapter.
- [x] `src/features/auth/context/AuthContext.tsx` — session state, expiry,
      login/logout, bootstrapping status.
- [x] `LoginScreen` — safe area, responsive layout, validation, inline errors,
      loading/disabled state, a11y, autofill hints, keyboard flow.
- [x] `styles.ts` — logo sizing, button width, contrast tokens, keyboard pad.
- [x] `icons/auth.tsx` — almond Eye/EyeOff + outlined Lock.
- [x] Lint fixes in `App.tsx`.
- [x] Tests: login validation/error/loading/success, auth service, context.
- [x] Static gates: typecheck, jest, eslint.
- [x] Device E2E: rest, keyboard-open, scrolled, error, success, logout.

## Standards applied (OWASP ASVS / NIST 800-63B)
- Generic credential error (no user enumeration), same latency on every path.
- Client rate-limit feedback with retry-after after 5 failed attempts.
- Password accepted verbatim (no truncation/trim), masked by default, reveal
  control, paste allowed, password-manager autofill tokens.
- Opaque session token with absolute expiry; logout invalidates; auto sign-out.
- Required-field validation only; never enforce composition rules at sign-in.
- Labelled controls, ≥44dp targets, contrast ≥4.5:1, live-region errors.

## Device E2E evidence (Samsung, 390x844 dp, `com.connexistracker`)

| Check | Result | Evidence |
| --- | --- | --- |
| Rest render (`cover` bg, card, footer) | PASS | screenshot `login2.png`; card `[50,406][730,1420]`, footer fully visible |
| Username focus + soft keyboard | PASS | field scrolls above IME, no double-compensation jump |
| IME "next" → password | PASS | focus moves to password |
| Password masked + reveal toggle | PASS | `password=true` → toggle → plaintext `Demo@1234` → toggle → masked |
| Loading state | PASS | label swaps to "Signing in…", control disabled |
| Valid login | PASS | `demo` / `Demo@1234` → Home renders with vehicle data |
| Wrong password | PASS | banner: "Incorrect username or password. Please try again." (generic, no user enumeration) |
| 5-attempt lockout | PASS | attempt 5 → "Too many failed attempts. Try again in 30 seconds."; immediate retry → same message with 25s |
| Lockout expiry | PASS | after 31 s, correct credentials log in |
| Remember Me prefill | PASS | login with Remember Me → logout → username `demo` prefilled, checkbox checked |
| Cold start persistence | LIMITATION | force-stop → relaunch → username empty (in-memory store, no native storage module) |
| Logout round trip | PASS | Profile → Logout → confirm → login screen |
| Bottom-nav Profile tab | PASS | tabs hit area starts at y≈1574 px; earlier miss was a bad tap coordinate, not an app bug |

### Background corner decorations (`resizeMode="cover"`, 1024x1536 asset → 390x844)
- Top-left diagonal streak: **visible**.
- Top-right target rings: **not visible** (cropped/off-viewport).
- Bottom-left target rings: **not visible** (cropped/off-viewport).
- Bottom-right diagonal streak: **not visible** (cropped/off-viewport).
- Measured on device: the right-edge strip (x 700–779) and the bottom-left strip
  (x 0–45, y 1100–1600) show flat background luminance (no ring arcs).
- Mode was **not** changed. Recommendation: ship a 390x844-cropped background
  asset (or a taller artboard) if the corners are required brand elements.

---

## Restyle to `design-references/Login Screen.png` (2026-10-27)

**Plan:** `docs/superpowers/plans/2026-10-27-login-reference-restyle.md`

### What changed
- Hero is a `LinearGradient` filled with the shared `headerSpec.background`
  ramp (`#2A0508 → #C0110F`, start top-right → end bottom-left) — the exact same
  diagonal every internal screen header paints — in a 225dp band. No hero image
  is rendered; both `login screen red background.png` and the cropped variant
  are unused.
- Logo is `src/assets/full white color logo.png` (2164×727) at 190dp wide,
  with a letter-spaced `TECHNOLOGIES` line underneath; the
  "Secure • Smart • Connected" tagline is gone.
- The card is 86% wide (max 340dp) and rides 64dp onto the hero; the footer sits
  on a `#F7F7FB` page with `marginTop:'auto'` so it parks at the viewport bottom.
- Inputs are flat white with a pale `#E6EAF2` outline and the existing pink icon
  tile; title/labels/copy use the reference navy `#172136` and blue-grey
  `#5F6D87`.
- Login button intentionally keeps the app-header gradient
  (`#E03131 → #C0110F → #2A0508`), not the reference's lighter red.
- All pinned testIDs, `StatusBar light-content`, `Welcome Back!`, and the red
  dash `#E03131` are unchanged.

### Focus-scroll fix found during device verification
- **Bug:** with an inline error banner, focusing the password field left it
  partially behind the IME. The old math used `covered = 0` on Android and
  `Dimensions.get('window').height` (still 844dp under `adjustResize`), so no
  overflow was ever detected.
- **Fix:** `src/features/auth/screens/LoginScreen/scrollMath.ts` — pure
  `focusScrollDelta` helper (24dp safe pad + 12dp gap), tested in
  `__tests__/loginScroll.test.ts`. The screen now measures the ScrollView's own
  viewport with `onLayout` and re-runs the scroll after `keyboardDidShow`.
- **Verified:** before `ui-baseline/login-restyle/04-keyboard-password.png`,
  after `ui-baseline/login-restyle/07-password-error-focus-fixed.png` and the
  final gradient-build run `14-error-password-focus.png` (field bottom 466dp,
  IME top 503dp).

### Device evidence
| Check | Result | Evidence |
| --- | --- | --- |
| Rest render vs reference | PASS | `ui-baseline/login-restyle/12-rest-gradient.png` |
| Hero matches the internal header ramp | PASS | `12-rest-gradient.png` vs `15-home-after-login.png` — same `headerSpec.background` diagonal; hero is a 450px (225dp) `LinearGradient`, no image node |
| Error banner layout | PASS | `ui-baseline/login-restyle/13-error-gradient.png` |
| Username focus / IME | PASS | `ui-baseline/login-restyle/03-keyboard.png` (password first focus `06-…png`) |
| Error + password focus clears IME | PASS | `ui-baseline/login-restyle/07-password-error-focus-fixed.png`, `14-error-password-focus.png` |
| Success login + logout round trip | PASS | `15-home-after-login.png` → `16-after-logout.png` |
| TestIDs exposed to a11y tree | PASS | `login-hero`, `login-card`, `login-brand-technologies`, plus all pinned form IDs |
