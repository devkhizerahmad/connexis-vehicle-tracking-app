// styles.ts — S8/S10 swipe-confirm card: Lock/Unlock selectors + the swipe rail.
//
// This file belongs to ControlSwipeCard, which exists purely so the
// pending-action / processing state re-renders THIS subtree and nothing else
// (Performance G2/G10): the map, routes, FAQ, header and bottom nav must not
// repaint while a finger is on the rail.
import { StyleSheet } from 'react-native';
import { radii } from '@shared/theme';

export const styles = StyleSheet.create({
  /**
   * Wrapper for the whole confirm group. Transparent and layout-only so it adds
   * no paint layer of its own.
   */
  wrap: {
    marginTop: 4,
  },

  /**
   * rn-swipe-button's own container style. Two overrides are load-bearing:
   *
   *  - `margin: 0`. The library hard-codes `margin: 5` on its container, which
   *    would indent the rail inside the Control Vehicle card and break the
   *    inset parity every other row in that card has.
   *  - `borderRadius`. The library uses a flat 50, which only reads as a capsule
   *    because its default height happens to be large; at the reference's 35 pt
   *    it would be a circle-ended lozenge. `radii.pill` is the token the artboard
   *    calls for.
   *
   * `borderWidth: 0` drops the library's default 1 px border, which would draw a
   * faint ring around the navy pill that the reference does not have.
   */
  swipeContainer: {
    margin: 0,
    marginTop: 4,
    borderRadius: radii.pill,
    borderWidth: 0,
  },

  /**
   * The fill that grows behind the thumb as the drag advances. It needs the same
   * radius as the container or its leading edge pokes out of the capsule.
   */
  swipeRail: {
    borderRadius: radii.pill,
  },

  /**
   * Thumb face. The artboard draws the chevrons bare on the navy with no disc,
   * but the library's thumb is a real 35 pt drag handle and needs something to
   * grab, so it carries a barely-there lighter navy disc (same density as the
   * rail's own fill) instead of the library's default opaque white knob.
   */
  thumbIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /** Pulls the two chevrons together into one tight "››" pair. */
  thumbChevronGap: {
    marginLeft: -4,
  },
});

export default styles;