// HistoryPanels.test.tsx — reference-match contract for the History (S4–S9)
// components. These lock the visual rules the 318x1280 reference defines:
//   S4 the range paints ONE contiguous band with rounded outer corners and a
//      WHITE start square (it used to be one circle per day);
//   S5 the summary is a "Summary" card whose BOTH bars are navy and whose rows
//      split "TOTAL" from the state word;
//   S8 the hour/minute strips are flanked by caret buttons;
//   S9 rows carry a car badge, a connector arrow and a two-tone address.
import React from 'react';
import { StyleSheet } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { DateRangeCalendar } from '../src/shared/components/controls/DateRangeCalendar';
import { HourMinPicker } from '../src/shared/components/controls/HourMinPicker';
import {
  HistoryListRow,
  splitAddress,
} from '../src/features/map/components/HistoryListRow/HistoryListRow';
import { HistorySummaryPanel } from '../src/features/map/components/HistorySummaryPanel';
import { historyColors } from '../src/shared/theme';
import type { HistoryStop, HistorySummary } from '../src/features/map/types/history';

const render = async (element: React.ReactElement) => {
  let instance!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    instance = ReactTestRenderer.create(element);
  });
  return instance;
};

/** Every text run rendered anywhere in the tree (trimmed to its content). */
const textsOf = (node: unknown): string[] => {
  const out: string[] = [];
  const walk = (n: any) => {
    if (n === null || n === undefined) {
      return;
    }
    if (typeof n === 'string') {
      // Nested <Text> runs carry their own separators ("  Lahore,Punjab").
      out.push(n.trim());
      return;
    }
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (typeof n === 'object' && n.children !== null) {
      walk(n.children);
    }
  };
  walk(node);
  return out;
};

/** Count HOST nodes whose flattened style declares `key: value`. */
const countStyled = (
  instance: ReactTestRenderer.ReactTestRenderer,
  key: string,
  value: unknown,
): number =>
  instance.root.findAll(node => {
    // Skip composite wrappers — react-test-renderer reports both the composite
    // and the host node for the same element, which would double every count.
    if (typeof node.type !== 'string') {
      return false;
    }
    const flat = StyleSheet.flatten(node.props?.style) as Record<string, unknown> | undefined;
    return flat?.[key] === value;
  }).length;

const summary: HistorySummary = {
  totalKm: '23.5',
  totalKmUnit: 'Km',
  runningLabel: 'TOTAL Running',
  runningValue: '18 minutes',
  idleLabel: 'TOTAL Idle',
  idleValue: '1 hour 30 minutes',
  runningRatio: 0.28,
  idleRatio: 0.55,
};

const movingStop: HistoryStop = {
  id: 'stop-1',
  time: '10:08 PM',
  kind: 'moving',
  address: 'Lda Avenue Phase 1 Lahore,Punjab',
  duration: '6 min.',
  distance: '5.12 km',
  speed: '47 mph',
};

describe('HistorySummaryPanel (S5)', () => {
  it('renders the Summary card, the full KM label and split TOTAL rows', async () => {
    const instance = await render(<HistorySummaryPanel summary={summary} />);
    const texts = textsOf(instance.toJSON());

    expect(texts).toContain('Summary');
    expect(texts).toContain('Total KM Driven');
    expect(texts).toContain('23.5');
    // "TOTAL Running" is split across two lines in the reference.
    expect(texts).toContain('TOTAL');
    expect(texts).toContain('Running');
    expect(texts).toContain('Idle');
    expect(texts).toContain('18 minutes');
    expect(texts).toContain('1 hour 30 minutes');
    instance.unmount();
  });

  it('fills BOTH bars with the reference navy, not a state tint', async () => {
    const instance = await render(<HistorySummaryPanel summary={summary} />);

    // Two fills (running + idle), both neutral navy.
    expect(countStyled(instance, 'backgroundColor', historyColors.barFill)).toBe(2);
    // The state words keep their own ink.
    expect(countStyled(instance, 'color', historyColors.runningInk)).toBe(1);
    expect(countStyled(instance, 'color', historyColors.idleInk)).toBe(1);
    instance.unmount();
  });
});

describe('HistoryListRow (S9)', () => {
  it('splits the address into a dark street and a light locality', () => {
    expect(splitAddress('Lda Avenue Phase 1 Lahore,Punjab')).toEqual({
      street: 'Lda Avenue Phase 1',
      city: 'Lahore,Punjab',
    });
    expect(splitAddress('H3, Phase 2 Johar Town Lahore,Punjab')).toEqual({
      street: 'H3, Phase 2 Johar Town',
      city: 'Lahore,Punjab',
    });
    // An address without a trailing "City,Province" stays a single tone.
    expect(splitAddress('Ring Road')).toEqual({ street: 'Ring Road', city: '' });
  });

  it('renders the car badge, the metric chips and the connector arrow', async () => {
    const instance = await render(<HistoryListRow stop={movingStop} />);
    const texts = textsOf(instance.toJSON());

    expect(texts).toContain('10:08 PM');
    expect(texts).toContain('6 min.');
    expect(texts).toContain('5.12 km');
    expect(texts).toContain('47 mph');
    expect(texts).toContain('Lda Avenue Phase 1');
    expect(texts).toContain('Lahore,Punjab');
    expect(texts).toContain('↑');
    expect(countStyled(instance, 'backgroundColor', historyColors.stopMoving)).toBe(1);
    instance.unmount();
  });
});


describe('HourMinPicker (S8)', () => {
  it('steps the selection from the caret buttons', async () => {
    const onSelect = jest.fn();
    const instance = await render(
      <HourMinPicker
        label="Hour"
        options={['1', '2', '3', '4']}
        selected="2"
        format={h => `${h} AM`}
        onSelect={onSelect}
        testID="hour-jump"
      />,
    );

    await ReactTestRenderer.act(async () => {
      instance.root.findByProps({ testID: 'hour-jump-next' }).props.onPress();
    });
    expect(onSelect).toHaveBeenCalledWith('3');

    await ReactTestRenderer.act(async () => {
      instance.root.findByProps({ testID: 'hour-jump-prev' }).props.onPress();
    });
    expect(onSelect).toHaveBeenCalledWith('1');
    instance.unmount();
  });

  it('draws the active chip in the reference red', async () => {
    const instance = await render(
      <HourMinPicker
        label="Min"
        options={['00', '05', '10', '15']}
        selected="05"
        testID="minute-jump"
      />,
    );

    expect(countStyled(instance, 'backgroundColor', historyColors.chipActiveBg)).toBe(1);
    expect(countStyled(instance, 'backgroundColor', historyColors.chipIdleBg)).toBe(3);
    instance.unmount();
  });
});

describe('DateRangeCalendar (S4)', () => {
  const renderCalendar = () =>
    render(
      <DateRangeCalendar
        range={{ from: '2018-12-13', until: '2018-12-24' }}
        month={{ year: 2018, month: 11 }}
        onMonthChange={jest.fn()}
        onSelectDay={jest.fn()}
      />,
    );

  it('paints one contiguous band for every in-range day except the start', async () => {
    const instance = await renderCalendar();

    // 13..24 is 12 in-range days; the start day paints the white square instead.
    expect(countStyled(instance, 'backgroundColor', historyColors.rangeFill)).toBe(11);
    expect(countStyled(instance, 'backgroundColor', historyColors.startFill)).toBe(1);
    instance.unmount();
  });

  it('rounds the band only where the range opens or closes', async () => {
    const instance = await renderCalendar();

    // Range 13..24 Dec 2018: Sun 16 + Sun 23 open a band; Sat 15 + Sat 22 + 24 end one.
    expect(countStyled(instance, 'borderTopLeftRadius', 4)).toBe(2);
    expect(countStyled(instance, 'borderTopRightRadius', 4)).toBe(3);
    instance.unmount();
  });

  it('renders the tooltip arrow above the dark panel', async () => {
    const instance = await renderCalendar();

    expect(countStyled(instance, 'borderBottomColor', historyColors.panel)).toBe(1);
    instance.unmount();
  });
});


describe('HistoryListRow connector (S9)', () => {
  it('drops the connector on the final row', async () => {
    const instance = await render(<HistoryListRow stop={movingStop} isLast />);

    expect(textsOf(instance.toJSON())).not.toContain('↑');
    instance.unmount();
  });
});
