// QuickReportGrid.tsx — navy header (collapsible) + 3x2 solid report tiles
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Chevron, Clipboard, ReportIcon} from './Icons';
import {Collapsible} from './Collapsible';
import {C, FS, H, L, R, S, SZ, reportColor} from '../../theme/detailsTokens';

export interface ReportTile {
  icon: string;
  label: string;
  color: string;
}

const tileW = `${(100 - L.gridGap * (L.gridCols - 1)) / L.gridCols}%`;

export function QuickReportGrid({
  reports,
  onTileTap,
}: {
  reports: ReportTile[];
  onTileTap?: (label: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <View>
      <Pressable
        style={[styles.header, {height: H.sectionHeader, borderRadius: R.card}]}
        onPress={() => setOpen(o => !o)}>
        <Clipboard color={C.white} size={SZ.headerIcon} />
        <Text style={[styles.headerTitle, {marginLeft: 6}]}>Quick Report</Text>
        <View style={{flex: 1}} />
        <View style={{transform: [{rotate: open ? '0deg' : '-90deg'}]}}>
          <Chevron dir="down" color={C.white} size={12} />
        </View>
      </Pressable>

      <Collapsible open={open}>
        <View style={[styles.grid, {gap: L.gridGap, marginTop: L.gridGap}]}>
          {reports.map(r => (
            <Pressable
              key={r.label + r.color}
              onPress={() => onTileTap?.(r.label)}
              style={{
                width: tileW,
                height: H.reportTile,
                borderRadius: R.banner,
                backgroundColor: reportColor(r.color),
                padding: S.tilePad,
                justifyContent: 'space-between',
              }}>
              <ReportIcon name={r.icon} color={C.white} size={SZ.reportIcon} />
              <Text style={{color: C.white, fontSize: FS.tileLabel, fontWeight: '600'}} numberOfLines={1}>
                {r.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Collapsible>
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
});
