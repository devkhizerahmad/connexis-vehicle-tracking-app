// RouteList (S6) — "Driving Routes" card: gradient header + 3 route rows.
//
// ROUTES LIST CONVERGENCE (2a/2b/2c):
//   • 2a — the horizontal dividers between rows are GONE;
//   • 2b — the vertical dashed connector between the number badges is BACK,
//     matching the Details spec measured on device (see routeRows.ts);
//   • 2c — the gradient header bar is UNCHANGED.
//
// The row internal design is the DONOR for the Details "Routes" list, so it
// stays exactly as it is.
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { Pin, RouteIcon } from '@shared/components/icons';
import { ecColors, routeRowColors } from '@shared/theme';
import type { ControlRoute } from '@features/engineControl/types/engineControl';
import SectionBar from '../SectionBar';
import { badgeFill, pillFill, stateInk, styles } from './styles';

export interface RouteListProps {
  title: string;
  routes: ControlRoute[];
}

const RouteRow = memo(function RouteRowBase({
  route,
  showConnector,
}: {
  route: ControlRoute;
  /**
   * 2b: the dashed connector is painted BETWEEN consecutive badges only — never
   * below the last one. Details' connector is the measured source of truth.
   */
  showConnector: boolean;
}) {
  return (
    <View style={styles.row} testID={`ec-route-${route.id}`}>
      <View style={styles.badgeColumn}>
        <View style={[styles.badge, badgeFill(route.state)]}>
          <Text style={styles.badgeText}>{route.index}</Text>
        </View>
        {showConnector ? <View style={styles.dashedConnector} testID={`ec-route-connector-${route.id}`} /> : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {route.title}
        </Text>
        <View style={styles.subtitleRow}>
          <View style={styles.subtitleIcon}>
            <Pin color={routeRowColors.subInk} size={11} />
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
          <RouteRow
            key={route.id}
            route={route}
            showConnector={index < lastIndex}
          />
        ))}
      </View>
    </View>
  );
}

export const RouteList = memo(RouteListImpl);
export default RouteList;
