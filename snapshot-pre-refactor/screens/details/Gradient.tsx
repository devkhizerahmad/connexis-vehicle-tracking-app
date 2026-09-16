// Gradient.tsx — dependency-free vertical gradient built from interpolated strips
import React from 'react';
import {View} from 'react-native';
import {C} from '../../theme/detailsTokens';

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function VerticalGradient({
  height,
  top = C.gradTop,
  bottom = C.gradBottom,
}: {
  height: number;
  top?: string;
  bottom?: string;
}): React.ReactElement {
  const steps = Math.min(height, 64);
  const [r1, g1, b1] = hexToRgb(top);
  const [r2, g2, b2] = hexToRgb(bottom);
  const rows: React.ReactElement[] = [];
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    rows.push(
      <View
        key={i}
        style={{
          height: height / steps + 0.6,
          backgroundColor: `rgb(${r},${g},${b})`,
        }}
      />,
    );
  }
  return <View style={{height, width: '100%', overflow: 'hidden'}}>{rows}</View>;
}
