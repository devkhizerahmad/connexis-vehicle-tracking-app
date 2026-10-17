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
import { ExternalLinkGlyph, PlayTriangleGlyph } from '@shared/components/icons';
import { ecColors, ecSizes } from '@shared/theme';
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
        <Image
          source={require('../../../../assets/img_car_sedan.png')}
          style={styles.car}
          resizeMode="contain"
        />
        <View style={styles.caption}>
          <Text style={styles.captionLabel}>{vehicle.lastUpdatedLabel}</Text>
          <Text style={styles.captionValue}>{vehicle.lastUpdatedValue}</Text>
        </View>
      </View>

      <View style={styles.statusCol} testID="ec-status-card">
        {/* P3: label + external-link arrow only. The Pressable and its
            accessibilityLabel are unchanged, so the tap target and the
            screen-reader name behave exactly as before. */}
        <Pressable
          onPress={onFencePress}
          accessibilityRole="button"
          accessibilityLabel={vehicle.fenceState}
          style={({ pressed }) => [styles.fencePill, pressed ? styles.pressed : null]}
          testID="ec-fence-pill">
          <Text style={styles.fencePillText} numberOfLines={1}>
            {vehicle.fenceState}
          </Text>
          <View style={styles.fencePillIcon}>
            <ExternalLinkGlyph color={ecColors.fencePillInk} size={12} />
          </View>
        </Pressable>

        <View style={styles.statusRow}>
          <View style={styles.flag}>
            <PlayTriangleGlyph color={ecColors.runningGreen} size={ecSizes.flagSize} />
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