// styles.ts — S3: "out of geofence" alert banner (368..423 px → 30 pt, #FEE3E7).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  banner: {
    height: ecSizes.bannerH,
    marginHorizontal: ecSizes.bannerGutter,
    borderRadius: ecSizes.radiusSm,
    backgroundColor: ecColors.alertBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    color: ecColors.alertInk,
    fontSize: 11,
    fontWeight: '500',
  },
});

export default styles;
