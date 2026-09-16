// KpiRow.tsx — 3 equal KPI cards (stop / idle / km)
import React from 'react';
import { Text, View } from 'react-native';
import { Clock, Pin, StopSign } from '@shared/components/icons';
import { colors, sizes } from '@shared/theme';
import { styles } from './styles';

interface Kpi {
  icon: string;
  label: string;
  value: string;
}

function KpiIcon({ name }: { name: string }) {
  switch (name) {
    case 'stop':
      return <StopSign color={colors.red} size={sizes.kpiIcon} />;
    case 'clock':
      return <Clock color={colors.amber} size={sizes.kpiIcon} />;
    case 'route':
      return <Pin color={colors.tileGreen} size={sizes.kpiIcon} />;
    default:
      return <StopSign color={colors.red} size={sizes.kpiIcon} />;
  }
}

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <View style={styles.row}>
      {kpis.map(k => (
        <View key={k.label} style={styles.card}>
          <KpiIcon name={k.icon} />
          <Text style={styles.label}>{k.label}</Text>
          <Text style={styles.value}>{k.value}</Text>
        </View>
      ))}
    </View>
  );
}

export default KpiRow;
