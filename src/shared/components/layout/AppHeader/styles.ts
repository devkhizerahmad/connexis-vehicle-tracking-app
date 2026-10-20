// styles.ts — the shared TOP-HEADER STANDARD. Every value comes from
// `headerSpec` (shared/theme/header.ts) so no screen can drift from another.
import { StyleSheet } from 'react-native';
import { headerSpec, sizes } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // PATCH I3/K2: keep the gradient inside the header bounds (no bleed)
    overflow: 'hidden',
  },
  /**
   * The ONE background layer: the shared diagonal ramp fills the whole header
   * container (nav row, and the band below it on the extended screen). On a
   * standard screen the container IS the nav-row strip, so this renders
   * exactly as the previous strip-only gradient did.
   */
  gradientStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  // PATCH K2: chevron + title + right slot sit above the gradient
  contentLayer: {
    zIndex: 1,
  },
  // PATCH K2: Zone 2 nav row — FIXED height on every screen, centre = inset + 28
  navRow: {
    height: headerSpec.navRowH,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: headerSpec.horizontalInset,
  },
  // PATCH K2: Zone 3 extended band (variant="extended")
  extendedBand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // PATCH K2: immersive variant — floating circular back button (48dp)
  immersiveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  immersiveBack: {
    width: sizes.immersiveBackSize,
    height: sizes.immersiveBackSize,
    borderRadius: sizes.immersiveBackSize / 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Left slot — 44dp, the touch-target floor. */
  leftContainer: {
    width: headerSpec.slotWidth,
    alignItems: 'flex-start',
  },
  /** Title — centred in the space between the two 44dp slots. */
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: headerSpec.title.color,
    fontSize: headerSpec.title.fontSize,
    fontWeight: headerSpec.title.fontWeight as any,
  },
  /**
   * Right slot — 44dp and ALWAYS rendered. With no action it is a transparent
   * spacer, which is what keeps the title optically centred on screens that
   * have no right-hand action (Profile).
   */
  rightContainer: {
    width: headerSpec.slotWidth,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  /**
   * The avatar frame. It MUST clip: the photo inside is over-scaled so the
   * asset's baked-in white hoop falls outside the circle — without
   * `borderRadius` + `overflow: 'hidden'` the over-scaled photo paints as a
   * SQUARE instead of a circle.
   */
  avatarContainer: {
    width: headerSpec.avatar.size,
    height: headerSpec.avatar.size,
    borderRadius: headerSpec.avatar.size / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /**
   * The photo is OVER-SCALED inside the circular frame so the asset's
   * baked-in white hoop is cropped away — clipping, not an asset swap.
   */
  avatarImage: {
    width: headerSpec.avatar.size * headerSpec.avatar.cropScale,
    height: headerSpec.avatar.size * headerSpec.avatar.cropScale,
  },
});
