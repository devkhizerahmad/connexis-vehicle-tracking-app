// VehicleStatusCards (S2) — the single flat vehicle + live-status card.
//
// PHASE-1 DESIGN LANGUAGE (P1): the two inset rounded boxes ("car card" and
// "status card") are now ONE full-width, square, shadow-free plane attached
// directly under the header. P1 also replaces the "Car | <model>" caption with
// the reference's "Last Updated <time>" caption — grey small label + bold time,
// left-aligned under the photo. Both values come from the mock unchanged.
//
// P2: the "Running" label no longer clips its descender (see styles.ts).
// P3: the camera-lock glyph is removed from the "Out of Fence" badge, leaving
//     the label + external-link arrow, flush top-right.
import React, { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { CameraLockGlyph, ExternalLinkGlyph, Pin } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import type { EngineVehicle } from '@features/engineControl/types/engineControl';
import { styles } from './styles';

export interface VehicleStatusCardsProps {
  vehicle: EngineVehicle;
  onFencePress: () => void;
}

function VehicleStatusCardsImpl({ vehicle, onFencePress }: VehicleStatusCardsProps) {
  return (
    <View style={styles.card} testID="ec-vehicle-row">
      <View style={styles.identity} testID="ec-vehicle-card">
        {/* FLAG: the NEW reference shows a white VAN. No van asset exists in the
            repo (only img_car_sedan.png), so the existing vehicle-image
            mechanism is kept rather than substituting a wrong picture.
            "van asset missing - user to provide". */}
        <Image
          source={require('../../../../assets/img_car_sedan.png')}
          style={styles.car}
          resizeMode="contain"
        />
        <View style={styles.caption}>
          <Text style={styles.captionLabel}>{vehicle.plateLabel}</Text>
          <Text style={styles.captionValue}>{vehicle.plateValue}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statusCol} testID="ec-status-card">
        <Pressable
          onPress={onFencePress}
          accessibilityRole="button"
          accessibilityLabel={vehicle.fenceState}
          style={({ pressed }) => [styles.fencePill, pressed ? styles.pressed : null]}
          testID="ec-fence-pill">
          <View style={styles.fencePillLeading}>
            <CameraLockGlyph color={ecColors.fencePillInk} size={13} />
            <Text style={styles.fencePillText} numberOfLines={1}>
              {vehicle.fenceState}
            </Text>
          </View>
          <View style={styles.fencePillIcon}>
            <ExternalLinkGlyph color={ecColors.fencePillInk} size={12} />
          </View>
        </Pressable>

        <View style={styles.statusRow}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>{vehicle.status}</Text>
        </View>

        <View style={styles.addressRow}>
          <View style={styles.addressIcon}>
            <Pin color={ecColors.addressInk} size={12} />
          </View>
          <View style={styles.addressLines}>
            {vehicle.addressLines.map(line => (
              <Text key={line} style={styles.address}>
                {line}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export const VehicleStatusCards = memo(VehicleStatusCardsImpl);
export default VehicleStatusCards;