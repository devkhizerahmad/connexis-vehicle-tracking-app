// color.ts — color parsing & interpolation helpers (multi-stop gradients)
import { GradientStop } from '@shared/types/common';

/** Parses `#RRGGBB` into an [r, g, b] tuple. */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Linear interpolation between two hex colors (t in 0..1). */
export function interpolateColor(from: string, to: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(from);
  const [r2, g2, b2] = hexToRgb(to);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

/**
 * Samples a multi-stop vertical gradient at position t (0..1).
 * Stops are declared with ascending offsets; the segment containing t is
 * interpolated linearly, so stop placement stays verbatim to the reference artboard.
 */
export function sampleGradient(stops: readonly GradientStop[], t: number): string {
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  if (stops.length === 0) {
    return '#000000';
  }
  if (clamped <= stops[0].offset) {
    return stops[0].color;
  }
  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1];
    const next = stops[i];
    if (clamped <= next.offset) {
      const span = next.offset - prev.offset;
      const localT = span === 0 ? 0 : (clamped - prev.offset) / span;
      return interpolateColor(prev.color, next.color, localT);
    }
  }
  return stops[stops.length - 1].color;
}