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
});