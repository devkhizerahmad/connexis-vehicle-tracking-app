// profile.ts — Profile screen design tokens (sampled from the Profile artboard)
import { GradientStop } from '@shared/types/common';

/**
 * Profile header vertical gradient stops — SAMPLED from the reference artboard
 * (column x=380 of the 390x844 frame, clear of the avatar).
 * Measured: 0% #A4411A -> 40% #73321C -> 80% #35221E -> 100% #1B1C20
 */
export const profileGradientStops: readonly GradientStop[] = [
  { offset: 0, color: '#A4411A' },
  { offset: 0.4, color: '#73321C' },
  { offset: 0.8, color: '#35221E' },
  { offset: 1, color: '#1B1C20' },
];

export const profileTokens = {
  gradientStops: profileGradientStops,
  color: {
    // sampled: the artboard page reads #FFFFFF (card surface is a 1-level #FEFEFE)
    pageLight: '#FFFFFF',
    cardSurface: '#FFFFFF',
    avatarRing: '#E0E0E0',
    // sampled from the divider lines at y=312/395/479/560 (#CECECE core)
    dividerLine: '#CECECE',
    fieldLabel: '#9AA0A6',
    fieldValue: '#333333',
    fieldPlaceholder: '#4A4F54',
    // sampled from the flat button fill (away from the label glyphs)
    dangerButton: '#CD0716',
    logoutText: '#B05656',
    onDark: '#FFFFFF',
    toastSurface: '#1B2430',
  },
  size: {
    // PATCH A: gradient band below the safe-area inset -> header = inset + 100 (≈140)
    headerBar: 100,
    // PATCH A: title row centre = safeAreaTop + 60 -> 32 + row(56)/2
    headerCenterOffset: 32,
    chevron: 20,
    // PATCH B: avatar diameter 80pt
    avatar: 80,
    avatarRing: 1,
    avatarInner: 78,
    hairline: 1,
    // PATCH C: UPDATE PROFILE height 52pt
    buttonH: 52,
  },
  space: {
    headerPadH: 16,
    // PATCH B: avatar top = headerBottom - 10 (10pt above the gradient edge)
    avatarOverlap: 10,
    formMarginH: 35,
    formMarginTop: 15,
    // tuned against the artboard band table: row pitch 82.5px,
    // label ink -> value ink 29px, divider -> next label ink 34px
    formPadTop: 0,
    // artboard: card bottom sits 23px below the last value's ink
    formPadBottom: 6,
    // artboard: label/value ink both start at x=54 -> card padLeft 30 (card at x=24)
    fieldPadL: 30,
    fieldLabelMt: 27,
    fieldValueMt: 9,
    fieldValueMb: 9,
    dividerInset: 10,
    // PATCH C: Update button marginH 42, 32pt below the card bottom
    buttonMarginH: 42,
    buttonMarginTop: 32,
    // PATCH C: LOGOUT 40pt below the button
    logoutMarginTop: 40,
    logoutTapPad: 12,
    scrollBottomPad: 40,
    toastInsetH: 24,
    toastBottom: 32,
    toastPadV: 10,
    toastPadH: 14,
  },
  radius: {
    formCard: 4,
    button: 2,
    // PATCH B: 80pt avatar
    avatar: 40,
    avatarInner: 39,
    toast: 6,
  },
  opacity: {
    pressed: 0.9,
  },
  type: {
    headerTitle: { fontSize: 17, fontWeight: '700' },
    fieldLabel: { fontSize: 11, fontWeight: '400' },
    fieldValue: { fontSize: 13, fontWeight: '400' },
    buttonLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
    logoutLabel: { fontSize: 12, fontWeight: '400', letterSpacing: 1.5 },
    toastLabel: { fontSize: 12, fontWeight: '600' },
  },
} as const;