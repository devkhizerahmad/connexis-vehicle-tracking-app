# Code Analysis & Cleanup — Progress File

> CONTINUATION RULE: any new chat starts with: "Continue code analysis - read code-analysis-progress.md, then proceed with the next phase."

## Standing Contracts (copy — active for entire cleanup)

- **UI-FREEZE**: ZERO behavior or pixel change. DetailsScreen + ProfileScreen are reference-locked against `/ui-baseline/` (16 PNG + baseline_record.json). Everything they import (styles, tokens, @deprecated-but-used AppHeader props `contentHeight`, `contentCenterOffset`) is NEVER-DELETE.
- **Performance G1–G10**: profiler idle re-renders must remain 0 after every batch.
- **Header Standard**: nav row 56dp — untouched.
- **NO GIT operations** of any kind.
- **Docs sync DEFERRED** to project end (docs/ is read-only).

## Category System

| Category | Meaning |
|---|---|
| SAFE-DELETE | unused imports; commented-out code; temp files; unreachable code; unused locals |
| REVIEW-DELETE | unused exports/styles/tokens/assets/stubs that may serve PENDING screens — delete only on explicit OK |
| NEVER-DELETE | anything referenced by frozen screens; @deprecated-but-used props; mock JSON keys; baselines; native XML; navigation types used by stacks; barrel re-exports consumed elsewhere |

## Phases & Batches — Status

| Phase | Status | Gate results |
|---|---|---|
| P0 SNAPSHOT | ✅ DONE 2026-09-19 | 131 files copied; SHA256 manifest (130 entries); manifest hash `90B3F5C3FCD2244B8940DD808C335288D655C123698EA34D167681D50B0BB452` |
| P1 DISCOVERY | ✅ DONE 2026-09-19 | structure mapped (~121 src files; features: home, map, profile, reports, engineControl; shared + navigation) |
| P2 SCAN | ✅ DONE 2026-09-19 | findings table below (tsc/eslint-assisted + manual verification) |
| P3 REVIEW | ✅ DONE 2026-09-19 | user approved B1, B3 (subset), B4, token subset; B2 empty |
| P4 B1 unused imports/commented code/temp | ✅ DONE 2026-09-19 | babel.config.js −3 comment lines. Gates: tsc 0 ✅ eslint 0 ✅ jest 1/1 ✅ |
| P4 B2 unused StyleSheet entries + unused locals | ✅ EMPTY | nothing to change (verified) |
| P4 B3 orphan files → quarantine | ✅ DONE 2026-09-19 | Gradient/* (4 files) + SafeAreaProvider barrel quarantined; 16 kept items marked `// RESERVED: pending …`. Gates: tsc 0 ✅ eslint 0 ✅ jest 1/1 ✅ |
| P4 B4 unused deps + assets + config | ✅ DONE 2026-09-19 | `@react-native/new-app-screen` removed; `babel-plugin-module-resolver` → devDeps (npm install exit 0); 8 design screenshots → `design-references/`; tsconfig excludes + .eslintignore added. Gates: tsc 0 ✅ eslint 0 ✅ jest 1/1 ✅ Metro bundle 0 ✅ |
| P4 TOKENS (approved subset) | ✅ DONE 2026-09-19 | aliases `S/L/SZ/H/R` removed; `colors.brand.*` (6 tokens) removed; zero-refs re-verified before deletion. Gates: all pass (incl. Metro bundle) |
| P4 B5 sweep | ✅ DONE 2026-09-19 | empty dir rmdir; OS junk: none; scratch: none; residual: color.ts → quarantine; makeGradient* orphans → P5 pending OK. Gates: tsc 0 ✅ eslint 0 ✅ jest 1/1 ✅ Metro bundle 0 ✅ |
| P5 FINAL REPORT | ✅ DONE 2026-09-19 | see below — 3 decisions pending user sign-off |
| P6 OPTIONAL (RingView hoist) | ⬜ separate approval required | NOT bundled with cleanup |

## Snapshot, Quarantine & Design-References Paths

- Rollback snapshot (KEEP until P5 sign-off): `cleanup-snapshot-2026-09-19/` + `MANIFEST-SHA256.txt`
- Pre-refactor snapshot (KEEP until P5 sign-off): `snapshot-pre-refactor/`
- Quarantine: `cleanup-quarantine/` → `src/shared/components/feedback/Gradient/` (4 files), `src/shared/components/layout/SafeAreaProvider-index.ts`, `src/shared/utils/color.ts` (B5 residual)
- Design references (moved from src/assets per B4): `design-references/` — 8 unreferenced screenshots (engine control, Fuel expert man, home individual/total assets, map date-wise ×3, term & conditions). src/assets now holds only the 4 referenced images.
- Gate lint/compile hygiene: `.eslintignore` created; tsconfig `exclude` extended (snapshot dirs + quarantine + design-references).

## Executed Changes (B1–B5 detail)

- **B1**: babel.config.js — removed commented alternative preset block (3 lines).
- **B3**: quarantined `Gradient/*` (4 files) + `layout/SafeAreaProvider/index.ts`; marked RESERVED-KEEP (18 files + 4 interfaces): DateRangeCalendar, HourMinPicker, SelectField, AssetCard, PromoBanner, SummaryCards, VehicleChip, Banner, useCollapsible, useDonutProgress, format.ts, navigationHelpers.ts, mapService, historyService, map.ts, reportsService, reports.ts, useVehicleList; types HeaderProps, ToastState, VehicleStatusInfo, HomeFeedData.
- **B4**: package.json dep `@react-native/new-app-screen` REMOVED; `babel-plugin-module-resolver` moved to devDependencies (^5.0.3, npm install OK); 8 screenshots moved to `design-references/`; tsconfig + eslint exclude snapshot dirs.
- **TOKENS**: deleted alias exports `S/L` (spacing.ts), `SZ/H` (sizes.ts), `R` (radii.ts); deleted `colors.brand.{headerGradientStart,headerGradientMid,headerGradientEnd,navActive,gradTop,gradBottom}` (brand kept as empty `{}`). All other unused tokens DEFERRED until pending screens are built.
- **B5**: removed empty dir `src/shared/components/layout/SafeAreaProvider/`; residual scan found `src/shared/utils/color.ts` fully orphaned → quarantined; `makeGradientContainerStyle`/`makeGradientStripStyle` in styleFactories.ts now orphaned (their only consumer was the quarantined MultiStopGradient) → flagged for P5 decision.

## RESERVED-KEEP list (with reasons)

All RESERVED items carry a one-line `// RESERVED: pending <screen> screen` marker in-source:

- DateRangeCalendar, HourMinPicker, SelectField (controls) — pending History/Reports filters
- AssetCard, PromoBanner, SummaryCards (home components) — pending Home screen
- VehicleChip (shared/vehicle) — pending Home vehicle list chip
- Banner (feedback) — pending LiveMap/Reports alerts
- useCollapsible, useDonutProgress (hooks) — pending screen scaffolding
- format.ts, navigationHelpers.ts (utils) — pending History/Reports/LiveMap
- mapService, historyService, map.ts (features/map) — pending LiveMap/History
- reportsService, reports.ts (features/reports) — pending Reports
- useVehicleList (home/hooks) — pending Home vehicle list
- HeaderProps, ToastState (common.ts), VehicleStatusInfo (vehicle.ts), HomeFeedData (home.ts) — pending screen shape contracts

## P5 — Decisions Pending User Sign-off

✅ **ALL DECIDED 2026-09-19** — see "P5 Decisions (recorded)" section below. Nothing left pending.

## P5 — Stats

| Metric | Value |
|---|---|
| Lines removed (code) | ~15 (babel comments 3, alias exports 5, brand tokens 6, barrel 1) |
| Files quarantined | 6 (Gradient ×4, SafeAreaProvider barrel, color.ts) |
| Files moved to design-references | 8 |
| Empty dirs removed | 1 (SafeAreaProvider/) |
| Deps removed / section-moved | 1 removed (`@react-native/new-app-screen`); 1 → devDeps (`babel-plugin-module-resolver`) |
| Tokens removed | 6 brand colors + 5 alias exports |
| RESERVED markers added | 22 |
| src file count | 121 → 107 |
| Auto-removed (B5.1) | 1 empty dir; 0 junk files; 0 scratch files |
| Gate failures | 0 |

## P5 — Gate Evidence Table (final state)

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | PASS (exit 0) — after B1, B3, B4+TOKENS, B5 |
| `npx eslint . --quiet` | PASS (exit 0; zero warnings in src) |
| `npx jest` | PASS (1 suite, 1 test) — after every batch |
| Metro bundle (android, dev=false) | PASS (exit 0) — validates aliases + asset resolution + module graph post-B4/B5 |
| Details/Profile pixel diff vs /ui-baseline/ | NOT RUN (needs emulator; no code path touching frozen screens was modified — verified by import-graph) |
| Details scroll round-trip byte-identical | NOT RUN (device-dependent; same zero-touch guarantee) |
| Profiler idle re-renders = 0 | NOT RUN (device-dependent; no component/styling logic touched) |

Device-gated checks need an emulator session (unavailable in this env) — flag for on-device verification. No cleanup change intersects frozen-screen dependency chains (verified by import-graph), so pixel/behavior risk is nil by construction.

## P5 Decisions (recorded 2026-09-19 — binding)

1. **`makeGradientContainerStyle` / `makeGradientStripStyle` (styleFactories.ts) → RESERVED-KEEP.** In-source one-line marker added above each export:
   `// RESERVED: pending LiveMap/History gradient usage (do NOT delete until those screens are built)`
   Applied + gates re-run: tsc 0 ✅ eslint 0 ✅ jest 1/1 ✅.
2. **`cleanup-quarantine/` → RETAIN** until ALL pending screens (Home list, LiveMap, History, Reports, EngineControl, Profile T&C) are built and stable. Final deletion approval comes as a separate task after project completion.
3. **Snapshots (`cleanup-snapshot-2026-09-19/` + `snapshot-pre-refactor/`) → DO NOT DELETE yet.** Reason: device-gated gates 5–7 (pixel overlay diff, scroll round-trip, profiler) were not executed in the agent environment — only import-graph + tsc/eslint/jest/Metro gates passed. Snapshots are rollback insurance and stay until: (a) user runs on-device verification and confirms Details + Profile visual fidelity intact, AND (b) all pending screens are built and stable. A separate "delete snapshots" command will be issued later.
4. **P6 (RingView hoist)** remains optional + unapproved — not part of cleanup.

**Awaiting: on-device verification (gates 5–7) by user. No further cleanup action until then.**

## Next Steps for Continuation Chats

1. On-device gate pass (Details + Profile overlay diff vs /ui-baseline/, scroll round-trip, profiler idle 0) when emulator available.
2. Pending screens build-out (Home list, LiveMap, History, Reports, EngineControl, Profile T&C) — RESERVED items + design-references are their scaffolding.
3. Only AFTER project completion: separate task for quarantine + snapshot deletion approvals.
4. Optional P6: RingView hoist in OverallActivity (separate approval, NOT part of cleanup).