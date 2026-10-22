# BIG Issues — release-blocking, user-visible, or security-critical

**20 findings.** Every one was re-verified against the source at review time.
Format: `ID · file:line · problem → impact → fix → evidence`.

---

## Security & data (3)

### B1 · `android/gradle.properties:109` · Google Maps API key committed and baked into the APK
- **Status: code-side FIXED during this review; rotation still required.** Key removed from the tracked file (both the live line and the commented copy), `.env` deleted, and `app/build.gradle` now resolves `MAPS_API_KEY` from `-P`, the environment, or `~/.gradle/gradle.properties` — never a tracked file. Release builds throw if it is missing; debug builds warn. Verified: debug merged manifest still contains a 39-char `AIza…` value, release config aborts with an actionable message. **Remaining: rotate the key in Google Cloud Console, add package + SHA-1 restrictions, purge it from git history.**
- **Problem:** A live-form key (`AIza…<redacted>`, 39 chars; a second copy sits commented at `:52`) is tracked. `.gitignore:81` lists `/android/gradle.properties`, but the file is already tracked so the rule has no effect. `android/app/build.gradle:89` injects it as `MAPS_API_KEY`, so it lands in the merged release manifest and the published APK.
- **Impact:** Anyone with repo access — or the APK — extracts the key and spends the project's billed Maps quota. Unrestricted keys are routinely harvested for quota theft. The file's own comment at `:108` says "ROTATE THIS KEY NOW".
- **Fix:** Rotate in Google Cloud Console **today**. Add Android-app restriction (package `com.connexistracker` + release SHA-1) and API restriction (Maps SDK for Android only). `git rm --cached android/gradle.properties`, purge history with `git filter-repo`, commit `gradle.properties.example`, inject from CI/local secrets.
- **Evidence:** `MAPS_API_KEY=AIza…<redacted>` present at HEAD; `git ls-files --error-unmatch android/gradle.properties` → tracked; 2 matches in the file.

### B2 · `android/app/build.gradle:106` · Release signed with the public debug keystore
- **Status: code-side FIXED during this review; keystore still required.** `buildTypes.release` no longer references `signingConfigs.debug`. A `release` signing config is built from `android/keystore.properties` (gitignored) when present, and any release task without it fails at configuration time. `android/keystore.properties.example` documents the four keys. **Remaining: generate the private keystore, create `android/keystore.properties`, keep it out of git.**
- **Problem:** `buildTypes.release` uses `signingConfig signingConfigs.debug`, whose credentials are the universally known `storePassword 'android'` / `keyPassword 'android'` (`:94`, `:96`). `android/app/debug.keystore` is itself tracked.
- **Impact:** Anyone can sign an APK with the identical certificate. A user with a side-loaded build accepts a malicious update with no signature mismatch, and the artifact carries no authenticity guarantee. Play Store will reject it outright.
- **Fix:** Generate a private release keystore outside the repo; read passwords from CI env or a gitignored `keystore.properties`; point `release` at it; keep the debug keystore for `debug` only.
- **Evidence:** `signingConfig signingConfigs.debug` inside `buildTypes { release { … } }` (line 106); `debug.keystore` tracked.

### B3 · `src/navigation/RootNavigator.tsx:64-93` · No authentication; kill/unlock reachable from cold start
- **Problem:** The root mounts the tab navigator directly. "Logout" only shows a toast (`ProfileScreen.tsx:94-106`, `TODO: navigate to the Auth flow`). `requestLockUnlock(action)` sends no token, no session, no actor identity; the swipe is the only gate.
- **Impact:** Anyone holding an unlocked phone sees every tracked vehicle (plates, home addresses, live location) and can lock/unlock/kill the engine. A stolen device equals full fleet control once the mock seam is replaced by a real endpoint.
- **Fix:** Auth stack before the tabs; per-vehicle authorization enforced server-side; biometric/device credential + audit record (actor, vehicle, action, timestamp) before kill/unlock.
- **Evidence:** `Tab.Screen` entries with no auth conditional; `showToast('Logged out')`; `engineControlService.requestLockUnlock(action)` resolves the action unchanged.

---

## Correctness — user-visible breakage (3)

### B4 · `src/features/map/components/PlaybackPanel/PlaybackPanel.tsx:44,66` · Play button never plays
- **Problem:** `const [playing, setPlaying] = useState(false)` and `togglePlay = useCallback(() => setPlaying(p => !p), [])`. No timer, no `requestAnimationFrame`, no animation driver advances `PlaybackScrubber`'s `progress`. The scrubber is rendered as `<PlaybackScrubber ref={scrubberRef} playback={playback} />` with **no `onScrub`**, so the timestamp row never updates either.
- **Impact:** Tapping Play shows the Pause glyph and the car never moves — the panel's headline feature is dead. Dragging moves the car but `playback.stamp` stays frozen, so the displayed time contradicts the playhead.
- **Fix:** Add a `useEffect` that, while `playing`, advances `progress.value` by `dt / durationMs`, stopping at 1 and clearing `playing`; wire `onScrub` to local state and derive `stamp` from it; clear the loop on pause/unmount.
- **Evidence:** grep for `setInterval|requestAnimationFrame|onScrub` in the file → **0 hits**; `togglePlay` body is a one-line state flip (line 66).

### B5 · `src/features/map/screens/LiveMapScreen/LiveMapScreen.tsx:27` · New `vehicleId` param ignored when the tab is already mounted
- **Problem:** `const [vehicleId, setVehicleId] = useState<string | undefined>(route?.params?.vehicleId)` copies the param once. `navigationHelpers.ts:9-12` dispatches `navigate('MapTab', { screen: 'LiveMap', params: { vehicleId } })`; React Navigation updates `route.params`, but the state copy never resyncs.
- **Impact:** Home → "View on Map" on Kia → back → "View on Map" on Honda → the Map tab still shows the Kia card, name and route while the header implies the new selection. Same for Details → Live Location.
- **Fix:** Derive from the param, or sync in an effect keyed on `route.params?.vehicleId`, keeping only the dropdown override in state.
- **Evidence:** `useState(route?.params?.vehicleId)` at line 27; only two effects in the file, neither keyed on the param.

### B6 · `src/` · Zero rejection handling; every screen has no loading / empty / error state
- **Status: FIXED during this review.** Added `src/shared/components/feedback/ScreenState` (spinner / error+Retry / empty, tokens only, 44pt action target, `accessibilityRole` on the title and button) plus `__tests__/ScreenState.test.tsx` (4 tests). `useVehicleList` and `useVehicleDetails` now return `{loading, error, retry}`; `useProfile` returns `{loadError, saveError}` and `save()` returns `null` on failure instead of claiming success. `.catch` added to every screen-level fetch: Home (list empty component), Details (header stays mounted), Reports, History, Engine Control, Live Map, plus `ControlSwipeCard.requestLockUnlock` (`.catch` + `.finally`). Verified on device (`R9YR30BS1LJ`): Home, Details, Live Map, History, Engine Control and Profile all render the loaded payload unchanged.
- **Problem (as found):** `.catch(` occurrences in `src/` → **0**. `try {` → **2**. `useVehicleList`/`useVehicleDetails`/`useProfile` expose `loading` and no screen destructures it. The `!data` branches render: a fully blank screen on Details (`DetailsScreen.tsx:57-63`, no header, no back), header-only shells on Reports (`:285-297`), Engine Control (`:177-189`), History (`:229-235`), and a silently empty list on Home (`:86`). No `ListEmptyComponent` anywhere.
- **Impact:** Any slow or failed fetch leaves a blank or header-only screen with no explanation, no retry, and no way back on Details. Unhandled promise rejections go to the log only. A TalkBack user hears an empty window.
- **Fix:** One `ScreenShell`/`EmptyState` (header + spinner + error + Retry), consume `loading`, add `.catch` to every service call, add `ListEmptyComponent`, and keep `AppHeader` mounted in every branch.
- **Evidence:** `.catch(` = 0; `try {` = 2; `ListEmptyComponent` = 0; the five `!data` guards listed above.

---

## Dead code & dependency hygiene (1)

### B7 · `package.json:17,22,23,27` · Four dead runtime dependencies + a dead `PaperProvider`
- **Status: FIXED during this review.** All four packages removed (`18 → 14` runtime deps); `PaperProvider`, its import and the 31-line `paperTheme` block deleted from `HistoryScreen`; `transformIgnorePatterns` allowlist cleaned. Re-verified: tsc 0 errors, eslint 0 errors, jest 28/28.
- **Problem:** `react-native-paper-dates` — 0 imports (3 comment mentions only). `lucide-react-native` — 0 imports. `react-native-svg` — 0 imports (icons are hand-built `View`/`Text` glyphs). `react-native-paper` — 1 import, used only to build `MD3DarkTheme` for a `<PaperProvider>` that wraps a subtree rendering **zero** Paper components (`HistoryScreen/index.tsx:29,82-103,238,312`).
- **Impact:** ~36 MB of `node_modules` (28.2 MB lucide + 7.7 MB svg + 4.6 MB paper), an autolinked native `rnsvg` CMake target compiled into every Android build, and the whole Paper barrel parsed on Hermes at cold start. The 22-line `paperTheme` looks load-bearing, so it will be kept alive by future maintainers.
- **Applied:** `npm uninstall react-native-paper react-native-paper-dates lucide-react-native react-native-svg` (26 packages removed, 39.5 MB); `paperTheme`, its import and the `<PaperProvider>` wrapper deleted from `HistoryScreen`; Jest allowlist cleaned. `gradlew clean` is still advisable before the next native build to drop the stale `rnsvg` CMake objects.
- **Evidence:** import counts — paper-dates 0, lucide 0, svg 0, paper 1 (HistoryScreen only), worklets 0 direct but required by Reanimated.

---

## Code quality & conventions (1)

### B8 · `src/shared/components/icons/index.tsx:1` · 1,521-line god file: 71 icons, 204 inline styles, 12 dead exports, 0 memoisation
- **Problem:** Every glyph in the app lives in one file. `style={{…}}` appears **204** times, `StyleSheet.create` **0**, `React.memo` **0**, raw `borderColor: '#FFFFFF'` at `:1579`. Twelve exports have zero importers outside the file (`StatusIcons`, `CircleGlyph`, `Tank`, `Wind`, `Leaf`, `FoldedMap`, `BoxIcon`, `FenceChipGlyph`, `ZoneBadge`, `PlayTriangleGlyph`, `ShuffleGlyph`, `DiamondMarker`).
- **Impact:** Breaks conventions 1–3 for the most-imported module in the app. Every screen pulls the whole barrel, so all 71 glyphs are parsed at startup with no tree-shaking; each glyph allocates 2–5 style objects per render (AssetCard alone renders ~13 glyphs). Icon edits mean reading a 1.5k-line file and invite merge conflicts.
- **Fix:** Split by domain (`icons/primitives|navigation|vehicle|map|reports|engineControl.tsx`), move static geometry into `icons/styles.ts` with a shared `GlyphFrame`, memoise each glyph, delete the 12 dead exports, replace the raw hex with `colors.white`.
- **Evidence:** measured — 1,521 LOC (`Measure-Object -Line`; 1,597 including blank-line accounting), 204 `style={{`, 0 `StyleSheet.create`, 0 `memo(`, 71 `export const`.

---

## Architecture (2)

### B9 · `src/features/*/types/*` + `DetailsScreen.tsx:80-131` · No shared vehicle domain model; 8 `as any` at the main seam
- **Problem:** Eight interfaces describe the same vehicle with disjoint field sets: `VehicleSummary`, `LiveMapVehicle`, `HistoryVehicle`, `EngineVehicle`, `ReportVehicleOption`, `VehicleOption`, `SelectFieldOption`, `VehicleStatusInfo`. The status union `'running'|'idle'|'stop'|'noData'` is declared twice (`home.ts:13`, `map.ts:17`) and widened to `| string` in `shared/types/vehicle.ts:9`. Route geometry is duplicated (`map.ts:11,45-48` vs `history.ts:6,9-12`). Those mismatches are bridged with 8 `as any` casts in `DetailsScreen.tsx` (`:80,103,110,111,119,120,125,131`) and `navigation?: any` at `:21`.
- **Impact:** The sole integration point where domain data meets presentational props is untyped. Rename a field in `details.mock.json` and it compiles clean, then fails at render. A real API needs a per-feature adapter, so the "one-layer swap" is actually five swaps.
- **Fix:** One `src/shared/types/domain.ts` (`Vehicle`, `VehicleStatus`, `RoutePoint`, `Segment`, `RouteStop`) reused via `Pick<>`/`&`; delete the duplicated geometry pairs; type the screen as `NativeStackScreenProps<HomeStackParamList, 'Details'>` like the other screens.
- **Evidence:** 8 interfaces; 3 declarations of the status union; 8 `as any` in one 141-line screen (repo total 9); `history.ts` imports nothing from `types/map.ts`.

### B10 · `RouteList/index.tsx:24-66` vs `RoutesCard/RoutesCard.tsx:89-138` · Route row implemented twice
- **Problem:** Two independent implementations of the same row (number badge, dashed connector, title, pin + sub-line, duration, tinted state pill). Only the *tokens* were converged; the component was not. `RouteList/styles.ts:26-56` re-declares `BADGE_FILL`/`PILL_FILL`/`STATE_INK`, which `src/shared/theme/routeRows.ts:89-107` already exports; `home/RoutesCard.tsx:49-50` re-implements the string→tone coercion a third time.
- **Impact:** Any row change (a11y, tap target, a fourth state, an icon) is a 4-file edit in 2 features. The convergence comments claim one source of truth that does not exist at the component level, so the next drift is invisible in review.
- **Fix:** Extract `src/shared/components/vehicle/RouteRow` owning badge/connector/text/pill; `RouteList` and `RoutesCard` become thin list wrappers.
- **Evidence:** duplicated `badgeColumn`/`badge`/`dashedConnector`/`subtitleRow`/`statePill` style blocks with identical values in both `styles.ts`; triple tone mapping.

---

## Performance (2)

### B11 · `RootNavigator.tsx:87`, `GeofenceMap/index.tsx:64`, `LiveMapView.tsx:157`, `HistoryMiniMap.tsx:63` · Every map surface stays mounted forever
- **Status: FIXED during this review.** `freezeOnBlur: true` added to the tab navigator and all five stacks (`HomeStack`, `MapStack`, `ReportStack`, `EngineControlStack`, `ProfileStack`). Inactive tab subtrees now freeze, so their maps stop rendering. Verified on device: tab switching still renders every map.
- **Problem:** `Tab.Navigator` sets only `screenOptions={{headerShown:false}}`. Bottom-tabs keeps visited screens mounted (view detach only), so the Engine Control map, the Map tab map and the History map are all resident simultaneously. **7 `<MapView` instances, 0 `freezeOnBlur`/`useIsFocused`/`unmountOnBlur` guards.**
- **Impact:** Three live Google map surfaces ≈ tens of MB of native heap on a 3 GB device. The repo's own measurement (`GeofenceMap/index.tsx:5-15`) is +9.2 MB PSS *per remount*; keeping every map mounted removes the only teardown that reclaims it, turning tab-thrashing into monotonic growth.
- **Fix:** `freezeOnBlur: true` in `screenOptions`, and gate each `MapView` on `useIsFocused()` so the subtree unmounts when its tab is inactive.
- **Evidence:** 7 `<MapView` occurrences; 0 focus/freeze guards in `src/`.

### B12 · `src/features/home/components/OverallActivity/OverallActivity.tsx:15-27,41-57` · Donut remounts its ring subtree every animation frame
- **Status: FIXED during this review.** `RingView` hoisted to module scope with explicit `size`/`radius`/`stroke` props, so the ring subtree is no longer remounted every frame; the count-up listener now throttles to ~31 fps; the donut exposes `accessibilityRole="progressbar"` with the live score.
- **Problem:** `animated.addListener(({value}) => setProgress(...))` calls `setState` on every JS-driven frame (`useNativeDriver: false`). `RingView` is declared **inside** the render body, so each `setProgress` creates a new component identity and React unmounts/remounts the ring + 4 rotated wrappers every frame.
- **Impact:** 900 ms at ~60 fps ≈ **54 full remounts + relayouts** of the 84 dp ring tree on the JS thread, exactly while the Details stack push animates and the rest of the screen mounts. Visible jank on the 4-core target device.
- **Fix:** Hoist `RingView` to module scope; drive the sweep with `useAnimatedStyle` (Reanimated 4 is already installed) or use the existing `useDonutProgress` hook, which throttles to 32 ms; never `setState` per frame.
- **Evidence:** `const RingView = ({ style }: { style?: any }) =>` inside `Donut` (line 41); `addListener` → `setProgress` (line 25); `useNativeDriver: false` (line 23).

---

## UX / accessibility (2)

### B13 · `src/features/profile/components/ProfileFormField/ProfileFormField.tsx:37-47` · Profile inputs have no accessible name
- **Status: FIXED during this review.** `ProfileFormField` now sets `accessibilityLabel` + `accessibilityHint` and a per-field `autoComplete`/`textContentType`/`autoCapitalize`/`returnKeyType` map (email no longer auto-capitalises). 23 other unlabelled `Pressable` controls got explicit labels and roles; the re-scan finds **0** unlabelled controls.
- **Problem:** The `<Text>` label is a sibling of `<TextInput>`; there is no `accessibilityLabel`, no `nativeID`/`accessibilityLabelledBy`, no `autoComplete`/`textContentType`, no `returnKeyType`, no validation.
- **Impact:** TalkBack announces four identical "edit box" fields — the user cannot tell First Name from Last Name from Email from Phone. The email field also auto-capitalises its first character (`profile.ts:44` sets only `keyboardType`).
- **Fix:** `accessibilityLabel={label}` (or `accessibilityLabelledBy`), `autoComplete`/`textContentType`, `returnKeyType="next"`, `autoCapitalize="none"` for email, and an inline error slot.
- **Evidence:** `ProfileFormField.tsx:36-47` — zero a11y props in the component.

### B14 · `AssetCard/styles.ts:95-99`, `colors.ts:70-72` · Unreadable text: 7.5 pt telemetry and 1.9–2.6:1 contrast
- **Status: FIXED during this review (telemetry sizes + status ink).** `batteryText` 7.5 → 10 pt and `grayText` → `grayStrong`; `moreDetails` → `grayStrong`; the three bright status fills (Running / Idle / No Data) now use dark ink instead of white, while the red Stop fill keeps white; Home user chip text is dark. The contrast values in `colors.ts` were not edited and `reportColors.rangeFill` was not touched.
- **Problem:** `batteryText` is `fontSize: 7.5` at `#7A8288` (3.9:1); `infoValue` 11 pt at 3.9:1; `moreDetails` 10 pt at 3.2:1. White text on status fills measures **2.1:1 (running), 1.9:1 (idle), 2.3:1 (noData)**; white on Home's user chip ≈ 2.0:1; white on `tileGold` 1.97:1. The failing ratios are already written in `colors.ts:70-72` as a known, unfixed defect.
- **Impact:** A low-vision user cannot read vehicle status, battery voltage, signal strength, current speed, last-update time, the account holder's name, or gold/grey report tile titles. 7.5 pt is below any usable minimum on a 390 dp device.
- **Fix:** Dark ink on light fills (`#1B1B1B`) or darken the fills to ≥4.5:1; minimum 12 pt for telemetry with `colors.text.label #4A4F54` (7.7:1); replace `#8A9199` with `#4A4F54`.
- **Evidence:** `colors.ts:71-72` comment states "Running 2.1:1, Idle 1.9:1, No Data 2.3:1 — the last three sit below the 3:1"; `fontSize: 7.5` at `AssetCard/styles.ts:95`.

---

## Testing (4)

### B15 · `src/features/profile/components/ProfileDobPicker/dob.ts` · DOB domain math has zero tests
- **Problem:** 98 LOC of pure logic — `isLeapYear`, `daysInMonth`, `parseDob`, `toIso`, `formatDob`, `clampParts`, `todayParts` — with no test file. `grep dob __tests__/` → 0.
- **Impact:** A wrong February in a leap year, or a regression that persists a future DOB, ships silently. `clampParts` returns `today` wholesale when the candidate is in the future, so a bad clamp corrupts month **and** day at once (see M7).
- **Fix:** `__tests__/dob.test.ts` — `daysInMonth` for Feb 2000/1900/2024 and the 30-day months; a `clampParts` table for (Jan 31 → Feb 28), (Feb 29 2023 → Feb 28), (Feb 29 2024 kept), (future year/month → today); `jest.setSystemTime('2026-10-22')` because `todayParts()` reads the wall clock.
- **Evidence:** no `__tests__/dob*`; `dob.ts:55` calls `dayjs()` directly.

### B16 · `PlaybackScrubber.tsx:58` · Scrubber untested **and** its callback is never wired
- **Problem:** No test imports `PlaybackScrubber` or `PlaybackPanel`. `fractionFromX` (div-by-zero guard), `skip` (±1/12 clamping) and `handleLayout` are unverified; `onScrub` is never supplied by the panel.
- **Impact:** Boundary overshoot, scrub-before-layout snapping to 0, and the dead callback all ship undetected. Nothing proves the transport buttons move anything.
- **Fix:** Test with `onLayout({width:200})` first (track width starts 0), then assert `skip(-1)` at 0 stays 0, 12 `skip(1)` reach 1 and a 13th does not exceed it, and a release at `locationX=300` reports 1.
- **Evidence:** `PlaybackScrubber.tsx:60-63` early-returns 0 while `trackWidth <= 0`; `PlaybackPanel.tsx:138` passes only `ref` and `playback`.

### B17 · `ControlSwipeCard/index.tsx:152-180` · Swipe-to-lock guard matrix untested
- **Problem:** Three guards (already-processing `:156`, nothing-armed `:163`, unmounted `:173`) and the `pendingActionRef` double-fire protection have no test. No test file mentions `ControlSwipeCard`, `LockUnlockRow` or `engineControlService`.
- **Impact:** Losing `pendingActionRef` — or allowing a double-fire in one tick, exactly why the ref exists — would issue two lock/unlock calls with no failing test. A swipe with nothing selected could lock a vehicle silently.
- **Fix:** Mock `rn-swipe-button` to capture `onSwipeSuccess`/`forceReset`; assert (a) no selection → notice, service not called, reset; (b) armed lock → one call, resolve notice; (c) two synchronous successes → exactly one call; (d) unmount mid-flight → no notice/state update. Use fake timers for the 800 ms service seam.
- **Evidence:** `engineControlService.ts:51-57` resolves after a real `setTimeout(…, 800)` with no injection point.

### B18 · `GeofenceMap/fitRegion.ts:19` · Geofence camera math untested
- **Problem:** 63 LOC of pure geometry (metres-per-degree, longitude shrink by `cos(lat)`, pad factor, degenerate-viewport fallback) with zero tests.
- **Impact:** A sign/unit regression silently crops the fence ring or returns a zero-delta region — only visible on a device. The `cos(lat)` division has no near-pole case pinned.
- **Fix:** `__tests__/fitRegion.test.ts` — region contains every pin and the full circle; `latitudeDelta/longitudeDelta > 0`; `viewW = 0` returns the state region unchanged.
- **Evidence:** imported only by `GeofenceMap/index.tsx`; no test imports either.

---

## Productivity / DX (2)

### B19 · repo root · No CI pipeline; every gate is manual
- **Status: FIXED during this review.** `.github/workflows/ci.yml` added: `npm ci` → `npm run typecheck` → `npm run lint` → `npm test -- --ci`, Node 22 with npm cache, 20-minute timeout, concurrency cancel.
- **Problem:** No `.github/workflows` directory; 0 `*.yml`/`*.yaml` outside `node_modules`. Gates are pasted into root files by hand — `gate_tsc.txt` and `gate_eslint.txt` are **0 bytes**, so they prove nothing.
- **Impact:** Every regression depends on one developer remembering three commands. A red PR merges unblocked and reviewers must trust untracked terminal output.
- **Fix:** `.github/workflows/ci.yml` on `push`/`pull_request`: `npm ci` → `npm run typecheck` → `npm run lint` → `npm test -- --ci --coverage`. Node 22.11 with npm cache.
- **Evidence:** no `.github` dir; `Get-ChildItem -Recurse -Include *.yml,*.yaml` → 0 outside `node_modules`.

### B20 · `package.json:5-11`, `tsconfig.json` · No `typecheck` script; bare `tsc` emits into `src/`
- **Status: FIXED during this review.** `"typecheck": "tsc --noEmit"` added to scripts; `"noEmit": true` added to `compilerOptions`; `lint` now passes explicit extensions (`.js,.jsx,.ts,.tsx`) so TS files can never silently drop out of the lint run.
- **Problem:** Scripts are only `android, ios, lint, start, test`. `tsconfig.json` sets neither `noEmit` nor `outDir`, so a bare `tsc` writes `.js`/`.d.ts` next to 180 source files. The project guide itself is inconsistent (`docs/PROJECT_GUIDE.md:18` says "tsc", `:349` says `npx tsc --noEmit`).
- **Impact:** Every developer types a 17-character command from memory each session; one forgetful run pollutes `src/` and poisons the next build. CI cannot call a stable name.
- **Fix:** `"typecheck": "tsc --noEmit"` + `"noEmit": true` in `compilerOptions`; update the guide to `npm run typecheck`.
- **Evidence:** `package.json:5-11` has no `typecheck`; `tsconfig.json` has only `strict`, `paths`, `exclude`, `include`.
