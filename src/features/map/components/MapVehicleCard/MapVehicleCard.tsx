// MapVehicleCard.tsx — S3 vehicle card (60/40 split header, photo, speed/update
// rows, View History link) + S4 full-width cyan "Live Location:" box that hangs
// 18pt BELOW the card bottom (same no-clip technique as the frozen VehicleInfoCard).
// Photo note: the reference shows a van for this card, but no van asset exists in
// src/assets (same known gap as AssetCard) — the sedan photo is used face-right.
import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, CirclePlay, Clock, Speedo } from '@shared/components/icons';
import { colors } from '@shared/theme';
import type { LiveMapVehicle } from '@features/map/types/map';

export interface MapVehicleCardProps {
  vehicle: LiveMapVehicle;
  onViewHistory: (vehicleId: string) => void;
}

const STATUS_COLORS: Record<LiveMapVehicle['status'], string> = {
  running: colors.status.running,
  idle: colors.status.idle,
  stop: colors.status.stop,
  noData: colors.status.noData,
};

function MapVehicleCardBase({ vehicle, onViewHistory }: MapVehicleCardProps) {
  const handleHistory = useCallback(
    () => onViewHistory(vehicle.id),
    [onViewHistory, vehicle.id],
  );

  return (
    <View style={styles.card}>
      {/* S3 header: 60% black name / 40% status colour */}
      <View style={styles.header}>
        <View style={styles.headerName}>
          <Text style={styles.headerNameText} numberOfLines={1}>
            {vehicle.name}
          </Text>
        </View>
        <View style={[styles.headerStatus, { backgroundColor: STATUS_COLORS[vehicle.status] }]}>
          <Text style={styles.headerStatusText}>{vehicle.statusLabel}</Text>
        </View>
      </View>

      {/* S3 body: van photo 120x70 at (20,12) + right column (PATCH L4: the
          icons/labels/values column starts exactly at card left + 50%) */}
      <View style={styles.body}>
        <View style={styles.photoWrap}>
          <Image
            source={require('../../../../assets/img_car_sedan.png')}
            style={styles.photo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.rows}>
          <View style={styles.row}>
            <Speedo color={colors.icon.brickRed} size={14} />
            <Text numberOfLines={1} style={styles.rowText}>
              <Text style={styles.rowLabel}>Current Speed: </Text>
              <Text style={styles.speedValue}>{vehicle.speed}</Text>
            </Text>
          </View>
          <View style={styles.row}>
            <Clock color={colors.icon.brickRed} size={14} />
            <Text numberOfLines={1} style={styles.rowText}>
              <Text style={styles.rowLabel}>Last Update: </Text>
              <Text style={styles.updateValue}>{vehicle.update}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* S3 link row (PATCH L4): same 50% column as the right column above */}
      <Pressable style={styles.historyRow} onPress={handleHistory} hitSlop={6}>
        <Text style={styles.historyText}>View History</Text>
        <ArrowRight color={colors.icon.blue} size={10} />
      </Pressable>

      {/* S4 full-width cyan box — hangs 18pt below the card bottom (no clip) */}
      <View style={styles.cyanBox}>
        <View style={styles.cyanTitleRow}>
          <CirclePlay color={colors.cyanText} size={14} />
          <Text style={styles.cyanTitle}>Live Location:</Text>
        </View>
        <Text style={styles.cyanBody} numberOfLines={2}>
          {vehicle.locationText}
        </Text>
      </View>
    </View>
  );
}

export const MapVehicleCard = memo(MapVehicleCardBase);
export default MapVehicleCard;

// S3/S4 geometry is screen-specific (T1) — kept with the component
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 4,
    backgroundColor: colors.white,
    /* no overflow:hidden — the cyan box paints below the card bottom (S4) */
  },
  header: {
    height: 36,
    flexDirection: 'row',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  headerName: {
    width: '60%',
    backgroundColor: colors.black,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  headerNameText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  headerStatus: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStatusText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  photoWrap: {
    width: 120,
    height: 70,
    marginLeft: 20,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 120,
    height: 70,
  },
  rows: {
    // PATCH L4: right column left edge === card left + 50% (was ~38%), so the
    // icons, labels and values all start on the card's mid-width gridline.
    position: 'absolute',
    left: '50%',
    right: 14,
    top: 18,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    marginLeft: 8,
  },
  rowLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.grayStrong,
  },
  speedValue: {
    fontSize: 11,
    color: colors.text.grayText,
  },
  updateValue: {
    fontSize: 10,
    color: colors.text.grayText,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    // PATCH L4: same 50% column as the speed/update rows (was right-aligned)
    marginLeft: '50%',
    marginTop: 10,
  },
  historyText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.icon.blue,
  },
  cyanBox: {
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: -18,
    borderRadius: 8,
    padding: 10,
    backgroundColor: colors.cyan,
  },
  cyanTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cyanTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.cyanText,
  },
  cyanBody: {
    fontSize: 10,
    lineHeight: 14,
    color: colors.cyanText,
    opacity: 0.75,
    marginLeft: 20,
    marginTop: 4,
  },
});