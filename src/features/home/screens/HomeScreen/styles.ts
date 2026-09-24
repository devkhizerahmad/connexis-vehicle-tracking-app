import { StyleSheet } from 'react-native';
import { colors } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.page,
  },
  // PATCH H-A: band content starts 29pt below the nav row (greeting top = navRowBottom + 29)
  // and is top-aligned so the chip stays clear of the summary overlap (never clipped).
  band: {
    width: '100%',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: 29,
  },
  // PATCH H-A: greeting 17pt bold white, left 12 (top comes from the band's 29pt offset)
  greeting: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 12,
  },
  // PATCH H-A: user chip 180x30 r15, bg #B9B9B9@80%, avatar 30 docked right (2pt inset)
  chip: {
    marginTop: 8,
    marginLeft: 0,
    width: 180,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(185,185,185,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipName: {
    color: colors.white,
    fontSize: 11,
    paddingLeft: 12,
    flexShrink: 1,
  },
  chipAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 'auto',
    marginRight: 2,
  },
  listContent: {
    // PATCH H-B: page margin 13
    paddingHorizontal: 13,
    paddingBottom: 24,
  },
  // PATCH H-A: summary row1 straddles the header gradient bottom by 20pt
  // (gradient paints 20pt behind the cards; header gradient bottom = row1Top + 20)
  list: {
    marginTop: -20,
  },
  // S4 title row (PATCH H-C: title 17pt bold #1A1A1A, refresh glyph 20pt, gap 8)
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 10,
  },
  titleText: {
    color: colors.home.assetsTitle,
    fontSize: 17,
    fontWeight: '700',
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: colors.surface.navy,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toastText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});