// navigation.tsx — bottom-tab glyphs and the arrow runes used for links,
// breadcrumbs and map banners.
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { colors } from '@shared/theme';
import { styleFactory } from './styles';
import type { IconProps } from './types';

const homeIconStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center' },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: size * 0.5,
    borderRightWidth: size * 0.5,
    borderBottomWidth: size * 0.36,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color,
  },
  body: {
    width: size * 0.72,
    height: size * 0.44,
    backgroundColor: color,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  door: {
    width: size * 0.2,
    height: size * 0.26,
    backgroundColor: colors.white,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
}));

export const HomeIcon = memo(function HomeIconImpl({ color, size }: IconProps) {
  const s = homeIconStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.roof} />
      <View style={s.body}>
        <View style={s.door} />
      </View>
    </View>
  );
});

const docIconStyles = styleFactory((color, size) => ({
  root: {
    width: size * 0.72,
    height: size * 0.92,
    borderWidth: size * 0.09,
    borderColor: color,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: size * 0.08,
  },
  line: { width: size * 0.4, height: size * 0.07, backgroundColor: color, borderRadius: 1 },
}));

export const DocIcon = memo(function DocIconImpl({ color, size }: IconProps) {
  const s = docIconStyles(color, size);
  return (
    <View style={s.root}>
      {[0, 1, 2].map(i => (
        <View key={i} style={s.line} />
      ))}
    </View>
  );
});

const keyIconStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, flexDirection: 'row', alignItems: 'center' },
  ring: {
    width: size * 0.4,
    height: size * 0.4,
    borderWidth: size * 0.1,
    borderColor: color,
    borderRadius: size * 0.2,
  },
  shaft: { width: size * 0.42, height: size * 0.1, backgroundColor: color },
  tooth: {
    width: size * 0.1,
    height: size * 0.22,
    backgroundColor: color,
    marginTop: size * 0.16,
  },
}));

export const KeyIcon = memo(function KeyIconImpl({ color, size }: IconProps) {
  const s = keyIconStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.ring} />
      <View style={s.shaft} />
      <View style={s.tooth} />
    </View>
  );
});

const personIconStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center' },
  head: {
    width: size * 0.36,
    height: size * 0.36,
    borderRadius: size * 0.18,
    backgroundColor: color,
    marginTop: size * 0.04,
  },
  body: {
    width: size * 0.66,
    height: size * 0.4,
    backgroundColor: color,
    borderTopLeftRadius: size * 0.33,
    borderTopRightRadius: size * 0.33,
    marginTop: size * 0.06,
  },
}));

export const PersonIcon = memo(function PersonIconImpl({ color, size }: IconProps) {
  const s = personIconStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.head} />
      <View style={s.body} />
    </View>
  );
});

const mapOutlineStyles = styleFactory((color, size) => ({
  root: {
    width: size * 0.9,
    height: size * 0.72,
    borderWidth: size * 0.09,
    borderColor: color,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    paddingVertical: size * 0.06,
    marginTop: size * 0.1,
  },
  fold: { width: size * 0.06, backgroundColor: color },
}));

export const MapOutline = memo(function MapOutlineImpl({ color, size }: IconProps) {
  const s = mapOutlineStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.fold} />
      <View style={s.fold} />
    </View>
  );
});

const listIconStyles = styleFactory((color, size) => ({
  root: {
    width: size * 0.8,
    height: size,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  line: { width: size * 0.7, height: size * 0.09, backgroundColor: color, borderRadius: 0.5 },
}));

/** List/document glyph — Reports button on AssetCard. */
export const ListIcon = memo(function ListIconImpl({ color, size }: IconProps) {
  const s = listIconStyles(color, size);
  return (
    <View style={s.root}>
      {[0, 1, 2].map(i => (
        <View key={i} style={s.line} />
      ))}
    </View>
  );
});

const bellIconStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center' },
  bell: {
    width: size * 0.58,
    height: size * 0.52,
    borderTopWidth: size * 0.15,
    borderLeftWidth: size * 0.15,
    borderRightWidth: size * 0.15,
    borderColor: color,
    borderTopLeftRadius: size * 0.3,
    borderTopRightRadius: size * 0.3,
  },
  rim: { width: size * 0.76, height: size * 0.15, backgroundColor: color, borderRadius: 1 },
  clapper: {
    width: size * 0.18,
    height: size * 0.12,
    borderRadius: size * 0.06,
    backgroundColor: color,
    marginTop: 1,
  },
}));

/** Notification bell — Home header actions slot. */
export const BellIcon = memo(function BellIconImpl({ color, size }: IconProps) {
  const s = bellIconStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.bell} />
      <View style={s.rim} />
      <View style={s.clapper} />
    </View>
  );
});

const arrowLeftStyles = styleFactory((color, size) => ({
  glyph: { color, fontSize: size, lineHeight: size * 1.15, textAlign: 'center' },
}));

/**
 * PATCH T-HISTORY: thin left arrow — the "View Live" link on the S2 chip row.
 * Dependency-free (text glyph) so frozen screens keep their existing icons.
 */
export const ArrowLeft = memo(function ArrowLeftImpl({ color, size }: IconProps) {
  const s = arrowLeftStyles(color, size);
  return <Text style={s.glyph}>←</Text>;
});

const arrowRightStyles = styleFactory((color, size) => ({
  glyph: { color, fontSize: size, lineHeight: size * 1.2, textAlign: 'center' },
}));

/** PATCH HOME/H-D: right arrow glyph — "More Details" link on AssetCard. */
export const ArrowRight = memo(function ArrowRightImpl({ color, size }: IconProps) {
  const s = arrowRightStyles(color, size);
  return <Text style={s.glyph}>→</Text>;
});

const arrowCircleStyles = styleFactory((color, size) => ({
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
    fontSize: size * 0.62,
    fontWeight: '800',
    lineHeight: size * 0.7,
    textAlign: 'center',
  },
}));

export const ArrowCircle = memo(function ArrowCircleImpl({ color, size }: IconProps) {
  const s = arrowCircleStyles(color, size);
  return (
    <View style={s.root}>
      <Text style={s.glyph}>▲</Text>
    </View>
  );
});

const caretSolidStyles = styleFactory((color, size) => ({
  glyph: { color, fontSize: size, lineHeight: size * 1.15, textAlign: 'center' },
}));

/** PATCH T-HISTORY: solid caret ('◀' / '▶') — S8 hour/minute jump arrows. */
export const CaretSolid = memo(function CaretSolidImpl({
  color,
  size,
  dir = 'left',
}: IconProps & { dir?: 'left' | 'right' }) {
  const s = caretSolidStyles(color, size);
  return <Text style={s.glyph}>{dir === 'left' ? '◀' : '▶'}</Text>;
});

const navArrowStyles = styleFactory((color, size) => ({
  glyph: {
    color,
    fontSize: size,
    lineHeight: size * 1.1,
    textAlign: 'center',
    transform: [{ rotate: '-45deg' }],
  },
}));

/** PATCH T-HISTORY: filled navigation arrow tilted up-right — S6 alert banner. */
export const NavArrow = memo(function NavArrowImpl({ color, size }: IconProps) {
  const s = navArrowStyles(color, size);
  return <Text style={s.glyph}>➤</Text>;
});

const refreshIconStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: size * 0.11,
    borderColor: color,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  headTop: {
    position: 'absolute',
    top: 0,
    right: size * 0.1,
    width: 0,
    height: 0,
    borderLeftWidth: size * 0.3,
    borderLeftColor: color,
    borderTopWidth: size * 0.17,
    borderTopColor: 'transparent',
    borderBottomWidth: size * 0.17,
    borderBottomColor: 'transparent',
  },
  headBottom: {
    position: 'absolute',
    bottom: 0,
    left: size * 0.1,
    width: 0,
    height: 0,
    borderRightWidth: size * 0.3,
    borderRightColor: color,
    borderTopWidth: size * 0.17,
    borderTopColor: 'transparent',
    borderBottomWidth: size * 0.17,
    borderBottomColor: 'transparent',
  },
}));

/**
 * Refresh CIRCULAR double-arrow — Assets List row (PATCH H-C).
 * Composed from a ring with the top+bottom quadrants transparent (=> two side arcs) plus two
 * triangular arrowheads, reproducing the reference's circular sync glyph (NOT a "⇆" swap arrow).
 */
export const RefreshIcon = memo(function RefreshIconImpl({ color, size }: IconProps) {
  const s = refreshIconStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.ring} />
      {/* top arrowhead — clockwise */}
      <View style={s.headTop} />
      {/* bottom arrowhead — clockwise */}
      <View style={s.headBottom} />
    </View>
  );
});
