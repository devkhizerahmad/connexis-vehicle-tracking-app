// stamp.ts — B4: derive the playback timestamp from the playhead position.
//
// The mock ships ONE absolute string (`28-April-2024 (2:45 AM)`) that describes
// the playhead's CURRENT position, not the start of the clip. Advancing the
// playhead must move the clock, so the string is parsed into minutes-of-day and
// re-rendered at `base + progress * duration`.
//
// `base` is `stamp - initialProgress * duration`, which keeps the very first
// render byte-identical to the mock (no visual regression on the reference).

/** Everything the derivation needs from `HistoryPlayback`. */
export interface StampSource {
  stamp: string;
  durationMinutes: number;
  initialProgress: number;
}

export interface StampParts {
  /** Text before the clock, e.g. `28-April-2024 (`. */
  prefix: string;
  /** Text after the clock, e.g. `)`. */
  suffix: string;
  /** True when the source used a 12-hour clock with an AM/PM marker. */
  hour12: boolean;
  minutesOfDay: number;
}

const STAMP_PATTERN = /^(.*?)(\d{1,2}):(\d{2})\s*(AM|PM)?(.*)$/i;
const DAY_MINUTES = 24 * 60;

/** Parse `28-April-2024 (2:45 AM)` into prefix + minutes-of-day + suffix. */
export function parseStamp(stamp: string): StampParts | null {
  const match = STAMP_PATTERN.exec(stamp);
  if (!match) {
    return null;
  }
  const [, prefix, hours, minutes, meridiem, suffix] = match;
  const isPm = (meridiem ?? '').toUpperCase() === 'PM';
  return {
    prefix,
    suffix,
    hour12: Boolean(meridiem),
    minutesOfDay: (Number(hours) % 12) * 60 + Number(minutes) + (isPm ? DAY_MINUTES / 2 : 0),
  };
}

/** Render minutes-of-day back into the source's own stamp format. */
export function formatStamp(parts: StampParts, minutesOfDay: number): string {
  const normalized = ((Math.round(minutesOfDay) % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  const hours24 = Math.floor(normalized / 60);
  const minutes = String(normalized % 60).padStart(2, '0');
  if (!parts.hour12) {
    return `${parts.prefix}${String(hours24).padStart(2, '0')}:${minutes}${parts.suffix}`;
  }
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const meridiem = hours24 >= 12 ? 'PM' : 'AM';
  return `${parts.prefix}${hours12}:${minutes} ${meridiem}${parts.suffix}`;
}

/** The timestamp shown for a 0..1 playhead position. */
export function derivePlaybackStamp(source: StampSource, progress: number): string {
  const parts = parseStamp(source.stamp);
  if (!parts) {
    return source.stamp;
  }
  const clamped = Math.min(1, Math.max(0, progress));
  const baseMinutes = parts.minutesOfDay - source.initialProgress * source.durationMinutes;
  return formatStamp(parts, baseMinutes + clamped * source.durationMinutes);
}
