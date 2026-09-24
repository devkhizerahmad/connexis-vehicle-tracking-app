// PromoBanner.tsx — S6: promo slot between vehicle cards (h119, brand blue)
// Man photo: src/assets/promo_man.png (copied from design references). The lavender/pink
// blobs + dark-blue quarter-circle are composed Views (no bitmap asset needed).
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { HomePromo } from '@features/home/types/home';
import { styles } from './styles';

export interface PromoBannerProps {
  promo: HomePromo;
  onMoreInfo: () => void;
}

export function PromoBanner({ promo, onMoreInfo }: PromoBannerProps) {
  return (
    <View style={styles.banner}>
      {/* left: 3-line title + More Info button */}
      <View style={styles.left}>
        <Text style={styles.title}>{promo.title}</Text>
        <Pressable style={styles.button} onPress={onMoreInfo}>
          <Text style={styles.buttonText}>{promo.buttonLabel}</Text>
        </Pressable>
      </View>
      {/* right: composed blobs + quarter circle + man photo */}
      <View style={styles.right}>
        <View style={styles.blobLavender} />
        <View style={styles.blobPink} />
        <View style={styles.quarterCircle} />
        <Image source={require('../../../../assets/promo_man.png')} style={styles.man} resizeMode="contain" />
      </View>
    </View>
  );
}

export default React.memo(PromoBanner);
