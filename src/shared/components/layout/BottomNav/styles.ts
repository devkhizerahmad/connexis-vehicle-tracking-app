import { StyleSheet } from 'react-native';
import { colors, radii } from '@shared/theme';

export const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surface.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTile: {
    width: 52,
    height: 40,
    borderRadius: radii.navActive,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  activeText: {
    color: colors.white,
    fontSize: 9, // nav label — 9pt (verbatim)
    fontWeight: '600',
  },
  idleContainer: {
    alignItems: 'center',
    gap: 3,
  },
  idleText: {
    color: colors.icon.navGray,
    fontSize: 9,
  },
});
