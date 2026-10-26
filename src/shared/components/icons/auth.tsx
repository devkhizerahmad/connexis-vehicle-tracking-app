// auth.tsx — login/auth glyphs: envelope, eye, eye-off.
// Hand-drawn from View/Text primitives — no SVG runtime, no new deps.
import React, { memo } from 'react';
import { View } from 'react-native';
import { styleFactory } from './styles';
import type { IconProps } from './types';

const envelopeStyles = styleFactory((color, size) => ({
  root: { width: size, height: size * 0.78, alignItems: 'center', justifyContent: 'center' },
  body: {
    width: size,
    height: size * 0.62,
    borderWidth: size * 0.1,
    borderColor: color,
    borderRadius: size * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flap: {
    width: 0,
    height: 0,
    borderLeftWidth: size * 0.5,
    borderRightWidth: size * 0.5,
    borderBottomWidth: size * 0.32,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color,
    position: 'absolute',
    top: size * 0.08,
  },
}));

/** Envelope / mail — username input left icon. */
export const Envelope = memo(function EnvelopeImpl({ color, size }: IconProps) {
  const s = envelopeStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.body} />
      <View style={s.flap} />
    </View>
  );
});

const eyeStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
  outer: {
    width: size,
    height: size,
    borderWidth: size * 0.14,
    borderColor: color,
    borderRadius: size / 2,
  },
  pupil: {
    width: size * 0.36,
    height: size * 0.36,
    borderRadius: size * 0.18,
    backgroundColor: color,
  },
}));

/** Eye — password visible toggle. */
export const Eye = memo(function EyeImpl({ color, size }: IconProps) {
  const s = eyeStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.outer} />
      <View style={s.pupil} />
    </View>
  );
});

const eyeOffStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
  outer: {
    width: size,
    height: size,
    borderWidth: size * 0.14,
    borderColor: color,
    borderRadius: size / 2,
  },
  pupil: {
    width: size * 0.36,
    height: size * 0.36,
    borderRadius: size * 0.18,
    backgroundColor: color,
  },
  slash: {
    position: 'absolute',
    width: size * 1.42,
    height: size * 0.14,
    backgroundColor: color,
    transform: [{ rotate: '-45deg' }],
  },
}));

/** Eye-off — password hidden toggle. */
export const EyeOff = memo(function EyeOffImpl({ color, size }: IconProps) {
  const s = eyeOffStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.outer} />
      <View style={s.pupil} />
      <View style={s.slash} />
    </View>
  );
});