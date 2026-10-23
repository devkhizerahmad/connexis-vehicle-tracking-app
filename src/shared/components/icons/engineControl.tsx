// engineControl.tsx — Engine Control glyphs: padlocks, support headset, camera
// lock, external link and the shield-with-check chip glyph.
import React, { memo } from 'react';
import { View } from 'react-native';
import { styleFactory } from './styles';
import type { IconProps } from './types';

const lockGlyphStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center' },
  shackle: {
    width: size * 0.5,
    height: size * 0.42,
    borderWidth: Math.max(1.5, size * 0.1),
    borderBottomWidth: 0,
    borderColor: color,
    borderTopLeftRadius: size * 0.25,
    borderTopRightRadius: size * 0.25,
    marginTop: size * 0.04,
  },
  body: {
    width: size * 0.8,
    height: size * 0.5,
    backgroundColor: color,
    borderRadius: size * 0.12,
    marginTop: -size * 0.06,
  },
}));

/** Engine Control S8: closed padlock (shackle up + body). */
export const LockGlyph = memo(function LockGlyphImpl({ color, size }: IconProps) {
  const s = lockGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.shackle} />
      <View style={s.body} />
    </View>
  );
});

const unlockGlyphStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'flex-end' },
  shackle: {
    width: size * 0.5,
    height: size * 0.42,
    borderWidth: Math.max(1.5, size * 0.1),
    borderBottomWidth: 0,
    borderColor: color,
    borderTopLeftRadius: size * 0.25,
    borderTopRightRadius: size * 0.25,
    marginRight: size * 0.1,
    marginTop: size * 0.04,
  },
  body: {
    width: size * 0.8,
    height: size * 0.5,
    backgroundColor: color,
    borderRadius: size * 0.12,
    marginTop: -size * 0.06,
  },
}));

/** Engine Control S8: open padlock (shackle lifted clear of the body). */
export const UnlockGlyph = memo(function UnlockGlyphImpl({ color, size }: IconProps) {
  const s = unlockGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.shackle} />
      <View style={s.body} />
    </View>
  );
});

const supportGlyphStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center' },
  band: {
    width: size * 0.62,
    height: size * 0.34,
    borderWidth: Math.max(1.5, size * 0.1),
    borderBottomWidth: 0,
    borderColor: color,
    borderTopLeftRadius: size * 0.34,
    borderTopRightRadius: size * 0.34,
    marginTop: size * 0.08,
  },
  cups: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: size * 0.86,
    marginTop: -size * 0.02,
  },
  cup: { width: size * 0.22, height: size * 0.38, borderRadius: size * 0.08, backgroundColor: color },
  mic: {
    width: size * 0.34,
    height: size * 0.18,
    borderBottomWidth: Math.max(1.5, size * 0.1),
    borderLeftWidth: Math.max(1.5, size * 0.1),
    borderColor: color,
    borderBottomLeftRadius: size * 0.16,
    marginTop: -size * 0.06,
    marginLeft: size * 0.2,
  },
}));

/** Engine Control S12: support headset (band + two ear cups). */
export const SupportGlyph = memo(function SupportGlyphImpl({ color, size }: IconProps) {
  const s = supportGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.band} />
      <View style={s.cups}>
        <View style={s.cup} />
        <View style={s.cup} />
      </View>
      <View style={s.mic} />
    </View>
  );
});

const cameraLockGlyphStyles = styleFactory((color, size) => {
  const ring = Math.max(1.2, size * 0.1);
  return {
    root: {
      width: size,
      height: size,
      borderWidth: ring,
      borderColor: color,
      borderRadius: size * 0.22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lens: {
      width: size * 0.44,
      height: size * 0.44,
      borderWidth: ring,
      borderColor: color,
      borderRadius: size * 0.22,
    },
    shutter: {
      position: 'absolute',
      top: size * 0.14,
      right: size * 0.1,
      width: size * 0.18,
      height: size * 0.18,
      borderRadius: size * 0.09,
      backgroundColor: color,
    },
  };
});

/** Engine Control S2 (F3): camera-lock glyph — body + lens ring + shutter dot. */
export const CameraLockGlyph = memo(function CameraLockGlyphImpl({ color, size }: IconProps) {
  const s = cameraLockGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.lens} />
      <View style={s.shutter} />
    </View>
  );
});

const externalLinkGlyphStyles = styleFactory((color, size) => {
  const bar = Math.max(1.2, size * 0.11);
  return {
    root: { width: size, height: size, justifyContent: 'flex-end' },
    corner: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: size * 0.62,
      height: size * 0.62,
      borderTopWidth: bar,
      borderRightWidth: bar,
      borderColor: color,
    },
    arrow: {
      position: 'absolute',
      top: size * 0.1,
      right: size * 0.1,
      width: size * 0.42,
      height: bar,
      backgroundColor: color,
      transform: [{ rotate: '-45deg' }],
    },
    box: {
      width: size * 0.6,
      height: size * 0.6,
      marginRight: size * 0.14,
      marginBottom: size * 0.14,
      borderWidth: bar,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderColor: color,
    },
  };
});

/** Engine Control S2 (F3): open-in-new (external link) — box + diagonal arrow. */
export const ExternalLinkGlyph = memo(function ExternalLinkGlyphImpl({ color, size }: IconProps) {
  const s = externalLinkGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.corner} />
      <View style={s.arrow} />
      <View style={s.box} />
    </View>
  );
});

const shieldCheckGlyphStyles = styleFactory((color, size) => {
  const bar = Math.max(1.2, size * 0.11);
  return {
    root: { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
    shield: {
      width: size * 0.82,
      height: size * 0.9,
      borderWidth: bar,
      borderColor: color,
      borderTopLeftRadius: size * 0.16,
      borderTopRightRadius: size * 0.16,
      borderBottomLeftRadius: size * 0.4,
      borderBottomRightRadius: size * 0.4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    check: {
      width: size * 0.3,
      height: size * 0.16,
      borderLeftWidth: bar,
      borderBottomWidth: bar,
      borderColor: color,
      transform: [{ rotate: '-45deg' }],
      marginTop: -size * 0.12,
    },
  };
});

/** Engine Control S4 (F6): shield with a check — used by the "Current Fence" chip. */
export const ShieldCheckGlyph = memo(function ShieldCheckGlyphImpl({ color, size }: IconProps) {
  const s = shieldCheckGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.shield}>
        <View style={s.check} />
      </View>
    </View>
  );
});
