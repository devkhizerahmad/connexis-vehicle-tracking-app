// PlaybackPanel.tsx — S7: "Playback" title strip, speed + state pill, timestamp
// + transport controls, the Reanimated scrubber, and the Hour/Minute jump rows (S8).
//
// PATCH T-HISTORY (reference match):
//   * the "Playback" title strip was missing — the reference opens the panel with it;
//   * the reference shows THREE transport buttons (skip-back / play / skip-forward)
//     on the timestamp row, not a single play button on the speed row;
//   * the car + calendar glyphs are RED on this panel;
//   * the scrubber, its tick ruler and the Hour/Min rows sit on the PAGE background
//     below the dark surface, so only the title strip + two info rows are dark.
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CalendarGlyph,
  CarGlyph,
  StatusRing,
  TransportGlyph,
} from '@shared/components/icons';
import { HourMinPicker } from '@shared/components/controls/HourMinPicker';
import { historyColors, historySizes } from '@shared/theme';
import type { HistoryFilters, HistoryPlayback } from '@features/map/types/history';
import { PlaybackScrubber, type PlaybackScrubberHandle } from './PlaybackScrubber';

/** State dot colour tracks the playback state (same tokens as the S9 badges). */
const STATE_INK: Record<HistoryPlayback['state'], string> = {
  Moving: historyColors.stopMoving,
  Idle: historyColors.stopIdle,
  Stop: historyColors.stopStop,
};

export interface PlaybackPanelProps {
  playback: HistoryPlayback;
  filters: HistoryFilters;
  onHourChange?: (hour: string) => void;
  onMinuteChange?: (minute: string) => void;
}

export const PlaybackPanel = ({
  playback,
  filters,
  onHourChange,
  onMinuteChange,
}: PlaybackPanelProps) => {
  const [playing, setPlaying] = useState(false);
  const scrubberRef = useRef<PlaybackScrubberHandle | null>(null);
  // PATCH T-HISTORY: the Hour/Min rows own their selection so the chips and the
  // flanking carets actually respond; the parent is still notified when wired.
  const [hour, setHour] = useState(filters.defaultHour);
  const [minute, setMinute] = useState(filters.defaultMinute);

  const selectHour = useCallback(
    (next: string) => {
      setHour(next);
      onHourChange?.(next);
    },
    [onHourChange],
  );
  const selectMinute = useCallback(
    (next: string) => {
      setMinute(next);
      onMinuteChange?.(next);
    },
    [onMinuteChange],
  );

  const togglePlay = useCallback(() => setPlaying(p => !p), []);
  // Skip buttons move the Reanimated playhead through the scrubber's imperative handle.
  const skip = useCallback(
    (direction: -1 | 1) => () => {
      setPlaying(false);
      scrubberRef.current?.skip(direction);
    },
    [],
  );

  return (
    <View style={styles.wrap} testID="playback-panel">
      {/* S7 title strip (dark navy, same surface as the S4 calendar + S9 section bar) */}
      <View style={styles.titleStrip}>
        <Text style={styles.titleText}>Playback</Text>
      </View>

      {/* S7 info rows (lighter charcoal body) */}
      <View style={styles.body}>
        <View style={styles.head}>
          <View style={styles.headLeft}>
            <CarGlyph color={historyColors.playIconInk} size={17} />
            <Text style={styles.speed}>{`Speed: ${playback.speed}`}</Text>
          </View>
          <View style={styles.statePill} testID="playback-state">
            <StatusRing color={STATE_INK[playback.state]} size={13} />
            <Text style={styles.stateText}>{playback.stateLabel}</Text>
          </View>
        </View>

        <View style={styles.stampRow}>
          <View style={styles.headLeft}>
            <CalendarGlyph color={historyColors.playIconInk} size={15} />
            <Text style={styles.stamp} testID="playback-stamp">
              {playback.stamp}
            </Text>
          </View>
          <View style={styles.transport}>
            <Pressable
              style={styles.ctrlBtn}
              onPress={skip(-1)}
              hitSlop={6}
              accessibilityLabel="Skip back"
              testID="playback-prev">
              <TransportGlyph glyph="prev" color={historyColors.ctrlBtnInk} size={13} />
            </Pressable>
            <Pressable
              style={[styles.ctrlBtn, styles.ctrlBtnBig]}
              onPress={togglePlay}
              hitSlop={6}
              accessibilityLabel={playing ? 'Pause' : 'Play'}
              accessibilityState={{ selected: playing }}
              testID="playback-play">
              <TransportGlyph
                glyph={playing ? 'pause' : 'play'}
                color={historyColors.ctrlBtnInk}
                size={playing ? 12 : 16}
              />
            </Pressable>
            <Pressable
              style={styles.ctrlBtn}
              onPress={skip(1)}
              hitSlop={6}
              accessibilityLabel="Skip forward"
              testID="playback-next">
              <TransportGlyph glyph="next" color={historyColors.ctrlBtnInk} size={13} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* S7 scrubber + ruler — page background, not the dark surface */}
      <PlaybackScrubber ref={scrubberRef} playback={playback} />

      {/* S8 hour/minute jump rows */}
      <View style={styles.jumpers}>
        <HourMinPicker
          label="Hour"
          options={filters.hourOptions}
          selected={hour}
          format={h => `${h} AM`}
          onSelect={selectHour}
          testID="hour-jump"
        />
        <HourMinPicker
          label="Min"
          options={filters.minuteOptions}
          selected={minute}
          onSelect={selectMinute}
          testID="minute-jump"
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  // PATCH T-HISTORY: "Playback" title strip (dark navy, same surface as the calendar)
  titleStrip: {
    height: historySizes.panelTitleH,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: historyColors.panel,
  },
  // PATCH T-HISTORY: info rows sit on the lighter charcoal body
  body: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: historyColors.panelSoft,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexShrink: 1,
  },
  titleText: {
    color: historyColors.panelTitle,
    fontSize: 13,
    fontWeight: '700',
  },
  speed: {
    fontSize: 13,
    fontWeight: '700',
    color: historyColors.speedInk,
  },
  statePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 13,
    backgroundColor: historyColors.movingPillBg,
  },
  stateText: {
    fontSize: 12,
    color: historyColors.movingPillInk,
  },
  transport: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctrlBtn: {
    width: historySizes.ctrlBtn,
    height: historySizes.ctrlBtn,
    borderRadius: historySizes.ctrlBtn / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: historyColors.ctrlBtnBg,
  },
  ctrlBtnBig: {
    width: historySizes.ctrlBtnBig,
    height: historySizes.ctrlBtnBig,
    borderRadius: historySizes.ctrlBtnBig / 2,
  },
  stampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stamp: {
    fontSize: 13,
    fontWeight: '600',
    color: historyColors.speedInk,
  },
  jumpers: {
    gap: 8,
  },
});

export default PlaybackPanel;
