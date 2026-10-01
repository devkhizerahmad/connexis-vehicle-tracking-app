// FenceAlertBanner (S3) — red-tinted banner under the vehicle cards.
// The glyph is the OUTLINED alert ring (red ring + red "!"), not the filled
// AlertCircle used elsewhere in the app.
import React from 'react';
import { Text, View } from 'react-native';
import { AlertRing } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import { styles } from './styles';

export interface FenceAlertBannerProps {
  message: string;
}

function FenceAlertBannerImpl({ message }: FenceAlertBannerProps) {
  return (
    <View style={styles.banner} testID="ec-alert-banner">
      <View style={styles.icon}>
        <AlertRing color={ecColors.alertInk} size={18} />
      </View>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

export const FenceAlertBanner = React.memo(FenceAlertBannerImpl);
export default FenceAlertBanner;
