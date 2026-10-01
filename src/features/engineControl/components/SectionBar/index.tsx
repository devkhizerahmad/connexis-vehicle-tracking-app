// SectionBar (S6/S7) — dark maroon bar with the reference's diagonal red seam.
// The bar is always the rounded header of a white card, so the top corners are
// rounded by the component and the bottom corners are square.
import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ecColors } from '@shared/theme';
import { styles } from './styles';

export interface SectionBarProps {
  title: string;
  testID?: string;
}

function SectionBarImpl({ title, testID }: SectionBarProps) {
  return (
    <View style={styles.bar} testID={testID}>
      <LinearGradient
        colors={[ecColors.barDarkEdge, ecColors.barDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.darkFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[ecColors.barRedDeep, ecColors.barRedBright]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.redBlock}
        pointerEvents="none"
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export const SectionBar = React.memo(SectionBarImpl);
export default SectionBar;
