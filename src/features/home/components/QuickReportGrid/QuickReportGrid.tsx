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
        <View style={styles.grid}>
          {reports.map(r => (
            <Pressable
              key={r.label + r.color}
              onPress={() => onTileTap?.(r.label)}
              style={[
                styles.tile,
                { backgroundColor: reportColor(r.color) },
              ]}>
              <ReportIcon name={r.icon} color={colors.white} size={sizes.reportIcon} />
              <Text style={styles.tileLabel} numberOfLines={1}>
                {r.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Collapsible>
    </View>
  );
}

export default QuickReportGrid;
