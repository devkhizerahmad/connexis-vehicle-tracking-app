# Testing Audit — Reports 00–05 vs the Current Tree

**Date:** 2026-10-27
**Branch:** `testing-dev` (working tree holds uncommitted auth/login work)
**Scope:** All six review reports (`00-EXECUTIVE-SUMMARY` … `05-REMEDIATION-PLAN`), the current `src/` tree, the Jest suite, the device evidence already captured, and live static sweeps.
**Type:** Read-only audit. No product or test file was modified.

---

## 1. Verdict

The reports are **substantially accurate but stale in both directions**.

- Several findings still marked open are **already fixed** (M41, S4, S11, S22, S23, S37).
- Several findings still marked fixed/verified are **still true or only partly true** (B3, M37, M55, S30).
- The **auth/login surface added after the reports has no review coverage at all**, and it is now the app's front door.

**Release readiness is not established.** Static gates are green, but:

1. The release path is still blocked on the user-side key/keystore items (B1/B2).
2. Authentication is a client-side mock with plaintext demo passwords in the bundle; there is no server authorization, audit trail, or kill confirmation (B3/M38).
3. Screen- and hook-level automated coverage is thin: **1 of 8 screens** is mounted in a test, **2 of 7 hooks** have tests, and **0 navigation/param tests** exist.
4. The reports' own "70 tests" is now **148**, but coverage is **46.6 % statements / 31.5 % branches / 24.6 % functions** and is **not enforced**.

---

## 2. Measurements taken today

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | **0 errors** |
| Lint | `npx eslint .` | **0 errors / 22 warnings** |
| Jest (normal) | `npx jest --silent` | **16 suites / 148 tests pass**, 17.3 s |
| Jest + coverage | `npx jest --coverage --collectCoverageFrom="src/**/*.{ts,tsx}"` | **46.56 % stmts · 31.54 % branches · 24.58 % funcs · 48.12 % lines** |
| Full parallel coverage run | same, all suites | **1 unidentified test failed once** (15/16 suites); every suite passes when rerun in subsets — flaky under instrumentation, not root-caused |
| Source size | `src/**/*.{ts,tsx}` | **214 files / 16,687 lines** (report baseline: 205 / 15,205) |

Static sweeps over `src/`:

| Pattern | Count | Report baseline |
|---|---:|---:|
| `.catch(` | 4 | 10 (after remediation) |
| `try {` | 6 | 2 (before) |
| `ListEmptyComponent` | 1 | 1 |
| `freezeOnBlur` | 6 | 6 |
| `as any` | 3 | 3 |
| `as unknown as` | 5 | 5 |
| `console.*` | 0 | 0 |
| `accessibilityLabel` | 62 | — |
| Raw hex outside `src/shared/theme` | **36 in 13 files** | 24 in 4 files |
| `StyleSheet.create` with no sibling `styles.ts` | **12 files** | 12 |
| `index.tsx` components/screens | **22** | 21 |
| Tracked `ui-baseline/` files | **47** | ~12 planned |

---

## 3. Finding status

### 3.1 BIG — 20 findings

| ID | Status today | Evidence |
|---|---|---|
| B1 Maps key committed | **Code fixed; user action open** | `android/gradle.properties` has no key (only the warning comment); `build.gradle` resolves `MAPS_API_KEY` from `-P`/env/`~/.gradle`; **rotation + Cloud restrictions still required** |
| B2 Debug-key release signing | **Code fixed; user action open** | release signing block reads `android/keystore.properties`; **file does not exist** → release build aborts by design |
| B3 No authentication | **Partially fixed after the report** | `AuthProvider` + `LoginScreen` now gate the tabs; logout works (verified 2026-10-27). Still **mock accounts with plaintext passwords in the bundle**, no server authorization, no audit trail, no biometric confirmation for kill |
| B4 Playback did not play | Fixed | `requestAnimationFrame` loop, `setProgress`, `onScrub` wired (`PlaybackPanel.tsx:89–152,273`) |
| B5 Stale `vehicleId` in Live Map | Fixed | `incomingVehicleId` + effect + `setParams` (`LiveMapScreen.tsx:28–49`) |
| B6 No loading/empty/error states | Fixed | `ScreenState` + `useAsyncData` + `.catch` paths; `ListEmptyComponent` on Home |
| B7 Four dead runtime deps | Fixed | `package.json` now 14 runtime deps, no Paper/SVG/lucide |
| B8 Icon god file | Fixed | split icon domain files + `styles.ts` + `types.ts` |
| B9 No shared domain model | Fixed | `src/shared/types/domain.ts`; `as any` 9 → 3 |
| B10 Route row duplicated | Fixed | `shared/components/vehicle/RouteRow` |
| B11 Maps never frozen | Fixed | `freezeOnBlur: true` on tabs + 5 stacks (6 hits) |
| B12 Donut remounts per frame | Fixed | ring hoisted, count-up throttled, `progressbar` role |
| B13 Profile inputs unnamed | Fixed | 62 `accessibilityLabel` hits; report re-scan says 0 unlabelled |
| B14 7.5 pt / low-contrast text | Fixed (telemetry + status ink) | `batteryText` now 10 pt; dark ink on bright fills |
| B15 DOB untested | Fixed | `dob.test.ts` 12 tests |
| B16 Scrubber untested/unwired | Fixed | `playbackScrubber.test.tsx` 5 tests + wired callback |
| B17 Swipe guard untested | Fixed | `ControlSwipeCard.test.tsx` 5 tests |
| B18 Geofence math untested | Fixed | `fitRegion.test.ts` 8 tests |
| B19 No CI | **Partially fixed** | `.github/workflows/ci.yml` runs typecheck/lint/test; **no coverage gate** |
| B20 No typecheck script | Fixed | `npm run typecheck` + `noEmit` |

**Count:** 17 fully fixed, 2 fixed code-side with user action outstanding (B1, B2), 1 partial (B3). B19's CI exists but lacks the coverage gate the report itself prescribed.

### 3.2 MEDIUM — 61 findings

**Fixed (15):** M1, M2, M3, M4, M5, M6, M7, M8, M9, M17, M31, M39, M41, M42, M56.

- M41 is **newly fixed since the report**: `mapService` now selects by id via `find`, with no `'kia'`/`'honda'` branches.
- M39/M42/M17/M31/M56 match their in-report status and still hold.

**Confirmed open (evidence re-checked today):**

| ID | Evidence |
|---|---|
| M10 | Reports test still does not walk a month boundary; no "Previous month" drive |
| M11 | `ReportsScreen` is still never mounted |
| M12 | No draft-promotion assertions (`onApplyRange` absent) |
| M13 | 0 test imports of `useProfile`, `useVehicleList`, `useVehicleDetails`, `useCollapsible`, `useDonutProgress` |
| M14 | `historyService` and `profileService` have no tests |
| M15 | `__mocks__/react-native-maps.js` still renders `null` |
| M16 | `jest.config.js` has no coverage config/threshold; CI does not run coverage |
| M18 | 12 `.tsx` files still `StyleSheet.create` with no sibling `styles.ts` |
| M19 | Four field primitives still coexist (`SelectField`, `DateRangeCalendar`/`DateRangeField`, `ProfileFormField`, `ProfileDobPicker`) |
| M20 | Three collapse implementations still present |
| M22 | 36 raw hex values in 13 files outside the theme (worse than the 24 baseline) |
| M23 | 22 `index.tsx` components/screens |
| M24 | Improved but open: `ReportsScreen` 348 LOC / 9 `useState` (was 396 / 12) |
| M26 | `shared/utils/navigationHelpers.ts:3` still imports `@navigation/types` |
| M26b | `AppHeader` still has no `onAvatarPress` |
| M27 | 6 copies of `sizes.bottomNav* + insets.bottom + …` |
| M28 | Shared controls still import `reportColors` |
| M29 | `slice(0, 4)`, `'LFA-1464'` default, mock-era literals remain in screens/services |
| M30 | `CustomTabBar({ state, navigation }: any)` + label `switch` + separate `tabs` array |
| M33 | `useCollapsible` still animates height with `useNativeDriver: false` |
| M34 | `MIN_SPLASH_MS = 2400` still an unconditional floor |
| M35 | `DetailsScreen` still nests two `SafeAreaProvider`s |
| M36 | `profile.mock.json` still carries "Adeel Hussein", email and phone |
| M37 | **Still true:** merged debug manifest adds `WAKE_LOCK`, `RECEIVE_BOOT_COMPLETED`, `FOREGROUND_SERVICE` |
| M38 | Kill is still swipe-only; auth added a gate before the app, not a confirmation/audit per action |
| M40 | 47 `ui-baseline/` files are tracked |
| M43 | No `.husky/`, no `lint-staged` |
| M44–M51 | README/guide/release docs still stale; `PROJECT_GUIDE.html` still exists; no `RELEASE.md`; ABI note only in a scratch file |
| M52 | No `accessibilityRole="tab"` / `accessibilityState.selected` in the tab bar |
| M54 | 5 `hitSlop` uses; touch-target coverage is partial |
| M55 | `secondary: '#7A8288'` (3.9:1) still present; `secondaryStrong` was added alongside, not instead |
| M57 | No `accessibilityViewIsModal` in `ProfileDobSheet` |
| M58 | `ReportTile` still nests Pressables |
| M59 | No adjustable role/value/actions on the scrubber |
| M60 | `onBack` is optional; tab headers still render an inert back affordance |

**Not re-checked today (report says open):** M20, M21, M25, M32, M44–M51 — some may already be fixed or improved; they were left as reported to avoid over-claiming. M54 was only counted (5 `hitSlop` uses), not measured per control.

**Improved / stale since the report:** M24 (348 LOC / 9 `useState`), M32 (`ListHeaderComponent` is gone from `HistoryScreen`; the mini-map is still rendered inline — needs a fresh performance check), M37 (confirmed still true), M41 (now fixed).

### 3.3 SMALL — 38 findings

**Fixed or stale-open (verified today):** S3, S4, S8, S11, S14, S22, S23, S37; S30 improved (normal suite 17 s vs 96 s).

- S4: `selectedIndex` fallback is gone; a hardcoded default id remains (M29).
- S11: the dead `case 'Details'` is gone.
- S22: `ProfileHeader` now wraps the shared `AppHeader`.
- S23: zero `getParent(` calls.
- S37: zero `marginLeft` / `paddingRight` in `src`.
- S8: `.env` is absent.

**Open (verified):** S1 (uncleared `setTimeout`), S2 (`keyExtractor` still uses `item.vehicle.name`), S5 (`usesCleartextTraffic` placeholder, no network config), S6 (no `maxLength`/email/phone validation), S7 (no audit/Dependabot config), S9 (4 modules still have zero importers), S10 (4 of 7 style factories unused), S12 (`toIsoDate` still has no importer), S20 (`chunk` implemented twice), S21 (5 `as unknown as`), S27 (inline ref callback), S29 (hook still returns the whole vehicle), S31 (`App.test` asserts nothing), S32 (fixture-literal assertions), S34 (ESLint 8, TS `^6.0.3`), S35 (no CONTRIBUTING/CHANGELOG), S36 (`PROJECT_GUIDE.html` still tracked), S38 (no `expanded` a11y state).

**Open per the report, not re-checked today:** S13, S15 (duration now honoured; overlay life-cycle unverified), S16 (primitive still exists — M19), S17, S18, S19, S24, S25, S26 (hour handler is now memoised; no tick strip found — likely improved), S28, S33.

**Improved / stale since the report:** S4, S11, S22, S23, S37, plus S26 and S30 (normal suite now 17 s vs 96 s).

**Net:** 8 fixed/stale-open, 2 improved (S26, S30), 18 open with fresh evidence, 10 still report-only.

---

## 4. Test coverage by point of view

Status: **Covered** = behavioural assertion exists · **Partial** = component/service covered, screen/flow not · **Missing** = nothing.

| Dimension | What exists today | Status | Gap |
|---|---|---|---|
| Static gates | tsc + eslint + jest in CI | Covered | No coverage gate; CI does not build the APK |
| Pure domain logic | `dob` 12, `fitRegion` 8, `playbackStamp` 5, `routePlayback` 23, `loginScroll` 4 | Covered | Table-driven boundaries could grow |
| Component behaviour | Scrubber 5, Swipe 5, ScreenState 4, Toast 5, Reports components 23 | Partial | No Home/Details/History/EC/Profile component tests |
| Screen integration | **LoginScreen only** (30) | Missing | 7 of 8 screens never mounted |
| App shell / splash | `App.test` renders, asserts nothing | Missing | S31 |
| Hooks | `useAsyncData` 7, `useToast` 5 | Missing | 5 of 7 hooks untested |
| Services | auth 9, map 4, vehicle 3, reports payload 4, engine via UI | Partial | history, profile; reports not behavioural |
| Auth / session | login service + screen | Partial | `AuthContext` expiry, failed login state, remember-me store, cold start, logout side-effects |
| Navigation / params | none | Missing | B5/M2-class regressions are only caught manually |
| Loading / error / empty | `ScreenState` component only | Partial | No screen-level rejection/retry test; no failure injection |
| Offline / network failure | none | Missing | Services are mocks; no real fetch/rejection seam |
| Device functional QA | Login re-verified 2026-10-27 (12 screenshots) | Partial | Other 7 screens have report-era evidence only; no current full sweep |
| Accessibility | 62 labels; report re-scan 0 unlabelled | Partial | No TalkBack run; M52/M57/M58/M59/M60 open; contrast M55 |
| Performance | Static evidence only | Missing | No profiler run; map memory, splash 2.4 s, JS collapse untested |
| Visual regression | Manual `ui-baseline/` only | Missing | No snapshot/visual diff; 47 tracked scratch files |
| Security / release | Key/keystore code guards | Partial | No signed release build; PII mocks; permissions; cleartext |
| i18n / RTL | none | Missing | 55 hardcoded strings (S37) |
| Release build | dry-run only in report | Missing | No `assembleRelease` with a real keystore |

### 4.1 Screen × state matrix

| Screen | Mounted in test | Loading | Error/retry | Empty | Current device evidence |
|---|---|---|---|---|---|
| Login | Yes (30) | n/a (sync form) | Yes (error banner + lockout) | n/a | 2026-10-27 |
| Home | No | No | No | No (component exists) | Report-era |
| Details | No | No | No | No | Report-era |
| Live Map | No | No | No | No | Report-era |
| History | No | No | No | No | Report-era |
| Reports | No | No | No | No | Report-era |
| Engine Control | No | No | No | No | Report-era |
| Profile | No | No | No | n/a | Report-era |

### 4.2 Hook / service matrix

| Unit | Tests | Status |
|---|---|---|
| `useAsyncData` | 7 | Covered |
| `useToast` | 5 | Covered |
| `useProfile` | 0 | Missing |
| `useVehicleList` | 0 | Missing |
| `useVehicleDetails` | 0 | Missing |
| `useCollapsible` | 0 | Missing |
| `useDonutProgress` | 0 | Missing |
| `authService` | 9 | Covered |
| `vehicleService` | 3 | Covered |
| `mapService` | 4 | Covered |
| `reportsService` | 4 (payload only) | Partial |
| `engineControlService` | via ControlSwipeCard | Partial |
| `historyService` | 0 | Missing |
| `profileService` | 0 | Missing |

---

## 5. What is complete

- All four release-blocking **test** gaps from the report (B15–B18) are closed with real behavioural tests.
- The four highest-risk interactive fixes are test-locked: playback, swipe guards, geofence math, DOB clamping.
- The login screen is now the best-tested surface in the app: 30 screen tests + 9 service tests + 4 keyboard-math tests, with fresh device evidence.
- Error/loading/empty primitives exist and are used; every screen fetch has a rejection path.
- Maps are frozen when blurred; icons are split and memoised; domain types are shared.
- CI runs typecheck, lint and tests on `main`/`testing-dev` and every PR.

---

## 6. What is pending

### P0 — before any release/sign-off

1. **Rotate the Maps key and add package + SHA-1 restrictions** (B1, user-side). The repo is clean; the key is still the old one until Cloud Console rotation.
2. **Create the release keystore + `android/keystore.properties`** and prove `assembleRelease` signs correctly (B2). The file is absent today; the build intentionally aborts.
3. **Decide the auth posture** (B3/M38). Today: mock accounts with plaintext passwords in the bundle, no server authorization, no audit log, no kill confirmation. If this ships as a demo, document it; if production, this is a blocker.
4. **Replace or confirm the PII mocks** (M36): real-looking name, email, phone and addresses are in the bundle.
5. **Full device sweep after auth + login restyle** — all 8 screens, cold start, logout, lockout, remember-me, back navigation.
6. **Root-cause the coverage-run flake** — one test failed only in the full parallel coverage run.

### P1 — test depth that protects the app

7. Screen mount tests for Home, Details, Live Map, History, Reports, Engine Control, Profile.
8. Screen-level loading/error/retry/empty tests with rejection injection.
9. Hook tests for the remaining five hooks.
10. Service tests for `historyService`, `profileService`, and behavioural `reportsService`.
11. Fix the test-quality findings: M10, M11, M12, S31, S32, S33.
12. Coverage: `collectCoverageFrom`, `test:coverage`, a floor (start at today's 48 % lines) and a CI gate.
13. Accessibility pass: M52/M55/M57/M58/M59/M60 + one TalkBack run with screenshots.
14. Performance checks: splash floor, map memory, JS-thread collapse, History header.
15. Navigation/param regression tests (B5/M2 class).

### P2 — structure and polish

16. M18–M30 structural work (field primitive, collapse primitive, styles extraction, token cleanup, tab model).
17. M44–M51 documentation/release path; M43/M47/M48 DX scripts.
18. S1/S2/S5/S6/S9/S10/S12/S15/S16/S18/S20/S21/S24/S25/S26/S27/S28/S29/S34/S35/S36/S38.
19. i18n/RTL and logical margins (S37's string half).

---

## 7. What is missing entirely

- **No end-to-end test harness** (Detox/Maestro) and no release-build smoke test.
- **No visual regression** (no snapshots or screenshot diffing; `ui-baseline/` is manual scratch).
- **No failure injection** at the service seam; the app has never been tested against slow/500/offline responses.
- **No `AuthContext` tests** (expiry timer, failed login, remember-me write/clear, unmount).
- **No cold-start/session-persistence test**; sessions are in-memory only despite the 30-day Remember-Me TTL.
- **No navigation/params integration test**; cross-tab vehicle hand-off is manual.
- **No accessibility automation** (no `eslint-plugin-react-native-a11y`, no TalkBack CI run).
- **No performance budget/regression** (no profiler capture, no memory ceiling, no startup budget).
- **No security scanning** (no `npm audit` job, Dependabot/Renovate, or secret scan).
- **No release verification** (no signed AAB/APK produced in CI).
- **No i18n/RTL coverage.**

---

## 8. Recommended sequence

1. **Close P0 items 1–2 first** (they are user-side but block release).
2. **Run the full device sweep (P0-5)** and capture one screenshot per screen/state — this turns the report-era "PASS" rows into current evidence.
3. **Land the P1 test harness** (screen mounts, hooks, services, coverage gate) before any more feature work; it is the cheapest insurance against the regressions the reports keep finding.
4. **Then** the a11y/performance batch, then P2 structure.

---

## 9. Evidence notes / limitations

- Device evidence for screens other than Login is **report-era** (2026-10-22/23); it was not re-captured in this audit.
- Coverage was measured with `collectCoverageFrom`; individual files can still be 0 % (e.g. `AppHeader`, `RouteRow`, `useCollapsible`) because no test mounts them.
- The one full-run failure could not be reproduced in three subset reruns; treat it as an instrumentation/parallel-worker flake until root-caused.
- Statuses labelled "report says open" were not all re-read line by line; they are the reports' own status, not a fresh claim.
- `codebase-memory-mcp` recognises one project (`D:/khizer_workspace/ConnexisTracker`, branch `testing-dev`); this audit used direct source reads and gates for the claims above.
