// SensorBlock.tsx — navy header + "Select" dropdown + 3x2 tile grid + alert/success banner
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AlertCircle, CheckCircle, Chevron, FuelPump, Thermo, TileIcon} from './Icons';
import {
  C,
  FS,
  H,
  L,
  R,
  S,
  SZ,
  statusColor,
} from '../../theme/detailsTokens';

export interface SensorTile {
  icon: string;
  label: string;
  value: string;
  trend?: string;
  trendColor?: string;
  status?: string;
  statusColor?: string;
}

interface Props {
  title: string;
  accent: 'amber' | 'blue';
  dropdown: string;
  tiles: SensorTile[];
  banner: {kind: 'alert' | 'success'; text: string};
  onSelectPress?: () => void;
}

const tileW = `${(100 - L.gridGap * (L.gridCols - 1)) / L.gridCols}%`;

export function SensorBlock(p: Props) {
  const accent = p.accent === 'amber' ? C.amber : C.blue;
  const bannerAlert = p.banner.kind === 'alert';
  return (
    <View>
      {/* Header — radius 8 on TOP corners only, height 44, dropdown flush inside */}
      <View style={styles.header}>
        {/* Left zone 70% */}
        <View
          style={{
            flex: 0.7,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 14,
            gap: 10,
          }}>
          {p.accent === 'amber' ? (
            <FuelPump color={accent} size={SZ.headerIcon} />
          ) : (
            <Thermo color={accent} size={SZ.headerIcon} />
          )}
          <Text style={styles.headerTitle}>{p.title}</Text>
        </View>

        {/* Right zone 30% — dropdown flush with header top/right/bottom edges */}
        <Pressable
          onPress={p.onSelectPress}
          style={{
            flex: 0.3,
            backgroundColor: C.white,
            borderLeftWidth: 1,
            borderLeftColor: C.navyLine,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}>
          <Text style={{color: C.grayText, fontSize: 12}}>{p.dropdown}</Text>
          <Chevron dir="down" color={C.grayText} size={12} />
        </Pressable>
      </View>

      {/* 3x2 tile grid */}
      <View style={[styles.grid, {gap: L.gridGap, marginTop: L.gridGap}]}>
        {p.tiles.map(t => (
          <View key={t.label} style={[styles.tile, {width: tileW, borderRadius: R.tile, padding: S.tilePad, minHeight: H.sensorTileMin}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <TileIcon name={t.icon} color={accent} size={SZ.tileIcon} />
              <Text style={styles.tileLabel} numberOfLines={1}>
                {t.label}
              </Text>
            </View>
            <Text style={styles.tileValue}>{t.value}</Text>
            {t.trend ? (
              <Text style={{fontSize: FS.trend, color: statusColor(t.trendColor ?? 'red'), fontWeight: '600'}}>
                {t.trend}
              </Text>
            ) : null}
            {t.status ? (
              <Text style={{fontSize: FS.trend, color: statusColor(t.statusColor ?? 'red'), fontWeight: '700'}}>
                {t.status}
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      {/* Banner */}
      <View
        style={{
          marginTop: L.gridGap,
          backgroundColor: bannerAlert ? C.alertBg : C.bannerGreen,
          borderRadius: R.banner,
          padding: S.tilePad,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}>
        {bannerAlert ? (
          <AlertCircle color={C.alertText} size={14} />
        ) : (
          <CheckCircle color={C.white} size={14} />
        )}
        <Text
          style={{
            color: bannerAlert ? C.alertText : C.white,
            fontSize: FS.banner,
            fontWeight: '700',
            flex: 1,
          }}>
          {p.banner.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: H.sectionHeader,
    backgroundColor: C.navy,
    borderTopLeftRadius: R.card,
    borderTopRightRadius: R.card,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  headerTitle: {
    color: C.white,
    fontSize: FS.sectionTitle,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    backgroundColor: C.white,
    shadowColor: C.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 1},
    elevation: 1,
  },
  tileLabel: {
    color: C.grayText,
    fontSize: FS.tileLabel,
    flex: 1,
  },
  tileValue: {
    color: C.textDark,
    fontSize: FS.tileValue,
    fontWeight: '700',
    marginTop: 4,
  },
});
