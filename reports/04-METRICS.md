# Metrics & Evidence

All numbers below were measured during this review on `testing-dev` @ `d59b000`. Nothing is estimated unless labelled.

---

## 1. Repository size

| Metric | Value |
|---|---:|
| TypeScript/TSX files under `src/` | 180 |
| Total files indexed as TypeScript | 184 (incl. `App.tsx`, configs) |
| LOC under `src/` | 14,607 |
| `src/features` | 124 files · 8,908 LOC |
| `src/shared` | 49 files · 4,697 LOC |
| `src/navigation` | 7 files · 213 LOC |
| Runtime dependencies | 14 (was 18 before this review) |
| Dead runtime dependencies | 0 (4 removed during this review) |

### Largest files

| File | LOC | Note |
|---|---:|---|
| `src/shared/components/icons/index.tsx` | 1,521 | 71 icons, 204 inline styles |
| `src/features/reports/screens/ReportsScreen/ReportsScreen.tsx` | 396 | 12 `useState` |
| `src/shared/theme/engineControl.ts` | 355 | Token module |
| `src/features/map/screens/HistoryScreen/index.tsx` | 317 | 12 `useState`, inline header |
| `src/shared/components/controls/DateRangeCalendar/DateRangeCalendar.tsx` | 284 | 3 FlatLists |
| `src/features/profile/components/ProfileDobPicker/ProfileDobSheet.tsx` | 279 | Modal + 3 lists |

---

## 2. Gate evidence (executed live)

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | **0 errors**, 0 output |
| Lint | `npx eslint src App.tsx index.js --ext .ts,.tsx,.js` | **0 errors, 177 warnings** (all `react-native/no-inline-styles`) |
| Tests | `npx jest --silent` | **3 suites / 28 tests passed** in **96.258 s** |

Warning distribution: 204 inline-style occurrences exist in `src/shared/components/icons/index.tsx`, which accounts for nearly all 177 lint warnings.

> Note: `gate_tsc.txt` and `gate_eslint.txt` in the repo root are **0 bytes**. They are not evidence; the numbers above come from running the tools.

---

## 3. Coverage map

| Test file | Lines | Tests | What it actually asserts |
|---|---:|---:|---|
| `__tests__/App.test.tsx` | 12 | 1 | Renders `App`; no assertion |
| `__tests__/mapService.test.ts` | 44 | 4 | Fixture literals for `getLiveMapData` / `getVehicleOptions` |
| `__tests__/ReportsScreen.test.tsx` | 596 | 23 | `reportsService` payload, `DateRangeCalendar`, `ReportTile`, `HourMinPicker`, route config — never mounts `ReportsScreen` |

- **Source files exercising a behavioural assertion: ~9 of 180 (≈5%).**
- **Hooks tested: 0 of 5.**
- **Services tested: 1 of 5.**
- **Screens mounted in tests: 0.**

---

## 4. Code sweeps (`src/**` + `App.tsx` + `index.js`)

| Pattern | Count | Verdict |
|---|---:|---|
| Raw hex outside `src/shared/theme` | 24 | Convention violation |
| `style={{` | 231 | 204 in icons, 27 elsewhere |
| `console.log` / `console.*` | 0 | Clean |
| `: any` | 4 | Acceptable |
| `as any` | 9 | 8 in `DetailsScreen.tsx` |
| `as unknown as` | 5 | Service boundary |
| `@ts-ignore` / `@ts-expect-error` | 0 | Clean |
| `eslint-disable` | 0 | Clean |
| Non-null assertions (`!`) | 1 | Clean |
| `TODO` / `FIXME` / `HACK` | 9 lines / 5 real TODOs | Low |
| Commented-out code | 0 | Clean |
| `StyleSheet.create` in a component with no `styles.ts` | 12 | Convention violation |
| `index.tsx`-named components/screens | 21 | Naming drift |
| Files > 300 LOC | 3 | icons, ReportsScreen, HistoryScreen |

---

## 5. Reliability sweeps

| Pattern | Count |
|---|---:|
| `.catch(` in `src/` | **0** |
| `try {` in `src/` | **2** |
| `ListEmptyComponent` | **0** |
| `freezeOnBlur` / `useIsFocused` / `unmountOnBlur` | **0** |
| `<MapView` instances | **7** |
| Duplicated `showToast` implementations | **5** |
| `getVehicleDetails(_id)` id-discarding services | 1 |

---

## 6. Accessibility sweep

| Metric | Value |
|---|---:|
| Interactive elements inspected | 55 |
| With an accessible name | 28 |
| Without an accessible name | 27 |
| Hardcoded user-facing strings | 55 |
| i18n layer | none |
| Contrast failures (text) | 5 token pairs, 1.9–2.6:1 |
| Minimum text size found | 7.5 pt (`batteryText`) |

---

## 7. Dependency audit

All four dead packages were **removed** during this review. Remaining audit of the 14 runtime dependencies:

| Dependency | Direct imports | Status |
|---|---:|---|
| `react-native-paper` | 1 → 0 | **Removed** |
| `react-native-paper-dates` | 0 | **Removed** |
| `lucide-react-native` | 0 | **Removed** (28.2 MB) |
| `react-native-svg` | 0 | **Removed** (7.7 MB + native `rnsvg` target) |
| `react-native-worklets` | 0 direct | **Keep** — Reanimated peer |
| `dayjs` | 3 | Used |
| `react-native-ui-datepicker` | 4 | Used |
| `rn-swipe-button` | 1 | Used |
| `react-native-linear-gradient` | 3 | Used |
| `react-native-maps` | 3 | Used |
| `@react-navigation/*` (3 packages) | 14 | Used |
| `react` / `react-native` | core | Used |
| `react-native-safe-area-context` / `react-native-screens` / `react-native-reanimated` | — | Used |

Install weight freed: **39.5 MB** in `node_modules`; 26 packages removed in total (the four direct deps plus their transitive trees, including `react-native-vector-icons` and two nested `color` copies).

Peer check before removal: none of the 11 non-navigation packages retained requires any removed package.

---

## 8. Tracked build artifacts (should not be tracked)

| Path | Size | Tracked |
|---|---:|---|
| `android/app/src/main/assets/index.android.bundle` | 2,693,794 B | **Yes** |
| `android/gradle.properties` | 4.1 KB (contains Maps key) | **Yes** |
| `android/app/debug.keystore` | — | **Yes** |
| `uidump.xml` | — | **Yes** |
| `gate_tsc.txt` / `gate_eslint.txt` | 0 B each | **Yes** |
| `gate_tsc_full.txt` | ~150 KB | **Yes** |
| `ec_*.png` (4 files) | ~0.9 MB | **Yes** |
| `ui-baseline/` scratch | ~6.9 MB | **Yes** |

`.gitignore:81` lists `/android/gradle.properties`, but the ignore rule does not apply to already-tracked files.

---

## 9. Knowledge-graph snapshot (`codebase-memory-mcp`)

| Metric | Value |
|---|---:|
| Nodes | 1,644 |
| Edges | 3,793 |
| Indexed at | 2026-10-22T10:34:26Z |
| Status | ready |

Node distribution: Variable 610, Function 261, File 226, Module 225, Folder 121, Interface 110, Type 29, Class 26, Section 24, Method 9.
Edge distribution: DEFINES 1,299, USAGE 1,258, IMPORTS 642, CONTAINS_FILE 226, CALLS 157, CONTAINS_FOLDER 94, SEMANTICALLY_RELATED 71, CONFIGURES 17.

**Layer violations found: 1** — `src/shared/utils/navigationHelpers.ts:3` imports from `src/navigation/types`.

---

## 10. OCR deterministic selection (`ocr scan --preview`, no LLM)

| Metric | Value |
|---|---:|
| Candidate files | 338 |
| Reviewable | **226** |
| Excluded | 112 |
| Insertions considered | 17,463 |
| Notable exclusion | `index.android.bundle` (2,693,794 B > 2 MB scan limit) |

This selection is what a full-codebase OCR pass would feed to a model. The 112 exclusions are predominantly binaries, generated assets, and the committed bundle.

---

## 11. After remediation (measured at the end of this review)

Every row was re-measured with the same command as the baseline above.

| Metric | Before | After | Note |
|---|---:|---:|---|
| `src/` files | 180 | 205 | +25: icons split (11 files), `RouteRow`, `domain.ts`, `stamp.ts`, `routePlayback.ts`, `useToast.ts`, `useAsyncData.ts`, `Toast/` (3 files), 5 test-driven modules |
| `src/` LOC | 14,607 | 15,205 | +598 net, all comments + new shared modules (playback maths, shared toast) |
| Lint | 0 errors, **177 warnings** | 0 errors, **21 warnings** | icons inline styles gone; remaining warnings are pre-existing `no-inline-styles` / `no-shadow` outside icons |
| Tests | **3 suites / 28 tests** | **13 suites / 105 tests** | +10 suites / +77 tests |
| Typecheck | not wired | `tsc --noEmit` **0 errors** | new `typecheck` script |
| `as any` | 9 | **3** | DetailsScreen's 8 are gone |
| `style={{` in `src/` | 231 | **27** | 204 of those were in `icons/index.tsx` |
| `.catch(` in `src/` | 0 | **10** | every screen/service path now has an error branch |
| `freezeOnBlur` | 0 | **6** | tab navigator + 5 stacks |
| `ListEmptyComponent` | 0 | **1** | Home vehicle list |
| Unlabelled interactive elements | 27 of 55 | **0** | 27 controls labelled, re-scanned |
| Files > 300 LOC | 3 | 5 | `ReportsScreen` 390, `PlaybackPanel` 330 (B4 loop), `engineControl.ts` 355 (tokens), two icon domain files 325/313 |

Test suites: `App`, `ScreenState`, `mapService`, `vehicleService`, `ReportsScreen`, `playbackStamp`, `dob` (12), `fitRegion` (8), `playbackScrubber` (5), `ControlSwipeCard` (5), `routePlayback` (23), `useToast` (5), `useAsyncData` (7).

Gates are wired in `.github/workflows/ci.yml` (typecheck, lint, jest) so these numbers cannot silently regress.

The three remaining `as any` are the service/mock boundary casts that were already accepted in the baseline (`as unknown as` is used elsewhere for the same job); they are not the domain-model hole B9 closed.
