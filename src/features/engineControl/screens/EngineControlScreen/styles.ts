// styles.ts — EngineControlScreen assembly (section rhythm, scroll gutters, toast).
import { StyleSheet } from 'react-native';
import { colors, ecColors, ecSizes, headerSpec } from '@shared/theme';

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
   * S2 — the vehicle card is INSET under the header with clear breathing room
   * (it used to be attached flush with `scrollTopPad: 0` in the flat language).
   */
  vehicleBlock: {
    marginTop: 10,
  },
  /** Consistent inter-section rhythm — the NEW reference spaces its cards evenly. */
  mapBlock: {
    marginTop: 10,
  },
  fenceBlock: {
    marginTop: 10,
  },
  routesBlock: {
    marginTop: 12,
  },
  /** S7 — under the Driving Routes card. */
  controlBlock: {
    marginTop: 12,
  },
  /** S11 — under the Control Vehicle card. */
  faqBlock: {
    marginTop: 12,
  },
  /** S12 — under the FAQ card. */
  supportBlock: {
    marginTop: 12,
    marginBottom: 8,
  },
  /**
   * S1 avatar — PHASE-1 (P8): 32 -> 28 pt (≈12% smaller). This frame is the
   * circular clip; the photo inside it is OVER-SCALED (`avatarCropScale`) so the
   * asset's baked-in white hoop falls outside the clip. That removes the ring by
   * cropping rather than by swapping the asset.
   */
  /**
   * S1 avatar — the SHARED header avatar (32dp portrait, cropped to a circle
   * by an over-scaled photo so the asset's baked-in white hoop is cropped
   * away). TOP-HEADER STANDARD: this screen no longer keeps a private 28dp
   * avatar; it uses the same token as every other screen.
   */
  avatar: {
    width: headerSpec.avatar.size,
    height: headerSpec.avatar.size,
    borderRadius: headerSpec.avatar.size / 2,
    // F1: the photo is circular and opaque so a transparent asset can never
    // read as a blank white disc against the gradient header.
    backgroundColor: ecColors.avatarFallback,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: headerSpec.avatar.size * headerSpec.avatar.cropScale,
    height: headerSpec.avatar.size * headerSpec.avatar.cropScale,
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
    borderRadius: headerSpec.avatar.size / 2,
  },
});

export default styles;
