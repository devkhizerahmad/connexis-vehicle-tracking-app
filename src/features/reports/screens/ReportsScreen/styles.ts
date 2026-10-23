// styles.ts — ReportsScreen assembly (scroll gutters, picker rows, toast, avatar).
import { StyleSheet } from 'react-native';
import { colors, headerSpec, sizes } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  /**
   * FIX 2 (scroll): paddingBottom was a CONSTANT 24 — never tuned per collapse state,
   * so collapsing the S4–S6 body reflowed the list upward with no ghost gap.
   *
   * V5-PART1: that constant was also what let the last category card sit underneath
   * the absolute BottomNav overlay at extreme scroll. paddingBottom is now applied
   * dynamically in ReportsScreen as `sizes.bottomNav + insets.bottom + 12` — still a
   * constant (collapse-independent), but sized to clear the bar.
   */
  scrollContent: {
    paddingTop: 16,
  },
  /** S2 / S3 field blocks: stacked with the reference's 8pt rhythm. */
  fieldBlock: {
    marginTop: 8,
  },
  /**
   * FIX 1 (S3 toggle): the S4–S6 body stays MOUNTED forever; this in-flow
   * wrapper is the only thing that changes size. `overflow: hidden` clips the
   * still-mounted children at height 0, so collapsing never unmounts and
   * re-opening always has content to reveal.
   */
  collapseWrap: {
    overflow: 'hidden',
  },
  /** S5 / S6 chip rows: full-bleed gutters, 10pt above each row. */
  /**
   * PATCH UI-POLISH (PART 6): every top-level section on this screen now shares
   * the ONE page gutter token (`sizes.marginH`, 16) so all section edges land on
   * the same two vertical guides. `reportSizes.gutter` was already 16, so this
   * is a token-consistency change with NO pixel delta — the point is that the
   * gutter is now declared once, app-wide, instead of per-feature.
   */
  pickerRow: {
    marginHorizontal: sizes.marginH,
    marginTop: 10,
  },
  /**
   * DEFECT 4: the shared calendar no longer owns a page gutter (that stacked on
   * top of History's `header` padding and pushed it out of alignment with the
   * field above it). Reports hosts it in a full-bleed scroll view, so the gutter
   * is supplied HERE instead — the rendered position is unchanged.
   */
  calendarBlock: {
    marginHorizontal: sizes.marginH,
  },
  /**
   * S1 right slot avatar — the SHARED 32dp portrait, cropped to a circle by
   * an over-scaled photo so the asset's baked-in white hoop is cropped away
   * (clipping, not an asset swap).
   */
  avatarFrame: {
    width: headerSpec.avatar.size,
    height: headerSpec.avatar.size,
    borderRadius: headerSpec.avatar.size / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: headerSpec.avatar.size * headerSpec.avatar.cropScale,
    height: headerSpec.avatar.size * headerSpec.avatar.cropScale,
  },
});

export default styles;
