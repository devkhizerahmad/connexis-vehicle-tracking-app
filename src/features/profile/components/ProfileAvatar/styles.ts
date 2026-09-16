// styles.ts — static styles for the Profile avatar
import { StyleSheet } from 'react-native';
import { profileTokens } from '@shared/theme';

export const styles = StyleSheet.create({
  /** 80pt circle straddling the gradient edge: top = header bottom − 15pt. */
  ring: {
    width: profileTokens.size.avatar,
    height: profileTokens.size.avatar,
    borderRadius: profileTokens.radius.avatar,
    borderWidth: profileTokens.size.avatarRing,
    borderColor: profileTokens.color.avatarRing,
    backgroundColor: profileTokens.color.cardSurface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: -profileTokens.space.avatarOverlap,
    zIndex: 1,
  },
  image: {
    width: profileTokens.size.avatarInner,
    height: profileTokens.size.avatarInner,
    borderRadius: profileTokens.radius.avatarInner,
  },
});