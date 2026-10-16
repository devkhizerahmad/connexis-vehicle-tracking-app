// QuickReportGrid.tsx — navy header (collapsible, 250ms) + 3x2 solid report tiles
import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Chevron, Clipboard, ReportIcon } from '@shared/components/icons';
import Collapsible from '@shared/components/controls/Collapsible';
import { colors, reportColor, sizes } from '@shared/theme';
import { styles } from './styles';

export interface ReportTile {
  icon: string;
  label: string;
  color: string;
}

/** Columns per row — the tile grid is a fixed 3-wide layout. */
const COLS = 3;

/** Split a flat list into fixed-width rows (see styles.gridRow for why). */
function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export function QuickReportGrid({
  reports,
  onTileTap,
}: {
  reports: ReportTile[];
  onTileTap?: (label: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const rot = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    Animated.timing(rot, {
      toValue: next ? 0 : 1,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      <Pressable
        style={styles.header}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}>
        <Clipboard color={colors.white} size={sizes.headerIcon} />
        <Text style={styles.headerTitle}>Quick Report</Text>
        <View style={styles.spacer} />
        <Animated.View
          style={{
            transform: [
              { rotate: rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) },
            ],
          }}>
          <Chevron dir="down" color={colors.white} size={sizes.headerIcon} />
        </Animated.View>
      </Pressable>

      <Collapsible open={expanded}>
        {/* PATCH UI-POLISH (PART 4): explicit rows of 3 so the outer tiles line
            up with the Quick Report bar's edges. */}
        <View style={styles.grid}>
          {chunk(reports, COLS).map((row, rowIndex) => (
            <View style={styles.gridRow} key={`row-${rowIndex}`}>
              {row.map((r, colIndex) => (
                <Pressable
                  key={r.label + r.color}
                  onPress={() => onTileTap?.(r.label)}
                  style={[
                    styles.tile,
                    colIndex === row.length - 1 ? styles.tileRowEnd : null,
                    { backgroundColor: reportColor(r.color) },
                  ]}>
                  <ReportIcon name={r.icon} color={colors.white} size={sizes.reportIcon} />
                  <Text style={styles.tileLabel} numberOfLines={1}>
                    {r.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </Collapsible>
    </View>
  );
}

export default QuickReportGrid;
