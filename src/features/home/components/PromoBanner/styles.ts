import { StyleSheet } from 'react-native';
import { colors } from '@shared/theme';

export const styles = StyleSheet.create({
  banner: {
    height: 119,
    borderRadius: 8,
    backgroundColor: colors.icon.blue,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  left: {
    flex: 55,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface.navy,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 10,
  },
  right: {
    flex: 45,
    justifyContent: 'flex-end',
  },
  blobLavender: {
    position: 'absolute',
    top: -14,
    right: -10,
    width: 90,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.icon.purple,
    opacity: 0.35,
  },
  blobPink: {
    position: 'absolute',
    top: 30,
    left: -8,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.alertBg,
    opacity: 0.7,
  },
  quarterCircle: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 90,
    height: 90,
    borderTopLeftRadius: 90,
    backgroundColor: colors.surface.navy,
  },
  man: {
    width: '100%',
    height: 104,
    alignSelf: 'center',
  },
});