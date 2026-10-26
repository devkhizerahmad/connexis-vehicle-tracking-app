// LoginScreen/styles.ts — STYLE ONLY. Colors = existing theme tokens (STEP 1).
// Geometry = spec-ratio build from design-references/Login Screen.png
// (dp = (ref_px / 1000) × 390). No sampled palette, no arbitrary hex.
import { StyleSheet } from 'react-native';
import { colors, shadows, spacing } from '@shared/theme';

export const headerFieldH = 420;
export const arcLarge = 260;
export const arcSmall = 160;
export const logoW = 110;
export const logoH = 44;
export const cardW = 330;
export const cardRadius = 16;
export const cardPadH = 24;
export const cardPadT = 30;
export const cardPadB = 24;
export const inputH = 52;
export const inputRadius = 12;
export const iconSquare = 44;
export const fieldGap = 16;
export const sectionGap = 24;
export const buttonH = 52;
export const buttonRadius = 12;
export const footerGap = 24;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface.page,
  },
  headerField: {
    position: 'relative',
    height: headerFieldH,
    overflow: 'hidden',
  },
  arcLarge: {
    position: 'absolute',
    top: -arcLarge * 0.55,
    left: -arcLarge * 0.35,
    width: arcLarge,
    height: arcLarge,
    borderRadius: arcLarge / 2,
    backgroundColor: colors.gradientHeader[0],
  },
  arcSmall: {
    position: 'absolute',
    top: -arcSmall * 0.25,
    right: -arcSmall * 0.3,
    width: arcSmall,
    height: arcSmall,
    borderRadius: arcSmall / 2,
    backgroundColor: colors.gradientHeader[0],
  },
  headerCurve: {
    position: 'absolute',
    bottom: -cardRadius * 0.6,
    left: 0,
    right: 0,
    height: cardRadius,
    backgroundColor: colors.surface.page,
    borderTopLeftRadius: cardRadius * 2,
    borderTopRightRadius: cardRadius * 2,
  },
  pinkArc: {
    position: 'absolute',
    bottom: -arcSmall * 0.15,
    left: -arcSmall * 0.15,
    width: arcSmall,
    height: arcSmall,
    borderRadius: arcSmall / 2,
    borderWidth: 3,
    borderColor: colors.authDecorArc,
  },
  logoWrap: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: logoW,
    height: logoH,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    color: colors.onAccent,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    width: cardW,
    alignSelf: 'center',
    marginTop: -cardRadius * 0.85,
    backgroundColor: colors.surface.card,
    borderRadius: cardRadius,
    paddingHorizontal: cardPadH,
    paddingTop: cardPadT,
    paddingBottom: cardPadB,
    ...shadows.card,
  },
  redDash: {
    width: 24,
    height: 3,
    backgroundColor: colors.red,
    borderRadius: 2,
    marginBottom: 12,
  },
  welcomeTitle: {
    color: colors.surface.navy,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  welcomeSub: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: sectionGap,
  },
  fieldLabel: {
    color: colors.text.label,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surface.hairline,
    borderRadius: inputRadius,
    height: inputH,
    paddingHorizontal: 12,
    marginBottom: fieldGap,
    backgroundColor: colors.surface.page,
  },
  inputIcon: {
    width: iconSquare,
    height: iconSquare,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  inputIconTint: {
    backgroundColor: colors.authIconTint,
    borderRadius: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surface.hairline,
    borderRadius: inputRadius,
    height: inputH,
    paddingHorizontal: 12,
    marginBottom: fieldGap,
    backgroundColor: colors.surface.page,
  },
  eyeToggle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  rememberLabel: {
    color: colors.text.dark,
    fontSize: 14,
    flex: 1,
  },
  forgotPassword: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButtonWrap: {
    alignItems: 'center',
    marginBottom: footerGap,
  },
  loginButton: {
    width: '100%',
    height: buttonH,
    borderRadius: buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loginButtonText: {
    color: colors.onAccent,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: footerGap,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surface.hairline,
  },
  orText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  footer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginRight: 6,
  },
  footerLink: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '600',
  },
  kaView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  checkMark: {
    color: colors.onAccent,
    fontSize: 14,
    fontWeight: '700',
  },
});