// ProfileHeader.tsx — thin wrapper: the single shared AppHeader with the
// Profile configuration.
// PATCH I3: gradient now comes from the shared AppHeader (colors.gradientHeader);
// the per-feature gradientStops override was removed.
// TOP-HEADER STANDARD: the legacy contentHeight/contentCenterOffset geometry is
// RETIRED — every screen now uses the shared nav row (56dp, centre = inset + 28).
// Profile has no right-hand action, so the shared header's always-rendered 44dp
// right slot acts as the transparent spacer that keeps the title centred.
import React from 'react';
import AppHeader from '@shared/components/layout/AppHeader';

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
      showAvatar={false}
    />
  );
}

export default ProfileHeader;