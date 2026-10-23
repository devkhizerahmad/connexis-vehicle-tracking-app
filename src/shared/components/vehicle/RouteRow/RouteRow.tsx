// RouteRow.tsx — the ONE route row (B10).
//
// Two features render the same row: Engine Control's "Driving Routes" list and
// the Details "Routes" card. They used to own two independent implementations
// (number badge, dashed connector, title, pin + sub-line, duration, tinted state
// pill), held together only by shared tokens — so any row change was a 4-file
// edit in 2 features. This component owns the row; the lists are thin wrappers.
import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import { Pin } from '@shared/components/icons';
import {
  routeRowBadgeFill,
  routeRowColors,
  routeRowPillFill,
  routeRowSizes,
  routeRowStateInk,
  type RouteRowTone,
} from '@shared/theme';
import { styles } from './styles';

export interface RouteRowProps {
  /** Left-hand number badge text ("1", "2", …). */
  index: string | number;
  /** Route title (Engine Control) or the address (Details). */
  title: string;
  /** Pin-prefixed sub-line: location or time. */
  subtitle: string;
  /** Right-hand duration label. */
  duration: string;
  /** Status pill label ("Moving", "Idle", …). */
  state: string;
  /** Row tone — drives badge fill, pill fill and pill ink together. */
  tone: RouteRowTone;
  /** Paint the dashed connector between this row and the next one. */
  showConnector: boolean;
  /** Horizontal gutter inside the row (Engine Control's card has none). */
  inset?: boolean;
  /** Max lines for the title. Details allows two, Engine Control one. */
  titleLines?: number;
  testID?: string;
  connectorTestID?: string;
}

/**
 * Map an arbitrary tone key onto the shared tones. Details' rows carry
 * `green | amber | red`; anything unknown falls back to green, which is what
 * both legacy implementations did.
 */
export function routeRowToneFromKey(key: string): RouteRowTone {
  return key === 'amber' ? 'amber' : key === 'red' ? 'red' : 'green';
}

function RouteRowImpl({
  index,
  title,
  subtitle,
  duration,
  state,
  tone,
  showConnector,
  inset = false,
  titleLines = 1,
  testID,
  connectorTestID,
}: RouteRowProps) {
  const fills = useMemo(
    () => ({
      badge: { backgroundColor: routeRowBadgeFill[tone] },
      pill: { backgroundColor: routeRowPillFill[tone] },
      ink: { color: routeRowStateInk[tone] },
    }),
    [tone],
  );

  return (
    <View style={[styles.row, inset ? styles.rowInset : null]} testID={testID}>
      <View style={styles.badgeColumn}>
        <View style={[styles.badge, fills.badge]}>
          <Text style={styles.badgeText}>{index}</Text>
        </View>
        {showConnector ? (
          <View style={styles.dashedConnector} testID={connectorTestID} />
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={titleLines}>
          {title}
        </Text>
        <View style={styles.subtitleRow}>
          <View style={styles.subtitleIcon}>
            <Pin color={routeRowColors.subInk} size={routeRowSizes.subIcon} />
          </View>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.duration}>{duration}</Text>
        <View style={[styles.statePill, fills.pill]}>
          <Text style={[styles.state, fills.ink]}>{state}</Text>
        </View>
      </View>
    </View>
  );
}

export const RouteRow = memo(RouteRowImpl);
export default RouteRow;
