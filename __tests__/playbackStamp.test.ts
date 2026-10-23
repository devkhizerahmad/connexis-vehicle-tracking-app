// playbackStamp.test.ts — B4/T(b): the playback clock must follow the playhead.
//
// The mock ships ONE absolute timestamp that describes the playhead's current
// position. The panel derives every other timestamp from it, so the derivation
// is the contract worth locking: initial render byte-identical to the mock,
// advancing forwards in time, and wrapping past midnight.
import {
  derivePlaybackStamp,
  formatStamp,
  parseStamp,
} from '../src/features/map/components/PlaybackPanel/stamp';

const playback = {
  stamp: '28-April-2024 (2:45 AM)',
  durationMinutes: 18,
  initialProgress: 0.34,
};

describe('playback stamp derivation (B4)', () => {
  it('reproduces the mock string exactly at the initial playhead position', () => {
    expect(derivePlaybackStamp(playback, playback.initialProgress)).toBe(
      '28-April-2024 (2:45 AM)',
    );
  });

  it('starts the clip before the mock stamp and ends it after', () => {
    // 0.34 * 18 min ≈ 6 min before 2:45 AM.
    expect(derivePlaybackStamp(playback, 0)).toBe('28-April-2024 (2:39 AM)');
    // ...and the 18-minute clip runs to about 2:57 AM.
    expect(derivePlaybackStamp(playback, 1)).toBe('28-April-2024 (2:57 AM)');
  });

  it('advances monotonically and clamps outside 0..1', () => {
    expect(derivePlaybackStamp(playback, 0.5)).toBe('28-April-2024 (2:48 AM)');
    expect(derivePlaybackStamp(playback, -5)).toBe(derivePlaybackStamp(playback, 0));
    expect(derivePlaybackStamp(playback, 5)).toBe(derivePlaybackStamp(playback, 1));
  });

  it('wraps past midnight and keeps 12 AM / 12 PM correct', () => {
    const late = { stamp: '28-April-2024 (11:58 PM)', durationMinutes: 10, initialProgress: 0 };
    // The date prefix is carried verbatim; only the clock wraps.
    expect(derivePlaybackStamp(late, 0.5)).toBe('28-April-2024 (12:03 AM)');

    const noon = parseStamp('12:00 PM');
    expect(noon?.minutesOfDay).toBe(12 * 60);
    expect(formatStamp(noon!, 12 * 60)).toBe('12:00 PM');
    expect(formatStamp(noon!, 0)).toBe('12:00 AM');
  });

  it('leaves an unparseable stamp untouched', () => {
    const odd = { stamp: 'no clock here', durationMinutes: 5, initialProgress: 0 };
    expect(derivePlaybackStamp(odd, 0.5)).toBe('no clock here');
  });
});
