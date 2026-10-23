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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CalendarGlyph,
  CarGlyph,
  StatusRing,
  TransportGlyph,
} from '@shared/components/icons';
import { HourMinPicker } from '@shared/components/controls/HourMinPicker';
import { historyColors, historySizes, radii } from '@shared/theme';
import type { HistoryFilters, HistoryPlayback } from '@features/map/types/history';
import { PlaybackScrubber, type PlaybackScrubberHandle } from './PlaybackScrubber';
import { derivePlaybackStamp } from './stamp';

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
  // B4: the playhead lives in a ref (authoritative, read by the RAF loop) and is
  // mirrored into state only ~10x/s so the timestamp text re-renders without
  // turning the transport into a 60 fps React workload.
  const [progress, setProgress] = useState(() =>
    Math.min(1, Math.max(0, playback.initialProgress)),
  );
  // PATCH T-HISTORY: the Hour/Min rows own their selection so the chips and the
  // flanking carets actually respond; the parent is still notified when wired.
  const [hour, setHour] = useState(filters.defaultHour);
  const [minute, setMinute] = useState(filters.defaultMinute);
  const progressRef = useRef(progress);
  const durationMs = Math.max(1, playback.durationMinutes * 60_000);

  /** Single writer for the playhead: ref + scrubber shared value + state. */
  const writeProgress = useCallback((value: number) => {
    const next = Math.min(1, Math.max(0, value));
    progressRef.current = next;
    scrubberRef.current?.setProgress(next);
    setProgress(next);
  }, []);

  /** M8: a new payload resets the transport, the playhead and the jump rows. */
  useEffect(() => {
    const seed = Math.min(1, Math.max(0, playback.initialProgress));
    progressRef.current = seed;
    setProgress(seed);
    scrubberRef.current?.setProgress(seed);
    setPlaying(false);
    setHour(filters.defaultHour);
    setMinute(filters.defaultMinute);
  }, [
    playback.stamp,
    playback.initialProgress,
    playback.durationMinutes,
    filters.defaultHour,
    filters.defaultMinute,
  ]);

  /** B4: while playing, advance the playhead in real time and stop at the end. */
  useEffect(() => {
    if (!playing) {
      return undefined;
    }
    let frame = 0;
    let lastTs = Date.now();
    let lastPaint = lastTs;
    const step = () => {
      const now = Date.now();
      const elapsed = now - lastTs;
      lastTs = now;
      const next = Math.min(1, progressRef.current + elapsed / durationMs);
      progressRef.current = next;
      scrubberRef.current?.setProgress(next);
      if (now - lastPaint > 100 || next >= 1) {
        lastPaint = now;
        setProgress(next);
      }
      if (next >= 1) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [playing, durationMs]);

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

  /** Dragging or skipping the playhead keeps the timestamp in step (B4). */
  const handleScrub = useCallback(
    (next: number) => {
      const clamped = Math.min(1, Math.max(0, next));
      progressRef.current = clamped;
      setProgress(clamped);
    },
    [],
  );

  /** Play from the current position; a finished clip restarts from the top. */
  const togglePlay = useCallback(() => {
    if (!playing && progressRef.current >= 1) {
      writeProgress(0);
    }
    setPlaying(p => !p);
  }, [playing, writeProgress]);

  // Skip buttons move the Reanimated playhead through the scrubber's imperative handle.
  const skip = useCallback(
    (direction: -1 | 1) => () => {
      setPlaying(false);
      scrubberRef.current?.skip(direction);
    },
    [],
  );

  /**
   * B4: the displayed time is derived, not copied. `playback.stamp` describes the
   * playhead's CURRENT position, so its base time is that value minus
   * `initialProgress` of the clip; advancing the playhead moves the clock.
   */
  const stamp = useMemo(() => derivePlaybackStamp(playback, progress), [playback, progress]);

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
              {stamp}
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
      <PlaybackScrubber ref={scrubberRef} playback={playback} onScrub={handleScrub} />

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
  /**
   * PATCH UI-POLISH (PART 8): `titleStrip` + `body` now read as ONE rounded
   * playback box. The strip carries the top corners and the body the bottom
   * ones, both at `radii.md`, so the two stacked surfaces meet at a square
   * seam internally while the outer silhouette is rounded like every other
   * card in the app. `overflow: hidden` on the body clips its children to
   * those corners.
   */
  // PATCH T-HISTORY: "Playback" title strip (dark navy, same surface as the calendar)
  titleStrip: {
    height: historySizes.panelTitleH,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: historyColors.panel,
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    overflow: 'hidden',
  },
  // PATCH T-HISTORY: info rows sit on the lighter charcoal body
  body: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: historyColors.panelSoft,
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
    overflow: 'hidden',
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
