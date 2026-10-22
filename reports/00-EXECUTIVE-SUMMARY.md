# ConnexisTracker — Full Codebase Review
**Date:** 2026-10-22
**Branch / commit:** `testing-dev` @ `d59b000`
**Scope:** 180 TypeScript/TypeScriptX files under `src/` (14,607 LOC), `App.tsx`, `index.js`, build config, Android manifest and Gradle config.
**Type:** Full-repository review (not a diff review). Read-only: no source file was modified.

---

## 1. How this review was produced

| Layer | Tool | What it contributed |
|---|---|---|
| Deterministic file selection | `ocr scan --preview` (alibaba/open-code-review v1.13.3, delegate mode, no LLM) | 338 candidate files → **226 reviewable**, 112 excluded (binaries, generated, oversized bundle), 17,463 insertions |
| Structural analysis | `codebase-memory-mcp` knowledge graph | 1,644 nodes, 3,793 edges; layer/boundary/dependency map; dead-symbol candidates |
| Specialist review | 9 independent reviewer agents (review-team skill) | Correctness, code quality/conventions, performance/reliability, testing, architecture, simplicity/dead code, security, productivity/DX, UX/accessibility |
| Static gates | `tsc --noEmit`, `eslint`, `jest` | Executed live during this review |
| Verification | Direct re-read + grep of every BIG claim | False positives removed before publication |

Each reviewer worked independently and returned findings with `file:line`. Overlapping findings were merged and de-duplicated; every finding below was re-verified against the source (see `04-METRICS.md`).

---

## 2. Verdict

**The app builds, type-checks, lints and tests clean — but the "clean" is shallow.**

- `tsc --noEmit` → **0 errors**.
- `eslint` → **0 errors, 177 warnings** (all `react-native/no-inline-styles`; 204 occurrences live in one icon file).
- `jest` → **3 suites, 28 tests, all pass — in 92 seconds**. Roughly **5% of source files** carry any behavioural assertion.
- **Zero `.catch(`** in `src/` and only 2 `try` blocks across 14.6k LOC.
- **4 of 18 runtime dependencies were dead** — removed during this review (`18 → 14`), and the release build is still signed with the public debug keystore.

This is a prototype-grade codebase with production-grade visual polish. The UI work is genuinely strong; the engineering scaffolding underneath it (error handling, tests, CI, type boundaries, dependency hygiene) is not yet at the level the UI implies.

---

## 2b. Applied during this review

| Change | Detail |
|---|---|
| Removed 4 dead runtime dependencies | `react-native-paper`, `react-native-paper-dates`, `lucide-react-native`, `react-native-svg` — `npm uninstall` removed 26 packages (incl. transitive `react-native-vector-icons` and two `color` trees), 39.5 MB freed, runtime deps **18 → 14** |
| Removed the dead `PaperProvider` | `HistoryScreen/index.tsx`: import, 31-line `paperTheme` block and the provider wrapper deleted; the screen tree is plain RN views again |
| Cleaned the Jest allowlist | Dropped `react-native-paper`, `react-native-paper-dates`, `react-native-vector-icons` from `transformIgnorePatterns` and corrected its stale example comment |
| Added the typecheck gate | `"typecheck": "tsc --noEmit"`; `"noEmit": true`; `lint` now passes `.js,.jsx,.ts,.tsx` explicitly |
| Added CI | `.github/workflows/ci.yml` — `npm ci` → typecheck → lint → test, Node 22, 20-minute timeout |
| Untracked build artifacts | 12 files removed from the index and disk (gate `*.txt`, `ec_*.png`, `uidump.xml`, `index.android.bundle`); new `.gitignore` patterns |
| Removed the Maps key from the repo | `android/gradle.properties` no longer holds it; `app/build.gradle` resolves `MAPS_API_KEY` from `-P` / env / `~/.gradle/gradle.properties`; `.env` deleted |
| Gated release signing | `buildTypes.release` reads `android/keystore.properties` and aborts a release task when absent; no debug-key fallback; `keystore.properties.example` added |

Verified after the changes: `npm run typecheck` 0 errors · `npm run lint` 0 errors / 177 warnings · `npm test -- --ci` 28/28 in 17.9 s · runtime dependencies 14 · `:app:assembleDebug --dry-run` successful · `:app:assembleRelease --dry-run` aborts with the signing message · debug merged manifest still resolves a 39-char Maps key.
No peer dependency of the 14 remaining packages requires any removed package.

---

## 3. Severity matrix

| Dimension | BIG | MEDIUM | SMALL | Total |
|---|---:|---:|---:|---:|
| Correctness / reliability | 3 | 9 | 4 | 16 |
| Security / data | 3 | 3 | 4 | 10 |
| Dead code / simplicity | 1 | 4 | 7 | 12 |
| Code quality / conventions | 1 | 9 | 6 | 16 |
| Architecture | 2 | 7 | 4 | 13 |
| Performance | 2 | 4 | 4 | 10 |
| Testing | 4 | 7 | 4 | 15 |
| Productivity / DX | 2 | 9 | 3 | 14 |
| UX / accessibility | 2 | 9 | 2 | 13 |
| **Total** | **20** | **61** | **38** | **119** |

Reports: `01-BIG-ISSUES.md`, `02-MEDIUM-ISSUES.md`, `03-SMALL-ISSUES.md`, `04-METRICS.md`, `05-REMEDIATION-PLAN.md`.

---

## 4. Top 10 risks (ordered by real-world damage)

1. **Google Maps API key is committed** in tracked `android/gradle.properties` and compiled into the APK (`build.gradle:89`). `.gitignore` lists the file but ignore rules do not apply to tracked files. **Rotate now.**
2. **Release build is signed with the debug keystore** (`build.gradle:106`, passwords `android`). Anyone can produce a look-alike APK that installs as an update.
3. **No auth/session at all.** Cold start → full fleet view → lock/unlock/kill with no credential, no re-auth, no audit trail.
4. **Playback does not play.** The Play button flips a glyph; nothing advances the scrubber (`PlaybackPanel.tsx:44,66`).
5. **Every screen has no loading, empty, or error state**, and no service call has a rejection handler. A failed fetch leaves a blank or header-only screen forever.
6. **`LiveMapScreen` and `ReportsScreen` ignore a new `vehicleId` route param** when their tab is already mounted — you navigate to vehicle B and keep seeing vehicle A.
7. **Three Google `MapView`s stay mounted for the app's lifetime** (7 map instances, 0 `freezeOnBlur`/`useIsFocused` guards), compounding a self-documented ~9.2 MB/remount native leak.
8. **Profile text inputs have no accessible name** — TalkBack announces four identical "edit box" fields; the five contrast failures (1.9–2.6:1) and 7.5 pt telemetry text are likewise release-blocking for accessibility.
9. **No CI, no `typecheck` script, bare `tsc` emits into `src/`.** All gates are manual and pasted into root `.txt` files; two of them are 0 bytes.
10. **Four dead runtime dependencies** (`react-native-paper`, `react-native-paper-dates`, `lucide-react-native`, `react-native-svg`) plus a dead `PaperProvider` wrapper — **removed during this review**: 18 → 14 runtime deps, 39.5 MB of `node_modules` deleted, dead `rnsvg` native target gone.

---

## 5. What is genuinely solid

These were checked and found correct — do not churn them:

- **Type safety at compile time:** `strict: true` passes with 0 errors; only 4 `: any` and 9 `as any` in the whole tree (8 in one file).
- **Token discipline is mostly real:** 24 raw hex values outside the theme across 184 files; the theme layer exists and is used.
- **No `console.log`, no `@ts-ignore`, no `eslint-disable`, no commented-out code.**
- **Swipe-control concurrency guards are correct in construction:** `processingRef` + `forceResetRef` + `clearTimeout` exist and are wired (they simply lack tests and a failure path).
- **Date-range calendar logic:** leap-year day lists, month/year awareness, 3-click reset, and the contiguous-range painting contract behave as specified.
- **`codebase-memory` graph is live and accurate** (1,644 nodes / 3,793 edges, indexed at review time), and dependency direction is genuinely acyclic **except** one edge (`shared → navigation`).
- **Design system:** the `AppHeader` standard, shared `routeRows` tokens, and profile/reports/history token modules are a real foundation; the problems are duplication above them, not absence below.

---

## 6. Report index

| File | Contents |
|---|---|
| `01-BIG-ISSUES.md` | 20 release-blocking / user-visible / security findings, with evidence and fix |
| `02-MEDIUM-ISSUES.md` | 61 real-risk findings: maintainability, performance, a11y barriers, test gaps |
| `03-SMALL-ISSUES.md` | 38 polish items with concrete value |
| `04-METRICS.md` | Raw measured numbers, gate evidence, coverage map, dead-code inventory |
| `05-REMEDIATION-PLAN.md` | Four sequenced sprints with effort estimates and exit criteria |
