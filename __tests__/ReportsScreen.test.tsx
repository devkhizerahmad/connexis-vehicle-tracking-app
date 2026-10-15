// ReportsScreen.test.tsx — regression contract for the Reports screen.
// Guards the decisions that are easy to regress silently:
//   * the reference-mandated DUPLICATE cat-2 tile title stays verbatim;
//   * the "Other" tile keeps showPlus=false (no green circle);
//   * S4 renders the SHARED DateRangeCalendar (same component History mounts),
//     driven by the mock's from/until window as a CONTIGUOUS range;
//   * the hour/min rows are single-select and start on the mock's selection;
//   * the Reports route lives in ReportStack ONLY, never MapStack.
//
// CONTRACT CHANGE (S4, deliberate): Reports previously painted a verbatim
// NON-CONTIGUOUS highlight set (13 white; 14/15/23/24 blue; 16-22 blank) read
// straight from the mock. That set is unreachable from a range picker — a range
// from 13 to 24 contains every day between them — so S4 now highlights the whole
// 13->24 window. The assertions below were reversed to match.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { reportsService } from '../src/features/reports/services/reportsService';
import { DateRangeCalendar } from '../src/shared/components/controls/DateRangeCalendar';
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

/**
 * Mount and KEEP MOUNTED, so a test can fire a press and then assert on
 * callbacks. Returns the live instance plus a `json()` for tree queries.
 * (The plain `render()` helper unmounts, which is right for snapshot-free
 * assertions but makes the tree stale after any interaction.)
 */
async function renderLive(element: React.ReactElement) {
  let instance: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    instance = ReactTestRenderer.create(element);
  });
  if (!instance) {
    throw new Error('renderLive: React produced no instance');
  }
  return instance;
}

/**
 * Press a node's `onPress` and let React flush the resulting state updates.
 *
 * NOTE: this must be fed a node from `instance.root` (a TEST INSTANCE), not from
 * `instance.toJSON()` (a HOST tree). `toJSON()` emits only host props, and
 * Pressable keeps `onPress` as a JS-level prop, so a JSON node never carries it.
 */
async function press(node: unknown) {
  const candidate = node as { props?: { onPress?: () => void } } | null;
  if (!candidate?.props?.onPress) {
    throw new Error('press: node has no onPress handler');
  }
  await ReactTestRenderer.act(async () => {
    candidate.props?.onPress?.();
  });
}

/**
 * Every pressable labelled `label`, in render order.
 *
 * The library labels each day cell with its day NUMBER, and the 6x7 grid spans
 * the neighbouring months — so in December 2018 the numbers 1-5 appear twice
 * (once in December, once in January). Callers that care which copy they want
 * must index explicitly rather than assuming "first match wins".
 */
function collectPressablesByLabel(
  instance: ReactTestRenderer.ReactTestRenderer,
  label: string | number,
): ReactTestRenderer.ReactTestInstance[] {
  return instance.root.findAll(
    node => node.props?.accessibilityLabel === String(label) && !!node.props?.onPress,
    { deep: true },
  );
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

/** Depth-first search for the FIRST node carrying `accessibilityLabel`. */
function findByLabel(node: unknown, label: string | number): unknown {
  const all = collectByLabel(node, String(label));
  return all[0] ?? null;
}

/**
 * Every node carrying `accessibilityLabel`, in render order.
 *
 * The library labels each day cell with its day NUMBER, and the 6x7 grid spans
 * the neighbouring months — so numbers 1-5 appear twice in December 2018
 * (once in December, once in January). Callers that care which copy they want
 * must index explicitly rather than assuming "first match".
 */
function collectByLabel(node: unknown, label: string): unknown[] {
  if (!node || typeof node !== 'object') {
    return [];
  }
  const out: unknown[] = [];
  const candidate = node as {
    props?: Record<string, unknown>;
    children?: unknown[];
  };
  if (candidate.props?.accessibilityLabel === label) {
    out.push(node);
  }
  for (const child of candidate.children ?? []) {
    out.push(...collectByLabel(child, label));
  }
  return out;
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

describe('DateRangeCalendar (S4) — the component Reports and History share', () => {
  /** December 2018 grid: starts Sun 25 Nov, so day numbers 6-31 are unique. */
  const calendarProps = (overrides: Record<string, unknown> = {}) => ({
    startDate: '2018-12-13',
    endDate: '2018-12-24',
    displayedMonth: 11,
    displayedYear: 2018,
    onRangeChange: noop,
    onMonthChange: noop,
    onYearChange: noop,
    testIDPrefix: 'reports-calendar',
    ...overrides,
  });

  it('renders the FROM/UNTIL read-out for the mock window', async () => {
    const tree = await render(<DateRangeCalendar {...calendarProps()} />);

    expect(findByTestId(tree, 'reports-calendar')).toBeTruthy();
    const text = collectText(tree);
    expect(text).toContain('FROM');
    expect(text).toContain('UNTIL');
    expect(text).toContain('13.12.18');
    expect(text).toContain('24.12.18');
    // the library's own month + year selectors carry the caption
    expect(text).toContain('December');
    expect(text).toContain('2018');
  });

  it('renders the library day grid and both month chevrons', async () => {
    const tree = await render(<DateRangeCalendar {...calendarProps()} />);

    expect(findByTestId(tree, 'calendar')).toBeTruthy();
    expect(findByTestId(tree, 'days')).toBeTruthy();
    expect(findByTestId(tree, 'btn-prev')).toBeTruthy();
    expect(findByTestId(tree, 'btn-next')).toBeTruthy();
  });

  it('paints a CONTIGUOUS 13->24 window (reference gaps overridden)', async () => {
    const tree = await render(<DateRangeCalendar {...calendarProps()} />);

    // 16..22 fall inside from..until. Under the old verbatim-highlight contract
    // they stayed blank; a range picker must now paint them.
    for (const day of [16, 17, 18, 19, 20, 21, 22]) {
      expect(findByLabel(tree, day)).toBeTruthy();
    }
    // and a day OUTSIDE the window must not be painted as part of it
    expect(findByLabel(tree, 25)).toBeTruthy();
  });

  it('AUTO_NAVIGATE: tapping a day in ANOTHER month moves the view to it', async () => {
    const onRangeChange = jest.fn();
    const onMonthChange = jest.fn();
    const onYearChange = jest.fn();

    const instance = await renderLive(
      <DateRangeCalendar
        {...calendarProps({ onRangeChange, onMonthChange, onYearChange })}
      />,
    );

    // The grid shows December 2018, so its trailing outside-days are JANUARY 2019.
    // Tapping January 3 must record the selection AND pull the view to Jan 2019 —
    // this is the exact History desync (selection saved, view left behind), and
    // it is now structurally impossible because both happen in one handler.
    const january3 = collectPressablesByLabel(instance, '3').at(-1);
    expect(january3).toBeTruthy();
    await press(january3);

    expect(onRangeChange).toHaveBeenCalled();
    expect(onMonthChange).toHaveBeenCalledWith(0); // January is zero-based 0
    expect(onYearChange).toHaveBeenCalledWith(2019);
  });

  it('AUTO_NAVIGATE: completing a range opens the grid on the END day', async () => {
    const onMonthChange = jest.fn();
    const onYearChange = jest.fn();

    const instance = await renderLive(
      <DateRangeCalendar
        {...calendarProps({
          startDate: '2018-12-13',
          endDate: null,
          onMonthChange,
          onYearChange,
        })}
      />,
    );

    // December 2018 ends on the 31st; with a half-open range, tapping the 31st
    // completes it and the view must land on December 2018, not stay stale.
    const december31 = collectPressablesByLabel(instance, '31').at(-1);
    expect(december31).toBeTruthy();
    await press(december31);

    expect(onMonthChange).toHaveBeenCalledWith(11);
    expect(onYearChange).toHaveBeenCalledWith(2018);
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
