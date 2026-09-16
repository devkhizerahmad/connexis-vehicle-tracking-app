// SensorBlock.tsx — navy header + "Select" dropdown + 3x2 tile grid + alert/success banner
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { AlertCircle, CheckCircle, Chevron, FuelPump, Thermo, TileIcon } from '@shared/components/icons';
import { colors, sizes, statusColor } from '@shared/theme';
import { styles } from './styles';

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
  banner: { kind: 'alert' | 'success'; text: string };
  onSelectPress?: () => void;
}

export function SensorBlock(p: Props) {
  const accent = p.accent === 'amber' ? colors.amber : colors.blue;
  const bannerAlert = p.banner.kind === 'alert';
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {p.accent === 'amber' ? (
            <FuelPump color={accent} size={sizes.headerIcon} />
          ) : (
            <Thermo color={accent} size={sizes.headerIcon} />
          )}
          <Text style={styles.headerTitle}>{p.title}</Text>
        </View>

        <Pressable onPress={p.onSelectPress} style={styles.headerRight}>
          <Text style={styles.dropdownText}>{p.dropdown}</Text>
          <Chevron dir="down" color={colors.grayText} size={12} />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {p.tiles.map(t => (
          <View key={t.label} style={styles.tile}>
            <View style={styles.tileHeader}>
              <TileIcon name={t.icon} color={accent} size={sizes.tileIcon} />
              <Text style={styles.tileLabel} numberOfLines={1}>
                {t.label}
              </Text>
            </View>
            <Text style={styles.tileValue}>{t.value}</Text>
            {t.trend ? (
              <Text style={[styles.trendText, { color: statusColor(t.trendColor ?? 'red') }]}>
                {t.trend}
              </Text>
            ) : null}
            {t.status ? (
              <Text style={[styles.statusText, { color: statusColor(t.statusColor ?? 'red') }]}>
                {t.status}
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      <View
        style={[
          styles.banner,
          { backgroundColor: bannerAlert ? colors.alertBg : colors.bannerGreen },
        ]}>
        {bannerAlert ? (
          <AlertCircle color={colors.alertText} size={14} />
        ) : (
          <CheckCircle color={colors.white} size={14} />
        )}
        <Text
          style={[
            styles.bannerText,
            { color: bannerAlert ? colors.alertText : colors.white },
          ]}>
          {p.banner.text}
        </Text>
      </View>
    </View>
  );
}

export default SensorBlock;
