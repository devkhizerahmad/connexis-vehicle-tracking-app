// PlateStatusRow.tsx — 59% black plate | 41% green status (+check), height 44, contiguous
import React from 'react';
import { Text, View } from 'react-native';
import { CheckMark } from '@shared/components/icons';
import { colors } from '@shared/theme';
import { styles } from './styles';

export function PlateStatusRow({ plate, status }: { plate: string; status: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.blackSeg}>
        <Text style={styles.plateText} numberOfLines={1}>
          {plate}
        </Text>
      </View>
      <View style={styles.greenSeg}>
        <View style={styles.statusContent}>
          <CheckMark color={colors.white} size={16} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
    </View>
  );
}

export default PlateStatusRow;
