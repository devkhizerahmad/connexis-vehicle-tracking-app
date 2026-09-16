// styles.ts — static styles for the profile actions block
import { StyleSheet } from 'react-native';
import { profileTokens } from '@shared/theme';

export const styles = StyleSheet.create({
  button: {
    marginHorizontal: profileTokens.space.buttonMarginH,
    marginTop: profileTokens.space.buttonMarginTop,
    height: profileTokens.size.buttonH,
    borderRadius: profileTokens.radius.button,
    backgroundColor: profileTokens.color.dangerButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: profileTokens.opacity.pressed,
  },
  buttonLabel: {
    color: profileTokens.color.onDark,
    fontSize: profileTokens.type.buttonLabel.fontSize,
    fontWeight: profileTokens.type.buttonLabel.fontWeight,
    letterSpacing: profileTokens.type.buttonLabel.letterSpacing,
    textAlign: 'center',
  },
  logoutBtn: {
    alignSelf: 'center',
    marginTop: profileTokens.space.logoutMarginTop,
    padding: profileTokens.space.logoutTapPad,
  },
  logoutLabel: {
    color: profileTokens.color.logoutText,
    fontSize: profileTokens.type.logoutLabel.fontSize,
    fontWeight: profileTokens.type.logoutLabel.fontWeight,
    letterSpacing: profileTokens.type.logoutLabel.letterSpacing,
    textAlign: 'center',
  },
});