// RoutesCard.tsx — navy header (collapsible, 250ms) + timeline of 3 route stops + View More link
//
// ROUTES LIST CONVERGENCE (3a/3b/3c): the row internal design matches the Engine
// Control "Driving Routes" rows exactly, and B10 makes that literal — both lists
// now render `@shared/components/vehicle/RouteRow`. Every colour and metric in
// that row comes from the shared canonical block `@shared/theme/routeRows`
// (the Details list was the connector's SOURCE OF TRUTH; Engine Control copied
// its spec, and both now share one component too).
//
// The header bar and the "View More" link are Details' own and stay unchanged.
import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Chevron, RouteIcon } from '@shared/components/icons';
import Collapsible from '@shared/components/controls/Collapsible';
import {
  RouteRow,
  routeRowToneFromKey,
} from '@shared/components/vehicle/RouteRow';
import { colors, sizes } from '@shared/theme';
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

/**
 * 3a — the row tone. Details' own `color` key (green / amber / red) already IS
 * the Engine Control colour logic (1 green / 2 amber / 3 red), so it drives BOTH
 * the number badge and the status pill. The legacy `statusColor` field (which
 * painted "Stop" black) is superseded by that logic; the mock field itself is
 * untouched and still present.
 */
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
        accessibilityState={{ expanded }}
          accessibilityLabel="Routes">
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
            <RouteRow
              key={r.n}
              index={r.n}
              title={r.address}
              subtitle={r.time}
              duration={r.duration}
              state={r.status}
              tone={routeRowToneFromKey(r.color)}
              showConnector={i < routes.length - 1}
              titleLines={2}
            />
          ))}

          <Pressable style={styles.viewMoreButton} onPress={onViewMore}
            accessibilityRole="button"
            accessibilityLabel={viewMore}>
            <Text style={styles.viewMoreText}>{viewMore}</Text>
          </Pressable>
        </View>
      </Collapsible>
    </View>
  );
}

export default RoutesCard;
