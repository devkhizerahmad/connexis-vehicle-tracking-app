// ProfileDobSheet.tsx — the international-standard DOB picker: THREE segment
// rows (Month / Day / Year) with AUTO-SAVE on every selection.
//
// This is the Facebook / Google / LinkedIn / X pattern: there is NO calendar
// grid and NO OK/Done button — tapping a segment opens its option list inside
// the same sheet, and choosing an option saves immediately. The sheet stays
// open so the other segments can still be edited; the backdrop or the hardware
// back button closes it (the changes are already saved).
//
// The calendar grid is deliberately NOT used here: a grid is the international
// norm for EVENT dates (which is what the History / Reports range pickers are),
// while a birth date is entered as three segments.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { ChevronDown } from '@shared/components/icons';
import { profileTokens } from '@shared/theme';
import {
  MIN_YEAR,
  MONTH_NAMES,
  clampParts,
  daysInMonth,
  formatDob,
  parseDob,
  toIso,
  todayParts,
  type DobParts,
} from './dob';
import { styles } from './styles';

type Segment = 'month' | 'day' | 'year';

interface MonthOption {
  name: string;
  index: number;
}

export interface ProfileDobSheetProps {
  visible: boolean;
  /** The current DOB as ISO ("1990-01-01"). */
  value: string | null | undefined;
  /** Fired on EVERY selection — the auto-save. */
  onChange: (iso: string) => void;
  /** Fired when the sheet closes. */
  onClose: () => void;
}

const ROW_HEIGHT = 48;

export function ProfileDobSheet({
  visible,
  value,
  onChange,
  onClose,
}: ProfileDobSheetProps) {
  const initial = useMemo(() => parseDob(value) ?? todayParts(), [value]);
  const [parts, setParts] = useState<DobParts>(initial);
  const [openSegment, setOpenSegment] = useState<Segment | null>(null);

  /**
   * Re-seed the segments from the CURRENT DOB every time the sheet OPENS.
   *
   * Without this the sheet would keep whatever it was initialised with — and
   * because the Profile form is still loading on first mount, that initial
   * value is today's date, not the saved DOB. The sheet must always open
   * pre-set to the DOB it is editing.
   */
  const wasVisible = useRef(false);
  useEffect(() => {
    if (visible && !wasVisible.current) {
      setParts(parseDob(value) ?? todayParts());
      setOpenSegment(null);
    }
    wasVisible.current = visible;
  }, [visible, value]);

  /** Every selection goes through here: clamp, save, keep the sheet open. */
  const apply = useCallback(
    (next: DobParts) => {
      const clamped = clampParts(next);
      setParts(clamped);
      onChange(toIso(clamped));
    },
    [onChange],
  );

  const pickMonth = useCallback(
    (month: number) => {
      apply({ ...parts, month: month + 1 });
    },
    [apply, parts],
  );

  const pickDay = useCallback(
    (day: number) => {
      apply({ ...parts, day });
    },
    [apply, parts],
  );

  const pickYear = useCallback(
    (year: number) => {
      apply({ ...parts, year });
    },
    [apply, parts],
  );

  const thisYear = todayParts().year;
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = MIN_YEAR; y <= thisYear; y += 1) {
      years.push(y);
    }
    return years;
  }, [thisYear]);

  const dayOptions = useMemo(
    () => Array.from({ length: daysInMonth(parts.month, parts.year) }, (_, i) => i + 1),
    [parts.month, parts.year],
  );

  const monthOptions = useMemo(
    () => MONTH_NAMES.map((name, index) => ({ name, index })),
    [],
  );

  /**
   * The option list for the OPEN segment. The three lists are rendered as three
   * concrete FlatLists (rather than one union-typed list) so each keeps its own
   * item type, and the selected item is auto-scrolled into view.
   */
  const listLayout = useCallback(
    (_data: unknown, index: number) => ({
      length: ROW_HEIGHT,
      offset: ROW_HEIGHT * index,
      index,
    }),
    [],
  );

  const segmentValue = {
    month: MONTH_NAMES[parts.month - 1],
    day: `${parts.day}`,
    year: `${parts.year}`,
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close date of birth picker"
        testID="profile-dob-backdrop"
      />
      <View style={styles.sheet} testID="profile-dob-sheet">
        <View style={styles.handle} />

        <Text style={styles.title}>Date of Birth</Text>

        <SegmentRow
          label="Month"
          value={segmentValue.month}
          expanded={openSegment === 'month'}
          onPress={() => setOpenSegment(openSegment === 'month' ? null : 'month')}
          testID="profile-dob-segment-month"
        />
        <SegmentRow
          label="Day"
          value={segmentValue.day}
          expanded={openSegment === 'day'}
          onPress={() => setOpenSegment(openSegment === 'day' ? null : 'day')}
          testID="profile-dob-segment-day"
        />
        <SegmentRow
          label="Year"
          value={segmentValue.year}
          expanded={openSegment === 'year'}
          onPress={() => setOpenSegment(openSegment === 'year' ? null : 'year')}
          testID="profile-dob-segment-year"
        />

        {openSegment === 'month' ? (
          <FlatList
            data={monthOptions}
            keyExtractor={item => item.name}
            renderItem={({ item }: ListRenderItemInfo<MonthOption>) => (
              <OptionRow
                label={item.name}
                selected={item.index === parts.month - 1}
                onPress={() => pickMonth(item.index)}
                testID={`profile-dob-month-${item.name}`}
              />
            )}
            initialScrollIndex={parts.month - 1}
            getItemLayout={listLayout}
            style={styles.list}
            testID="profile-dob-options"
          />
        ) : null}

        {openSegment === 'day' ? (
          <FlatList
            data={dayOptions}
            keyExtractor={item => `${item}`}
            renderItem={({ item }: ListRenderItemInfo<number>) => (
              <OptionRow
                label={`${item}`}
                selected={item === parts.day}
                onPress={() => pickDay(item)}
                testID={`profile-dob-day-${item}`}
              />
            )}
            initialScrollIndex={parts.day - 1}
            getItemLayout={listLayout}
            style={styles.list}
            testID="profile-dob-options"
          />
        ) : null}

        {openSegment === 'year' ? (
          <FlatList
            data={yearOptions}
            keyExtractor={item => `${item}`}
            renderItem={({ item }: ListRenderItemInfo<number>) => (
              <OptionRow
                label={`${item}`}
                selected={item === parts.year}
                onPress={() => pickYear(item)}
                testID={`profile-dob-year-${item}`}
              />
            )}
            initialScrollIndex={parts.year - MIN_YEAR}
            getItemLayout={listLayout}
            style={styles.list}
            testID="profile-dob-options"
          />
        ) : null}
      </View>
    </Modal>
  );
}

interface SegmentRowProps {
  label: string;
  value: string;
  expanded: boolean;
  onPress: () => void;
  testID: string;
}

function SegmentRow({ label, value, expanded, onPress, testID }: SegmentRowProps) {
  return (
    <Pressable
      style={styles.segment}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`${label}: ${value}`}
      testID={testID}>
      <Text style={styles.segmentLabel}>{label}</Text>
      <View style={styles.segmentValueWrap}>
        <Text style={styles.segmentValue}>{value}</Text>
        <ChevronDown color={profileTokens.color.fieldValue} size={14} />
      </View>
    </Pressable>
  );
}

interface OptionRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID: string;
}

function OptionRow({ label, selected, onPress, testID }: OptionRowProps) {
  return (
    <Pressable
      style={[styles.option, selected ? styles.optionSelected : null]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={selected ? `${label}, selected` : label}
      testID={testID}>
      <Text style={[styles.optionLabel, selected ? styles.optionLabelSelected : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

export { formatDob };
export default ProfileDobSheet;
