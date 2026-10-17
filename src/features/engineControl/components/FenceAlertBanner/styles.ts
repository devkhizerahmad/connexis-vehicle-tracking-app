// styles.ts — S3: "out of geofence" alert banner.
//
// PHASE-1 DESIGN LANGUAGE (P7): the banner was a floating tinted pill — 8 pt
// radius, inset by a 15 pt gutter on each side. The reference draws a
// RECTANGULAR, FULL-WIDTH strip, so the radius and both side margins are gone
// and a thin pink-red hairline now defines its edge. Height 30 -> 21 pt (≈30%
// less vertical padding) with the glyph and type shrunk to match (P8).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  banner: {
    height: ecSizes.bannerH,
    marginHorizontal: ecSizes.flat,
    borderRadius: ecSizes.flat,
    borderWidth: 1,
    borderColor: ecColors.alertBorder,
    backgroundColor: ecColors.alertBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    flex: 1,
    color: ecColors.alertInk,
    fontSize: 10,
    fontWeight: '500',
  },
});

export default styles;