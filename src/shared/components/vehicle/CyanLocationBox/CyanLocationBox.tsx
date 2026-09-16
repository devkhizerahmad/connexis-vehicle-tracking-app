// CyanLocationBox.tsx — 56% wide cyan overlay box, auto height, hangs below card bottom
import React from 'react';
import { Text, View } from 'react-native';
import { ArrowCircle } from '@shared/components/icons';
import { colors } from '@shared/theme';
import { styles } from './styles';

interface CyanLocationBoxProps {
  lastLocationLabel: string;
  location: string;
  onCyanHeight?: (h: number) => void;
}

export const CyanLocationBox: React.FC<CyanLocationBoxProps> = ({
  lastLocationLabel,
  location,
  onCyanHeight,
}) => (
  <View
    pointerEvents="none"
    onLayout={e => onCyanHeight?.(e.nativeEvent.layout.height)}
    style={styles.cyanBox}>
    <ArrowCircle color={colors.cyanText} size={14} />
    <View style={styles.content}>
      <Text style={styles.title}>{lastLocationLabel}</Text>
      <Text style={styles.locationText}>{location}</Text>
    </View>
  </View>
);

export default CyanLocationBox;
