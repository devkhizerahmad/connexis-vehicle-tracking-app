// HistoryListRow.tsx — S9: one stop row. Memoised because it sits inside a
// virtualised FlatList, so the screen's clock/state updates must not re-render
// every row on each frame.
// PATCH T-HISTORY (reference match):
//   * the badge is a coloured circle holding a WHITE CAR glyph (it used to be
//     filled with ▶ / ⏸ / ■ text glyphs);
//   * consecutive badges are joined by a grey up-arrow connector, so the row
//     takes an `isLast` flag;
//   * the address renders in two tones: street dark, locality grey;
//   * meta chips carry tinted icons and the reference's taller pill.
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CarGlyph, Clock, Pin, Speedo } from '@shared/components/icons';
import { historyColors, historySizes } from '@shared/theme';
import type { HistoryStop } from '@features/map/types/history';

export interface HistoryListRowProps {
  stop: HistoryStop;
  /** True for the final row — suppresses the connector below the badge. */
  isLast?: boolean;
}

/** Per-state badge accent. */
const KIND_INK: Record<HistoryStop['kind'], string> = {
  moving: historyColors.stopMoving,
  idle: historyColors.stopIdle,
  stop: historyColors.stopStop,
};

/**
 * Split "Lda Avenue Phase 1 Lahore,Punjab" into its street and its trailing
 * "City,Province" locality so the reference's two-tone address can be rendered.
 */
export function splitAddress(address: string): { street: string; city: string } {
  const match = address.match(/^(.*?)\s+([^\s]+,[^\s]+)$/);
  return match ? { street: match[1], city: match[2] } : { street: address, city: '' };
}

export const HistoryListRow = memo(function HistoryListRow({
  stop,
  isLast = false,
}: HistoryListRowProps) {
  const { street, city } = splitAddress(stop.address);

  return (
    <View style={styles.row} testID={`history-row-${stop.id}`}>
      <Text style={styles.time} testID={`history-time-${stop.id}`}>
        {stop.time}
      </Text>

      <View style={styles.badgeCol}>
        <View style={[styles.badge, { backgroundColor: KIND_INK[stop.kind] }]} testID={`history-badge-${stop.id}`}>
          <CarGlyph color={historyColors.sectionBarInk} size={17} />
        </View>
        {isLast ? null : (
          <Text style={styles.connector} testID={`history-connector-${stop.id}`}>
            {'↑'}
          </Text>
        )}
      </View>

      <View style={styles.main}>
        <Text style={styles.address} numberOfLines={2}>
          <Text style={styles.addressStreet}>{street}</Text>
          {city ? <Text style={styles.addressCity}>{`  ${city}`}</Text> : null}
        </Text>

        <View style={styles.metaRow}>
          <MetaChip icon={<Clock color={historyColors.rowChipIconInk} size={11} />} text={stop.duration} />
          {stop.distance ? (
            <MetaChip icon={<Pin color={historyColors.rowChipIconInk} size={11} />} text={stop.distance} />
          ) : null}
          {stop.speed ? (
            <MetaChip icon={<Speedo color={historyColors.rowChipIconInk} size={11} />} text={stop.speed} />
          ) : null}
        </View>
      </View>
    </View>
  );
});

/** One rounded grey chip: icon + value. Empty values are skipped by the caller. */
function MetaChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.metaChip}>
      {icon}
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: historySizes.gutter,
    backgroundColor: '#FFFFFF',
  },
  time: {
    width: historySizes.stopColW,
    fontSize: 12,
    color: historyColors.rowTime,
  },
  badgeCol: {
    alignItems: 'center',
    width: historySizes.stopGlyph + 6,
  },
  badge: {
    width: historySizes.stopGlyph,
    height: historySizes.stopGlyph,
    borderRadius: historySizes.stopGlyph / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // PATCH T-HISTORY: grey up arrow joining two consecutive badges
  connector: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 16,
    color: historyColors.rowArrow,
  },
  main: {
    flex: 1,
    paddingLeft: 10,
  },
  address: {
    fontSize: 13,
    lineHeight: 17,
  },
  addressStreet: {
    color: historyColors.rowAddress,
  },
  // PATCH T-HISTORY: locality half of the address is lighter in the reference
  addressCity: {
    color: historyColors.rowCity,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 7,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    height: 24,
    borderRadius: 4,
    backgroundColor: historyColors.rowChipBg,
  },
  metaText: {
    fontSize: 12,
    color: historyColors.rowChipInk,
  },
});

export default HistoryListRow;
