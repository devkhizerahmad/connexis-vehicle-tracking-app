// map.tsx — map-surface glyphs: route, stop, flag, fence, group, geofence and
// the teardrop pin used as a map marker.
import React, { memo } from 'react';
import { View } from 'react-native';
import { colors } from '@shared/theme';
import { styleFactory } from './styles';
import type { IconProps } from './types';

const routeIconStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center', justifyContent: 'space-between' },
  start: {
    width: size * 0.32,
    height: size * 0.32,
    borderRadius: size * 0.16,
    backgroundColor: color,
  },
  connector: { width: size * 0.12, flex: 1, backgroundColor: color },
  end: {
    width: size * 0.32,
    height: size * 0.32,
    borderRadius: size * 0.16,
    borderWidth: size * 0.1,
    borderColor: color,
  },
}));

export const RouteIcon = memo(function RouteIconImpl({ color, size }: IconProps) {
  const s = routeIconStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.start} />
      <View style={s.connector} />
      <View style={s.end} />
    </View>
  );
});

const stopSignStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: size * 0.22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: { width: size * 0.5, height: size * 0.16, backgroundColor: colors.white, borderRadius: 1 },
}));

export const StopSign = memo(function StopSignImpl({ color, size }: IconProps) {
  const s = stopSignStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.bar} />
    </View>
  );
});

const flagIconStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, flexDirection: 'row' },
  pole: { width: size * 0.09, height: size, backgroundColor: color, borderRadius: 1 },
  flag: {
    width: size * 0.6,
    height: size * 0.55,
    backgroundColor: color,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: size * 0.1,
  },
}));

export const FlagIcon = memo(function FlagIconImpl({ color, size }: IconProps) {
  const s = flagIconStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.pole} />
      <View style={s.flag} />
    </View>
  );
});

const fenceStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, justifyContent: 'space-between' },
  rail: { height: size * 0.1, width: size, backgroundColor: color, borderRadius: 1 },
  posts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingTop: size * 0.06,
  },
  post: {
    width: size * 0.14,
    backgroundColor: color,
    borderRadius: 1,
    flex: 1,
    marginHorizontal: 1,
  },
}));

export const Fence = memo(function FenceImpl({ color, size }: IconProps) {
  const s = fenceStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.rail} />
      <View style={s.posts}>
        {[0, 1, 2].map(i => (
          <View key={i} style={s.post} />
        ))}
      </View>
    </View>
  );
});

const groupStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center' },
  heads: { flexDirection: 'row' },
  headLeft: {
    width: size * 0.28,
    height: size * 0.28,
    borderRadius: size * 0.14,
    backgroundColor: color,
    marginRight: -size * 0.08,
  },
  headRight: {
    width: size * 0.28,
    height: size * 0.28,
    borderRadius: size * 0.14,
    backgroundColor: color,
    marginLeft: -size * 0.08,
  },
  bodies: { flexDirection: 'row', marginTop: 1 },
  bodyLeft: {
    width: size * 0.34,
    height: size * 0.36,
    backgroundColor: color,
    borderTopLeftRadius: size * 0.17,
    borderTopRightRadius: size * 0.17,
    marginRight: -size * 0.1,
  },
  bodyRight: {
    width: size * 0.34,
    height: size * 0.36,
    backgroundColor: color,
    borderTopLeftRadius: size * 0.17,
    borderTopRightRadius: size * 0.17,
    marginLeft: -size * 0.1,
  },
}));

export const Group = memo(function GroupImpl({ color, size }: IconProps) {
  const s = groupStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.heads}>
        <View style={s.headLeft} />
        <View style={s.headRight} />
      </View>
      <View style={s.bodies}>
        <View style={s.bodyLeft} />
        <View style={s.bodyRight} />
      </View>
    </View>
  );
});

const teardropPinStyles = styleFactory((color, size) => ({
  root: { width: size, height: size * 1.25, alignItems: 'center' },
  head: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    borderWidth: Math.max(1.2, size * 0.08),
    borderColor: colors.white,
  },
  tail: {
    width: 0,
    height: 0,
    marginTop: -size * 0.16,
    borderLeftWidth: size * 0.26,
    borderRightWidth: size * 0.26,
    borderTopWidth: size * 0.36,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: color,
  },
}));

/** Engine Control S4 (F10): red teardrop map pin (circle head + triangular tail). */
export const TeardropPin = memo(function TeardropPinImpl({ color, size }: IconProps) {
  const s = teardropPinStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.head} />
      <View style={s.tail} />
    </View>
  );
});

const geofenceGlyphStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center', justifyContent: 'flex-start' },
  ring: {
    width: size * 0.44,
    height: size * 0.44,
    borderRadius: size * 0.22,
    borderWidth: Math.max(1.2, size * 0.09),
    borderColor: color,
    marginTop: size * 0.1,
  },
  dot: {
    marginTop: -size * 0.06,
    width: size * 0.2,
    height: size * 0.2,
    borderRadius: size * 0.1,
    backgroundColor: color,
  },
  boundary: {
    marginTop: size * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: size * 0.8,
  },
  dash: {
    width: size * 0.14,
    height: size * 0.08,
    backgroundColor: color,
    borderRadius: size * 0.04,
  },
}));

/** Reports S7–S9: geofence glyph (location pin over a dashed boundary). */
export const GeofenceGlyph = memo(function GeofenceGlyphImpl({ color, size }: IconProps) {
  const s = geofenceGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.ring} />
      <View style={s.dot} />
      <View style={s.boundary}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={s.dash} />
        ))}
      </View>
    </View>
  );
});
