// MultiStopGradient.tsx — dependency-free multi-stop vertical gradient (interpolated bands)
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { GradientStop } from '@shared/types/common';
import {
  makeGradientContainerStyle,
  makeGradientStripStyle,
} from '@shared/utils/styleFactories';
import { sampleGradient } from '@shared/utils/color';
import { styles } from './styles';

/** Upper bound of rendered bands — keeps the band count bounded for tall headers. */
const MAX_BANDS = 64;

/** Extra height per band avoids sub-pixel seams between interpolated bands. */
const SEAM_OVERLAP = 0.6;

export function MultiStopGradient({
  height,
  stops,
}: {
  height: number;
  stops: readonly GradientStop[];
}): React.ReactElement {
  const bands = useMemo(() => {
    const count = Math.max(1, Math.min(Math.round(height), MAX_BANDS));
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(sampleGradient(stops, count === 1 ? 0 : i / (count - 1)));
    }
    return colors;
  }, [height, stops]);

  const bandHeight = height / bands.length + SEAM_OVERLAP;

  return (
    <View style={[styles.column, makeGradientContainerStyle(height)]}>
      {bands.map((color, i) => (
        <View key={i} style={makeGradientStripStyle(color, bandHeight)} />
      ))}
    </View>
  );
}

export default MultiStopGradient;