// useAsyncData.ts — M31: the ONE async-load lifecycle for the app.
//
// Before this hook every screen invented its own fetch effect. Six files used
// three different cancellation idioms (`mounted`, `cancelled`, `alive`), and
// the drift was not cosmetic: a stale response could overwrite a newer one,
// and History fetched twice on mount (M9) because two effects raced on the
// same `setData`.
//
// Contract:
//   * one fetch on mount, one per `key` change, one per `retry()`;
//   * a response is dropped when its effect has been torn down (unmount or a
//     newer key), so out-of-order responses can never win;
//   * `loading` is true for every fetch, including a retry;
//   * `data` is kept while a refetch is in flight, so a retry does not blank
//     the screen the user is already looking at;
//   * `error` is cleared when a fetch starts.
//
// `key` is the dependency of the fetch (a vehicle id, a range string, a
// constant for a one-shot load). It is deliberately a primitive: passing an
// inline loader cannot retrigger the effect, and the caller cannot accidentally
// depend on a new object identity every render.
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAsyncDataResult<T> {
  /** Last successful payload; kept while a refetch is in flight. */
  data: T | null;
  /** True from the start of every fetch until it settles. */
  loading: boolean;
  /** Normalised failure from the latest fetch, or null. */
  error: Error | null;
  /** Re-run the fetch with the current key. */
  retry: () => void;
}

/** Normalise `unknown` rejections into a real Error. */
export function toError(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}

export function useAsyncData<T>(
  loader: () => Promise<T>,
  key: string | number | null | undefined = 'default',
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  // The loader is usually an inline arrow, so it must not be an effect
  // dependency. A ref keeps the effect keyed on the caller's primitive only.
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    let request: Promise<T>;
    try {
      request = loaderRef.current();
    } catch (reason: unknown) {
      // A loader that throws synchronously still has to settle the state.
      setError(toError(reason));
      setLoading(false);
      return undefined;
    }

    request.then(
      value => {
        if (cancelled) {
          return;
        }
        setData(value);
        setLoading(false);
      },
      (reason: unknown) => {
        if (cancelled) {
          return;
        }
        setError(toError(reason));
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [key, attempt]);

  const retry = useCallback(() => setAttempt(n => n + 1), []);

  return { data, loading, error, retry };
}

export default useAsyncData;
