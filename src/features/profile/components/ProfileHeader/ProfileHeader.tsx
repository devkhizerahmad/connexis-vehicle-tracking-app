// ProfileHeader.tsx — thin wrapper: the single shared AppHeader with the
// Profile configuration (100pt content band + lower title centre).
// PATCH I3: gradient now comes from the shared AppHeader (colors.gradientHeader);
// the per-feature gradientStops override was removed.
import React from 'react';
import AppHeader from '@shared/components/layout/AppHeader';
import { profileTokens } from '@shared/theme';

export function ProfileHeader({
  title = 'Profile',
  onBack,
}: {
  title?: string;
  onBack?: () => void;
}) {
  return (
    // LEGACY-EXCEPTION: frozen reference design (Profile) — contentHeight/contentCenterOffset
    // replicate the pre-K2 layout exactly (header = inset+100, title centre = inset+60).
    // DO NOT copy these props into new screens — use variant="standard"/"extended".
    <AppHeader
      title={title}
      onBack={onBack}
      contentHeight={profileTokens.size.headerBar}
      contentCenterOffset={profileTokens.size.headerCenterOffset}
      showAvatar={false}
    />
  );
}

export default ProfileHeader;