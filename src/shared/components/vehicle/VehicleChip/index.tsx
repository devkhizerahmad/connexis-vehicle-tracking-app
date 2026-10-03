// // VehicleChip index.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@shared/theme';
import { styles } from './styles';

interface VehicleChipProps {
  label: string;
  color?: string;
}

export const VehicleChip: React.FC<VehicleChipProps> = ({ label, color = colors.plateGreen }) => (
  <View style={[styles.chip, { backgroundColor: color }]}>
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

export default VehicleChip;
