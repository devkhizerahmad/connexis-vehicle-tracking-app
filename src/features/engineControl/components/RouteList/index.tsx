// RouteList (S6) — "Driving Routes" card: section bar + 3 route rows.
// Row content order is verbatim from the reference: badge, title + duration,
// subtitle, time, state.
//
// PHASE-1 DESIGN LANGUAGE (P6): the state is PLAIN COLOURED TEXT (the tinted
// chip is gone), every sub-line is grey (route 1's blue subtitle is gone), the
// time line has no clock glyph, rows are separated by nothing, and a clearly
// visible dotted connector chains the number badges. See styles.ts.
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import type { ControlRoute } from '@features/engineControl/types/engineControl';
import SectionBar from '../SectionBar';
import { badgeFill, stateInk, styles } from './styles';

export interface RouteListProps {
  title: string;
  routes: ControlRoute[];
}

const RouteRow = memo(function RouteRowBase({
  route,
  showConnector,
}: {
  route: ControlRoute;
  /** P6: the dashed badge-column connector, painted on every row. */
  showConnector: boolean;
}) {
  return (
    <View style={styles.row} testID={`ec-route-${route.id}`}>
      {showConnector ? <View style={styles.connector} testID={`ec-route-connector-${route.id}`} /> : null}
      <View style={[styles.badge, badgeFill(route.state)]}>
        <Text style={styles.badgeText}>{route.index}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleLine}>
          <Text style={styles.title} numberOfLines={1}>
            {route.title}
          </Text>
          <Text style={styles.duration}>{route.duration}</Text>
        </View>
        <Text style={styles.subtitle}>{route.subtitle}</Text>
        <Text style={styles.time}>{route.time}</Text>
        <Text style={[styles.state, stateInk(route.state)]}>{route.state}</Text>
      </View>
    </View>
  );
});

function RouteListImpl({ title, routes }: RouteListProps) {
  return (
    <View style={styles.card} testID="ec-routes-card">
      {/* P7: `edge` drops the bar's top rounding and tones down the red swoosh.
          ControlRows (Phase 2) omits it and keeps its rounded bar untouched. */}
      <SectionBar title={title} edge testID="ec-routes-bar" />
      {routes.map(route => (
        <RouteRow key={route.id} route={route} showConnector />
      ))}
    </View>
  );
}

export const RouteList = memo(RouteListImpl);
export default RouteList;