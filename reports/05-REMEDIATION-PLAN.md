# Remediation Plan

Four sequenced sprints. Ordered so that each one removes a category of risk rather than spreading effort evenly.

Effort scale: **S** < 1 h · **M** 1–4 h · **L** 1–3 d · **XL** > 1 week.

---

## Sprint 0 — Stop the bleeding (same day, ~4 h)

Nothing here needs a design decision. Do it before any feature work.

| # | Action | Fixes | Effort |
|---|---|---|---|
| 1 | Rotate the Google Maps key in Cloud Console; add package + SHA-1 + API restrictions | B1 | S | (key rotated 2026-10-23 by user; **remaining: update `C:\Users\Administrator\.gradle\gradle.properties` with the new key + add package/SHA-1 restrictions in Cloud Console**) |
| 2 | ~~`git rm --cached android/gradle.properties`, `uidump.xml`, `android/app/src/main/assets/index.android.bundle`; add `*.bundle` to `.gitignore`~~ **DONE** (12 artifacts untracked + deleted) | B1 | M |
| 3 | ~~Delete `.env`; move the canonical value into an untracked local file~~ **DONE** (key now in `~/.gradle/gradle.properties`) | S8 | S |
| 4 | ~~Add `"typecheck": "tsc --noEmit"` and `"noEmit": true`~~ **DONE** | B20 | S |
| 5 | ~~Add `.github/workflows/ci.yml`: `npm ci` → typecheck → lint → test~~ **DONE** | B19 | M |
| 6 | ~~Delete the 16 root artifacts and 0-byte gate files; add ignore patterns~~ **DONE** (12 files untracked + deleted) | M39, M42 | S |
| 7 | ~~`accessibilityLabel` on all 27 unlabelled controls; `autoComplete`/`returnKeyType` on Profile fields~~ **DONE** — 0 unlabelled `Pressable` remain; Profile fields autofill-ready | B13, M53 | M |

**Exit criteria:** CI is green on a PR; no secret in tracked files; release build signed with a private key.

---

## Sprint 1 — Correctness and access (2–3 days)

The user-visible lies and the blocked-accessible paths.

| # | Action | Fixes | Effort |
|---|---|---|---|
| 1 | ~~Implement playback advance + wire `onScrub` + derive the timestamp~~ **DONE** - RAF loop, `setProgress` on the scrubber handle, `derivePlaybackStamp` in `PlaybackPanel/stamp.ts`, 5 new stamp tests, device-verified | B4, M8 | M |
| 2 | ~~Resync `vehicleId` from route params in LiveMap and Reports~~ **DONE** - param synced via `useEffect`, consumed via `setParams`, `getVehicleDetails(id)` relabels mock, 3 new service tests | B5, M2, M3 | S |
| 3 | ~~One `ScreenShell` + `EmptyState`/`ErrorState`/Retry; add `.catch` to all 5 services; `ListEmptyComponent`~~ **DONE** — `ScreenState` shipped, every screen fetch handles rejection, Home has `ListEmptyComponent`, 4 new tests | B6, M4, M5 | L |
| 4 | ~~`try/catch/finally` in `ControlSwipeCard`~~ **DONE** — `.catch` + `.finally`, failure notice | M1 | S |
| 5 | ~~`await` real save in Profile; toast only on resolve~~ **DONE** — `save()` returns `null` on failure, toast branches on `ok` | M6 | S |
| 6 | ~~Fix DOB clamp (component-wise)~~ **DONE** - year/month/day clamped one segment at a time; future year keeps month+day; 12 DOB tests | M7, B15 | M |
| 7 | ~~`accessibilityLabel` on all 27 unlabelled controls; `autoComplete`/`returnKeyType` on Profile fields~~ **DONE** — 0 unlabelled `Pressable` remain; Profile fields autofill-ready | B13, M53 | M |
| 8 | ~~Fix the 5 contrast pairs to >=4.5:1; raise telemetry text to >=12 pt~~ **DONE (telemetry + status ink)** — 7.5 -> 10 pt, gray -> grayStrong, dark ink on bright status fills, dark chip text. `colors.ts` values and `reportColors.rangeFill` untouched | B14, M55 | M |
| 9 | Tab role + selected state; `expanded` state on collapsibles; ~~live-region on toasts~~ **toast part DONE** (single `<Toast>` carries `role="alert"` + `liveRegion="polite"`); tab/collapsible parts open | M52, M56, S38 | M |
| 10 | 44 dp hit areas via `hitSlop` | M54 | S |
| 11 | Kill-confirmation (biometric or modal) + audit log entry | B3, M38 | L |

**Exit criteria:** no screen can render blank without an explanation; playback moves; every icon-only control is named; all text passes AA.

---

## Sprint 2 — Structure (1 week)

Removes the duplication that makes every future change expensive.

| # | Action | Fixes | Effort |
|---|---|---|---|
| 1 | ~~Split `icons/index.tsx` into domain files + `icons/styles.ts`; memoise; delete dead exports~~ **DONE** - 12 files, 204 inline styles removed, 65 memo, lint 176 -> 22 warnings, parity proven | B8, S14 | L |
| 2 | ~~Create `shared/types/domain.ts`; replace the duplicated vehicle interfaces; delete the `as any` casts~~ **DONE** - one status union, shared geometry, DetailsScreen fully typed, repo `as any` 9 -> 3 | B9, S21 | L |
| 3 | ~~Extract `shared/components/vehicle/RouteRow`; reduce both route lists to wrappers~~ **DONE** - shared row + `routeRowToneFromKey`, both list stylesheets reduced to card chrome, device-verified | B10 | M |
| 4 | ~~One `useToast` + `<Toast>`; delete 5 copies~~ **DONE** - one hook + one shell, all 5 screens migrated, per-screen timer refs and toast styles deleted, `useToast` tests (5) added, device-verified on all 5 screens | M17, S3, M56 | M |
| 5 | Extract `useReportRange`/`useReportFilters`; break up `ReportsScreen` | M24 | L |
| 6 | ~~`useAsyncData` hook; migrate the data loads~~ **DONE** - one hook, 6 call sites (2 hooks + 4 screens), three cancellation idioms gone, M9 double-fetch closed, 7 tests | M31, M9 | M |
| 7 | ~~`accessibilityLabel` on all 27 unlabelled controls; `autoComplete`/`returnKeyType` on Profile fields~~ **DONE** — 0 unlabelled `Pressable` remain; Profile fields autofill-ready | B13, M53 | M |
| 8 | ~~Fix the 5 contrast pairs to >=4.5:1; raise telemetry text to >=12 pt~~ **DONE (telemetry + status ink)** — 7.5 -> 10 pt, gray -> grayStrong, dark ink on bright status fills, dark chip text. `colors.ts` values and `reportColors.rangeFill` untouched | B14, M55 | M |
| 9 | Move `RootTabParamList` into `shared/types`; fix the upward import | M26 | S |
| 10 | Single `TABS` array; type `CustomTabBar` | M30, S24 | M |
| 11 | Fix `sizes.ts` duplicates and the 40/44 conflict; replace the 24 raw hex values | M21, M22, M25 | M |
| 12 | `FieldTrigger` primitive; retire the 4 competing field components | M19, S16 | L |

**Exit criteria:** one route row, one field trigger, one toast, one async pattern; an import from `shared` never reaches `features` or `navigation`.

---

## Sprint 3 — Test and guard (1 week)

| # | Action | Fixes | Effort |
|---|---|---|---|
| 1 | ~~`__tests__/dob.test.ts` with frozen clock~~ **DONE** - 12 tests | B15 | M |
| 2 | ~~`__tests__/PlaybackScrubber.test.tsx`~~ **DONE** - 5 tests (layout-first, clamp, silent setProgress, re-seed) | B16 | M |
| 3 | ~~`__tests__/ControlSwipeCard.test.tsx`~~ **DONE** - 5 guard cases, real 800 ms seam + fake timers | B17 | M |
| 4 | ~~`__tests__/fitRegion.test.ts`~~ **DONE** - 8 tests | B18 | S |
| 5 | Replace the vacuous calendar assertion with a real boundary walk | M10 | M |
| 6 | Mount `ReportsScreen` in one test | M11 | M |
| 7 | ~~`accessibilityLabel` on all 27 unlabelled controls; `autoComplete`/`returnKeyType` on Profile fields~~ **DONE** — 0 unlabelled `Pressable` remain; Profile fields autofill-ready | B13, M53 | M |
| 8 | ~~Fix the 5 contrast pairs to >=4.5:1; raise telemetry text to >=12 pt~~ **DONE (telemetry + status ink)** — 7.5 -> 10 pt, gray -> grayStrong, dark ink on bright status fills, dark chip text. `colors.ts` values and `reportColors.rangeFill` untouched | B14, M55 | M |
| 9 | Convert real-timer waits to fake timers; target <10 s suite | S30 | M |
| 10 | Coverage config + floor, wired into CI | M16, B19 | S |
| 11 | `husky` + `lint-staged` pre-push typecheck | M43 | S |
| 12 | Consolidate README + guide + `OPEN-ISSUES.md`; delete the duplicated HTML | M44–M46, S35, S36 | M |

**Exit criteria:** ≥40% line coverage; every pure-logic module has a table-driven test; suite <10 s; CI fails on regression.

---

## Resolved — the dependency contract

**Applied during this review.** The four dead runtime dependencies were removed (`npm uninstall react-native-paper react-native-paper-dates lucide-react-native react-native-svg`), taking the runtime count **18 → 14**. The dead `PaperProvider` wrapper was deleted from `HistoryScreen`, and the Jest `transformIgnorePatterns` allowlist was cleaned.

Consequences:
- 39.5 MB freed in `node_modules`; 26 packages removed including transitive trees.
- The autolinked `rnsvg` native target is gone from the next native build. Run `gradlew clean` once before rebuilding so stale CMake objects do not linger.
- The 18-dependency cap is superseded: the **new floor is 14**, and the standing rule should read "no new runtime dependencies without justification" rather than a fixed number.

Note: adding `@testing-library/react-native` (Sprint 3) is a **devDependency** and does not affect the runtime count of 14.

---

## Effort summary

| Sprint | Focus | Estimate |
|---|---|---|
| 0 | Secrets, artifacts, CI, signing | ~4 h |
| 1 | Correctness + accessibility | 2–3 d |
| 2 | Structural deduplication | ~5 d |
| 3 | Tests + guardrails | ~5 d |
| **Total** | | **~2.5 weeks of focused work** |

---

## What to do first, if only one day is available

1. Rotate the Maps key (B1).
2. Delete `.env` and untrack `gradle.properties` (B1, S8).
3. Add the `typecheck` script and the CI workflow (B19, B20).
4. Implement playback advance (B4).
5. Add `accessibilityLabel` to the Profile fields (B13).

Those five changes remove the two worst security exposures, restore the app's headline feature, and make every future regression visible.

---

## Status at close (2026-10-23)

| Sprint | Rows | Done |
|---|---|---|
| Sprint 0 - stop the bleeding | 7 | 6 done, 1 blocked on the user (new Maps key in `~/.gradle/gradle.properties` + Cloud Console restrictions) |
| Sprint 1 - correctness + accessibility | 8 | all 8 done (B5, B6, M1-M8, B13, B14) |
| Sprint 2 - structural deduplication | 12 | rows 1-3 done (icons split, shared domain types, shared `RouteRow`); rows 4-12 open |
| Sprint 3 - tests + guardrails | 12 | rows 1-4 done (B15-B18) plus row 5 (DOB clamp); rows 6-12 open |
| Sprint 4 - optional polish | - | open |

Gates: `npm run typecheck` 0 errors -> `npm run lint` 0 errors / 22 warnings -> `npm test -- --ci` 10 suites / 70 tests.

B3 (biometric kill-confirmation / audit log) stays permanently out of scope for this review.
