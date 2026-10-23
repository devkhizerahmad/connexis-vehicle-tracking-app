// reports.tsx — Reports-screen glyphs: clipboard, tile dispatcher, highway,
// share and the green add affordance.
import React, { memo } from 'react';
import { View } from 'react-native';
import { colors } from '@shared/theme';
import { DocIcon } from './navigation';
import { FlagIcon, Fence, Group } from './map';
import { Steering } from './vehicle';
import { styleFactory } from './styles';
import type { IconProps } from './types';

const clipboardStyles = styleFactory((color, size) => ({
  root: {
    width: size * 0.75,
    height: size,
    borderWidth: size * 0.09,
    borderColor: color,
    borderRadius: 2,
    alignItems: 'center',
  },
  clip: {
    width: size * 0.36,
    height: size * 0.16,
    backgroundColor: color,
    borderRadius: 1,
    marginTop: -size * 0.05,
  },
  lineFirst: { width: size * 0.4, height: size * 0.07, backgroundColor: color, marginTop: size * 0.14 },  lineSecond: { width: size * 0.4, height: size * 0.07, backgroundColor: color, marginTop: size * 0.08 },
}));

export const Clipboard = memo(function ClipboardImpl({ color, size }: IconProps) {
  const s = clipboardStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.clip} />
      <View style={s.lineFirst} />
      <View style={s.lineSecond} />
    </View>
  );
});

/*
 * Dispatch targets of `ReportIcon` only: the report keys "map" and "box" come
 * from the mock data, so these drawings stay in the module but are intentionally
 * not part of the public icon surface.
 */

const foldedMapStyles = styleFactory((color, size) => {
  const panel = {
    width: size * 0.26,
    height: size * 0.7,
    borderWidth: size * 0.09,
    borderColor: color,
    borderRadius: 1,
  };
  return {
    root: {
      width: size,
      height: size * 0.8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    left: { ...panel, borderRightWidth: 0, transform: [{ rotate: '-6deg' }] },
    right: { ...panel, borderRightWidth: 0, transform: [{ rotate: '6deg' }] },
    front: { ...panel, transform: [{ rotate: '-6deg' }] },
  };
});

const FoldedMap = memo(function FoldedMapImpl({ color, size }: IconProps) {
  const s = foldedMapStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.left} />
      <View style={s.right} />
      <View style={s.front} />
    </View>
  );
});

const boxIconStyles = styleFactory((color, size) => ({
  root: {
    width: size * 0.86,
    height: size * 0.7,
    borderWidth: size * 0.09,
    borderColor: color,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: size * 0.1,
  },
  band: { width: size * 0.5, height: size * 0.1, backgroundColor: color, borderRadius: 1 },
}));

const BoxIcon = memo(function BoxIconImpl({ color, size }: IconProps) {
  const s = boxIconStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.band} />
    </View>
  );
});

export const ReportIcon = memo(function ReportIconImpl({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) {
  switch (name) {
    case 'steering':
      return <Steering color={color} size={size} />;
    case 'flag':
      return <FlagIcon color={color} size={size} />;
    case 'fence':
      return <Fence color={color} size={size} />;
    case 'group':
      return <Group color={color} size={size} />;
    case 'map':
      return <FoldedMap color={color} size={size} />;
    case 'box':
      return <BoxIcon color={color} size={size} />;
    default:
      return <DocIcon color={color} size={size} />;
  }
});

const highwayGlyphStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: size * 0.08,
  },
  railLeft: {
    position: 'absolute',
    left: size * 0.16,
    top: 0,
    bottom: 0,
    width: size * 0.1,
    backgroundColor: color,
    borderRadius: size * 0.05,
  },
  railRight: {
    position: 'absolute',
    right: size * 0.16,
    top: 0,
    bottom: 0,
    width: size * 0.1,
    backgroundColor: color,
    borderRadius: size * 0.05,
  },
  dash: {
    width: size * 0.12,
    height: size * 0.16,
    backgroundColor: color,
    borderRadius: size * 0.04,
  },
}));

/** Reports S7–S9: road/highway glyph (two rails + a centre divider). */
export const HighwayGlyph = memo(function HighwayGlyphImpl({ color, size }: IconProps) {
  const s = highwayGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.railLeft} />
      <View style={s.railRight} />
      {[0, 1, 2].map(i => (
        <View key={i} style={s.dash} />
      ))}
    </View>
  );
});

const shareGlyphStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: size * 0.24,
    height: size * 0.24,
    borderRadius: size * 0.12,
    backgroundColor: color,
  },
  rail: {
    flex: 1,
    height: Math.max(1, size * 0.1),
    marginHorizontal: size * 0.06,
    backgroundColor: color,
  },
}));

/** Reports S7–S9: share glyph (three dots joined by two rails). */
export const ShareGlyph = memo(function ShareGlyphImpl({ color, size }: IconProps) {
  const s = shareGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.row}>
        <View style={s.dot} />
        <View style={s.rail} />
        <View style={s.dot} />
      </View>
      <View style={s.row}>
        <View style={s.dot} />
        <View style={s.rail} />
      </View>
    </View>
  );
});

const plusCircleGlyphStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    position: 'absolute',
    width: size * 0.5,
    height: Math.max(1.4, size * 0.12),
    borderRadius: size * 0.06,
    backgroundColor: colors.white,
  },
  vertical: {
    position: 'absolute',
    height: size * 0.5,
    width: Math.max(1.4, size * 0.12),
    borderRadius: size * 0.06,
    backgroundColor: colors.white,
  },
}));

/** Reports S7–S9: green circular "+" affordance (bottom-right of a tile body). */
export const PlusCircleGlyph = memo(function PlusCircleGlyphImpl({ color, size }: IconProps) {
  const s = plusCircleGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.horizontal} />
      <View style={s.vertical} />
    </View>
  );
});
