// SectionBar (S6/S7) — dark maroon bar with the reference's diagonal red seam.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): BOTH bars now render with
// ROUNDED TOP corners over an inset, rounded card. The PHASE-1 opt-in `edge`
// (sharp-cornered, toned-down) variant — built against the old flat
// "engine control.jpeg" — is removed with that design language.
//
// The reference's bars are a GLYPH + TITLE lockup: a white route/car glyph
// sits left of the title. The trailing white ">" that used to be pinned to the
// bar's right edge has been removed, so the title row runs to the bar's edge.
import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ecColors } from '@shared/theme';
import { styles } from './styles';

export interface SectionBarProps {
  title: string;
  /** Leading glyph (white on the dark base) — route icon, car glyph, … */
  icon?: React.ReactNode;
  testID?: string;
}

function SectionBarImpl({ title, icon, testID }: SectionBarProps) {
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
      {/* Content sits over both gradients and never swallows touches. */}
      <View style={styles.content} pointerEvents="none">
        {icon != null ? <View style={styles.iconSlot}>{icon}</View> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

export const SectionBar = React.memo(SectionBarImpl);
export default SectionBar;