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