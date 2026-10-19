// styles.ts — S3: "out of geofence" alert card.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): the old PHASE-1 target was
// a full-width, SQUARE, hairline-bordered STRIP. The new artboard draws an
// INSET ROUNDED PINK CARD WITH A SOFT SHADOW, so the flat rectangle, its
// radius-0 corners and its border are all gone.
import { StyleSheet } from 'react-native';
import { ecCardRadius, ecColors, ecShadow, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  banner: {
    marginHorizontal: ecSizes.pageGutter,
    borderRadius: ecCardRadius,
    backgroundColor: ecColors.alertBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    // NEW design language: shadows are back on every card.
    ...ecShadow,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    color: ecColors.alertInk,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
  },
});

export default styles;