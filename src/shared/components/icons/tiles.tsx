// tiles.tsx — the `TileIcon` dispatcher used by the sensor/status tile strips,
// plus the tile-only drawings ("tank", "wind", "leaf") it can select.
import React, { memo } from 'react';
import { View } from 'react-native';
import { Ruler } from './primitives';
import { Droplet, Shield, Speedo, Thermo } from './vehicle';
import { styleFactory } from './styles';
import type { IconProps } from './types';

/*
 * The three glyphs below are dispatch targets of `TileIcon` only: the tile keys
 * "tank", "wind" and "leaf" come from the mock data, so these drawings stay in
 * the module but are intentionally not part of the public icon surface.
 */

const tankStyles = styleFactory((color, size) => ({
  root: {
    width: size * 0.8,
    height: size * 0.9,
    borderWidth: size * 0.1,
    borderColor: color,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: size * 0.06,
  },
  fill: { width: size * 0.5, height: size * 0.1, backgroundColor: color, borderRadius: 1 },
}));

const Tank = memo(function TankImpl({ color, size }: IconProps) {
  const s = tankStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.fill} />
    </View>
  );
});

const windStyles = styleFactory((color, size) => {
  /** One streak; only the width differs, so the shared props stay in one place. */
  const streak = { height: size * 0.09, backgroundColor: color, borderRadius: 1 };
  return {
    root: {
      width: size,
      height: size * 0.8,
      justifyContent: 'space-between',
      marginTop: size * 0.08,
    },
    streakLong: { ...streak, width: size },
    streakMid: { ...streak, width: size * 0.72 },
    streakShort: { ...streak, width: size * 0.88 },
  };
});

const Wind = memo(function WindImpl({ color, size }: IconProps) {
  const s = windStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.streakLong} />
      <View style={s.streakMid} />
      <View style={s.streakShort} />
    </View>
  );
});

const leafStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
  shape: {
    width: size * 0.66,
    height: size * 0.66,
    borderWidth: size * 0.1,
    borderColor: color,
    borderBottomLeftRadius: size * 0.5,
    borderTopRightRadius: size * 0.5,
    transform: [{ rotate: '45deg' }],
  },
}));

const Leaf = memo(function LeafImpl({ color, size }: IconProps) {
  const s = leafStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.shape} />
    </View>
  );
});

export const TileIcon = memo(function TileIconImpl({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) {
  switch (name) {
    case 'gauge':
      return <Speedo color={color} size={size} />;
    case 'droplet':
      return <Droplet color={color} size={size} />;
    case 'shield':
      return <Shield color={color} size={size} />;
    case 'tank':
      return <Tank color={color} size={size} />;
    case 'ruler':
      return <Ruler color={color} size={size} />;
    case 'thermo':
      return <Thermo color={color} size={size} />;
    case 'wind':
      return <Wind color={color} size={size} />;
    case 'leaf':
      return <Leaf color={color} size={size} />;
    default:
      return <Droplet color={color} size={size} />;
  }
});
