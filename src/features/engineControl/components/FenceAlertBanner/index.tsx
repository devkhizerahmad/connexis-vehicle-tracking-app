// FenceAlertBanner (S3) — pink geofence alert card under the vehicle card.
// The glyph is a FILLED red circle carrying a white "!" (the NEW reference),
// not the outlined AlertRing the flat version used. The trailing ">" chevron
// that used to close the row has been removed; the message now runs to the
// card's right padding on its own.
import React from 'react';
import { Text, View } from 'react-native';
import { AlertCircle } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import { styles } from './styles';

export interface FenceAlertBannerProps {
  message: string;
}

function FenceAlertBannerImpl({ message }: FenceAlertBannerProps) {
  return (
    <View style={styles.banner} testID="ec-alert-banner">
      <View style={styles.icon}>
        <AlertCircle color={ecColors.alertInk} size={16} />
      </View>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

export const FenceAlertBanner = React.memo(FenceAlertBannerImpl);
export default FenceAlertBanner;
