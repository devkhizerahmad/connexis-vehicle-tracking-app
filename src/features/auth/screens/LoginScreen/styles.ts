// LoginScreen/styles.ts — STYLE ONLY. Colours are theme tokens.
//
// Geometry follows design-references/Login Screen.png (390dp-wide artboard):
//   hero band = 225dp tall, filled with the shared app-header gradient,
//   white card overlaps the hero by 64dp and is 86% wide (capped at 340dp),
//   footer is pinned to the viewport bottom via marginTop: 'auto'.
//
// The hero lives INSIDE the ScrollView so the keyboard can scroll it away; the
// card's negative top margin creates the overlap without absolute positioning,
// and the footer's auto margin parks it at the bottom on tall screens while
// letting it follow the card on short ones.
//
// REPAIR NOTES (previous build):
// - `logoWrap` had no dimensions while `logoImage` was 100%/100%, so Yoga sized
//   the wordmark against the ScrollView box and it covered the whole screen.
//   The logo now has explicit width/height at the asset's real 3840:825 ratio.
// - The Login button's Touchable had no width, so the gradient's `width:'100%'`
//   resolved against the content-sized touchable. The pressable owns the width.
// - Removed `overflow`/fixed heights: the card must scroll freely under the
//   keyboard on short screens.
import { Platform, StyleSheet } from 'react-native';
import { colors, shadows, spacing } from '@shared/theme';

/** Wordmark width in dp (≈49% of a 390dp artboard) at the asset's native ratio. */
export const logoW = 190;
export const logoAspect = 2164 / 727;
export const logoH = Math.round(logoW / logoAspect);

/** Hero band height in dp — the shared header gradient fills it. */
export const heroHeight = 225;
/** Top padding between the status-bar inset and the wordmark. */
export const heroInsetTop = 12;

export const cardW = 340;
export const cardRadius = 18;
export const cardPadH = 24;
export const cardPadT = 28;
export const cardPadB = 24;
/** How far the card rides up onto the hero band. */
export const cardOverlap = 64;
export const inputH = 52;
export const inputRadius = 12;
export const iconSquare = 40;
export const fieldGap = 16;
export const sectionGap = 24;
export const buttonH = 52;
export const buttonRadius = 12;
export const footerGap = 24;
/** Minimum touch target (WCAG 2.5.5 / Material). */
export const touchTarget = 44;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    // Light page behind the hero and below the card (native window colour too,
    // so rotate/relaunch never flashes the old full-bleed red).
    backgroundColor: colors.authPage,
  },
  kaView: {
    flex: 1,
  },
  scrollContent: {
    // Full-bleed hero: the card and footer own their own side gutters.
    flexGrow: 1,
  },
  hero: {
    width: '100%',
    height: heroHeight,
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    alignItems: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: logoW,
    height: logoH,
  },
  technologies: {
    color: colors.onAccent,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 4.5,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    width: '86%',
    maxWidth: cardW,
    alignSelf: 'center',
    marginTop: -cardOverlap,
    backgroundColor: colors.surface.card,
    borderRadius: cardRadius,
    paddingHorizontal: cardPadH,
    paddingTop: cardPadT,
    paddingBottom: cardPadB,
    ...shadows.card,
  },
  redDash: {
    width: 28,
    height: 3,
    backgroundColor: colors.red,
    borderRadius: 2,
    marginBottom: 14,
  },
  welcomeTitle: {
    color: colors.authTitle,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  welcomeSub: {
    // Blue-grey from the reference; 5.9:1 on white (AA).
    color: colors.authMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: sectionGap,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.authErrorBg,
    borderWidth: 1,
    borderColor: colors.authErrorBorder,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    flex: 1,
    color: colors.authErrorText,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginLeft: spacing.sm,
  },
  field: {
    marginBottom: fieldGap,
  },
  fieldLabel: {
    color: colors.authMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.authFieldBorder,
    borderRadius: inputRadius,
    height: inputH,
    paddingHorizontal: 10,
    // Flat white fill, as in the reference (the icon tile supplies the tint).
    backgroundColor: colors.surface.card,
  },
  inputRowFocused: {
    borderColor: colors.red,
    backgroundColor: colors.surface.card,
  },
  inputRowInvalid: {
    borderColor: colors.authErrorText,
    // Tint (not just a red border) so an invalid field stays distinguishable
    // from the brand-red focus ring.
    backgroundColor: colors.authErrorBg,
  },
  inputIcon: {
    width: iconSquare,
    height: iconSquare,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  inputIconTint: {
    backgroundColor: colors.authIconTint,
    borderRadius: 10,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    color: colors.text.primary,
    fontSize: 15,
  },
  eyeToggle: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldError: {
    color: colors.authErrorText,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sectionGap,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.surface.border,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  checkMark: {
    color: colors.onAccent,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
  },
  rememberLabel: {
    color: colors.text.dark,
    fontSize: 14,
  },
  rememberLabelHit: {
    flex: 1,
    justifyContent: 'center',
    minHeight: touchTarget,
    marginLeft: 10,
  },
  forgotHit: {
    justifyContent: 'center',
    minHeight: touchTarget,
    paddingLeft: spacing.sm,
  },
  forgotPassword: {
    color: colors.red,
    fontSize: 13,
    fontWeight: '600',
  },
  loginButtonWrap: {
    marginBottom: footerGap,
  },
  loginButtonPressable: {
    width: '100%',
    borderRadius: buttonRadius,
  },
  loginButtonPressableDisabled: {
    opacity: 0.7,
  },
  loginButton: {
    width: '100%',
    height: buttonH,
    borderRadius: buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
  },
  loginButtonText: {
    color: colors.onAccent,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surface.hairline,
  },
  orText: {
    color: colors.authMuted,
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: spacing.md,
  },
  footer: {
    alignItems: 'center',
    // 'auto' parks the footer at the bottom of the viewport when the content is
    // shorter, and collapses on short screens/keyboard so it still scrolls.
    marginTop: 'auto',
    paddingTop: footerGap,
    paddingHorizontal: 20,
  },
  footerText: {
    color: colors.authMuted, // blue-grey on the light page (5.9:1)
    fontSize: 14,
    marginBottom: 2,
  },
  footerLink: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '700',
  },
  footerLinkHit: {
    minHeight: touchTarget,
    justifyContent: 'center',
  },
  // Android renders TextInput text with extra top padding without this on some
  // OEM fonts; `paddingVertical: 0` + explicit height above keeps it centred.
  androidInputFix: Platform.OS === 'android' ? { includeFontPadding: false } : {},
});
