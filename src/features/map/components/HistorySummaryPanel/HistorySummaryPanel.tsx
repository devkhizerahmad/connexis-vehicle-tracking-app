// HistorySummaryPanel.tsx — S5: "Summary" card = "Total KM Driven" + Running/Idle bars.
// PATCH T-HISTORY (reference match):
//   * the block is wrapped in a white "Summary" card (title + hairline border);
//   * the KM card is the reference's slate (#374955) with the GREEN route glyph,
//     labelled "Total KM Driven" (it read "Total KM" before);
//   * BOTH proportional bars are navy (#0F3A5C) — they were tinted green/amber,
//     which the reference does not do;
//   * each row is two lines: "TOTAL" + value, then the state word + the bar,
//     where the bar starts AFTER the state word rather than on its own line.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteIcon } from '@shared/components/icons';
import { colors, historyColors, historySizes } from '@shared/theme';
import type { HistorySummary } from '@features/map/types/history';

export interface HistorySummaryPanelProps {
  summary: HistorySummary;
}

/** The mock carries "TOTAL Running"; the reference splits it over two lines. */
const splitLabel = (label: string): { caption: string; state: string } => {
  const parts = label.trim().split(/\s+/);
  if (parts.length > 1 && parts[0].toUpperCase() === 'TOTAL') {
    return { caption: parts[0].toUpperCase(), state: parts.slice(1).join(' ') };
  }
  return { caption: 'TOTAL', state: label };
};

export const HistorySummaryPanel = ({ summary }: HistorySummaryPanelProps) => (
  <View style={styles.card} testID="history-summary">
    <Text style={styles.cardTitle}>Summary</Text>
    <View style={styles.row}>
      <View style={styles.totalCard}>
        <RouteIcon color={historyColors.totalKmInk} size={20} />
        <Text style={styles.totalLabel}>{'Total KM Driven'}</Text>
        <Text style={styles.totalValue} testID="summary-total-km">
          {summary.totalKm}
          <Text style={styles.totalUnit}> {summary.totalKmUnit}</Text>
        </Text>
      </View>

      <View style={styles.bars}>
        <Bar
          label={summary.runningLabel}
          value={summary.runningValue}
          ratio={summary.runningRatio}
          ink={historyColors.runningInk}
          testID="summary-running"
        />
        <Bar
          label={summary.idleLabel}
          value={summary.idleValue}
          ratio={summary.idleRatio}
          ink={historyColors.idleInk}
          testID="summary-idle"
        />
      </View>
    </View>
  </View>
);

/** One "TOTAL / value" row over a state word + proportional navy track. */
function Bar({
  label,
  value,
  ratio,
  ink,
  testID,
}: {
  label: string;
  value: string;
  ratio: number;
  ink: string;
  testID: string;
}) {
  const { caption, state } = splitLabel(label);
  const pct = `${Math.round(Math.min(1, Math.max(0, ratio)) * 100)}%` as const;

  return (
    <View style={styles.barBlock} testID={testID}>
      <View style={styles.barHead}>
        <Text style={styles.barCaption}>{caption}</Text>
        <Text style={styles.barValue}>{value}</Text>
      </View>
      <View style={styles.barLine}>
        <Text style={[styles.barState, { color: ink }]} numberOfLines={1}>
          {state}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: pct }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // PATCH T-HISTORY: the reference wraps S5 in a white "Summary" card
  card: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.surface.border,
  },
  cardTitle: {
    paddingTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: historyColors.summaryTitleInk,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  totalCard: {
    width: historySizes.totalCardW,
    height: historySizes.totalCardH,
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: historyColors.summaryCardBg,
    borderRadius: 4,
  },
  totalLabel: {
    marginTop: 4,
    fontSize: 10,
    color: historyColors.summaryLabel,
  },
  totalValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '700',
    color: historyColors.summaryValue,
  },
  totalUnit: {
    fontSize: 10,
    fontWeight: '600',
  },
  bars: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  barBlock: {
    gap: 4,
  },
  barHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barCaption: {
    fontSize: 11,
    fontWeight: '700',
    color: historyColors.summaryTitleInk,
  },
  barValue: {
    fontSize: 12,
    color: historyColors.summaryLabel,
  },
  barLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barState: {
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    flex: 1,
    height: historySizes.barH,
    borderRadius: 2,
    backgroundColor: historyColors.barTrack,
    overflow: 'hidden',
  },
  // PATCH T-HISTORY: both bars use the reference navy, not the state tint
  fill: {
    height: '100%',
    backgroundColor: historyColors.barFill,
    borderRadius: 2,
  },
});

export default HistorySummaryPanel;
