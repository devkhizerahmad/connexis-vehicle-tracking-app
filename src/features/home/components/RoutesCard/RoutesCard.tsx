// RoutesCard.tsx — navy header (collapsible, 250ms) + timeline of 3 route stops + View More link
//
// ROUTES LIST CONVERGENCE (3a/3b/3c): the row internal design now matches the
// Engine Control "Driving Routes" rows exactly — same number-badge shape and
// colour logic, same title/sub-line type, same right-hand duration + status
// pill, same paddings — and every value comes from the shared canonical block
// `@shared/theme/routeRows` (the Details list was the connector's SOURCE OF
// TRUTH; Engine Control copied its spec, and now both share the tokens).
//
// The header bar and the "View More" link are Details' own and stay unchanged.
import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Chevron, Pin, RouteIcon } from '@shared/components/icons';
import Collapsible from '@shared/components/controls/Collapsible';
import {
  colors,
  routeRowBadgeFill,
  routeRowColors,
  routeRowPillFill,
  routeRowSizes,
  routeRowStateInk,
  sizes,
} from '@shared/theme';
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
const toneOf = (key: string): 'green' | 'amber' | 'red' =>
  key === 'amber' ? 'amber' : key === 'red' ? 'red' : 'green';

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
          {routes.map((r, i) => {
            const tone = toneOf(r.color);
            return (
              <View key={r.n} style={styles.row}>
                <View style={styles.badgeColumn}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: routeRowBadgeFill[tone] },
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
                  <View style={styles.subtitleRow}>
                    <View style={styles.subtitleIcon}>
                      <Pin color={routeRowColors.subInk} size={routeRowSizes.subIcon} />
                    </View>
                    <Text style={styles.timeText} numberOfLines={1}>
                      {r.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightColumn}>
                  <Text style={styles.durationText}>{r.duration}</Text>
                  <View
                    style={[
                      styles.statePill,
                      { backgroundColor: routeRowPillFill[tone] },
                    ]}>
                    <Text
                      style={[
                        styles.stateText,
                        { color: routeRowStateInk[tone] },
                      ]}>
                      {r.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          <Pressable style={styles.viewMoreButton} onPress={onViewMore}>
            <Text style={styles.viewMoreText}>{viewMore}</Text>
          </Pressable>
        </View>
      </Collapsible>
    </View>
  );
}

export default RoutesCard;
