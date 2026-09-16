// KpiRow.tsx — 3 equal KPI cards (stop / idle / km)
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Clock, Pin, StopSign} from './Icons';
import {C, FS, L, R, S, SZ} from '../../theme/detailsTokens';

interface Kpi {
  icon: string;
  label: string;
  value: string;
}

function KpiIcon({name}: {name: string}) {
  switch (name) {
    case 'stop':
      return <StopSign color={C.red} size={SZ.kpiIcon} />;
    case 'clock':
      return <Clock color={C.amber} size={SZ.kpiIcon} />;
    case 'route':
      return <Pin color={C.tileGreen} size={SZ.kpiIcon} />;
    default:
      return <StopSign color={C.red} size={SZ.kpiIcon} />;
  }
}

export function KpiRow({kpis}: {kpis: Kpi[]}) {
  return (
    <View style={{flexDirection: 'row', gap: L.gridGap}}>
      {kpis.map(k => (
        <View key={k.label} style={[styles.card, {borderRadius: R.card, padding: S.tilePad + 2}]}>
          <KpiIcon name={k.icon} />
          <Text style={styles.label}>{k.label}</Text>
          <Text style={styles.value}>{k.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: C.white,
    alignItems: 'center',
    gap: 3,
    shadowColor: C.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  label: {
    color: C.grayText,
    fontSize: FS.kpiLabel,
    textAlign: 'center',
  },
  value: {
    color: C.textDark,
    fontSize: FS.kpiValue,
    fontWeight: '700',
  },
});
