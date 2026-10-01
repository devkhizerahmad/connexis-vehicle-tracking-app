// VehicleStatusCards (S2) — the car identity card and the live status card.
// Height reference: left 160..352 px (≈103 pt), right 160..330 px (≈92 pt), so the
// row aligns to the TOP and the two cards keep their own heights.
import React, { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { CameraLockGlyph, ExternalLinkGlyph, PlayTriangleGlyph } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import type { EngineVehicle } from '@features/engineControl/types/engineControl';
import { styles } from './styles';

export interface VehicleStatusCardsProps {
  vehicle: EngineVehicle;
  onFencePress: () => void;
}

function VehicleStatusCardsImpl({ vehicle, onFencePress }: VehicleStatusCardsProps) {
  return (
    <View style={styles.row} testID="ec-vehicle-row">
      <View style={styles.vehicleCard} testID="ec-vehicle-card">
        <Image
          source={require('../../../../assets/img_car_sedan.png')}
          style={styles.car}
          resizeMode="contain"
        />
        <View style={styles.caption}>
          <Text style={styles.captionPrefix}>{vehicle.captionPrefix}</Text>
          <Text style={styles.captionName}>{vehicle.name}</Text>
        </View>
      </View>

      <View style={styles.statusCard} testID="ec-status-card">
        <Pressable
          onPress={onFencePress}
          accessibilityRole="button"
          accessibilityLabel={vehicle.fenceState}
          style={({ pressed }) => [styles.fencePill, pressed ? styles.pressed : null]}
          testID="ec-fence-pill">
          {/* F3: camera-lock left, external-link right; the label is NOT
              flex-shrunk so "Out of Fence" always renders complete. */}
          <CameraLockGlyph color={ecColors.fencePillInk} size={16} />
          <Text style={styles.fencePillText} numberOfLines={1}>
            {vehicle.fenceState}
          </Text>
          <ExternalLinkGlyph color={ecColors.fencePillInk} size={15} />
        </Pressable>

        <View style={styles.statusRow}>
          {/* F4: clean right-pointing play triangle, vertically centred. */}
          <View style={styles.flag}>
            <PlayTriangleGlyph color={ecColors.runningGreen} size={16} />
          </View>
          <Text style={styles.statusText}>{vehicle.status}</Text>
        </View>

        {vehicle.addressLines.map(line => (
          <Text key={line} style={styles.address}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
}

export const VehicleStatusCards = memo(VehicleStatusCardsImpl);
export default VehicleStatusCards;
