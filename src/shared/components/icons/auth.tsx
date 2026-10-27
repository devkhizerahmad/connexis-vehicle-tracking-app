// auth.tsx — login/auth glyphs: envelope, lock, eye, eye-off.
// Hand-drawn from View/Text primitives — no SVG runtime, no new deps.
//
// Geometry notes (fixed in the login repair pass):
// - `Lock` is now an OUTLINE padlock (shackle arc + stroked body + keyhole),
//   matching the reference instead of the previous solid red block.
// - `Eye` / `EyeOff` are built from two half-ellipse ARCS that meet at pointed
//   tips, so they read as an almond/lens — the previous single rounded View was
//   a capsule (borderRadius clamps to an ellipse), not an almond.
import React, { memo } from 'react';
import { View } from 'react-native';
import { styleFactory } from './styles';
import type { IconProps } from './types';

const envelopeStyles = styleFactory((color, size) => {
  const stroke = Math.max(1.3, size * 0.09);
  const barW = size * 0.45;
  return {
    root: { width: size, height: size * 0.78, alignItems: 'center', justifyContent: 'center' },
    body: {
      position: 'absolute',
      top: size * 0.03,
      width: size,
      height: size * 0.72,
      borderWidth: stroke,
      borderColor: color,
      borderRadius: size * 0.1,
    },
    // Two short bars form the folded flap "V" inside the body outline.
    flapLeft: {
      position: 'absolute',
      width: barW,
      height: stroke,
      borderRadius: stroke / 2,
      backgroundColor: color,
      top: size * 0.34 - stroke / 2,
      left: size * 0.085,
      transform: [{ rotate: '32deg' }],
    },
    flapRight: {
      position: 'absolute',
      width: barW,
      height: stroke,
      borderRadius: stroke / 2,
      backgroundColor: color,
      top: size * 0.34 - stroke / 2,
      left: size * 0.465,
      transform: [{ rotate: '-32deg' }],
    },
  };
});

/** Envelope / mail — username input left icon. */
export const Envelope = memo(function EnvelopeImpl({ color, size }: IconProps) {
  const s = envelopeStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.body} />
      <View style={s.flapLeft} />
      <View style={s.flapRight} />
    </View>
  );
});

const lockStyles = styleFactory((color, size) => {
  const stroke = Math.max(1.5, size * 0.09);
  return {
    root: { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
    shackle: {
      width: size * 0.5,
      height: size * 0.36,
      borderWidth: stroke,
      borderBottomWidth: 0,
      borderColor: color,
      borderTopLeftRadius: size * 0.25,
      borderTopRightRadius: size * 0.25,
      marginBottom: -stroke,
    },
    body: {
      width: size * 0.76,
      height: size * 0.5,
      borderWidth: stroke,
      borderColor: color,
      borderRadius: size * 0.13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    keyhole: {
      width: size * 0.1,
      height: size * 0.18,
      borderRadius: size * 0.05,
      backgroundColor: color,
    },
  };
});

/** Lock — password input left icon (outlined body + shackle arc + keyhole). */
export const Lock = memo(function LockImpl({ color, size }: IconProps) {
  const s = lockStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.shackle} />
      <View style={s.body}>
        <View style={s.keyhole} />
      </View>
    </View>
  );
});

/**
 * Two arcs sharing their tips build the almond outline:
 * an upper arch (rounded top corners, no bottom border) and its mirrored lower
 * arch, offset by exactly the arch height so the four tips coincide.
 */
const eyeGeometry = (color: string, size: number) => {
  const stroke = Math.max(1.4, size * 0.1);
  const archH = size * 0.34;
  const arch: object = {
    position: 'absolute',
    width: size,
    height: archH,
    borderColor: color,
    borderWidth: stroke,
  };
  return {
    stroke,
    archH,
    arch,
  };
};

const eyeStyles = styleFactory((color, size) => {
  const { stroke, archH, arch } = eyeGeometry(color, size);
  return {
    root: { width: size, height: archH * 2, alignItems: 'center', justifyContent: 'center' },
    topArc: {
      ...arch,
      top: 0,
      borderBottomWidth: 0,
      borderTopLeftRadius: size,
      borderTopRightRadius: size,
    },
    bottomArc: {
      ...arch,
      top: archH,
      borderTopWidth: 0,
      borderBottomLeftRadius: size,
      borderBottomRightRadius: size,
    },
    pupil: {
      position: 'absolute',
      width: size * 0.24,
      height: size * 0.24,
      borderRadius: size * 0.12,
      backgroundColor: color,
      borderWidth: stroke * 0.5,
      borderColor: color,
    },
  };
});

/** Eye — password visible toggle (almond outline + centre pupil). */
export const Eye = memo(function EyeImpl({ color, size }: IconProps) {
  const s = eyeStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.topArc} />
      <View style={s.bottomArc} />
      <View style={s.pupil} />
    </View>
  );
});

const eyeOffStyles = styleFactory((color, size) => {
  const { stroke, archH, arch } = eyeGeometry(color, size);
  return {
    root: {
      width: size,
      height: archH * 2,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    topArc: {
      ...arch,
      top: 0,
      borderBottomWidth: 0,
      borderTopLeftRadius: size,
      borderTopRightRadius: size,
    },
    bottomArc: {
      ...arch,
      top: archH,
      borderTopWidth: 0,
      borderBottomLeftRadius: size,
      borderBottomRightRadius: size,
    },
    pupil: {
      position: 'absolute',
      width: size * 0.24,
      height: size * 0.24,
      borderRadius: size * 0.12,
      backgroundColor: color,
    },
    slash: {
      position: 'absolute',
      width: size * 1.12,
      height: stroke,
      borderRadius: stroke / 2,
      backgroundColor: color,
      transform: [{ rotate: '-45deg' }],
    },
  };
});

/** Eye-off — password hidden toggle (almond + diagonal slash). */
export const EyeOff = memo(function EyeOffImpl({ color, size }: IconProps) {
  const s = eyeOffStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.topArc} />
      <View style={s.bottomArc} />
      <View style={s.pupil} />
      <View style={s.slash} />
    </View>
  );
});
