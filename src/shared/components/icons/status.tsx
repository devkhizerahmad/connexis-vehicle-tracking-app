// status.tsx — status semantics: filled alert/check circles, sad face, alert
// ring, warning triangle and the red circle-play rune.
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { colors } from '@shared/theme';
import { styleFactory } from './styles';
import type { IconProps } from './types';

const circleGlyphStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    color: colors.white,
    fontSize: size * 0.58,
    fontWeight: '800',
    lineHeight: size * 0.68,
    textAlign: 'center',
  },
}));

/**
 * Filled circle with a rune inside. Private on purpose: only `AlertCircle` and
 * `CheckCircle` use it, and both keep the default white rune, so the old
 * `glyphColor` escape hatch is gone with the public export.
 */
const CircleGlyph = memo(function CircleGlyphImpl({
  color,
  size,
  glyph,
}: IconProps & { glyph: string }) {
  const s = circleGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <Text style={s.glyph}>{glyph}</Text>
    </View>
  );
});

export const AlertCircle = memo(function AlertCircleImpl({ color, size }: IconProps) {
  return <CircleGlyph color={color} size={size} glyph="!" />;
});

export const CheckCircle = memo(function CheckCircleImpl({ color, size }: IconProps) {
  return <CircleGlyph color={color} size={size} glyph="✓" />;
});

const sadFaceStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size,
    borderWidth: size * 0.09,
    borderColor: color,
    borderRadius: size / 2,
    alignItems: 'center',
  },
  eyes: { flexDirection: 'row', marginTop: size * 0.24 },
  eye: {
    width: size * 0.09,
    height: size * 0.09,
    borderRadius: size * 0.05,
    backgroundColor: color,
    marginHorizontal: size * 0.13,
  },
  mouth: {
    width: size * 0.4,
    height: size * 0.2,
    borderWidth: size * 0.08,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color,
    borderBottomLeftRadius: size * 0.2,
    borderBottomRightRadius: size * 0.2,
    marginTop: size * 0.1,
    transform: [{ rotate: '180deg' }],
  },
}));

export const SadFace = memo(function SadFaceImpl({ color, size }: IconProps) {
  const s = sadFaceStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.eyes}>
        <View style={s.eye} />
        <View style={s.eye} />
      </View>
      <View style={s.mouth} />
    </View>
  );
});

const alertRingStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: Math.max(1.5, size * 0.11),
    borderColor: color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    color,
    fontSize: size * 0.62,
    fontWeight: '800',
    lineHeight: size * 0.72,
    textAlign: 'center',
  },
}));

/** Engine Control S3: OUTLINED alert ring (red/amber ring + "!"). */
export const AlertRing = memo(function AlertRingImpl({ color, size }: IconProps) {
  const s = alertRingStyles(color, size);
  return (
    <View style={s.root}>
      <Text style={s.glyph}>!</Text>
    </View>
  );
});

const warningTriangleStyles = styleFactory((color, size) => ({
  glyph: { color, fontSize: size, lineHeight: size * 1.2, textAlign: 'center' },
}));

/** Warning triangle — No Data summary card. */
export const WarningTriangle = memo(function WarningTriangleImpl({ color, size }: IconProps) {
  const s = warningTriangleStyles(color, size);
  return <Text style={s.glyph}>⚠</Text>;
});

const circlePlayStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: { color: colors.white, fontSize: size * 0.44, lineHeight: size * 0.5, marginLeft: size * 0.06 },
}));

/** PATCH HOME/H-D: red circle-play glyph — "Last Location" row on AssetCard. */
export const CirclePlay = memo(function CirclePlayImpl({ color, size }: IconProps) {
  const s = circlePlayStyles(color, size);
  return (
    <View style={s.root}>
      <Text style={s.glyph}>▶</Text>
    </View>
  );
});
