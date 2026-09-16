// ProfileHeader.tsx — thin wrapper: the single shared AppHeader with the
// Profile artboard configuration (100pt content band + profile gradient stops).
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
      gradientStops={profileTokens.gradientStops}
      showAvatar={false}
    />
  );
}

export default ProfileHeader;