// useToast.test.tsx — M17/S3 contract for the shared toast state machine.
//
// The hook replaced five drifted copies. What must stay true:
//   * the message is null until something is shown,
//   * showing a message sets it immediately,
//   * the message clears itself once the fade-out finishes (S3: no stale
//     message left mounted at opacity 0),
//   * a second show restarts the dismiss timer instead of letting the first
//     timer hide the newer message,
//   * unmounting mid-toast clears the timer and never sets state afterwards.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { useToast, type UseToastResult } from '../src/shared/hooks/useToast';

const DURATION = 1000;
const FADE = 600;

let api: UseToastResult | null = null;

function Harness() {
  const value = useToast(DURATION);
  api = value;
  return <Text>{value.message ?? 'none'}</Text>;
}

async function mount() {
  let instance: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    instance = ReactTestRenderer.create(<Harness />);
  });
  if (!instance) {
    throw new Error('Harness did not mount');
  }
  return instance;
}

function label(instance: ReactTestRenderer.ReactTestRenderer): string {
  return instance.root.findAllByType(Text)[0].props.children as string;
}

async function unmount(instance: ReactTestRenderer.ReactTestRenderer) {
  await ReactTestRenderer.act(async () => {
    instance.unmount();
  });
}

async function advance(ms: number) {
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  api = null;
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useToast', () => {
  it('starts hidden', async () => {
    const renderer = await mount();
    expect(label(renderer)).toBe('none');
    await unmount(renderer);
  });

  it('shows the message as soon as showToast is called', async () => {
    const renderer = await mount();
    await ReactTestRenderer.act(async () => {
      api?.showToast('Vehicle locked');
    });
    expect(label(renderer)).toBe('Vehicle locked');
    await unmount(renderer);
  });

  it('clears the message after the fade-out (S3)', async () => {
    const renderer = await mount();
    await ReactTestRenderer.act(async () => {
      api?.showToast('Profile saved');
    });
    expect(label(renderer)).toBe('Profile saved');

    await advance(DURATION);
    await advance(FADE);

    expect(label(renderer)).toBe('none');
    await unmount(renderer);
  });

  it('restarts the dismiss timer when a second message arrives', async () => {
    const renderer = await mount();
    await ReactTestRenderer.act(async () => {
      api?.showToast('first');
    });

    // Halfway through the first timer, show another message.
    await advance(DURATION / 2);
    await ReactTestRenderer.act(async () => {
      api?.showToast('second');
    });
    expect(label(renderer)).toBe('second');

    // The first timer would have fired by now; the second must still hold.
    await advance(DURATION / 2);
    expect(label(renderer)).toBe('second');

    await advance(DURATION);
    await advance(FADE);
    expect(label(renderer)).toBe('none');
    await unmount(renderer);
  });

  it('does not set state after unmount', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const renderer = await mount();
    await ReactTestRenderer.act(async () => {
      api?.showToast('Engine started');
    });

    await unmount(renderer);
    await advance(DURATION + FADE);

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
