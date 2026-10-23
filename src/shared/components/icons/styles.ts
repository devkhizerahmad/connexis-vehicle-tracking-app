// styles.ts — style plumbing shared by the dependency-free icon set.
//
// Every glyph is drawn from plain `View`/`Text` primitives, so its geometry is
// a pure function of its props. `styleFactory` turns such a builder into a
// cached `StyleSheet.create` call: the sheet is created once per (colour, size)
// pair and reused by every glyph instance that asks for it, so a render no
// longer allocates a style object per node. The sheets are immutable, and the
// key is exactly the pair of values the builder reads.
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

type GlyphStyleSet = Record<string, ViewStyle | TextStyle>;

/*
 * Nearly every value in a glyph's sheet derives from its colour or size, so
 * there are no prop-independent rules worth extracting: the sheets themselves
 * are the shared artefact, built once per (colour, size) pair below.
 */

const sheetCache = new Map<string, GlyphStyleSet>();

/**
 * Returns the style sheet cached under `key`, creating it on the first call.
 * Reserved for glyphs whose geometry depends on more than colour and size
 * (`Chevron`'s direction and weight); keys are namespaced by glyph name, so two
 * glyphs can never collide.
 */
export const cachedSheet = <S extends GlyphStyleSet>(key: string, build: () => S): S => {
  const cached = sheetCache.get(key);
  if (cached) {
    return cached as S;
  }
  const created = StyleSheet.create(build());
  sheetCache.set(key, created);
  return created;
};

/**
 * Wraps a glyph's style builder so each (colour, size) pair is built once.
 * A glyph renders with one or two colour/size combinations in practice, so the
 * per-glyph cache stays tiny and every later render reuses the same objects.
 */
export const styleFactory = <S extends GlyphStyleSet>(
  build: (color: string, size: number) => S,
): ((color: string, size: number) => S) => {
  const cache = new Map<string, S>();
  return (color: string, size: number): S => {
    const key = `${color}|${size}`;
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }
    const created = StyleSheet.create(build(color, size));
    cache.set(key, created);
    return created;
  };
};
