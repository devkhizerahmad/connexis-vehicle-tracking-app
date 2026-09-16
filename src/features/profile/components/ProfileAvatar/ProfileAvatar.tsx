// ProfileAvatar.tsx — 80pt circular avatar straddling the header gradient edge
import React, { memo } from 'react';
import { Image, View } from 'react-native';
import { styles } from './styles';

/** Static asset: the avatar portrait cropped from the reference artboard
 *  (96px master, downscaled once by Android via resizeMethod="resize"). */
const AVATAR_SOURCE = require('../../../../assets/profile_avatar.png');

function ProfileAvatarBase() {
  return (
    <View style={styles.ring}>
      <Image source={AVATAR_SOURCE} style={styles.image} resizeMethod="resize" />
    </View>
  );
}

export const ProfileAvatar = memo(ProfileAvatarBase);
export default ProfileAvatar;