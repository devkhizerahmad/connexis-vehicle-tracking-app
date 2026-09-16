// profileService.ts — Profile data service (mock today, API ready signature)
import profileMock from '@features/profile/mocks/profile.mock.json';
import {
  Profile,
  ProfilePayload,
  ProfileUpdateResult,
} from '@features/profile/types/profile';

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    return (profileMock as unknown) as Profile;
  },

  /** Stub: resolves the payload unchanged until the real endpoint exists. */
  updateProfile: async (payload: ProfilePayload): Promise<ProfileUpdateResult> => {
    return { ok: true, payload };
  },
};