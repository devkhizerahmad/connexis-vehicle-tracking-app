// RouteList (S6) — "Driving Routes" card: gradient header + 3 route rows.
//
// ROUTES LIST CONVERGENCE (2a/2b/2c):
//   • 2a — the horizontal dividers between rows are GONE;
//   • 2b — the vertical dashed connector between the number badges is BACK,
//     matching the Details spec measured on device (see routeRows.ts);
//   • 2c — the gradient header bar is UNCHANGED.
//
// B10: the row itself now lives in `@shared/components/vehicle/RouteRow`, which
// the Details "Routes" card renders too. This file is the list wrapper: it owns
// the card chrome and the state -> tone mapping, nothing else.
import React, { memo } from 'react';
import { View } from 'react-native';
import { RouteIcon } from '@shared/components/icons';
import { RouteRow } from '@shared/components/vehicle/RouteRow';
import { ecColors, type RouteRowTone } from '@shared/theme';
import type {
  ControlRoute,
  RouteState,
} from '@features/engineControl/types/engineControl';
import SectionBar from '../SectionBar';
import { styles } from './styles';

export interface RouteListProps {
  title: string;
  routes: ControlRoute[];
}

/** Engine Control's route states map 1:1 onto the shared row tones. */
const TONE_BY_STATE: Record<RouteState, RouteRowTone> = {
  Moving: 'green',
  Pending: 'amber',
  Stop: 'red',
};

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
            index={route.index}
            title={route.title}
            subtitle={route.subtitle}
            duration={route.duration}
            state={route.state}
            tone={TONE_BY_STATE[route.state]}
            showConnector={index < lastIndex}
            inset
            testID={`ec-route-${route.id}`}
            connectorTestID={`ec-route-connector-${route.id}`}
          />
        ))}
      </View>
    </View>
  );
}

export const RouteList = memo(RouteListImpl);
export default RouteList;
