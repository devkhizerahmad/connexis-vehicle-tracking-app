// typography.ts — semantic typed typography system
import type { TextStyle } from 'react-native';

export const typography = {
  title: { fontSize: 18, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 12, fontWeight: '700' },
  body: { fontSize: 11, fontWeight: '400' },
  micro: { fontSize: 8, fontWeight: '400' },
  button: { fontSize: 10, fontWeight: '600' },
} as const satisfies Record<string, TextStyle>;
