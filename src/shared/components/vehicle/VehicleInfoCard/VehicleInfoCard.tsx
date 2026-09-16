// VehicleInfoCard.tsx — Vehicle specs & stats card with overlay box
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Clock, Pin, Speedo } from '@shared/components/icons';
import { CyanLocationBox } from '@shared/components/vehicle/CyanLocationBox';
import { colors } from '@shared/theme';
import { styles } from './styles';

interface Props {
  speedLabel: string;
  speed: string;
  updateLabel: string;
  update: string;
  lastLocationLabel: string;
  location: string;
  liveLocation: string;
  onLiveLocation?: () => void;
  onCyanHeight?: (h: number) => void;
}

export function VehicleInfoCard(p: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.carImageContainer}>
        <Image
          source={require('../../../../assets/img_car_sedan.png')}
          style={styles.carImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.row}>
          <Speedo color={colors.icon.brickRed} size={18} />
          <Text numberOfLines={1} style={styles.textContainer}>
            <Text style={styles.labelBold}>{p.speedLabel}</Text>
            <Text style={styles.valueText}>{p.speed}</Text>
          </Text>
        </View>

        <View style={styles.rowTopAlign}>
          <Clock color={colors.icon.brickRed} size={18} />
          <Text numberOfLines={2} style={styles.textContainer}>
            <Text style={styles.labelBold}>{p.updateLabel}</Text>
            <Text style={styles.valueText}>{p.update}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.liveLocationContainer}>
        <Pressable
          onPress={p.onLiveLocation}
          style={styles.liveLocationButton}>
          <Pin color={colors.icon.btnPin} size={14} />
          <Text style={styles.liveLocationText}>{p.liveLocation}</Text>
        </Pressable>
      </View>

      <CyanLocationBox
        lastLocationLabel={p.lastLocationLabel}
        location={p.location}
        onCyanHeight={p.onCyanHeight}
      />
    </View>
  );
}

export default VehicleInfoCard;
