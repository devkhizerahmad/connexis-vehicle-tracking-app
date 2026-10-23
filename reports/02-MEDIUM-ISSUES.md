# MEDIUM Issues — real risk, recurring cost, or barrier

**61 findings.** Grouped by dimension. Format: `ID · file:line · problem → impact → fix → evidence`.

---

## Correctness / reliability (9)

### M1 · `ControlSwipeCard/index.tsx:172-179` · A failed lock/unlock wedges the rail forever
- **Status: FIXED during this review.** Request now has `.catch` (notice: "Could not reach the vehicle. Try again.") and `.finally` (always resets `processingRef`, `processing` state and the rail). `pendingAction` clears only on success, so the user can swipe again.
- **Problem:** `.then(...)` has no `.catch`/`.finally`. `setState(true)` runs immediately and `processingRef.current`/`pendingActionRef.current` are cleared only inside the success branch (and in the `unmountedRef` branch).
- **Impact:** One rejected `requestLockUnlock` leaves the control disabled, the rail filled, and the promise rejection unhandled. Only a full remount recovers.
- **Fix:** `try/catch/finally`; always clear `processingRef`/`pendingActionRef` in `finally`; surface `error` through the existing notice pattern.
- **Evidence:** line 178 has `.then(...)`; grep `.catch|.finally` in the file → 0.

### M2 · `ReportsScreen.tsx:81` · New `vehicleId` param ignored on an already-mounted tab
- **Status: FIXED during this review.** Same pattern as B5: `incomingVehicleId` derived, `useEffect` syncs `selectedVehicle`, param consumed via `setParams`. Verified on device: Report tab already mounted showed Toyota Vitz (JSB-8735); tapping "Reports" on Kia Sportage (LZA-8735) switched the mounted tab to Kia Sportage.
- **Problem:** Same defect class as B5: `const [vehicleId, setVehicleId] = useState<string | undefined>(route?.params?.vehicleId)`.
- **Impact:** Reports stays on the previous vehicle after selecting another one from Home/Details.
- **Fix:** Sync from `route.params?.vehicleId` in an effect, or derive instead of copying.
- **Evidence:** `useState(route?.params?.vehicleId)` at line 81.

### M3 · `vehicleService.ts:13` · Vehicle details ignore the requested id
- **Status: FIXED during this review.** `getVehicleDetails(id)` now looks up the requested vehicle in `vehicles.mock.json` and relabels the single mock detail body with that vehicle's name (mock files untouched - the swap happens in the service). Verified on device: tapping "More Details" on Suzuki Mehran (LZA-8735) now shows a Details header reading "Suzuki Mehran (LZA-8735)" instead of the hardcoded "Honda Civic (LFA-1464)". New `__tests__/vehicleService.test.ts` (3 tests) locks the contract: known id relabels, unknown id falls back to the base payload.
- **Problem:** `getVehicleDetails: async (_id: string) => detailsMock` — the id is discarded, so every vehicle shows the Honda payload (plate, battery, 1.2 bar, last-update text).
- **Impact:** Details is wrong for every non-Honda vehicle; the bug is invisible because the mock is self-consistent.
- **Fix:** Key `details.mock.json` by vehicle id (`Record<string, VehicleDetailsData>`) and select by `_id`; return a typed `NotFound`.
- **Evidence:** `_id` prefixed with `_`; body returns `detailsMock as unknown as VehicleDetailsData`.

### M4 · `HistoryScreen/index.tsx:131,153` · Load failures swallowed; screen goes blank
- **Status: FIXED during this review.** Both fetches now `.catch` into `loadError`; the `!data` branch keeps `AppHeader` and renders `ScreenState` with a working Retry (`attempt` counter). Verified on device with the loaded payload.
- **Problem:** `.then(setData)` with no `.catch`; `!data` renders panel + `MapView` only (`:229-235`), no header, no message, no retry.
- **Impact:** A rejected history fetch looks like an empty page. User cannot distinguish "no trips" from "request failed".
- **Fix:** `error` state + `ErrorState` with Retry; keep `AppHeader` mounted.
- **Evidence:** `!data` guard at `:229`; no `.catch` in the file.

### M5 · `EngineControlScreen/index.tsx:80-89` · Load failure swallowed; header-only shell
- **Status: FIXED during this review.** Fetch has `.catch` into `loadError`; `!data` keeps `AppHeader` and renders `ScreenState` with Retry. Verified on device.
- **Problem:** `.then((d) => { if (active) setData(d) })`, no rejection branch; `!data` renders only `AppHeader` (`:177-189`).
- **Impact:** The screen silently stays empty on failure; the swipe control never appears and the user gets no explanation.
- **Fix:** Same `ScreenShell` + error/retry pattern.
- **Evidence:** `cancelled` flag at `:79`; no `catch`.

### M6 · `ProfileScreen.tsx:89`, `useProfile.ts:65-70` · Save always reports success; `saving` can wedge
- **Status: FIXED during this review.** `save()` now returns `ProfileUpdateResult | null` inside `try/catch/finally`; `saving` always clears; `saveError` is exposed. `handleUpdate` toasts success only when `result.ok`, otherwise "Could not update your profile. Try again." Verified on device: mock save still shows "Profile updated successfully".
- **Problem:** `setProfile(next); showToast('Profile saved')` runs immediately in the screen; the hook resolves after a fake 700 ms and has no rejection path. If it rejected, `saving` would never reset.
- **Impact:** The UI claims persistence before it happens, and a failed write is reported as success. Save can leave the button permanently disabled.
- **Fix:** `await` the service, toast on resolve, error on reject, `finally { setSaving(false) }`.
- **Evidence:** toast fires in the synchronous handler; `saving` set false only in the success path.

### M7 · `dob.ts:98-102` · A future DOB silently becomes *today*
- **Status: FIXED during this review.** `clampParts` now clamps COMPONENT-WISE instead of returning `today` wholesale: the day is first pulled back to the chosen month's real length (leap-aware), then a future year becomes the current year, a future month becomes the current month, and only then a future day becomes today — each segment keeps as much of the user's intent as the rule allows. `{2030, 5, 15}` now yields `2026-05-15` (it used to yield `2026-10-22`, silently rewriting month and day on a picker that auto-saves on close). `__tests__/dob.test.ts` pins the three cases plus a future Feb 29.
- **Problem:** `clampParts` returns `today` wholesale when the candidate is after today, instead of clamping to the nearest valid date, and `ProfileDobSheet` auto-saves on close.
- **Impact:** Selecting a future year/month rewrites month **and** day to today and persists it — a quiet data-corruption path with no message.
- **Fix:** Clamp component-wise (year → current year, month → current month, day → min(day, today)) and show a notice; or reject with an inline error instead of auto-saving.
- **Evidence:** `if (isAfter(candidate, today)) return today;` at `:101`.

### M8 · `PlaybackPanel.tsx:48`, `PlaybackScrubber.tsx:53` · Transport state does not resync on new payload
- **Status: FIXED during this review.** The panel resets `playing`, the playhead and the Hour/Min chips whenever the payload changes (`playback.stamp` / `initialProgress` / `durationMinutes` / `filters.default*`), and `PlaybackScrubber` re-seeds its shared value from `playback.initialProgress` on change (its own `useEffect`), so a re-render or a new trip no longer leaves the playhead on the previous position.
- **Problem:** `hour`/`minute` initialise from `playback.hour/minute` once; `progress` is a `useSharedValue(0)` seeded once from `playback.progress`. Changing vehicle/trip leaves the old hour/minute/duration/speed in the panel and the previous position on the slider.
- **Impact:** Switching trips shows the new route geometry with the old trip's time, duration, and playhead.
- **Fix:** Reset in an effect keyed on `playback` (and on `ref.current?.reset()`), or key the panel by trip id.
- **Evidence:** `useState(playback.hour)` pattern at `:48-50`; `useSharedValue` initialised from props once.

### M9 · `HistoryScreen/index.tsx:129,148` · Two history fetches fire on mount
- **Problem:** One effect loads the initial range, a second loads the effective range; both run on first mount because the draft is seeded from the same window.
- **Impact:** Double network cost and a state-update race on the same `setData`; one result can overwrite the other.
- **Fix:** Single effect keyed on the effective range; seed the draft inside the same effect.
- **Evidence:** two `getHistoryData().then(...)` calls (`:131`, `:150`) reached on mount.
- **Status: FIXED during this review.** History now has ONE request through `useAsyncData`, keyed on `${vehicleId}|${from~until}`. The payload's own range is recorded in `seededRangeRef` before `setRange` runs, and `requestRange` ignores a range equal to the seeded one — so seeding the calendar no longer retriggers an identical fetch. The single effect also seeds month/year/draft in one place. Covered by `useAsyncData`'s key-change test; verified on device (History opens with one fetch, range change still refetches).

---

## Testing (7)

### M10 · `__tests__/ReportsScreen.test.tsx:307-334` · The contiguous-highlight test cannot fail
- **Problem:** The canvas is closed at the current month, so the left-arrow is disabled and never actually walks across the range boundary — the assertion holds for any implementation, including a broken one.
- **Impact:** The one contract the range calendar exists to guarantee (one contiguous painted band in every 42-cell window) is unguarded.
- **Fix:** Freeze the clock inside the range, drive the arrow callback directly, and assert painted cells on both sides of a month boundary plus a fully-outside window.
- **Evidence:** `getByLabelText('Previous month').props.disabled === true` inside the assertion.

### M11 · `__tests__/ReportsScreen.test.tsx:1` · Never mounts `ReportsScreen`
- **Problem:** 596 lines render `ReportTile`, `DateRangeCalendar`, `HourMinPicker`, `reportsService`, router config — never the screen. B3/B5-class defects are outside its reach.
- **Impact:** The heaviest screen (396 LOC, 12 `useState`, 8 handlers) has no test that its own composition works.
- **Fix:** One mount test with mocked services asserting tab/segment switching, the empty-range reset, and the vehicle-change resync.
- **Evidence:** no import of `ReportsScreen` in the file.

### M12 · `__tests__/ReportsScreen.test.tsx:513-533` · Draft-range promotion untested
- **Problem:** `setInitialRange(result.end, result.end)` is asserted only as "the callback fires"; the draft promotion (`[draft.start, draft.end]`) and the post-apply reset are unverified. `:365` and `:403` assert on inline `dateRange` literals.
- **Impact:** A regression that drops `draft.start` or keeps a stale draft after Apply ships silently.
- **Fix:** Assert the full resulting range object after the apply callback, including the case where only the end date changed.
- **Evidence:** `expect(onApplyRange).toHaveBeenCalledWith(…)` asserts the mock call, not the resulting state.

### M13 · `__tests__/` · All five hooks untested; no React Native Testing Library
- **Problem:** `useProfile`, `useVehicleList`, `useVehicleDetails`, `useCollapsible`, `useDonutProgress` have no tests. `@testing-library/react-native` is not a dependency, so there is no ergonomic way to test them.
- **Impact:** Loading/error/cancellation branches — the exact code paths where B6 lives — are unreachable by the current suite.
- **Fix:** Add `@testing-library/react-native` as a devDependency (dev-only; the runtime dep count stays 18) and test each hook's loading → data / loading → error / unmount → no-setState paths with fake timers.
- **Evidence:** `grep use[A-Z] __tests__/` → 0 hook imports.

### M14 · `__tests__/` · 4 of 5 services untested
- **Problem:** Only `mapService` has tests. `vehicleService`, `historyService`, `reportsService` (payload only), `engineControlService`, `profileService` have no behavioural tests.
- **Impact:** The seam that the real API will replace has no contract test, so the swap will be validated only by manual tapping.
- **Fix:** One test per service asserting signature, shape conformance to the domain type, latency/failure propagation and `_id` selection (which would have caught M3).
- **Evidence:** only `mapService.test.ts` (44 lines) exists.

### M15 · `__mocks__/react-native-maps.js` · Map and gesture paths are unreachable in tests
- **Problem:** The `MapView`/`Marker`/`Polyline` mock renders `null`, and `rn-swipe-button` has no mock, so map composition, playback scrubbing and swipe guards cannot be exercised.
- **Impact:** B4, B11, B16, B17 — the highest-risk interactive surfaces — are permanently outside the test suite.
- **Fix:** Ship functional mocks that expose props (region, markers, `onSwipeSuccess`) and assert against them.
- **Evidence:** map mock exports `null` components; no `__mocks__/rn-swipe-button*`.

### M16 · `jest.config.js` · No coverage config, thresholds, or CI wiring
- **Problem:** The preset has no `collectCoverage`, `coverageThreshold`, `coveragePathIgnorePatterns`, or `transformIgnorePatterns` for new ESM deps.
- **Impact:** Coverage is unknown and unenforced; a 5% number can silently become 3%. The 96-second runtime also means nobody runs it casually.
- **Fix:** Add coverage with a floor (e.g. 15% rising per sprint), ignore `mocks/`, and reduce suite time by replacing real-timer waits with fake timers.
- **Evidence:** `jest.config.js` is 3 lines of preset + `setupFiles`.

---

## Code quality / conventions (9)

### M17 · 5 screens · Toast state machine duplicated with divergent cleanup
- **Problem:** `const showToast` appears in 5 files (HomeScreen, DetailsScreen, HistoryScreen, EngineControlScreen, ProfileScreen) with drifted timings (2500/3000/3200/2400 ms) and JSX copies. Home and Details never clear the timeout on unmount.
- **Impact:** A toast change is a 5-file edit; two of them leak a timer and can `setState` after unmount.
- **Fix:** One `useToast()` hook + one `<Toast>` component in `shared`; delete all five copies.
- **Evidence:** 5 `const showToast` occurrences; no `clearTimeout` in HomeScreen/DetailsScreen.
- **Status: FIXED during this review.** New `src/shared/hooks/useToast.ts` owns the message, the single `Animated.Value`, the dismiss timer and the unmount cleanup. New `src/shared/components/feedback/Toast/{Toast.tsx, styles.ts, index.ts}` is the only toast surface (navy pill, 24 pt insets, `pointerEvents="none"`, default offset `bottomNav + insets.bottom + 12`). All five screens now call `const { message: toast, anim: toastAnim, showToast } = useToast()` and render `<Toast …/>`; every per-screen `toast`/`toastText` style and timer ref is deleted. Profile passes `bottom={profileTokens.space.toastBottom}` because it hides the tab bar. `__tests__/useToast.test.tsx` (5 tests) locks show / auto-clear / timer restart / no-setState-after-unmount. Verified on device (SM-A025F): Home bell, Details "Select", EC "Change Fence", Profile "Update profile", Reports "History Report" all show and fade away.

### M18 · 12 component files · `StyleSheet.create` embedded with no `styles.ts`
- **Problem:** The stated convention is `ComponentName/{ComponentName.tsx, styles.ts, index.ts}`. Twelve components create styles inline in the `.tsx` (`map/LiveMapView`, `map/HistoryMiniMap`, `map/HistoryListRow`, `map/HistorySummaryPanel`, `reports/ReportTile`, `reports/HourMinPicker`, `controls/Collapsible`, `controls/DateRangeField`, `profile/ProfileDobPicker/ProfileDobSheet`, and 3 more).
- **Impact:** Screens and styles interleave, so component files are 1.5–2× longer than the convention implies; style diffs pollute logic diffs.
- **Fix:** Move the blocks to sibling `styles.ts`; adopt the pattern in the 12 files as they are touched.
- **Evidence:** 12 files contain `StyleSheet.create` with no sibling `styles.ts`.

### M19 · `SelectField.tsx:3-12`, `SelectVehicleField.tsx`, `DateRangeField.tsx`, `ProfileDobField.tsx` · Four competing field-trigger primitives
- **Problem:** Four components solve "label + tap target + chevron" with different accessibility, invalid-state handling, and styling. `SelectVehicleField` has no `accessibilityRole`/`label`; `DateRangeField` is highest-level but also does layout.
- **Impact:** Four places to fix any field-level a11y or interaction bug — directly visible in B13/M54. New fields copy one of four patterns.
- **Fix:** One `FieldTrigger` (label, value, chevron, `accessibilityRole="button"`, `invalid`) and let the four call sites compose it.
- **Evidence:** four separate Pressable+chevron implementations; only two set `accessibilityRole`.

### M20 · `Collapsible.tsx`, `useCollapsible.ts`, `AssetCard` local sensor strip · Three collapse implementations
- **Problem:** The shared `Collapsible` primitive (drives everything through one `Animated.Value` on the JS thread), a `useCollapsible` hook, and a hand-rolled sensor strip in `AssetCard`.
- **Impact:** Three different animation curves/behaviours for the same gesture; the shared one is the heaviest (see M34).
- **Fix:** Keep `useCollapsible` + Reanimated, delete the local copy, and reimplement `Collapsible` on top of it.
- **Evidence:** three independent expand/collapse state machines.

### M21 · `src/shared/theme/colors.ts:70` · 53 hex literals, 34 reachable through 2–5 aliases, `brand: {}` empty
- **Problem:** `#1E63E9` appears as `primary`, `accent`, `brandBlue` and two semantic names; `brand` is an empty object; `statusRunningFill`/`statusIdleFill` carry the failing-ratio comment.
- **Impact:** A palette change is ambiguous (which alias?), and the same colour can drift between aliases without review noticing.
- **Fix:** One canonical name per colour; aliases must be `export const x = canonical` references, not new literals; delete `brand` or populate it.
- **Evidence:** 53 hex values, 34 aliased, `brand: {}`.

### M22 · `App.tsx:40-41`, `LiveMapScreen/styles.ts:149`, `HistoryMiniMap`, `HistoryListRow` · 24 raw hex values outside the theme
- **Problem:** `App.tsx` uses `'#F6F5F1'`/`'#FFFFFF'`; `LiveMapScreen/styles.ts` has `'#000000'`/`'#FFFFFF'`; two map sub-components hardcode their palette.
- **Impact:** A theme change misses these, producing visible mismatches that pass lint and typecheck.
- **Fix:** Replace with `colors.*`; add an ESLint rule (or a custom regex check) banning `#[0-9A-Fa-f]{3,8}` outside `src/shared/theme`.
- **Evidence:** measured sweep — 24 occurrences outside the theme (21 src + 3 App.tsx).

### M23 · repo-wide · Naming/structure drift
- **Problem:** 21 components are `index.tsx` rather than `ComponentName.tsx`; three screen layouts (`Screen/index.ts`, `Screen/index.tsx`, `Component/index.tsx`); 5 components export both default and named; `ReportTile` names three different things.
- **Impact:** Finding the implementation of a component varies by folder; refactor tooling and review checklists cannot be mechanical.
- **Fix:** Pick one layout and add a check; rename `index.tsx` → `ComponentName.tsx` opportunistically.
- **Evidence:** measured counts above.

### M24 · `ReportsScreen.tsx` · 396 LOC, 12 `useState`, 8 handlers
- **Problem:** The screen owns range state, draft state, segment state, hour/minute state, vehicle state, toast state, and the whole composition. Nothing is extracted to hooks.
- **Impact:** Every keystroke-level state change re-renders the whole tree; the file is the hardest to review and to test (M11).
- **Fix:** Extract `useReportRange` / `useReportFilters`; split the body into `<RangeSection>`, `<TypeSection>`, `<HourSection>`.
- **Evidence:** 396 LOC; 12 `useState`; 8 `useCallback`/handlers.

### M25 · `src/shared/theme/sizes.ts` · Duplicate token families and one contradictory value
- **Problem:** Two token families describe the same values (`*Height` and `*H`, `cardRadius` vs `radius.card`), and `sectionHeader` is 40 in one family and 44 in the other.
- **Impact:** Call sites pick whichever name they find first, so spacing drifts; the 40/44 conflict is a live inconsistency.
- **Fix:** One family; delete the `*H` aliases; resolve 40 vs 44.
- **Evidence:** duplicate declarations with divergent values.

---

## Architecture (7)

### M26 · `src/shared/utils/navigationHelpers.ts:3` · `shared` imports upward from `navigation`
- **Problem:** The only upward edge in the graph: a shared util imports `RootTabParamList` from `src/navigation`.
- **Impact:** Breaks the dependency rule that makes `shared` reusable and testable; it now drags navigation types (and transitively react-navigation) into any consumer.
- **Fix:** Move the tab-target type into `shared/types/navigation.ts` and have `navigation` import it downward.
- **Evidence:** `import type { RootTabParamList } from '../../navigation/types'` at line 3.

### M26b · 4 screens · Header avatar workaround; `AppHeader` avatar not pressable
- **Problem:** `AppHeader` renders the avatar but has no `onAvatarPress`, so Home on-presses the Profile tab through `navigation.getParent()` (untyped) and Reports/Map/Profile each hand-roll their own avatar or omit it (Profile bypasses `AppHeader` entirely).
- **Impact:** Four different header behaviours for the same affordance; the shared header cannot be used as the single standard.
- **Fix:** Add optional `onAvatarPress` to `AppHeader`; make every screen pass `navigate('ProfileTab')`.
- **Evidence:** `AppHeader` has no avatar callback prop; `RootNavigator` contains an untyped `getParent()` helper.

### M27 · 6 components · Bottom-navigation clearance formula copied
- **Problem:** `TAB_BAR_HEIGHT + insets.bottom + N` is recomputed in six places with slightly different constants.
- **Impact:** A tab-bar height change produces six different amounts of dead space or content under the bar.
- **Fix:** One `useBottomContentInset()` hook or a `ScreenContainer` that applies it.
- **Evidence:** six independent inset computations.

### M28 · `SelectField.tsx:10`, `DateRangeCalendar/theme.ts:33`, `HourMinPicker` · Shared controls hard-wired to `reportColors`
- **Problem:** Generic controls import a feature-specific token module to style themselves.
- **Impact:** Reusing a shared control outside Reports requires editing the shared control; the token boundary is inverted.
- **Fix:** Accept a `tone`/`variant` prop (or a small `ControlTheme` context) and let Reports inject `reportColors`.
- **Evidence:** `import { reportColors } from '@shared/theme/reports'` inside a shared control.

### M29 · Screens · Mock-era constants leak past the service boundary
- **Problem:** `slice(0, 4)` on the Home vehicle list, hardcoded `LFA-1464` ×4, `2024` dates, fixed "28-April-2024 (2:45 AM)" stamps, `'Honda'` comparisons in `mapService` — all in screens/components, not in mocks.
- **Impact:** Real data will silently truncate to 4 vehicles, mislabel plates and show wrong dates; the swap is not a one-layer change.
- **Fix:** Move every literal into the mock/service layer; screens read only typed props.
- **Evidence:** grep for the four literals outside `mocks/`.

### M30 · `RootNavigator.tsx` · Untyped tab bar; three tab lists
- **Problem:** `CustomTabBar` takes `any`, selects its label via a label-keyed `switch`, and the tab set is described three times (screens, labels, icon map).
- **Impact:** Renaming a tab silently falls into the default branch; adding a tab is a three-place edit that typecheck does not enforce.
- **Fix:** Single `TABS` array of `{name, label, icon}` typed against `RootTabParamList`; `CustomTabBar` props typed from `BottomTabBarProps`.
- **Evidence:** `props: any` in `CustomTabBar`; three parallel lists.

### M31 · repo-wide · No shared async-data pattern
- **Problem:** Three cancellation idioms (`cancelled` boolean, `active` boolean, `mountedRef`), and every hook re-implements loading/error/cancel differently - the root cause behind B6.
- **Impact:** Each new screen invents its own lifecycle, so error handling and cancellation correctness vary by file.
- **Fix:** `useAsyncData(fn, deps)` returning `{data, loading, error, retry}` with built-in cancellation; migrate the five hooks.
- **Evidence:** three distinct flag names across the hooks.
- **Status: FIXED during this review.** New `src/shared/hooks/useAsyncData.ts`: `useAsyncData(loader, key)` returns `{ data, loading, error, retry }`, keyed on a primitive so an inline loader cannot retrigger the effect. It drops any response whose effect was torn down (unmount or newer key), keeps the previous data during a refetch, normalises rejections, settles a synchronous throw, and clears the error when a fetch starts. Migrated: `useVehicleList`, `useVehicleDetails`, `EngineControlScreen`, `ReportsScreen`, `LiveMapScreen`, `HistoryScreen` (which also closes M9). `useProfile` stays custom on purpose: it owns editable form state plus a `save()` action, not a fetch lifecycle. All six `attempt` counters, three flag idioms and every per-screen `.catch` shape are gone. `__tests__/useAsyncData.test.tsx` (7 tests) locks resolve/reject/sync-throw/retry/stale-key/unmount.

---

## Performance (4)

### M32 · `HistoryScreen/index.tsx:242-306` · `ListHeaderComponent` contains a `MapView` and is rebuilt per state change
- **Problem:** The header is an inline arrow capturing `range`, `draft`, `data`, and handlers; it is recreated on every state change and includes a `<MapView>`.
- **Impact:** Opening the calendar, selecting a day, or any harness update re-creates the header subtree, including the native map. On the target device this is a visible hitch per tap.
- **Fix:** Extract a memoised `<HistoryHeader>` with stable props; hoist the mini-map out of the header or memoise it independently.
- **Evidence:** `ListHeaderComponent={() => (<View>…<HistoryMiniMap/>…)}` at `:242`.

### M33 · `useCollapsible.ts:11-18` · Height animation runs on the JS thread around a heavy calendar
- **Problem:** `Animated.timing(..., {useNativeDriver: false})` animates `height`, so every frame is a JS-thread layout pass while `DateRangeCalendar` (284 LOC + 3 FlatLists) is on screen.
- **Impact:** Visible frame drops on the 4-core device during the most common Reports interaction (opening the range picker).
- **Fix:** Clip with Reanimated `useAnimatedStyle` + `overflow: hidden` (native driver), or animate a fixed-height container's translate.
- **Evidence:** `height` in the animated style; `useNativeDriver: false` at `:16`.

### M34 · `App.tsx:22` · Splash has a 2.4 s unconditional floor
- **Problem:** `MIN_SPLASH_MS = 2400` with `delay = max(0, 2400 - elapsed)` — the animation *orders* the wait even when providers are ready.
- **Impact:** Every cold start is ≥2.4 s longer than necessary, on every device, to satisfy an animation.
- **Fix:** Gate on provider readiness with a short maximum (e.g. 600 ms) and let the animation be interruptible.
- **Evidence:** `MIN_SPLASH_MS = 2400` at `:22`; `Math.max(0, …)` at `:57`.

### M35 · `DetailsScreen.tsx:59,66` · Nested `SafeAreaProvider` inside a navigator that already provides one
- **Problem:** The screen wraps itself in `SafeAreaProvider` inside the stack's provider.
- **Impact:** An extra inset computation and a context boundary on the heaviest screen; can produce inconsistent inset reporting.
- **Fix:** Delete the inner provider; use `useSafeAreaInsets`.
- **Evidence:** nested `<SafeAreaProvider>` at `:66`.

---

## Security (3)

### M36 · `src/features/*/mocks/*.json`, `uidump.xml` · Realistic PII ships in the bundle
- **Problem:** `profile.mock.json` carries a person's name, DOB, email, phone, and a UK home address; `vehicles.mock.json` carries four plates and Home/Work addresses; `uidump.xml` (tracked) contains a full accessibility dump of a device screen.
- **Impact:** PII in `assets/index.android.bundle` (also tracked) is extractable by anyone with the APK, in a product that tracks vehicles and homes.
- **Fix:** Replace with synthetic identities (`Jane Example`, `SW1A 1AA`, `AA00 AAA`), delete `uidump.xml`, and add a PII check to CI.
- **Evidence:** `profile.mock.json` + `vehicles.mock.json` + tracked `uidump.xml`.

### M37 · `AndroidManifest.xml` · Permissions widen transitively
- **Problem:** The merged manifest requests `RECEIVE_BOOT_COMPLETED`, `FOREGROUND_SERVICE` and `WAKE_LOCK` (pulled in by `androidx.work`), plus fine/coarse location, when the app uses none of them directly.
- **Impact:** Stricter review and user trust cost for capabilities the app does not use; background-start privilege is a real risk surface.
- **Fix:** `tools:node="remove"` on the three unused permissions in the app manifest, or exclude the `work-runtime` transitive if nothing needs it.
- **Evidence:** merged-manifest permission list vs `grep` for `WorkManager`/`WakeLock` in `src/` → 0.

### M38 · `ControlSwipeCard` + `engineControlService` · Engine kill gated only by a swipe gesture
- **Problem:** `requestLockUnlock('kill')` requires no confirmation, biometric, PIN, or second factor; the swipe is the sole control.
- **Impact:** A pocket gesture or an unlocked phone kills a vehicle's engine. There is no audit trail of who did it.
- **Fix:** Device-credential/biometric confirmation for `kill`, a confirm dialog for `unlock`, and an append-only action log.
- **Evidence:** the service resolves every action identically; no confirmation step in the card.

---

## Dead code / simplicity (4)

### M39 · repo root · 16 of 33 tracked entries are build artifacts (~1.04 MB)
- **Status: FIXED during this review.** All gate `*.txt`, the four `ec_*.png` screenshots and `uidump.xml` were untracked and deleted; `.gitignore` now covers `gate_*.txt`, `tsc_*.txt`, `uidump.xml`, `ec_*.png`.
- **Problem:** `gate_tsc.txt`, `gate_eslint.txt`, `gate_jest.txt`, `gate_eslint_exit.txt`, `gate_jest_exit.txt`, `tsc_out.txt`, `uidump.xml`, `ec_s1*.png`, `ec_device_top.png`. Two gate files are 0 bytes.
- **Impact:** Root listing is noise, 1 MB of churn in every clone, and "evidence" files that are stale or empty — actively misleading during review.
- **Fix:** Delete, add to `.gitignore` (`gate_*.txt`, `tsc_*.txt`, `uidump.xml`, `ec_*.png`), and let CI own gate output.
- **Evidence:** 16 artifact entries; `gate_tsc.txt` and `gate_eslint.txt` both 0 bytes.

### M40 · `ui-baseline/` · ~6.9 MB of tracked screenshot scratch
- **Problem:** Baseline PNGs plus a scratch `v2/` set; several legacy files are PNG bytes stored as UTF-16LE text, so they cannot be opened by tooling.
- **Impact:** Repo weight and a misleading "baseline" set that includes unreadable files.
- **Fix:** Keep only the 12 entries in `baseline_record.json`; delete scratch and the UTF-16 misencodings; store future baselines in a release artifact, not git.
- **Evidence:** `ui-baseline/` size + `fffe` prefixes on legacy PNGs.

### M41 · `mapService.ts:1-22`, `HomeScreen.tsx` · Mock-era branches and constants left in production code
- **Problem:** `getLiveMapData` keeps four hardcoded `id === 'kia'` / `'honda'` branches and an unknown-id fallback; Home slices to 4 and compares `'Honda'` by name.
- **Impact:** The "service" is a switch over fixture ids, so it cannot be replaced by a fetch without rewriting the screen contract.
- **Fix:** Key the mock by id and return `NotFound`; remove id comparisons from screens.
- **Evidence:** three id comparisons inside `mapService`; `'Honda'` comparisons in `HomeScreen`.

### M42 · `index.android.bundle` (2.7 MB) · Generated bundle committed
- **Status: FIXED during this review.** Untracked and deleted; `.gitignore` now has `*.bundle` alongside `*.jsbundle`.
- **Problem:** `android/app/src/main/assets/index.android.bundle` is tracked (gitignored pattern is `*.jsbundle`, which does not match it).
- **Impact:** 2.7 MB of generated churn per build, stale-bundle confusion, and binary blobs in review diffs.
- **Fix:** `git rm --cached`; add `*.bundle` to `.gitignore`; build it in the release pipeline.
- **Evidence:** `git ls-files --error-unmatch` → tracked; OCR scan skipped it for exceeding the 2 MB limit.

---

## Productivity / DX (9)

### M43 · repo root · No commit-time gate
- **Problem:** No husky/lint-staged/pre-commit hook; nothing runs typecheck or tests before a commit.
- **Impact:** Broken commits reach the branch and are found by the next person, not the author.
- **Fix:** `husky` + `lint-staged` running `eslint --fix` on staged files and `npm run typecheck` on pre-push.
- **Evidence:** no `.husky/`, no `lint-staged` config.

### M44 · `README.md` · Setup-only README; the real guide is orphaned
- **Problem:** 43 lines that stop at `npm test`. `docs/PROJECT_GUIDE.md` (30 KB) holds the architecture and is not linked from the README.
- **Impact:** New contributors read the wrong document, then discover the right one by accident.
- **Fix:** README = what/why + quickstart + link to the guide + the script table.
- **Evidence:** README length vs guide length; no cross-link.

### M45 · `docs/PROJECT_GUIDE.md` · Guide is stale and claims validity it lost
- **Problem:** 9 of 99 internal links are dead, it describes a pre-refactor layout, and it is 79 commits behind; `:23-47` claims all links resolve.
- **Impact:** The authoritative document actively misleads; readers trust a wrong map.
- **Fix:** Regenerate the reachability list in CI, remove the false claim, or delete the duplicated HTML and keep one Markdown source.
- **Evidence:** link check + `git rev-list --count`.

### M46 · `KNOWN_ISSUES.md` · A prompt transcript, not a defect tracker
- **Problem:** Mostly past session instructions; the real open item (map leak, `GeofenceMap`) points at a plan file that does not exist.
- **Impact:** Open defects are unfindable; the file grows with every session.
- **Fix:** Convert to a short `OPEN-ISSUES.md` with id/severity/owner, and move session history to a scratch dir.
- **Evidence:** file size vs number of actionable open items.

### M47 · `.prettierrc.js` · Prettier configured but never run
- **Problem:** A Prettier config exists; there is no `format` script, no `--check` gate, and code shows formatting drift (`App.tsx` mixes quote styles).
- **Impact:** Diffs carry formatting noise; reviewers argue style instead of logic.
- **Fix:** `"format": "prettier --write ."` + `"format:check"` in CI + `eslint-config-prettier`.
- **Evidence:** config present, script absent, visible drift.

### M48 · `package.json` · No coverage or test documentation
- **Problem:** No `test:coverage` script and no statement of what the suite guarantees.
- **Impact:** The 28-test suite looks like coverage when it is ~5%.
- **Fix:** Add the script, document actual coverage in the README, and set a floor.
- **Evidence:** scripts list.

### M49 · `README.md:8-20` · Prerequisites understate the toolchain
- **Problem:** Lists Node ≥20 and JDK 17 only. The build additionally needs NDK `27.1.12297006`, `compileSdk 37`, and an Android SDK 37 platform.
- **Impact:** A clean machine follows the README and fails at the first Gradle run.
- **Fix:** Enumerate the exact versions used by the working build.
- **Evidence:** `android/build.gradle` values vs README.

### M50 · repo root · Release path undocumented
- **Problem:** The only release note is a 200-byte `pending before release.md` mentioning arm64-only; there is no documented `assembleRelease` / signing / AAB procedure.
- **Impact:** The first release attempt is guesswork, and it will hit B2 head-on.
- **Fix:** A `RELEASE.md`: keystore setup, `bundleRelease`, ABI decision, version bump, Play upload.
- **Evidence:** no release doc; 200-byte note.

### M51 · `android/app/build.gradle` · ABI/architecture decision is implicit
- **Problem:** `abiFilters` select a single ABI; the consequence (no 32-bit device support) lives only in a scratch note.
- **Impact:** An unnoticed install failure on 32-bit hardware.
- **Fix:** Document the decision and make the filter explicit per build type.
- **Evidence:** `abiFilters` in `defaultConfig`.

---

## UX / accessibility (9)

### M52 · `CustomTabBar` · No tab role or selected state; labels shrink to 6.3 pt
- **Problem:** Custom tab buttons are plain `Pressable`s with no `accessibilityRole="tab"` and no `accessibilityState={{selected}}`; the active label is ~6.3 pt.
- **Impact:** TalkBack cannot report which tab is active; the label is unreadable for many users.
- **Fix:** `role="tab"`, `state.selected`, and a ≥10 pt active label with a non-colour cue.
- **Evidence:** custom tab bar with no role/state props.

### M53 · `src/features/**` · 27 of 55 interactive elements have no accessible name
- **Problem:** Across screens, 28 elements are labelled and 27 are not (icon-only chevrons, share, plus, close, refresh, map controls, scrubber).
- **Impact:** TalkBack announces "button" with no name; the user must guess.
- **Fix:** `accessibilityLabel` on every icon-only control; a lint rule or a PR checklist row.
- **Evidence:** measured 28 labelled / 27 unlabelled.

### M54 · `AssetCard`, `ReportTile`, `HourMinPicker`, `CustomTabBar` · Touch targets below 44 dp
- **Problem:** 24 dp and 22 dp icon buttons (`AssetCard` actions), 30 dp time chips, sub-44 dp tab hit areas.
- **Impact:** Mis-taps for anyone with reduced dexterity; fails both WCAG 2.5.8 and Android guidance.
- **Fix:** `hitSlop` to 44×44 (or resize), keeping the visual size.
- **Evidence:** measured widths/heights on the four components.

### M55 · `colors.ts` · Grey tokens fail AA for text
- **Problem:** `fieldLabel` #8A9199 on white = 2.64:1; `text.secondary` #6B7178 = 3.9:1; `weekdayInk` #9AA0A6 = 2.4:1; `calendar` disabled label = 2.04:1.
- **Impact:** Field labels, secondary values and weekday headers are unreadable for low-vision users — including the labels that B13 says are not announced.
- **Fix:** Minimum #4A4F54 (7.7:1) for body/label text; keep light greys only for non-text decoration.
- **Evidence:** ratios computed from the token values.

### M56 · 5 screens · Toasts are never announced
- **Problem:** The toast `View` has no `accessibilityLiveRegion` and no `AccessibilityInfo.announceForAccessibility` call.
- **Impact:** "Vehicle locked", "Profile saved", "Logged out" are silent for screen-reader users — the only feedback for those actions.
- **Fix:** `accessibilityLiveRegion="polite"` on the toast container plus an explicit announce on mount.
- **Evidence:** toast JSX in 5 screens with no live-region prop.
- **Status: FIXED during this review (via M17).** The single `<Toast>` now sets `accessibilityRole="alert"` and `accessibilityLiveRegion="polite"`, so every screen's toast is announced by TalkBack with no per-screen work. Explicit `announceForAccessibility` was not added: the live region already covers the message, and a manual announce would double-speak it.

### M57 · `ProfileDobSheet.tsx` · Modal does not contain focus
- **Problem:** No `accessibilityViewIsModal`; the backdrop is the first focusable element, so TalkBack can move behind the sheet.
- **Impact:** Screen-reader users can interact with the obscured screen underneath.
- **Fix:** `accessibilityViewIsModal` on the sheet + `importantForAccessibility="no-hide-descendants"` on the background.
- **Evidence:** Modal JSX lacking both props.

### M58 · `ReportTile` · Nested Pressables hide secondary actions from TalkBack
- **Problem:** A Pressable tile contains a Pressable plus/share button; the child is not separately announced and the parent swallows the gesture.
- **Impact:** The share/add action is effectively unavailable to screen-reader users.
- **Fix:** One Pressable with `accessibilityActions` (`[{name:'share'},{name:'add'}]`) and `onAccessibilityAction`, or restructure so the child is a sibling.
- **Evidence:** nested Pressable structure in `ReportTile`.

### M59 · `PlaybackScrubber.tsx` · Timeline is not adjustable for TalkBack
- **Problem:** The track is a plain `View` with `PanResponder`; no `accessibilityRole="adjustable"`, no `accessibilityValue`, no increment/decrement actions.
- **Impact:** A blind user cannot seek at all — the whole playback control is gesture-only.
- **Fix:** Add `role="adjustable"`, `accessibilityValue={{min:0,max:100,now:pct}}`, and `onAccessibilityAction` for increment/decrement (±1/12).
- **Evidence:** PanResponder-only track with no a11y props.

### M60 · `AppHeader` · Dead and inconsistent header affordances
- **Problem:** The back chevron always renders; Home's back press is a no-op; the avatar looks interactive on Home but is inert on other tabs; Profile bypasses `AppHeader`.
- **Impact:** The same header affordance does different things per screen, so users stop trusting it.
- **Fix:** Render back only when `canGoBack()`; make the avatar consistently pressable; standardise Profile on `AppHeader`.
- **Evidence:** unconditional back render; `onAvatarPress` absent.
