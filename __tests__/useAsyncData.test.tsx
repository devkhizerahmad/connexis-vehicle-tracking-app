// useAsyncData.test.tsx — M31 contract for the shared async-load lifecycle.
//
// What must stay true, because six screens now depend on it:
//   * a resolved loader fills `data` and clears `loading`,
//   * a rejected loader fills `error` and clears `loading`,
//   * `retry()` runs the loader again and clears the previous error,
//   * changing `key` refetches, and a late response for the OLD key is dropped
//     (this is the out-of-order race the old per-screen flags missed),
//   * a synchronous throw settles instead of crashing the effect,
//   * unmounting mid-flight never sets state.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { useAsyncData, type UseAsyncDataResult } from '../src/shared/hooks/useAsyncData';

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
};

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

let api: UseAsyncDataResult<string> | null = null;

function Harness({ loader, loadKey }: { loader: () => Promise<string>; loadKey: string }) {
  const value = useAsyncData(loader, loadKey);
  api = value;
  const state = value.loading ? 'loading' : value.error ? `error:${value.error.message}` : `data:${value.data ?? ''}`;
  return <Text>{state}</Text>;
}

async function mount(loader: () => Promise<string>, loadKey = 'a') {
  let instance: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    instance = ReactTestRenderer.create(<Harness loader={loader} loadKey={loadKey} />);
  });
  if (!instance) {
    throw new Error('Harness did not mount');
  }
  return instance;
}

async function rerender(instance: ReactTestRenderer.ReactTestRenderer, loader: () => Promise<string>, loadKey: string) {
  await ReactTestRenderer.act(async () => {
    instance.update(<Harness loader={loader} loadKey={loadKey} />);
  });
}

function label(instance: ReactTestRenderer.ReactTestRenderer): string {
  return instance.root.findAllByType(Text)[0].props.children as string;
}

async function unmount(instance: ReactTestRenderer.ReactTestRenderer) {
  await ReactTestRenderer.act(async () => {
    instance.unmount();
  });
}

describe('useAsyncData', () => {
  it('starts loading, then shows the payload', async () => {
    const first = deferred<string>();
    const loader = jest.fn(() => first.promise);
    const renderer = await mount(loader);

    expect(label(renderer)).toBe('loading');

    await ReactTestRenderer.act(async () => {
      first.resolve('vehicles');
    });

    expect(label(renderer)).toBe('data:vehicles');
    expect(loader).toHaveBeenCalledTimes(1);
    await unmount(renderer);
  });

  it('normalises a rejection into an Error', async () => {
    const first = deferred<string>();
    const renderer = await mount(() => first.promise);

    await ReactTestRenderer.act(async () => {
      first.reject(new Error('network down'));
    });

    expect(label(renderer)).toBe('error:network down');
    await unmount(renderer);
  });

  it('settles when the loader throws synchronously', async () => {
    const loader = () => {
      throw new Error('boom');
    };
    const renderer = await mount(loader);

    expect(label(renderer)).toBe('error:boom');
    await unmount(renderer);
  });

  it('retry() refetches and clears the previous error', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const loader = jest.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const renderer = await mount(loader);

    await ReactTestRenderer.act(async () => {
      first.reject(new Error('first failed'));
    });
    expect(label(renderer)).toBe('error:first failed');

    await ReactTestRenderer.act(async () => {
      api?.retry();
    });
    expect(label(renderer)).toBe('loading');

    await ReactTestRenderer.act(async () => {
      second.resolve('recovered');
    });

    expect(label(renderer)).toBe('data:recovered');
    expect(loader).toHaveBeenCalledTimes(2);
    await unmount(renderer);
  });

  it('keeps the previous data while a refetch is in flight', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const loader = jest.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const renderer = await mount(loader);

    await ReactTestRenderer.act(async () => {
      first.resolve('old');
    });
    expect(label(renderer)).toBe('data:old');

    await ReactTestRenderer.act(async () => {
      api?.retry();
    });

    // loading is true, but the old payload is still exposed to the screen.
    expect(api?.data).toBe('old');
    await ReactTestRenderer.act(async () => {
      second.resolve('new');
    });
    expect(label(renderer)).toBe('data:new');
    await unmount(renderer);
  });

  it('refetches on key change and drops the stale response', async () => {
    const stale = deferred<string>();
    const fresh = deferred<string>();
    const loader = jest.fn().mockReturnValueOnce(stale.promise).mockReturnValueOnce(fresh.promise);

    const renderer = await mount(loader, 'LFA-1464');
    await rerender(renderer, loader, 'LZA-8735');

    // The old request resolves after the new key is already active.
    await ReactTestRenderer.act(async () => {
      stale.resolve('old vehicle');
    });
    expect(label(renderer)).toBe('loading');

    await ReactTestRenderer.act(async () => {
      fresh.resolve('new vehicle');
    });
    expect(label(renderer)).toBe('data:new vehicle');
    expect(loader).toHaveBeenCalledTimes(2);
    await unmount(renderer);
  });

  it('does not set state after unmount', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const first = deferred<string>();
    const renderer = await mount(() => first.promise);

    await unmount(renderer);
    await ReactTestRenderer.act(async () => {
      first.resolve('too late');
    });

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
