// styles.ts — S4: geofence map (424..786 px → 195 pt, x=24..699 px, radius 10).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  wrap: {
    height: ecSizes.mapH,
    marginHorizontal: ecSizes.gutter,
    borderRadius: ecSizes.cardRadius,
    overflow: 'hidden',
    backgroundColor: ecColors.rowBg,
  },
  map: {
    flex: 1,
  },
  /**
   * F5: top-left navy read-out. Width is CONTENT-driven (was a fixed 58 pt box,
   * which squeezed "Last Updated" onto four lines). 12 pt inset so the pill sits
   * inside the map rather than hanging off its rounded corner.
   */
  updatedBox: {
    position: 'absolute',
    top: ecSizes.mapInset,
    left: ecSizes.mapInset,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: ecSizes.radiusChip,
    backgroundColor: ecColors.mapBoxBg,
  },
  updatedLabel: {
    color: ecColors.mapBoxLabel,
    fontSize: 8,
    lineHeight: 11,
  },
  updatedValue: {
    color: ecColors.mapBoxInk,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  /**
   * F6: top-right lime chip, fully INSIDE the map (was flush at right:0 with a
   * fixed 111 pt width, which clipped the trailing edge of the label).
   */
  fenceChip: {
    position: 'absolute',
    top: ecSizes.mapInset,
    right: ecSizes.mapInset,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ecSizes.radiusChip,
    backgroundColor: ecColors.mapChipBg,
  },
  fenceChipIcon: {
    marginRight: 6,
  },
  fenceChipText: {
    color: ecColors.mapChipInk,
    fontSize: 11,
    fontWeight: '700',
  },
});

/**
 * F2 — Engine Control S4 uses an explicitly LIGHT Google style.
 *
 * LiveMapView's darkMapStyle is deliberately NOT imported here: the reference
 * artboard for Engine Control shows a light street map (tan/white streets + blue
 * river) with POI labels still visible ("Lahore", "Gulberg III", "Liberty
 * Market"), so POI/transit layers are intentionally left ON. Shipping a named
 * style also pins the look regardless of the device's dark-mode setting — that is
 * what "force light" means for the Google Maps SDK.
 */
export const ecLightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#F2F2F2' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#555555' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#E0E0E0' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#E0E0E0' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#AADAFF' }] },
];

export default styles;
