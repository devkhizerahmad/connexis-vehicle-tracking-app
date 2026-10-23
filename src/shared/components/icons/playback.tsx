// playback.tsx — History playback glyphs: state ring, calendar shell and the
// transport runes.
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { colors } from '@shared/theme';
import { styleFactory } from './styles';
import type { IconProps } from './types';

const statusRingStyles = styleFactory((color, size) => ({
  ring: {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: Math.max(2, size * 0.3),
    borderColor: color,
    backgroundColor: colors.white,
  },
}));

/** PATCH T-HISTORY: ring dot (coloured ring, white centre) — S7 playback state pill. */
export const StatusRing = memo(function StatusRingImpl({ color, size }: IconProps) {
  const s = statusRingStyles(color, size);
  return <View style={s.ring} />;
});

const calendarGlyphStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center' },
  shell: {
    width: size,
    height: size * 0.88,
    borderWidth: Math.max(1.5, size * 0.11),
    borderColor: color,
    borderRadius: size * 0.16,
    marginTop: size * 0.12,
    justifyContent: 'center',
  },
  band: { height: Math.max(1.5, size * 0.1), backgroundColor: color },
  pinLeft: {
    position: 'absolute',
    top: 0,
    left: size * 0.18,
    width: Math.max(1.5, size * 0.1),
    height: size * 0.24,
    backgroundColor: color,
    borderRadius: 1,
  },
  pinRight: {
    position: 'absolute',
    top: 0,
    right: size * 0.18,
    width: Math.max(1.5, size * 0.1),
    height: size * 0.24,
    backgroundColor: color,
    borderRadius: 1,
  },
}));

/** PATCH T-HISTORY: outlined calendar shell — S7 playback timestamp row. */
export const CalendarGlyph = memo(function CalendarGlyphImpl({ color, size }: IconProps) {
  const s = calendarGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.shell}>
        <View style={s.band} />
      </View>
      <View style={s.pinLeft} />
      <View style={s.pinRight} />
    </View>
  );
});

const transportGlyphStyles = styleFactory((color, size) => ({
  glyph: { color, fontSize: size, lineHeight: size * 1.15, textAlign: 'center' },
}));

/** PATCH T-HISTORY: transport glyphs (skip-back / play / pause / skip-forward). */
export const TransportGlyph = memo(function TransportGlyphImpl({
  color,
  size,
  glyph,
}: IconProps & { glyph: 'prev' | 'play' | 'pause' | 'next' }) {
  const s = transportGlyphStyles(color, size);
  return (
    <Text style={s.glyph}>
      {glyph === 'prev' ? '⏮' : glyph === 'next' ? '⏭' : glyph === 'pause' ? '❚❚' : '▶'}
    </Text>
  );
});
