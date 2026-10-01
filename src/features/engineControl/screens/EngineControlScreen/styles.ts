// styles.ts — EngineControlScreen assembly (section rhythm, scroll gutters, toast).
import { StyleSheet } from 'react-native';
import { colors, ecColors, ecSizes, reportColors, sizes } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  /**
   * Bottom padding is applied dynamically in EngineControlScreen as
   * `sizes.bottomNav + insets.bottom + ecSizes.scrollNavBuffer`, because the shared
   * BottomNav is an absolute overlay and would otherwise sit on top of S12.
   * This constant is the non-nav remainder only.
   */
  scrollContent: {
    paddingBottom: ecSizes.scrollBottomPad,
  },
  /** S2 — first block under the header (18 px in the reference). */
  vehicleBlock: {
    marginTop: ecSizes.scrollTopPad,
  },
  /** S3 sits 6 pt under the tallest S2 card (12 px). */
  alertBlock: {
    marginTop: 6,
  },
  /** S4 — the reference packs the map right under the banner (≈5 px). */
  mapBlock: {
    marginTop: 5,
  },
  /** S5 — 15 px under the map. */
  fenceBlock: {
    marginTop: 10,
  },
  /** S6 — 23 px under the Change Fence button. */
  routesBlock: {
    marginTop: 10,
  },
  /** S7 — 13 px under the Driving Routes card. */
  controlBlock: {
    marginTop: 10,
  },
  /** S11 — 13 px under the Control Vehicle card. */
  faqBlock: {
    marginTop: 8,
  },
  /** S12 — 16 px under the FAQ card. */
  supportBlock: {
    marginTop: 6,
  },
  /** S1 right slot avatar (32 pt circle, same metric as the shared header's). */
  avatar: {
    width: sizes.avatar,
    height: sizes.avatar,
    borderRadius: sizes.avatar / 2,
    // F1: the photo is circular and opaque so a transparent asset can never
    // read as a blank white disc against the gradient header.
    backgroundColor: ecColors.avatarFallback,
    overflow: 'hidden',
  },
  /** F1: painted only if the photo fails to decode — guarantees a visible disc. */
  avatarFallback: {
    // Longhand: this RN version's generated types no longer expose
    // `StyleSheet.absoluteFillObject`.
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: ecColors.avatarFallback,
    borderRadius: sizes.avatar / 2,
  },
  toast: {
    position: 'absolute',
    left: ecSizes.gutter * 2,
    right: ecSizes.gutter * 2,
    bottom: 32,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: reportColors.toastBg,
    alignItems: 'center',
  },
  toastText: {
    color: reportColors.toastInk,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default styles;
