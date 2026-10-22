// useProfile.ts — profile form state hook (per-field state map + stable setters)
import { useCallback, useEffect, useRef, useState } from 'react';
import { profileService } from '@features/profile/services/profileService';
import {
  Profile,
  ProfileFieldKey,
  ProfileFormValues,
  ProfileUpdateResult,
} from '@features/profile/types/profile';

const EMPTY_VALUES: ProfileFormValues = {
  firstName: '',
  lastName: '',
  dob: '',
  email: '',
  phone: '',
};

/**
 * Owns the profile form state map.
 *
 * Performance contract:
 * - `values` is the single source of truth (never derived state).
 * - `setField` and `save` are referentially stable so memoized field rows only
 *   re-render the row whose value actually changed.
 * - A ref mirrors `values` so `save` never needs to re-create a closure.
 */
export function useProfile() {
  const [values, setValues] = useState<ProfileFormValues>(EMPTY_VALUES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const valuesRef = useRef<ProfileFormValues>(EMPTY_VALUES);

  useEffect(() => {
    let mounted = true;
    setLoadError(null);
    profileService
      .getProfile()
      .then((profile: Profile) => {
        if (!mounted) {
          return;
        }
        const next: ProfileFormValues = {
          firstName: profile.firstName,
          lastName: profile.lastName,
          dob: profile.dob,
          email: profile.email,
          phone: profile.phone,
        };
        valuesRef.current = next;
        setValues(next);
        setLoading(false);
      })
      .catch((reason: unknown) => {
        if (!mounted) {
          return;
        }
        setLoadError(reason instanceof Error ? reason : new Error(String(reason)));
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const setField = useCallback((key: ProfileFieldKey, text: string) => {
    if (valuesRef.current[key] === text) {
      return;
    }
    const next: ProfileFormValues = { ...valuesRef.current, [key]: text };
    valuesRef.current = next;
    setValues(next);
  }, []);

  /**
   * Returns null when the update could not be performed, so the caller can
   * report failure instead of unconditionally claiming success (M6). `saving`
   * is always cleared, including on rejection.
   */
  const save = useCallback(async (): Promise<ProfileUpdateResult | null> => {
    setSaving(true);
    setSaveError(null);
    try {
      return await profileService.updateProfile({ ...valuesRef.current });
    } catch (reason) {
      setSaveError(reason instanceof Error ? reason : new Error(String(reason)));
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  return { values, setField, save, loading, saving, loadError, saveError };
}

export default useProfile;