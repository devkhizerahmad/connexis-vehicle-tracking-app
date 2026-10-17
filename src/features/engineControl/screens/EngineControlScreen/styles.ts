// styles.ts — EngineControlScreen assembly (section rhythm, scroll gutters, toast).
import { StyleSheet } from 'react-native';
import { colors, ecColors, ecSizes, reportColors } from '@shared/theme';

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
  /**
   * S2 — PHASE-1 (P1): the flat vehicle card is ATTACHED directly under the
   * header (`scrollTopPad` is now 0); there is no gap and no top rounding.
   */
  vehicleBlock: {
    marginTop: ecSizes.scrollTopPad,
  },
  /** P8: tighter, denser vertical rhythm across the Phase-1 sections. */
  alertBlock: {
    marginTop: 4,
  },
  mapBlock: {
    marginTop: 3,
  },
  fenceBlock: {
    marginTop: 6,
  },
  routesBlock: {
    marginTop: 6,
  },
  /** S7 — 13 px under the Driving Routes card. Phase-2: UNCHANGED. */
  controlBlock: {
    marginTop: 10,
  },
  /** S11 — 13 px under the Control Vehicle card. Phase-2: UNCHANGED. */
  faqBlock: {
    marginTop: 8,
  },
  /** S12 — 16 px under the FAQ card. Phase-2: UNCHANGED. */
  supportBlock: {
    marginTop: 6,
  },
  /**
   * S1 avatar — PHASE-1 (P8): 32 -> 28 pt (≈12% smaller). This frame is the
   * circular clip; the photo inside it is OVER-SCALED (`avatarCropScale`) so the
   * asset's baked-in white hoop falls outside the clip. That removes the ring by
   * cropping rather than by swapping the asset.
   */
  avatar: {
    width: ecSizes.avatar,
    height: ecSizes.avatar,
    borderRadius: ecSizes.avatar / 2,
    // F1: the photo is circular and opaque so a transparent asset can never
    // read as a blank white disc against the gradient header.
    backgroundColor: ecColors.avatarFallback,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: ecSizes.avatar * ecSizes.avatarCropScale,
    height: ecSizes.avatar * ecSizes.avatarCropScale,
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
    borderRadius: ecSizes.avatar / 2,
  },
  /**
   * PATCH EC-SWIPE: `bottom` is NO LONGER set here.
   *
   * It used to be a flat 32, which put the toast at y≈1620..1656 on a 1688 px
   * screen — squarely underneath the shared BottomNav overlay (≈1548..1660). The
   * toast was therefore rendering the whole time and simply being PAINTED OVER,
   * which made every control in this screen look dead. Its offset is now applied
   * dynamically by EngineControlScreen as `sizes.bottomNav + insets.bottom`,
   * exactly like `scrollPadBottom`, so it always clears the nav.
   */
  toast: {
    position: 'absolute',
    left: ecSizes.gutter * 2,
    right: ecSizes.gutter * 2,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: reportColors.toastBg,
    alignItems: 'center',
    // Above the nav overlay, not merely near the bottom edge.
    zIndex: 10,
    elevation: 10,
  },
  toastText: {
    color: reportColors.toastInk,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default styles;
