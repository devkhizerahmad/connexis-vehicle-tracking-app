// styles.ts — S9: privacy policy row.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): a TRANSPARENT row — shield
// + label centred, flanked by thin divider LINES on both sides. The old light
// blue pill background is gone with the previous design language.
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    height: ecSizes.privacyRowH,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    // Transparent — the reference row has no fill of its own.
    backgroundColor: 'transparent',
  },
  /** Thin rule running out to each edge of the card. */
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: ecColors.cardBorder,
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    color: ecColors.privacyInk,
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;
