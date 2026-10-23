# SMALL Issues — polish with concrete value

**38 findings.** Each has a definite fix and a measurable benefit; none blocks release on its own.

---

## Correctness (4)

| ID | Location | Problem | Fix |
|---|---|---|---|
| S1 | `DateRangeCalendar/DateRangeCalendar.tsx:141` | Year-sync `setTimeout` is never cleared; it can fire after unmount or after the user has moved on. | Store the id in a ref; clear in the effect cleanup and before scheduling a new one. |
| S2 | `HomeScreen/HomeScreen.tsx:96` | `keyExtractor={(v) => v.name}` — two vehicles with the same name collide and React reuses the wrong row state. | Use `v.id`. |
| S3 | 5 toast implementations | `setToast(null)` is never called, so the state persists after fade-out; Home and Details also never clear their timer. | Fold into the shared `useToast` hook (M17); clear timer on unmount and reset state after the exit animation. **FIXED** — `useToast` clears the timer on unmount and sets the message back to `null` inside the fade-out completion callback; locked by `__tests__/useToast.test.tsx`. |
| S4 | `DetailsScreen/DetailsScreen.tsx:80` | `vehicles[selectedIndex]` falls back to index 0 when the id is not found, so the header silently mislabels the vehicle. | Resolve by id and render an explicit not-found state. |

---

## Security (4)

| ID | Location | Problem | Fix |
|---|---|---|---|
| S5 | `AndroidManifest.xml:19` | Commented `usesCleartextTraffic` placeholder with no `network_security_config.xml`; behaviour depends on the platform default. | Declare `android:networkSecurityConfig` with cleartext disabled, or delete the placeholder so the default is explicit. |
| S6 | `ProfileFormField.tsx` / `useProfile.ts` | No length limits, no email/phone validation, no trimming; a 10 KB paste is accepted and persisted. | Add `maxLength`, a cheap email regex, and `.trim()`; surface an inline error slot (shared with B13). |
| S7 | `package.json` | No `npm audit` step, no Dependabot/Renovate config, no lockfile policy note. | Add a scheduled audit job and a dependency-update bot. |
| S8 | `.env` (53 bytes) | Holds a duplicate of the Maps key under a mislabeled variable (`GEMINI_API_KEY`), is not read by Gradle, and adds a second place to leak from. | Delete it; keep the canonical value in an untracked `android/gradle.properties`/CI secret. |

---

## Dead code / simplicity (7)

| ID | Location | Problem | Fix |
|---|---|---|---|
| S9 | `shared/utils/format.ts`, `hooks/useDonutProgress.ts`, `components/Banner/*`, `components/VehicleChip/*`, `ProfileDobPicker/index.ts` | Five modules ship with zero importers. | Delete; recover from git if needed. |
| S10 | `src/shared/theme/styles.ts` (styleFactories) | 4 of 7 factory exports are unused. | Delete the 4. |
| S11 | `shared/theme/*`, `CustomTabBar` | Token lookup is stringly-typed with silent fallbacks; `CustomTabBar` has a dead `case 'Details'` branch for a tab that no longer exists. | Type the keys; delete the dead case so an unknown label fails loudly. |
| S12 | `toIsoDate` + 4 inline ISO builders | One helper is dead while four call sites hand-roll the same `YYYY-MM-DD` string. | Keep one `toIsoDate` and use it everywhere. |
| S13 | `reports.ts`, `engineControl.ts` | Exported alias arrays/consts used only inside their own module (e.g. `ROUTE_*`). | Drop `export` or delete. |
| S14 | `shared/components/icons/index.tsx` | 12 exports have no importer outside the file (`StatusIcons`, `CircleGlyph`, `Tank`, `Wind`, `Leaf`, `FoldedMap`, `BoxIcon`, `FenceChipGlyph`, `ZoneBadge`, `PlayTriangleGlyph`, `ShuffleGlyph`, `DiamondMarker`). | Delete during the B8 split. |
| S15 | `controls/Collapsible/Collapsible.tsx` | Keeps the overlay mounted at `opacity 0` after collapse; the `duration` prop is accepted and ignored. | Unmount on complete; honour or remove `duration`. |

---

## Code quality / conventions (6)

| ID | Location | Problem | Fix |
|---|---|---|---|
| S16 | `profile/components/ProfileFormField/` | A third labelled-field primitive alongside `SelectField` and `SelectVehicleField`; different label/error layout for the same concept. | Fold into the single `FieldTrigger` (M19). |
| S17 | `ReportTile` (×3 modules), `reports/types`, `home` | The name `ReportTile` refers to three different things (grid tile, list row, type). | Rename to `QuickReportTile`, `ReportRow`, `ReportTileSpec`. |
| S18 | repo-wide | Barrel convention exists but is not followed; deep `../../../components/.../ComponentName` paths bypass `index.ts` is inconsistent. | Enforce alias paths (`@features/...`) or drop barrels. |
| S19 | `App.tsx`, several components | Duplicate imports from the same module in one file; `App.tsx` imports past the barrel; quote style drifts from Prettier config. | Run `prettier --write`; merge duplicate imports; import via barrel. |
| S20 | `RoutesCard`, `QuickReportGrid` | Section-header JSX is duplicated, and `chunk()` is implemented twice. | One `<SectionHeader>` and one `chunk` util. |
| S21 | 5 service files | Mock JSON is forced onto domain types via `as unknown as`, so shape drift is invisible to the compiler. | Parse with a runtime guard (zod-free hand-written check) or typed fixture builders. |

---

## Architecture (4)

| ID | Location | Problem | Fix |
|---|---|---|---|
| S22 | `ProfileScreen.tsx` | Bypasses `AppHeader` and hand-rolls its own top bar, so the standard header is not universal. | Use `AppHeader` with the avatar disabled and a settings action. |
| S23 | `HomeScreen.tsx` | Reaches the Profile tab via an untyped `navigation.getParent()?.navigate(...)`. | Add a typed helper in `navigationHelpers` (after M26 moves the type). |
| S24 | `navigation/types.ts` vs `RootNavigator.tsx` | Tab labels are declared in one place and the tab list in another. | Single `TABS` source (M30). |
| S25 | `shared/components/controls/` | Mixes true primitives (Switch, Chip) with feature-shaped controls (DateRangeField, HourMinPicker). | Move the latter to `features/reports/components/`. |

---

## Performance (4)

| ID | Location | Problem | Fix |
|---|---|---|---|
| S26 | `PlaybackPanel.tsx:100-145` | The hour-chip `memo` is invalidated by an inline `onSelect`; the tick strip renders 64 `View`s on each render. | `useCallback` the handler; hoist the static tick array. |
| S27 | `LiveMapView.tsx:157` | Inline `ref={(r) => …}` is a new function every render, so React detaches/attaches the native ref each time. | Stable `useCallback` ref or `useRef` + effect. |
| S28 | `AssetCard` sensor strip | Runs the collapse animation on mount even when the vehicle has no sensor rows. | Skip the animation when the strip is empty. |
| S29 | `useVehicleDetails` | Returns the whole selected-vehicle object, so every card re-renders when any field changes. | Return `(id) => vehicle` or split into per-card selectors. |

---

## Testing (4)

| ID | Location | Problem | Fix |
|---|---|---|---|
| S30 | `__tests__/*` | Real `setTimeout` waits make the suite take **96 s** for 28 tests. | `jest.useFakeTimers()` everywhere; the suite should finish in <10 s. |
| S31 | `__tests__/App.test.tsx` (12 lines) | Renders `App` and asserts nothing — no crash is the only signal. | Assert the splash disappears and the tab bar appears (fake timers). |
| S32 | `__tests__/mapService.test.ts` | Pins fixture literals (plate, name) instead of behaviour; a mock edit breaks the test without a product defect. | Assert shape/contract and id-selection semantics. |
| S33 | `__tests__/ReportsScreen.test.tsx:559-580` | Route-placement test asserts the config object it just constructed — tautological. | Mount the navigator and assert the rendered screen. |

---

## Productivity (3)

| ID | Location | Problem | Fix |
|---|---|---|---|
| S34 | `package.json`, `.eslintignore`, `tsconfig.json` | ESLint 8 is end-of-life; TypeScript is pinned to a `6.x` caret (beta); `.eslintignore` duplicates `.gitignore` entries. | Move to ESLint 9 flat config; pin an exact TS version; delete `.eslintignore` and use `ignorePatterns`. |
| S35 | repo root | No `CONTRIBUTING.md`, no `CHANGELOG.md`; the guide is duplicated as a hand-maintained 30 KB HTML file with no generator. | One Markdown source; generate the HTML if still needed. |
| S36 | `docs/PROJECT_GUIDE.html` | 30 KB hand-maintained HTML that already drifted from the Markdown it mirrors. | Delete one of the two; keep Markdown. |

---

## UX / accessibility (2)

| ID | Location | Problem | Fix |
|---|---|---|---|
| S37 | `src/features/**` | 55 hardcoded user-facing strings; no i18n layer; `marginLeft`/`paddingRight` instead of `marginStart`/`paddingEnd`, so RTL mirrors incorrectly. | Extract strings to a `copy.ts`; use logical margins. |
| S38 | `Collapsible`, `AssetCard` | Section toggles expose no `accessibilityState={{expanded}}`, so TalkBack cannot say whether a section is open. | Add `expanded` state to every toggle. |
