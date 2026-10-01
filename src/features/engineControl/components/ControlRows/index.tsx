// ControlRows (S7) — "Control Vehicle" card rows (Live Location, Scheduled
// Remote Starts). Each row is a light-blue tile with a leading glyph and a
// trailing chevron.
import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Chevron, Clock, Pin } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import type { ControlRow } from '@features/engineControl/types/engineControl';
import SectionBar from '../SectionBar';
import { styles } from './styles';

export interface ControlRowsProps {
  title: string;
  rows: ControlRow[];
  onRowPress: (id: string) => void;
  children?: React.ReactNode;
}

/** Control-row glyph lookup — keeps the payload icon-keyed (never a component). */
const RowGlyph = ({ name }: { name: ControlRow['icon'] }) =>
  name === 'clock' ? (
    <Clock color={ecColors.rowInk} size={16} />
  ) : (
    <Pin color={ecColors.rowInk} size={16} />
  );

const Row = memo(function RowBase({
  row,
  onPress,
}: {
  row: ControlRow;
  onPress: (id: string) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(row.id)}
      accessibilityRole="button"
      accessibilityLabel={row.label}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
      testID={`ec-control-${row.id}`}>
      <View style={styles.rowIcon}>
        <RowGlyph name={row.icon} />
      </View>
      <Text style={styles.rowLabel}>{row.label}</Text>
      <Chevron dir="right" color={ecColors.chevronInk} size={14} />
    </Pressable>
  );
});

function ControlRowsImpl({ title, rows, onRowPress, children }: ControlRowsProps) {
  return (
    <View style={styles.card} testID="ec-control-card">
      <SectionBar title={title} testID="ec-control-bar" />
      {rows.map(row => (
        <Row key={row.id} row={row} onPress={onRowPress} />
      ))}
      {children}
    </View>
  );
}

export const ControlRows = memo(ControlRowsImpl);
export default ControlRows;
