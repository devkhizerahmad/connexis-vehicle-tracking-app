// PlaybackPanel.test.tsx — locks the S7/S8 playback contract:
// the Hour and Min jump rows must render their OWN labels (a shared-label
// regression shipped once and is the reason this test exists).
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PlaybackPanel } from '../src/features/map/components/PlaybackPanel';
import type { HistoryFilters, HistoryPlayback } from '../src/features/map/types/history';

const filters: HistoryFilters = {
  hourOptions: ['1', '2', '3', '4'],
  minuteOptions: ['00', '05', '10', '15'],
  defaultHour: '2',
  defaultMinute: '05',
};

const playback: HistoryPlayback = {
  speed: '35 km/h',
  state: 'Moving',
  stateLabel: 'Moving',
  stamp: '28-April-2024 (2:45 AM)',
  durationMinutes: 18,
  initialProgress: 0.34,
};

/** Every string rendered anywhere in the tree. */
const textsOf = (node: unknown): string[] => {
  const out: string[] = [];
  const walk = (n: any) => {
    if (n === null || n === undefined) {
      return;
    }
    if (typeof n === 'string') {
      out.push(n);
      return;
    }
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (typeof n === 'object') {
      if (typeof n.children === 'object' && n.children !== null) {
        walk(n.children);
      }
    }
  };
  walk(node);
  return out;
};

const renderPanel = async () => {
  let instance!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    instance = ReactTestRenderer.create(
      <PlaybackPanel playback={playback} filters={filters} />,
    );
  });
  return instance;
};

describe('PlaybackPanel', () => {
  it('renders the Hour and Min jump rows with distinct labels', async () => {
    const instance = await renderPanel();
    const texts = textsOf(instance.toJSON());

    // Each row is labelled by its own `label` prop.
    expect(texts).toContain('Hour');
    expect(texts).toContain('Min');
    // "Min" must not be rendered as "Hour" (the bug this test guards).
    expect(texts).not.toContain('MIN');
    instance.unmount();
  });

  it('formats hour chips with AM and leaves minute chips bare', async () => {
    const instance = await renderPanel();
    const texts = textsOf(instance.toJSON());

    expect(texts).toContain('1 AM');
    expect(texts).toContain('4 AM');
    // Minute values are rendered as-is, not suffixed.
    expect(texts).toContain('00');
    expect(texts).toContain('15');
    expect(texts).not.toContain('05 AM');
    instance.unmount();
  });

  it('marks only the default hour/minute chips as selected', async () => {
    const instance = await renderPanel();
    const byTestId = instance.root.findAll(
      node => typeof node.props.testID === 'string' &&
        (node.props.testID.startsWith('hour-jump-') ||
          node.props.testID.startsWith('minute-jump-')),
    );

    // findAll matches both composite and host nodes, so dedupe by testID.
    const ids = Array.from(
      new Set(
        byTestId
          .filter(node => node.props.accessibilityState?.selected)
          .map(node => node.props.testID as string),
      ),
    ).sort();

    expect(ids).toEqual(['hour-jump-2', 'minute-jump-05']);
    instance.unmount();
  });
});
