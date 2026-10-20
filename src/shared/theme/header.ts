// header.ts — TOP-HEADER STANDARD: the ONE source of truth for every screen's
// top header. Consumed by the shared `AppHeader` and by the per-screen header
// actions, so the nav row cannot drift between screens.
//
// The ramp is the DIAGONAL pair adopted from the Engine Control Vehicle
// Dashboard reference (dark maroon -> brand red) and is now GLOBAL: every
// screen paints the same gradient, on the same axis, over the same fixed strip.
//
// Standard (all values dp unless noted):
//   • nav row  : 56 high, vertical centre = safeAreaInset.top + 28
//   • inset    : 16 horizontal (matches the 16dp page gutter)
//   • slots    : 44 wide left AND right — the touch-target floor
//   • back     : one Chevron (left), 14 / 600, labelled "Back"
//   • title    : 16 / 600, white, single line, tail-ellipsised, optically centred
//   • avatar   : 32, `profile_avatar.png`, no ring
//   • background: the shared diagonal ramp on a fixed nav-row strip
import { colors } from './colors';

export const headerSpec = {
  /** Zone 2 nav-row height. */
  navRowH: 56,
  /** Nav-row horizontal inset — aligns the header with the 16dp page gutter. */
  horizontalInset: 16,
  /** Left AND right slot width — the touch-target floor for header actions. */
  slotWidth: 44,
  /** Minimum touch target for every header action. */
  minTouchTarget: 44,
  back: {
    /** Glyph size passed to the shared `Chevron` icon. */
    size: 14,
    weight: '600' as const,
    /** Screen-reader name for the back affordance on every screen. */
    label: 'Back',
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
  },
  avatar: {
    size: 32,
    /**
     * `profile_avatar.png` carries a BAKED-IN white hoop at ~92% radius. The
     * photo is over-scaled inside the circular clip so the hoop is cropped away
     * (clipping, not an asset swap).
     */
    cropScale: 1.16,
  },
  background: {
    /** The ONE ramp (shared/theme/colors.ts). */
    colors: colors.gradientHeader,
    /** Diagonal axis: start top-right, end bottom-left. */
    start: { x: 1, y: 0 },
    end: { x: 0, y: 1 },
    /**
     * The ramp is painted as the header's OWN background layer — the whole
     * container (nav row, plus the band below it on the extended screen). On a
     * standard screen the container IS the nav-row strip, so the hue behind the
     * title is identical everywhere; on the extended screen the SAME single
     * layer continues through the band, so there is no flat slab and no seam.
     */
    stripHeight: 56,
  },
} as const;
