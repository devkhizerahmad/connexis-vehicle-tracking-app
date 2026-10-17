// styles.ts — S4: geofence map (edge-to-edge, sharp) + its two corner badges.
//
// PHASE-1 DESIGN LANGUAGE (P5a): the custom `ecLightMapStyle` is DELETED. It
// desaturated every road to white/grey and flattened the land to #F2F2F2, which
// is why the map rendered washed-out next to the reference's full-colour Google
// map. With no `customMapStyle` the provider falls back to the DEFAULT colourful
// Google style.
//
// PHASE-1 (P5d) is deliberately NOT implemented here: the Google logo is
// mandatory attribution and react-native-maps exposes no size/opacity prop for
// it — `padding` only RELOCATES it, which would push it onto the POI labels
// instead of making it less prominent.
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  wrap: {
    height: ecSizes.mapH,
    marginHorizontal: ecSizes.flat,
    borderRadius: ecSizes.flat,
    overflow: 'hidden',
    backgroundColor: ecColors.rowBg,
  },
  map: {
    flex: 1,
  },
  /**
   * P4: top-left read-out, FLUSH to the map's sharp corner (was inset 12 pt
   * inside a rounded map) and ~30% smaller — padding 5/10 -> 3/7, label 8 -> 7,
   * value 13 -> 10.5. `borderRadius: flat` matches P7's sharp language.
   */
  updatedBox: {
    position: 'absolute',
    top: ecSizes.mapInset,
    left: ecSizes.mapInset,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: ecSizes.flat,
    backgroundColor: ecColors.mapBoxBg,
  },
  updatedLabel: {
    color: ecColors.mapBoxLabel,
    fontSize: 7,
    lineHeight: 9,
  },
  updatedValue: {
    color: ecColors.mapBoxInk,
    fontSize: 10.5,
    fontWeight: '700',
    lineHeight: 12.5,
  },
  /**
   * P4: top-right chip, flush to the sharp corner, with the shield glyph removed
   * (the reference carries the label alone) and the ink repointed to dark green
   * on the brighter #67DC52 fill — white-on-lime was a hard contrast failure.
   */
  fenceChip: {
    position: 'absolute',
    top: ecSizes.mapInset,
    right: ecSizes.mapInset,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ecSizes.flat,
    backgroundColor: ecColors.mapChipBg,
  },
  fenceChipText: {
    color: ecColors.mapChipInk,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default styles;