import { StyleSheet } from 'react-native';
import { colors } from '@shared/theme';

// PATCH H-B: row1 h86, row2 h87, vertical gap 7, row1 split 62.5/37.5 gap 7,
// row2 three equal gap 7, page margin 13 (listContent). Cards stack content LEFT:
// icon 16 at (12,12) -> label 12pt bold +10 -> value 13pt bold +6.
export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 86,
    gap: 7,
  },
  row2: {
    height: 87,
    marginTop: 7,
  },
  card: {
    borderRadius: 8,
  },
  // row1 left: 62.5% charcoal gradient
  totalCard: {
    flex: 62.5,
  },
  totalRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
  },
  totalLabel: {
    color: colors.onAccent,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 20,
  },
  totalValue: {
    color: colors.onAccent,
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  // row1 right: 37.5% running green (content stacked LEFT)
  runningCard: {
    flex: 37.5,
    backgroundColor: colors.status.running,
    paddingTop: 12,
    paddingLeft: 12,
  },
  /**
   * ONE shared ink for the whole status row: every box paints its title AND its
   * number in the same pure white (`colors.onAccent`), so no box shows a muted
   * number under a white title. Sizes/weights are unchanged — only the colour.
   */
  runningLabel: {
    color: colors.onAccent,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  runningValue: {
    color: colors.onAccent,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  // row2 three equal (content stacked LEFT)
  idleCard: {
    flex: 1,
    backgroundColor: colors.status.idle,
    paddingTop: 12,
    paddingLeft: 12,
  },
  idleLabel: {
    color: colors.onAccent,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  idleValue: {
    color: colors.onAccent,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  stopCard: {
    flex: 1,
    backgroundColor: colors.status.stop,
    paddingTop: 12,
    paddingLeft: 12,
  },
  stopGlyph: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  stopLabel: {
    color: colors.onAccent,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  stopValue: {
    color: colors.onAccent,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  noDataCard: {
    flex: 1,
    backgroundColor: colors.status.noData,
    paddingTop: 12,
    paddingLeft: 12,
  },
  noDataLabel: {
    color: colors.onAccent,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  noDataValue: {
    color: colors.onAccent,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
});