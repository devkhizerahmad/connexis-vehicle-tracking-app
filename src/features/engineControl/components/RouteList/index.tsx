// RouteList (S6) — "Driving Routes" card: gradient header + 3 route rows.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference) — each row is now
//   number badge | title + pin/subtitle | right column (duration over STATUS
//   PILL), with a hairline divider between rows. The trailing chevron that
//   used to close each row has been removed.
// The old reference's bare coloured state text, its dotted badge connector and
// its time line are all gone.
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { Pin, RouteIcon } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import type { ControlRoute } from '@features/engineControl/types/engineControl';
import SectionBar from '../SectionBar';
import { badgeFill, pillFill, stateInk, styles } from './styles';

export interface RouteListProps {
  title: string;
  routes: ControlRoute[];
}

const RouteRow = memo(function RouteRowBase({
  route,
  isLast,
}: {
  route: ControlRoute;
  /** The final row carries no bottom divider. */
  isLast: boolean;
}) {
  return (
    <View
      style={[styles.row, isLast ? styles.rowLast : null]}
      testID={`ec-route-${route.id}`}>
      <View style={[styles.badge, badgeFill(route.state)]}>
        <Text style={styles.badgeText}>{route.index}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {route.title}
        </Text>
        <View style={styles.subtitleRow}>
          <View style={styles.subtitleIcon}>
            <Pin color={ecColors.routeSubInk} size={11} />
          </View>
          <Text style={styles.subtitle} numberOfLines={1}>
            {route.subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.duration}>{route.duration}</Text>
        <View style={[styles.statePill, pillFill(route.state)]}>
          <Text style={[styles.state, stateInk(route.state)]}>{route.state}</Text>
        </View>
      </View>
    </View>
  );
});

function RouteListImpl({ title, routes }: RouteListProps) {
  const lastIndex = routes.length - 1;
  return (
    <View style={styles.cardOuter} testID="ec-routes-card">
      <View style={styles.card}>
        <SectionBar
          title={title}
          icon={<RouteIcon color={ecColors.barInk} size={16} />}
          testID="ec-routes-bar"
        />
        {routes.map((route, index) => (
          <RouteRow key={route.id} route={route} isLast={index === lastIndex} />
        ))}
      </View>
    </View>
  );
}

export const RouteList = memo(RouteListImpl);
export default RouteList;