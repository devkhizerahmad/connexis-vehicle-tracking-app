# ConnexisTracker — Project Guide

React Native vehicle-tracking app (Connexis). This guide covers architecture essentials; UI pixel specs live in `ui-baseline/baseline_record.json`.

## S1 — Boot Flow

```
index.js (AppRegistry)
  └─> App.tsx
        ├─ RootNavigator mounts IMMEDIATELY on first frame (exactly once, never remounts)
        └─ SplashOverlay (absolute-fill, zIndex 1000, bg colors.splash #F8F3F3) sits ON TOP
             ├─ logo spring + 800ms fade (both useNativeDriver: true)
             ├─ dismiss condition: NavigationContainer.onReady fired AND >= 2400ms elapsed
             ├─ fade 1 -> 0 over 300ms, then overlay unmounts (splashGone)
             └─ native safety net: android:windowBackground=@color/splashBackground
                (android/app/src/main/res/values/styles.xml + colors.xml) — the window
                paints cream during any pre-JS frame gap instead of black
```

Result: cold-start sequence is cream splash → smooth 300ms fade → Home painted; no black flash.

Source of truth: `colors.splash = '#F8F3F3'` in `src/shared/theme/colors.ts` **must** match
`<color name="splashBackground">#F8F3F3</color>` in `android/app/src/main/res/values/colors.xml`.
NOTE: native XML changes require a full rebuild (`npx react-native run-android`), not a Metro reload.

## S2 — Navigation

- `src/navigation/RootNavigator.tsx`: bottom-tab navigator (Home, Report, Engine Control, Map, Profile) with custom `BottomNav` tab bar; accepts optional `onReady` wired to `NavigationContainer.onReady`.
- Tab bar hidden on `ProfileTab` (Profile renders its own full-bleed header + no tab bar).
- Home/Report/EngineControl/Map stacks: `headerShown: false`; screens use shared `AppHeader`.

## S3 — Shared header rule

`AppHeader` = device inset + 100dp total height; title center at inset + 60 (`contentHeight` / `contentCenterOffset` props). Details + Profile keep the header OUTSIDE their ScrollViews? — No: both render the header as the first child inside scroll content where z-order matters (Profile avatar overlap = exactly 10dp over the gradient).

## S4 — Baselines / regression

`ui-baseline/` holds 16 frozen reference PNGs + `baseline_record.json` (SHA-256 per crop + interaction notes: Details fixed header on scroll; scroll round-trip 0 differing rows; avatar overlap 10dp). Compare at 390×844dp (device 780×1688 @2x), excluding the right-edge stride artifact (x ≥ 374).

## S5 — Performance contract (G10)

Home screen idle re-renders must be 0 after settle; no `console.*` in `src/`; no static `style={{...}}` in new/patched code (styleFactories / theme tokens only).
