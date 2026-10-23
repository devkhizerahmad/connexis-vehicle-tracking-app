// primitives.tsx — the smallest shared glyphs: chevrons, pin, clock, tick,
// star, grid and ruler. No domain-specific meaning lives here.
import React, { memo } from 'react';
import { StyleSheet, Text, View, type TextStyle } from 'react-native';
import { colors } from '@shared/theme';
import { cachedSheet, styleFactory } from './styles';
import type { IconProps } from './types';

type ChevronDir = 'left' | 'right' | 'down';

/**
 * Chevron geometry depends on its direction and weight as well as colour and
 * size, so it is keyed on all four rather than going through `styleFactory`.
 */
const chevronSheet = (color: string, size: number, dir: ChevronDir, weight: TextStyle['fontWeight']) =>
  StyleSheet.create({
    glyph: {
      color,
      fontSize: dir === 'down' ? size + 2 : size + 4,
      fontWeight: weight,
      lineHeight: size + 6,
      textAlign: 'center',
      marginTop: dir === 'down' ? -size * 0.35 : 0,
    },
  });

const chevronStyles = (color: string, size: number, dir: ChevronDir, weight: TextStyle['fontWeight']) =>
  cachedSheet(`chevron|${color}|${size}|${dir}|${String(weight)}`, () =>
    chevronSheet(color, size, dir, weight),
  );

export const Chevron = memo(function ChevronImpl({
  dir = 'left',
  color = colors.white,
  size = 14,
  weight = '700',
}: {
  dir?: ChevronDir;
  color?: string;
  size?: number;
  /**
   * PHASE-1 ENGINE CONTROL (P8): the glyph's weight. Defaults to the original
   * '700', so every existing call site renders byte-identically; Engine Control
   * passes '400' for the thinner/lighter back chevron its reference shows.
   */
  weight?: TextStyle['fontWeight'];
}) {
  const s = chevronStyles(color, size, dir, weight);
  const glyph = dir === 'left' ? '❮' : dir === 'right' ? '❯' : '▾';
  return <Text style={s.glyph}>{glyph}</Text>;
});

const chevronDownStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
  arrow: {
    width: size * 0.55,
    height: size * 0.55,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: color,
    transform: [{ rotate: '45deg' }],
    marginTop: -size * 0.18,
  },
}));

/**
 * PATCH L5: V-shape chevron (down) — dropdown affordance. Dependency-free: two
 * borders on a rotated square. Added alongside `Chevron` (whose filled ▾ glyph is
 * left untouched so frozen Details/Profile dropdowns render byte-identically).
 */
export const ChevronDown = memo(function ChevronDownImpl({ color, size }: IconProps) {
  const s = chevronDownStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.arrow} />
    </View>
  );
});

const pinStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center' },
  head: {
    width: size * 0.62,
    height: size * 0.62,
    borderRadius: size * 0.31,
    backgroundColor: color,
    marginTop: size * 0.06,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: size * 0.2,
    borderRightWidth: size * 0.2,
    borderTopWidth: size * 0.3,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: color,
    marginTop: -size * 0.04,
  },
  eye: {
    position: 'absolute',
    top: size * 0.24,
    width: size * 0.24,
    height: size * 0.24,
    borderRadius: size * 0.12,
    backgroundColor: colors.white,
  },
}));

export const Pin = memo(function PinImpl({ color, size }: IconProps) {
  const s = pinStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.head} />
      <View style={s.tail} />
      <View style={s.eye} />
    </View>
  );
});

const clockStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size,
    borderWidth: size * 0.11,
    borderColor: color,
    borderRadius: size / 2,
  },
  handMinute: {
    width: size * 0.1,
    height: size * 0.26,
    backgroundColor: color,
    position: 'absolute',
    left: size * 0.44,
    top: size * 0.16,
  },
  handHour: {
    width: size * 0.2,
    height: size * 0.1,
    backgroundColor: color,
    position: 'absolute',
    left: size * 0.44,
    top: size * 0.42,
  },
}));

export const Clock = memo(function ClockImpl({ color, size }: IconProps) {
  const s = clockStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.handMinute} />
      <View style={s.handHour} />
    </View>
  );
});

const checkMarkStyles = styleFactory((color, size) => ({
  glyph: {
    color,
    fontSize: size,
    fontWeight: '800',
    lineHeight: size * 1.2,
    textAlign: 'center',
  },
}));

export const CheckMark = memo(function CheckMarkImpl({ color, size }: IconProps) {
  const s = checkMarkStyles(color, size);
  return <Text style={s.glyph}>✓</Text>;
});

const starStyles = styleFactory((color, size) => ({
  glyph: { color, fontSize: size, lineHeight: size * 1.2, textAlign: 'center' },
}));

/** Star — Premium bar. */
export const StarIcon = memo(function StarIconImpl({ color, size }: IconProps) {
  const s = starStyles(color, size);
  return <Text style={s.glyph}>★</Text>;
});

const gridStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cell: {
    width: size * 0.22,
    height: size * 0.22,
    backgroundColor: color,
    borderRadius: 1,
    margin: size * 0.055,
  },
}));

/** 3x3 grid — Total summary card. */
export const GridIcon = memo(function GridIconImpl({ color, size }: IconProps) {
  const s = gridStyles(color, size);
  return (
    <View style={s.root}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <View key={i} style={s.cell} />
      ))}
    </View>
  );
});

const rulerStyles = styleFactory((color, size) => ({
  root: {
    width: size * 0.34,
    height: size * 0.9,
    borderWidth: size * 0.1,
    borderColor: color,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tick: { width: size * 0.16, height: size * 0.06, backgroundColor: color },
}));

export const Ruler = memo(function RulerImpl({ color, size }: IconProps) {
  const s = rulerStyles(color, size);
  return (
    <View style={s.root}>
      {[0, 1, 2].map(i => (
        <View key={i} style={s.tick} />
      ))}
    </View>
  );
});
