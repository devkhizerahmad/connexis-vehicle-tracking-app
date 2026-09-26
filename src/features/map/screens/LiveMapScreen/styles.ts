// styles.ts — LiveMapScreen S1–S6 geometry (390pt reference)
import { ImageStyle, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@shared/theme';

/**
 * PATCH L1: visible white gap between the map box bottom and the BottomNav top.
 * The screen applies it as MAP_NAV_GAP + nav-bar height, because BottomNav is
 * absolutely positioned over the scene (BottomNav/styles.ts) — a plain 12pt
 * margin would render *behind* the opaque bar (measured 1pt visible on device).
 */
export const MAP_NAV_GAP = 12;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  } as ViewStyle,
  body: {
    flex: 1,
  } as ViewStyle,
  // S5 map box (PATCH L1/L2): marginH 16, flex 1.
  // L2: marginTop is measured from the CYAN BOX BOTTOM EDGE. The cyan box hangs
  // 18pt below the card bottom (S4 marginBottom: -18), so the card's layout edge
  // sits 18pt above the cyan bottom → 22 + 18 = 40 from the card bottom.
  // Verified invariant: cyanBottom + 22 === mapTop (device: 22.0pt).
  // L1: marginBottom is supplied by the screen (MAP_NAV_GAP + navBarHeight) so the
  // 12pt gap clears the absolutely-positioned BottomNav.
  mapWrap: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 40,
    overflow: 'hidden',
  } as ViewStyle,
  // S1: 32pt circular avatar in the header right slot
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface.border,
  } as ImageStyle,
});