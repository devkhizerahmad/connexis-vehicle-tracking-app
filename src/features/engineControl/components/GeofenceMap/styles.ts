// styles.ts — S4: geofence map (INSET ROUNDED CARD) + its two corner badges.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): the map is no longer an
// edge-to-edge, sharp-cornered plane — it is an INSET ROUNDED CARD WITH A SOFT
// SHADOW, and both badges float INSET from those rounded corners.
//
// The DEFAULT colourful Google basemap is kept (the flat version's washed-out
// custom style stays deleted), and the Google logo stays: it is mandatory
// attribution and react-native-maps exposes no size/opacity prop for it.
// Basemap tile labels (Arabic / "Lahore" / POIs) are Google's, not the app's.
import { StyleSheet } from 'react-native';
import { ecCardRadius, ecColors, ecShadow, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  wrap: {
    height: ecSizes.mapH,
    marginHorizontal: ecSizes.pageGutter,
    borderRadius: ecCardRadius,
    overflow: 'hidden',
    backgroundColor: ecColors.rowBg,
    // NEW design language: shadows are back on every card.
    ...ecShadow,
  },
  map: {
    flex: 1,
  },
  /** Top-left dark read-out: clock glyph + "Last Updated" over the time. */
  updatedBox: {
    position: 'absolute',
    top: ecSizes.mapInset,
    left: ecSizes.mapInset,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
    backgroundColor: ecColors.mapBoxBg,
  },
  updatedIcon: {
    marginRight: 6,
  },
  updatedLabel: {
    color: ecColors.mapBoxLabel,
    fontSize: 7.5,
    lineHeight: 9.5,
  },
  updatedValue: {
    color: ecColors.mapBoxInk,
    fontSize: 11.5,
    fontWeight: '700',
    lineHeight: 14,
  },
  /** Top-right green pill: shield-check glyph + white label. */
  fenceChip: {
    position: 'absolute',
    top: ecSizes.mapInset,
    right: ecSizes.mapInset,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: ecColors.mapChipBg,
  },
  fenceChipIcon: {
    marginRight: 5,
  },
  fenceChipText: {
    color: ecColors.mapChipInk,
    fontSize: 11,
    fontWeight: '700',
  },
});

export default styles;