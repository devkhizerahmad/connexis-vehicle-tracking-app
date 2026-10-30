# Native splash + standard splash→login hand-off

**Date:** 2026-10-30
**Symptom:** every cold start showed a blank cream page for 11–65 s, then the UI appeared;
the login hero sometimes rendered without the Connexis wordmark.
**Root cause:** a debug build fetches the **9.6 MB JS bundle and every image asset from
Metro over `adb reverse`** on each launch. The `ReactActivity` draws its first (empty)
frame immediately, so the Android starting window is gone long before React mounts —
leaving the flat `windowBackground` on screen. The JS splash overlay lives *inside* the
React tree, so it cannot paint either. Assets (the hero logo) are fetched the same way,
which is why the wordmark could be missing when the UI finally appeared.
**Goal:** one platform splash that reads as branding, hands straight over to Login, and
does not depend on Metro for QA builds.
**Non-goal:** changing any screen's layout or the login contract.

## Design

| Piece | File | Change |
|---|---|---|
| Wordmark bitmap | `res/drawable-nodpi/splash_logo.png` | copy of `src/assets/logo.png` (298×64, dark on transparent) |
| Window drawable | `res/drawable/splash_background.xml` | layer-list: `@color/splashBackground` + wordmark centred at 220×47 dp |
| Launch theme | `res/values/styles.xml` | `SplashTheme` (parent `AppTheme`) with `windowBackground=@drawable/splash_background` |
| Android 12+ | `res/values-v31/styles.xml` | `windowSplashScreenBackground=@color/splashBackground` |
| Activity theme | `AndroidManifest.xml` | `MainActivity` uses `@style/SplashTheme` **for its whole life** |
| Activity code | `MainActivity.kt` | no `setTheme` — the splash window must stay behind React until the first frame covers it |
| JS shell | `App.tsx` | **remove** the second (JS) splash overlay, its 600 ms floor and its fade |
| QA build | `app/build.gradle` | `-PembedBundle` bundles JS + assets into the debug APK (Metro-independent) |

Why this is the standard behaviour: Android's launch guidance is a single platform splash
that exits when the app's first frame draws — no JS splash, no artificial minimum duration,
no fade-out overlay. Keeping `SplashTheme` on the activity is what makes the hand-off
correct on *slow* starts: the branded window is still there while JS loads, then React's
first frame covers it.

## Tasks

1. **RED** — `__tests__/nativeSplash.test.ts`: manifest/theme/drawable wiring, colour parity
   with `colors.splash`, `MainActivity` has no `setTheme`, and `App.tsx` has exactly one
   splash. Run Jest → fails.
2. **GREEN** — add the native files, simplify `App.tsx`, add the `-PembedBundle` switch.
3. **Gates** — Jest, `tsc --noEmit`, ESLint.
4. **Build** — `assembleDebug -PembedBundle` (armeabi-v7a, the A02s ABI).
5. **Device proof** — install, force-stop, cold launch; screenshot at ~1 s (splash),
   ~3 s (Login with wordmark), then sign in and screenshot Home.
6. **Record** — capture timings in `reports/07-SPLASH-FIX.md`.

## Acceptance

- Splash screenshot shows the wordmark on cream, before React mounts.
- Login appears in ~1 s with the wordmark visible (embedded assets, no Metro fetch).
- Login contract tests unchanged and green; `tsc`/ESLint clean.
