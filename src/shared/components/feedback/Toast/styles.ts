// Toast/styles.ts — the single toast shell.
//
// One surface for every screen: navy pill, white 12pt semibold copy, 6pt
// radius, 24pt side insets. Screens only choose the vertical offset (defaults
// to clearing the shared BottomNav overlay).
import { StyleSheet } from 'react-native';
import { colors } from '@shared/theme';

/** Horizontal inset shared by every toast (Profile's measured value). */
export const TOAST_INSET_H = 24;

export const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: TOAST_INSET_H,
    right: TOAST_INSET_H,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: colors.surface.navy,
    alignItems: 'center',
    // Above the shared tab bar overlay, not merely near the bottom edge.
    zIndex: 10,
    elevation: 10,
  },
  toastText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
