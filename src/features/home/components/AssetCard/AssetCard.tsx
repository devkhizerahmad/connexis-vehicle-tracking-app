// AssetCard.tsx — S5: vehicle asset card (FlatList item, memoized)
// NOTE (TODO, REVIEW): the reference mock shows a VAN photo for Kia Sportage; no van
// asset exists in src/assets yet — the sedan photo is used for all cards until the
// van asset is added.
import React from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';
import {
  ArrowRight,
  BatteryGlyph,
  Chevron,
  CirclePlay,
  Clock,
  ListIcon,
  Pin,
  SignalBars,
  Speedo,
  StarIcon,
  Thermo,
  Droplet,
  DoorIcon,
} from '@shared/components/icons';
import { colors } from '@shared/theme';
import { useCollapsible } from '@shared/hooks/useCollapsible';
import { VehicleSummary } from '@features/home/types/home';
import { styles } from './styles';

const statusColors = {
  running: colors.status.running,
  idle: colors.status.idle,
  stop: colors.status.stop,
  noData: colors.status.noData,
} as const;

const statusLabels = {
  running: 'Running',
  idle: 'Idle',
  stop: 'Stop',
  noData: 'No Data',
} as const;

export interface AssetCardProps {
  vehicle: VehicleSummary;
  onMoreDetails: (v: VehicleSummary) => void;
  onViewOnMap: (v: VehicleSummary) => void;
  onReports: (v: VehicleSummary) => void;
}

export function AssetCard({ vehicle, onMoreDetails, onViewOnMap, onReports }: AssetCardProps) {
  // Honda Civic only: premium sensor strip (250ms collapse via shared hook)
  const strip = vehicle.sensorStrip;
  const { toggle, anim, animatedHeight, onMeasureLayout } = useCollapsible(
    vehicle.expandedByDefault ?? false,
  );
  // premium chevron: 0deg open, 180deg closed (rotates with the collapse animation)
  const rotateDeg = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={styles.card}>
      {/* header: 55% black name / 45% status colour (NOT the frozen PlateStatusRow) */}
      <View style={styles.header}>
        <View style={styles.headerName}>
          <Text style={styles.headerNameText}>{vehicle.name}</Text>
        </View>
        <View style={[styles.headerStatus, { backgroundColor: statusColors[vehicle.status] }]}>
          <Text style={styles.headerStatusText}>{statusLabels[vehicle.status]}</Text>
        </View>
      </View>

      {/* body: left 35% photo + battery mini-list / right 65% info rows + buttons */}
      <View style={styles.body}>
        <View style={styles.leftCol}>
          <Image source={require('../../../../assets/img_car_sedan.png')} style={styles.photo} resizeMode="contain" />
          {/* PATCH H-D: dashed box around the battery / satellite / signal rows */}
          <View style={styles.batteryBox}>
            <View style={styles.batteryRow}>
              <BatteryGlyph color={colors.status.stop} size={9} />
              <Text style={styles.batteryText}>Battery Voltage: {vehicle.batteryVoltage}</Text>
            </View>
            <View style={styles.batteryRow}>
              <BatteryGlyph color={colors.status.idle} size={9} />
              <Text style={styles.batteryText}>Satellite Signal: {vehicle.satelliteSignal}</Text>
            </View>
            <View style={styles.batteryRow}>
              <SignalBars color={colors.tileGreen} size={9} />
              <Text style={styles.batteryText}>Signal Strength: {vehicle.signal}</Text>
            </View>
          </View>
          {/* PATCH H-D: 10pt #8A9199 link + ArrowRight glyph (no literal "->") */}
          <Pressable style={styles.moreDetailsLink} onPress={() => onMoreDetails(vehicle)}>
            <Text style={styles.moreDetails}>More Details</Text>
            <ArrowRight color={colors.home.moreDetails} size={10} />
          </Pressable>
        </View>

        <View style={styles.rightCol}>
          <View style={styles.infoRow}>
            <Speedo color={colors.icon.brickRed} size={12} />
            <Text style={styles.infoLabel}>Current Speed: </Text>
            <Text style={styles.infoValue}>{vehicle.speed}</Text>
          </View>
          <View style={styles.infoRow}>
            <CirclePlay color={colors.icon.brickRed} size={12} />
            <Text style={styles.infoLabel}>Last Location: </Text>
            <Text style={styles.infoValue}>{vehicle.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock color={colors.icon.brickRed} size={12} />
            <Text style={styles.infoLabel}>Last Update: </Text>
            <Text style={styles.infoValue}>{vehicle.update}</Text>
          </View>
          <View style={styles.buttonsRow}>
            <Pressable style={[styles.actionBtn, { backgroundColor: colors.home.reportsBtn }]} onPress={() => onReports(vehicle)}>
              <ListIcon color={colors.white} size={9} />
              <Text style={styles.actionBtnText}> Reports</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, { backgroundColor: colors.surface.navy }]} onPress={() => onViewOnMap(vehicle)}>
              <Pin color={colors.white} size={9} />
              <Text style={styles.actionBtnText}> View on Map</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* premium bar: maroon h26, chevron only when a sensor strip exists */}
      <Pressable style={styles.premiumBar} onPress={strip ? toggle : undefined}>
        <StarIcon color={colors.white} size={12} />
        <Text style={styles.premiumText}>Premium</Text>
        {strip ? (
          <View style={styles.chevronWrap}>
            <Animated.View style={{ transform: [{ rotate: rotateDeg }] }}>
              <Chevron dir="down" color={colors.white} size={12} />
            </Animated.View>
          </View>
        ) : null}
      </Pressable>

      {/* sensor strip: 250ms height+opacity collapse (useCollapsible) */}
      {strip ? (
        <Animated.View style={[styles.sensorClip, { height: animatedHeight, opacity: anim }]}>
          <View style={styles.sensorStrip} onLayout={e => onMeasureLayout(e.nativeEvent.layout.height)}>
            <View style={styles.sensorCell}>
              <Thermo color={colors.home.thermoOrange} size={14} />
              <View style={styles.sensorCol}>
                <Text style={styles.sensorLabel}>Temp</Text>
                <Text style={styles.sensorValue}>{strip.temp}</Text>
              </View>
            </View>
            <View style={styles.sensorDivider} />
            <View style={styles.sensorCell}>
              <Droplet color={colors.icon.blue} size={14} />
              <View style={styles.sensorCol}>
                <Text style={styles.sensorLabel}>Fuel</Text>
                <Text style={styles.sensorValue}>{strip.fuel}</Text>
              </View>
            </View>
            <View style={styles.sensorDivider} />
            <View style={styles.sensorCell}>
              <DoorIcon color={colors.home.doorPurple} size={14} />
              <View style={styles.sensorCol}>
                <Text style={styles.sensorLabel}>Door</Text>
                <Text style={styles.sensorValue}>{strip.door}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default React.memo(AssetCard);
