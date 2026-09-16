// RoutesCard.tsx — navy header (collapsible, 250ms) + timeline of 3 route stops + View More link
import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Chevron, RouteIcon } from '@shared/components/icons';
import Collapsible from '@shared/components/controls/Collapsible';
import { badgeColor, colors, sizes, statusColor } from '@shared/theme';
import { styles } from './styles';

export interface RouteStop {
  n: string;
  color: string;
  address: string;
  time: string;
  status: string;
  statusColor: string;
  duration: string;
}

interface Props {
  routes: RouteStop[];
  viewMore: string;
  onViewMore?: () => void;
}

export function RoutesCard({ routes, viewMore, onViewMore }: Props) {
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
        <RouteIcon color={colors.white} size={sizes.headerIcon - 2} />
        <Text style={styles.headerTitle}>Routes</Text>
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
        <View style={styles.body}>
          {routes.map((r, i) => (
            <View key={r.n} style={styles.row}>
              <View style={styles.badgeColumn}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: badgeColor(r.color) },
                  ]}>
                  <Text style={styles.badgeText}>{r.n}</Text>
                </View>
                {i < routes.length - 1 ? (
                  <View style={styles.dashedConnector} />
                ) : null}
              </View>

              <View style={styles.contentColumn}>
                <Text style={styles.addressText} numberOfLines={2}>
                  {r.address}
                </Text>
                <Text style={styles.timeText}>{r.time}</Text>
                <Text style={[styles.statusText, { color: statusColor(r.statusColor) }]}>
                  {r.status}
                </Text>
              </View>

              <Text style={styles.durationText}>{r.duration}</Text>
            </View>
          ))}

          <Pressable style={styles.viewMoreButton} onPress={onViewMore}>
            <Text style={styles.viewMoreText}>{viewMore}</Text>
          </Pressable>
        </View>
      </Collapsible>
    </View>
  );
}

export default RoutesCard;
