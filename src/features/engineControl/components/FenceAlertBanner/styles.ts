// styles.ts — S3: the "out of geofence" alert, now the VEHICLE CARD's BOTTOM
// FOOTER.
//
// LIVE CORRECTION (C3): the alert is NOT a standalone floating card and NOT the
// map card's top banner. It is embedded INSIDE the vehicle + status card as
// that card's bottom footer, flush with the card's bottom-left / bottom-right
// corners and sharing their radius — the exact mirror of the header-attach
// rule (a header bar flush with the TOP radius; this strip flush with the
// BOTTOM radius). No gap, no separate card, no shadow of its own.
import { StyleSheet } from 'react-native';
import { ecCardRadius, ecColors } from '@shared/theme';

export const styles = StyleSheet.create({
  banner: {
    // Shared corner with the vehicle card's bottom corners.
    borderBottomLeftRadius: ecCardRadius,
    borderBottomRightRadius: ecCardRadius,
    backgroundColor: ecColors.alertBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
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
