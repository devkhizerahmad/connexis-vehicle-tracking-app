// SummaryCards.tsx — S2/S3: summary rows (Total/Running + Idle/Stop/No Data)
import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// PATCH H-B: Running card uses the STEERING-WHEEL glyph (reference), not a car silhouette.
import { Clock, GridIcon, Steering, WarningTriangle } from '@shared/components/icons';
import { colors } from '@shared/theme';
import { HomeSummary } from '@features/home/types/home';
import { styles } from './styles';

export function SummaryCards({ summary }: { summary: HomeSummary }) {
  return (
    <View>
      {/* S2 row1: Total 60% (charcoal gradient) + Running 40% */}
      <View style={styles.row}>
        <LinearGradient
          colors={[colors.home.totalGradStart, colors.home.totalGradEnd]}
          style={[styles.card, styles.totalCard]}>
          <View style={styles.totalRow}>
            <GridIcon color={colors.white} size={18} />
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{summary.total}</Text>
          </View>
        </LinearGradient>
        <View style={[styles.card, styles.runningCard]}>
          <Steering color={colors.white} size={16} />
          <Text style={styles.runningLabel}>Running</Text>
          <Text style={styles.runningValue}>{summary.running}</Text>
        </View>
      </View>
      {/* S3 row2: Idle / Stop / No Data — three equal */}
      <View style={[styles.row, styles.row2]}>
        <View style={[styles.card, styles.idleCard]}>
          <Clock color={colors.white} size={16} />
          <Text style={styles.idleLabel}>Idle</Text>
          <Text style={styles.idleValue}>{summary.idle}</Text>
        </View>
        <View style={[styles.card, styles.stopCard]}>
          <View style={styles.stopGlyph} />
          <Text style={styles.stopLabel}>Stop</Text>
          <Text style={styles.stopValue}>{summary.stop}</Text>
        </View>
        <View style={[styles.card, styles.noDataCard]}>
          <WarningTriangle color={colors.white} size={16} />
          <Text style={styles.noDataLabel}>No Data</Text>
          <Text style={styles.noDataValue}>{summary.noData}</Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(SummaryCards);
