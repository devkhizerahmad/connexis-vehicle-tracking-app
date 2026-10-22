// ScreenState.test.tsx — load / error / empty contract for the shared body state.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ActivityIndicator, Text } from 'react-native';
import { ScreenState } from '../src/shared/components/feedback/ScreenState';

async function render(element: React.ReactElement) {
  let instance: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    instance = ReactTestRenderer.create(element);
  });
  if (!instance) {
    throw new Error('ScreenState did not mount');
  }
  return instance;
}

function textContent(instance: ReactTestRenderer.ReactTestRenderer): string[] {
  return instance.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .filter((child): child is string => typeof child === 'string');
}

/**
 * Pressable is a composite, so match it by the props it owns rather than by
 * type — that is also what a user taps.
 */
function findButton(instance: ReactTestRenderer.ReactTestRenderer) {
  return instance.root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
}

describe('ScreenState', () => {
  it('shows a spinner and the default loading copy, with no action', async () => {
    const instance = await render(<ScreenState kind="loading" />);

    expect(instance.root.findAllByType(ActivityIndicator)).toHaveLength(1);
    expect(textContent(instance)).toContain('Loading…');
    expect(findButton(instance)).toHaveLength(0);
  });

  it('shows error copy and runs the retry callback exactly once', async () => {
    const onAction = jest.fn();
    const instance = await render(<ScreenState kind="error" onAction={onAction} />);

    expect(textContent(instance)).toEqual(
      expect.arrayContaining(['Something went wrong', 'Try again']),
    );

    const [button] = findButton(instance);
    await ReactTestRenderer.act(async () => {
      button.props.onPress();
    });

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('shows empty copy without a spinner or an action', async () => {
    const instance = await render(<ScreenState kind="empty" />);

    expect(instance.root.findAllByType(ActivityIndicator)).toHaveLength(0);
    expect(findButton(instance)).toHaveLength(0);
    expect(textContent(instance)).toContain('Nothing here yet');
  });

  it('lets a screen override the title, message and action label', async () => {
    const instance = await render(
      <ScreenState
        kind="error"
        title="Vehicle not found"
        message="This vehicle is no longer available."
        actionLabel="Reload"
        onAction={() => {}}
      />,
    );

    expect(textContent(instance)).toEqual(
      expect.arrayContaining([
        'Vehicle not found',
        'This vehicle is no longer available.',
        'Reload',
      ]),
    );
  });
});
