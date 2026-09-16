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
  const valuesRef = useRef<ProfileFormValues>(EMPTY_VALUES);

  useEffect(() => {
    let mounted = true;
    profileService.getProfile().then((profile: Profile) => {
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

  const save = useCallback(async (): Promise<ProfileUpdateResult> => {
    setSaving(true);
    const result = await profileService.updateProfile({ ...valuesRef.current });
    setSaving(false);
    return result;
  }, []);

  return { values, setField, save, loading, saving };
}

export default useProfile;