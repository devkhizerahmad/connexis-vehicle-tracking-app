// SectionBar (S6/S7) — dark maroon bar with the reference's diagonal red seam.
//
// PHASE-1 (P7) adds an OPT-IN `edge` variant so "Driving Routes" can render with
// SHARP top corners and a toned-down red swoosh while the Phase-2 "Control
// Vehicle" bar keeps rendering exactly as before. `edge` is absent by default, so
// ControlRows (S7) is byte-identical to its previous output.
import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ecColors } from '@shared/theme';
import { styles } from './styles';

export interface SectionBarProps {
  title: string;
  testID?: string;
  /**
   * PHASE-1 (P7): flat/sharp variant for the Phase-1 "Driving Routes" bar —
   * square top corners (the card is flat and edge-to-edge below it) and a much
   * smaller red swoosh. Omit for the Phase-2 rounded, full-swoosh bar.
   */
  edge?: boolean;
}

function SectionBarImpl({ title, testID, edge }: SectionBarProps) {
  return (
    <View style={[styles.bar, edge ? styles.barEdge : null]} testID={testID}>
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
        style={edge ? styles.redBlockEdge : styles.redBlock}
        pointerEvents="none"
      />
      <Text style={[styles.title, edge ? styles.titleEdge : null]}>{title}</Text>
    </View>
  );
}

export const SectionBar = React.memo(SectionBarImpl);
export default SectionBar;