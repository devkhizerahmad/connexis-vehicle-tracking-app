PROMPT 1:

## STEP 0 — ASSET RECON (read-only) ✓

**Assets found in `src/assets/`:**

| File | Size (bytes) | Dimensions | Purpose |
|---|---|---|---|
| `login screen red background.png` | 1,341,386 | **1024×1536** (portrait) | User-provided red background |
| `connexis_logo_white_text.png` | 1,068,458 | **3840×825** (ultra-wide) | User-provided white logo with text |
| `logo.png` | 20,833 | (old colored logo) | Currently used — **to be replaced** |

**Icon components in `src/shared/components/icons/auth.tsx`:**

| Icon | File:Line | Current State | Issue |
|---|---|---|---|
| `Envelope` | `auth.tsx:34` | Rounded rectangle body + flap chevron | ✓ Distinct — keep as-is |
| `Eye` | `auth.tsx:62` | **Circle** outline + pupil dot | ✗ Must rebuild as **almond** outline |
| `EyeOff` | `auth.tsx:97` | Eye + diagonal slash | ⚠️ Uses circle (rebuild on almond) |
| `Lock` | **DOES NOT EXIST** | — | ✗ **Missing** — must add |

Note: `LockGlyph` exists in `engineControl.tsx:30` (padlock: shackle + body), but it's a padlock shape scoped to Engine Control — not the simple rectangular-body + shackle-arc `Lock` glyph needed for the login password field.

**Theme tokens (from `src/shared/theme/colors.ts`):**
- `colors.red` = `#E03131` · `colors.surface.navy` = `#1B2430` · `colors.onAccent` = `#FFFFFF`
- `colors.surface.card` = `#FFFFFF` · `colors.text.primary` = `#222222` · `colors.text.secondary` = `#7A8288`
- `colors.gradientHeader` = `['#2A0508', '#C0110F']` · `colors.authIconTint` = `rgba(192, 17, 15, 0.10)`
- `shadows.card` exists · `radii.pill` = 14 (button) · `radii.card` = 8

**Test expectations preserved (`__tests__/LoginScreen.test.tsx`):** testIDs (`login-username-input`, `login-password-input`, `login-eye-toggle`, `login-remember-checkbox`, `login-forgot-password`, `login-button`, `login-contact-support`), `StatusBar` `light-content`, "Welcome Back!" text, red dash BG `#E03131`, gradient colors `#2A0508`/`#C0110F`.

---

Per RULE 0, I'm presenting STEP 0 and pausing. Confirm **"proceed with STEP 1"** to replace the hand-built background with the image asset, or **"hold"** to adjust scope first.




PROMT 2:

Proceed with STEP 1 through STEP 7 in full, with these clarifications binding (do not re-ask about anything covered here):

1. BACKGROUND CROP: use resizeMode='cover' as planned. After render, verify on device that all four corner decorations of the asset (top-left streak, top-right crosshair, bottom-left crosshair, bottom-right streak) remain at least partially visible and visually balanced. If cover crops any of them into full invisibility, DO NOT silently switch modes — capture a screenshot, report the crop loss, and present the cover-vs-stretch tradeoff (stretch keeps all decorations but distorts the crosshair circles into ellipses) for my decision.

2. LOGO COMPOSITION: render connexis_logo_white_text.png as the wordmark at reference ratio width, with "Secure • Smart • Connected" as white text below it (band-check first per spec; the asset's 3840×825 aspect indicates wordmark-only, so text tagline is expected). Do NOT add a "TECHNOLOGIES" spaced line — the new asset supersedes the old logo block composition. Replace logo.png usage on this screen only.

3. LOCK ICON: prefer adding a proper Lock (rectangular body + shackle arc) to src/shared/components/icons/auth.tsx. HOWEVER, if on inspection LockGlyph (engineControl.tsx:30) visually matches the reference padlock glyph, you MAY reuse it via the shared barrel instead of duplicating — your call, but verify the rendered glyph against the reference on device and state which option you used. Eye and EyeOff must be rebuilt on the almond base as diagnosed.

4. TOKENS: reuse the existing colors.authIconTint (rgba(192,17,15,0.10)) for the icon-square tint — do NOT create a duplicate tint token. Only genuinely missing tokens (e.g. the derived light footer-on-red variants) get added, documented, and flagged.

5. TESTS: __tests__/LoginScreen.test.tsx pins testIDs (login-username-input, login-password-input, login-eye-toggle, login-remember-checkbox, login-forgot-password, login-button, login-contact-support), StatusBar light-content, "Welcome Back!", dash #E03131, gradient #2A0508/#C0110F. Preserve ALL of these through the fix pass; jest must stay green. If any fix legitimately requires changing a pinned value (it should not), update the test in the same change and FLAG it explicitly in the report.

6. EXECUTION: run STEP 1 → STEP 7 completely, including the scroll-clipping verification (top / bottom / mid-scroll at the card edge), the keyboard UX verification (focus visibility, next/go flow, on-drag dismiss, eye toggle with keyboard open), the icon distinctness screenshot, the button full-width/centered check, the footer-on-red recolor, static gates, and baseline re-capture (rest + scrolled-bottom + keyboard-open). Then HARD STOP with the one-line closing and the full report (asset filenames, icon choices, token additions, per-check PASS/DELTA/DEFERRED, all explicit lines).

Proceed now.