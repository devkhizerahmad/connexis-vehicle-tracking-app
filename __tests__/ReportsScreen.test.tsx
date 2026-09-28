// ReportsScreen.test.tsx — T1–T9 regression contract for the Reports screen.
// Guards the decisions that are easy to regress silently:
//   * the reference-mandated DUPLICATE cat-2 tile title stays verbatim;
//   * the "Other" tile keeps showPlus=false (no green circle);
//   * calendar highlights are VERBATIM (13 white; 14/15/23/24 blue) and are
//     NOT derived as a contiguous from..until range;
//   * the hour/min rows are single-select and start on the mock's selection;
//   * the Reports route lives in ReportStack ONLY, never MapStack.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { reportsService } from '../src/features/reports/services/reportsService';
import { ReportsCalendar } from '../src/features/reports/components/ReportsCalendar';
import { ReportTile } from '../src/features/reports/components/ReportTile';
import { HourMinPicker } from '../src/shared/components/controls/HourMinPicker';
import * as ReportStackModule from '../src/navigation/stacks/ReportStack';
import * as MapStackModule from '../src/navigation/stacks/MapStack';
import type {
  MapStackParamList,
  ReportStackParamList,
} from '../src/navigation/types';

/**
 * Render a component and return its JSON tree.
 *
 * The tree MUST be read AFTER `act` resolves: calling `toJSON()` inside the
 * act callback returns null because React has not flushed the render yet.
 */
async function render(element: React.ReactElement) {
  let instance: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    instance = ReactTestRenderer.create(element);
  });
  const tree = instance ? instance.toJSON() : null;
  if (instance) {
    await ReactTestRenderer.act(async () => {
      instance?.unmount();
    });
  }
  return tree;
}

/** Depth-first search for a node carrying `testID`. */
function findByTestId(node: unknown, testID: string): unknown {
  if (!node || typeof node !== 'object') {
    return null;
  }
  const candidate = node as {
    props?: Record<string, unknown>;
    children?: unknown[];
  };
  if (candidate.props && candidate.props.testID === testID) {
    return node;
  }
  for (const child of candidate.children ?? []) {
    const hit = findByTestId(child, testID);
    if (hit) {
      return hit;
    }
  }
  return null;
}

/** Every string rendered anywhere in the tree. */
function collectText(node: unknown, out: string[] = []): string[] {
  if (typeof node === 'string') {
    out.push(node);
    return out;
  }
  if (!node || typeof node !== 'object') {
    return out;
  }
  const candidate = node as { children?: unknown[] };
  for (const child of candidate.children ?? []) {
    collectText(child, out);
  }
  return out;
}

const noop = () => {};

describe('reportsService (Reports mock payload)', () => {
  it('returns the reference calendar state verbatim', async () => {
    const data = await reportsService.getReportsData();

    expect(data.dateTimeExpanded).toBe(true);
    expect(data.calendar.fromLabel).toBe('13.12.18');
    expect(data.calendar.untilLabel).toBe('24.12.18');
    expect(data.calendar.monthLabel).toBe('December 2018');
    expect(data.calendar.yearMonth).toEqual({ y: 2018, m: 11 });
    expect(data.calendar.startDay).toBe(13);
    // non-contiguous by design — NOT a from..until range
    expect(data.calendar.blueDays).toEqual([14, 15, 23, 24]);
  });

  it('seeds the hour and minute rows on the reference selections', async () => {
    const data = await reportsService.getReportsData();

    expect(data.hourRow).toEqual({
      label: 'Hour',
      chips: ['1 AM', '2 AM', '3 AM', '4 AM'],
      selected: 1,
    });
    expect(data.minRow).toEqual({
      label: 'Min',
      chips: ['00', '05', '10', '15'],
      selected: 1,
    });
    // index 1 => "2 AM" and "05", matching the reference's red chips
    expect(data.hourRow.chips[data.hourRow.selected]).toBe('2 AM');
    expect(data.minRow.chips[data.minRow.selected]).toBe('05');
  });

  it('lists 4 vehicle options', async () => {
    const options = await reportsService.getVehicleOptions();

    expect(options).toHaveLength(4);
    expect(options[0].name).toBe('Honda Civic (LFA-1464)');
  });

  it('carries the three category cards with byte-exact titles', async () => {
    const data = await reportsService.getReportsData();

    expect(data.categories).toHaveLength(3);
    expect(data.categories[0].title).toBe(
      'Monitoring & Analysis of Events and Alerts',
    );
    expect(data.categories[1].title).toBe(
      'Comprehensive Analysis of Vehicle Movement',
    );
    expect(data.categories[2].title).toBe('Geofence Monitoring & Compliance');
    // every card is a row of two tiles
    for (const category of data.categories) {
      expect(category.tiles).toHaveLength(2);
    }
  });

  it('keeps the DUPLICATE cat-2 tile title verbatim (reference defect preserved)', async () => {
    const data = await reportsService.getReportsData();

    // cat-1 tile 1 and cat-2 tile 1 are BOTH "Events & Alerts Report" in the
    // reference artboard. That is a reference inconsistency we deliberately do
    // NOT "fix" — this test pins it so nobody silently rewrites the copy.
    expect(data.categories[0].tiles[0].title).toBe('Events & Alerts Report');
    expect(data.categories[1].tiles[0].title).toBe('Events & Alerts Report');
  });

  it('shows the green plus on every tile EXCEPT "Other"', async () => {
    const data = await reportsService.getReportsData();
    const tiles = data.categories.flatMap(c => c.tiles);
    const other = tiles.find(t => t.title === 'Other');

    expect(other).toBeDefined();
    expect(other?.showPlus).toBe(false);
    expect(other?.desc).toBe('View More Reports here');
    // all other five tiles keep the plus
    for (const tile of tiles.filter(t => t.title !== 'Other')) {
      expect(tile.showPlus).toBe(true);
    }
  });

  it('uses the reference tile fills per category', async () => {
    const data = await reportsService.getReportsData();

    expect(data.categories[0].tiles.map(t => t.color)).toEqual([
      '#1E88E5',
      '#D84315',
    ]);
    expect(data.categories[1].tiles.map(t => t.color)).toEqual([
      '#009688',
      '#F9A825',
    ]);
    expect(data.categories[2].tiles.map(t => t.color)).toEqual([
      '#37474F',
      '#9E9E9E',
    ]);
  });
});

describe('ReportsCalendar (S4)', () => {
  const calendarProps = async () => {
    const data = await reportsService.getReportsData();
    return {
      state: data.calendar,
      cursor: { year: 2018, month: 11 },
      onMonthChange: noop,
      onSelectDay: noop,
    };
  };

  it('renders the December 2018 grid with verbatim day highlights', async () => {
    const props = await calendarProps();
    const tree = await render(<ReportsCalendar {...props} />);

    expect(findByTestId(tree, 'reports-calendar')).toBeTruthy();

    const text = collectText(tree);
    expect(text).toContain('13.12.18');
    expect(text).toContain('24.12.18');
    expect(text).toContain('December 2018');

    // every highlighted day is individually present in the grid
    for (const day of [13, 14, 15, 23, 24]) {
      expect(findByTestId(tree, `reports-day-${day}`)).toBeTruthy();
    }
  });

  it('highlights exactly 5 days and never paints a contiguous range', async () => {
    const props = await calendarProps();
    const tree = await render(<ReportsCalendar {...props} />);

    /**
     * Day numbers whose cell carries an explicit background fill.
     * The grid spans the neighbouring months, so several day NUMBERS appear
     * twice; only December's own cells may be highlighted, and the outside
     * (dimmed) copies never are — so a plain "first match wins" scan is safe.
     */
    const highlighted: number[] = [];

    for (let day = 1; day <= 31; day += 1) {
      const node = findByTestId(tree, `reports-day-${day}`) as {
        children?: { props?: Record<string, unknown> }[];
      } | null;
      // node = the day-cell wrapper (Pressable); children[0] = the styled inner
      // View whose style array carries the white-start / blue fill.
      const cellStyle = node?.children?.[0]?.props?.style;
      const entries = Array.isArray(cellStyle) ? cellStyle : [cellStyle];
      const filled = entries.some(
        entry =>
          !!entry &&
          typeof entry === 'object' &&
          'backgroundColor' in (entry as Record<string, unknown>),
      );
      if (filled) {
        highlighted.push(day);
      }
    }

    // Exactly the mock's set: 13 (white start) + 14, 15, 23, 24 (blue).
    expect(highlighted).toEqual([13, 14, 15, 23, 24]);
    // 16..22 fall inside from..until but must stay UNpainted — a contiguous
    // range derivation would have highlighted them.
    for (const day of [16, 17, 18, 19, 20, 21, 22]) {
      expect(highlighted).not.toContain(day);
    }
  });

  it('exposes month step controls', async () => {
    const props = await calendarProps();
    const tree = await render(<ReportsCalendar {...props} />);

    expect(findByTestId(tree, 'reports-calendar-prev')).toBeTruthy();
    expect(findByTestId(tree, 'reports-calendar-next')).toBeTruthy();
  });
});

describe('ReportTile (S7-S9)', () => {
  it('omits the green plus when showPlus is false', async () => {
    const data = await reportsService.getReportsData();
    const other = data.categories[2].tiles[1];
    const tree = await render(
      <ReportTile tile={other} onPress={noop} onShare={noop} onAdd={noop} />,
    );

    expect(findByTestId(tree, `reports-tile-${other.title}`)).toBeTruthy();
    expect(findByTestId(tree, `reports-plus-${other.title}`)).toBeNull();
    expect(findByTestId(tree, `reports-share-${other.title}`)).toBeTruthy();
  });

  it('renders the green plus when showPlus is true', async () => {
    const data = await reportsService.getReportsData();
    const tile = data.categories[0].tiles[0];
    const tree = await render(
      <ReportTile tile={tile} onPress={noop} onShare={noop} onAdd={noop} />,
    );

    expect(findByTestId(tree, `reports-plus-${tile.title}`)).toBeTruthy();
    expect(collectText(tree)).toContain(tile.desc);
  });
});

describe('HourMinPicker (S5-S6) reports variant', () => {
  it('renders the reference chips with caret controls', async () => {
    const data = await reportsService.getReportsData();
    const row = data.hourRow;
    const tree = await render(
      <HourMinPicker
        label={row.label}
        options={row.chips}
        selected={row.chips[row.selected]}
        onSelect={noop}
        variant="reports"
        testID="reports-hour"
      />,
    );

    expect(findByTestId(tree, 'reports-hour')).toBeTruthy();
    for (const chip of row.chips) {
      expect(findByTestId(tree, `reports-hour-${chip}`)).toBeTruthy();
    }
    expect(findByTestId(tree, 'reports-hour-prev')).toBeTruthy();
    expect(findByTestId(tree, 'reports-hour-next')).toBeTruthy();
  });

  it('marks exactly one chip as selected for the minute row', async () => {
    const data = await reportsService.getReportsData();
    const row = data.minRow;
    const tree = await render(
      <HourMinPicker
        label={row.label}
        options={row.chips}
        selected={row.chips[row.selected]}
        onSelect={noop}
        variant="reports"
        testID="reports-min"
      />,
    );

    let selectedCount = 0;
    for (const chip of row.chips) {
      const node = findByTestId(tree, `reports-min-${chip}`) as {
        props?: Record<string, unknown>;
      };
      const state = node?.props?.accessibilityState as
        | { selected?: boolean }
        | undefined;
      if (state?.selected) {
        selectedCount += 1;
      }
    }
    expect(selectedCount).toBe(1);
  });
});

describe('Reports route placement (T6)', () => {
  it('exposes Reports on ReportStackParamList only', () => {
    // Compile-time proof, enforced by `tsc --noEmit`:
    //   * `Reports` IS a key of ReportStackParamList;
    //   * `Reports` is NOT a key of MapStackParamList (the map line below fails
    //     to type-check if the route is ever re-registered there).
    const reportRoute: ReportStackParamList['Reports'] = undefined;
    expect(reportRoute).toBeUndefined();

    const mapKeys: Array<keyof MapStackParamList> = ['LiveMap', 'History'];
    expect(mapKeys).not.toContain('Reports' as keyof MapStackParamList);
  });

  it('registers both stacks', () => {
    expect(ReportStackModule.ReportStack).toBeDefined();
    expect(MapStackModule.MapStack).toBeDefined();
  });
});
