// styles.ts — static styles for the Profile screen assembly
import { StyleSheet } from 'react-native';
import { profileTokens, shadows } from '@shared/theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: profileTokens.color.pageLight,
  },
  flex: {
    flex: 1,
  },
  /** White form card: marginH 35, marginTop 15 from the avatar bottom, radius 4, soft shadow. */
  formCard: {
    marginHorizontal: profileTokens.space.formMarginH,
    marginTop: profileTokens.space.formMarginTop,
    backgroundColor: profileTokens.color.cardSurface,
    borderRadius: profileTokens.radius.formCard,
    paddingTop: profileTokens.space.formPadTop,
    paddingBottom: profileTokens.space.formPadBottom,
    ...shadows.card,
  },
  toast: {
    position: 'absolute',
    left: profileTokens.space.toastInsetH,
    right: profileTokens.space.toastInsetH,
    bottom: profileTokens.space.toastBottom,
    paddingVertical: profileTokens.space.toastPadV,
    paddingHorizontal: profileTokens.space.toastPadH,
    borderRadius: profileTokens.radius.toast,
    backgroundColor: profileTokens.color.toastSurface,
    alignItems: 'center',
  },
  toastText: {
    color: profileTokens.color.onDark,
    fontSize: profileTokens.type.toastLabel.fontSize,
    fontWeight: profileTokens.type.toastLabel.fontWeight,
  },
});