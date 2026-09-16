// QuickReportGrid.tsx — navy header (collapsible, 250ms) + 3x2 solid report tiles
import React, {useRef, useState} from 'react';
import {Animated, Easing, Pressable, StyleSheet, Text, View} from 'react-native';
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
  const [expanded, setExpanded] = useState(true); // shown on first load
  // chevronRotation: 0 when open, 180 when closed — animated in sync with state
  const rot = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !expanded;
    setExpanded(next); // 1. flip state
    Animated.timing(rot, {
      // 2. animate chevron 0 <-> 180 over 250ms ease-out
      toValue: next ? 0 : 1,
      duration: L.collapseMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      {/* ENTIRE header row is the tap target (including empty space) */}
      <Pressable
        style={[styles.header, {height: H.sectionHeader, borderRadius: R.card}]}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{expanded}}>
        <Clipboard color={C.white} size={SZ.headerIcon} />
        <Text style={[styles.headerTitle, {marginLeft: 6}]}>Quick Report</Text>
        <View style={{flex: 1}} />
        <Animated.View
          style={{
            transform: [
              {rotate: rot.interpolate({inputRange: [0, 1], outputRange: ['0deg', '180deg']})},
            ],
          }}>
          <Chevron dir="down" color={C.white} size={SZ.headerIcon} />
        </Animated.View>
      </Pressable>

      {/* Body ALWAYS mounted (never unmounted) — Collapsible animates height+opacity */}
      <Collapsible open={expanded}>
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
    paddingHorizontal: S.sectionPadH,
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
