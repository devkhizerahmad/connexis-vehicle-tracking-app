// profile.ts — Profile feature models
import { KeyboardTypeOptions } from 'react-native';

/** Editable profile fields (single source of truth for keys). */
export type ProfileFieldKey = 'firstName' | 'lastName' | 'dob' | 'email' | 'phone';

export interface Profile {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
}

/** Form state map — one entry per editable field. */
export type ProfileFormValues = Record<ProfileFieldKey, string>;

/** Update payload sent to the API (identical shape to Profile today). */
export type ProfilePayload = Profile;

export interface ProfileUpdateResult {
  ok: boolean;
  payload: ProfilePayload;
}

/** Declarative description of a single form row (labels are byte-exact). */
export interface ProfileFieldConfig {
  key: ProfileFieldKey;
  label: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  /** Divider is rendered AFTER rows 1-4 only (never after the last row). */
  dividerAfter: boolean;
}

/**
 * Rows in reference order. `dob` is intentionally empty in the mock so the
 * "YYYY-MM-DD" placeholder renders in the muted placeholder colour token.
 */
export const PROFILE_FIELDS: readonly ProfileFieldConfig[] = [
  { key: 'firstName', label: 'First Name', dividerAfter: true },
  { key: 'lastName', label: 'Last Name', dividerAfter: true },
  { key: 'dob', label: 'Date of Birth', placeholder: 'YYYY-MM-DD', dividerAfter: true },
  { key: 'email', label: 'Email Address', keyboardType: 'email-address', dividerAfter: true },
  { key: 'phone', label: 'Phone Number', keyboardType: 'phone-pad', dividerAfter: false },
];