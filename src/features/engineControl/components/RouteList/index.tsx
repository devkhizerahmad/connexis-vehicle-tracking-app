// RouteList (S6) — "Driving Routes" card: diagonal section bar over 3 route rows.
// Row content order is verbatim from the reference: badge, title + duration,
// subtitle, clock + window, state chip.
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { Clock } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import type { ControlRoute } from '@features/engineControl/types/engineControl';
import SectionBar from '../SectionBar';
import { badgeFill, chipFill, chipInk, styles } from './styles';

export interface RouteListProps {
  title: string;
  routes: ControlRoute[];
}

const RouteRow = memo(function RouteRowBase({ route }: { route: ControlRoute }) {
  return (
    <View style={styles.row} testID={`ec-route-${route.id}`}>
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
        {/* F8: route 1's subtitle is the only blue sub-line in the reference. */}
        <Text style={[styles.subtitle, route.subBlue ? styles.subtitleBlue : null]}>
          {route.subtitle}
        </Text>
        <View style={styles.timeRow}>
          <View style={styles.timeIcon}>
            <Clock color={ecColors.timeInk} size={12} />
          </View>
          <Text style={styles.time}>{route.time}</Text>
        </View>
        <View style={[styles.chip, chipFill(route.state)]}>
          <Text style={[styles.chipText, chipInk(route.state)]}>{route.state}</Text>
        </View>
      </View>
    </View>
  );
});

function RouteListImpl({ title, routes }: RouteListProps) {
  return (
    <View style={styles.card} testID="ec-routes-card">
      <SectionBar title={title} testID="ec-routes-bar" />
      {routes.map((route, index) => (
        <React.Fragment key={route.id}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <RouteRow route={route} />
        </React.Fragment>
      ))}
    </View>
  );
}

export const RouteList = memo(RouteListImpl);
export default RouteList;
