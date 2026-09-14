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
      {/* Header */}
      <View style={[styles.header, {height: H.sectionHeader, borderRadius: R.card}]}>
        {p.accent === 'amber' ? (
          <FuelPump color={accent} size={SZ.headerIcon} />
        ) : (
          <Thermo color={accent} size={SZ.headerIcon} />
        )}
        <Text style={[styles.headerTitle, {marginLeft: 6}]}>{p.title}</Text>
        <View style={{flex: 1}} />
        <Pressable
          onPress={p.onSelectPress}
          style={{
            width: `${L.dropdownWpct}%`,
            height: H.chip,
            backgroundColor: C.white,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: R.chip,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: S.chipPadH,
            paddingRight: 6,
          }}>
          <Text style={{color: C.grayText, fontSize: FS.plate, flex: 1}}>{p.dropdown}</Text>
          <Chevron dir="down" color={C.grayText} size={10} />
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
    backgroundColor: C.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: R.card,
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
