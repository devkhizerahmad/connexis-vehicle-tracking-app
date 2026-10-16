import { StyleSheet } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@shared/theme';

const gridGap = spacing.gridGap;

export const styles = StyleSheet.create({
  header: {
    height: sizes.sectionHeader,
    backgroundColor: colors.surface.navy,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  headerLeft: {
    flex: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    gap: 10,
  },
  /**
   * PATCH UI-POLISH (PART 5): the white "Select ▾" area gets the same 1pt
   * near-black outline as the asset cards, so it reads as a distinct control
   * rather than the bare end of the navy bar. The right-hand corners carry the
   * bar's own radius to match `header`'s top radii, and the left edge picks up
   * the hairline that used to be `borderLeftWidth: 1` in `navyLine`.
   */
  headerRight: {
    flex: 0.3,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line.strong,
    borderTopRightRadius: radii.card,
    borderBottomRightRadius: radii.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dropdownText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  headerTitle: {
    color: colors.white,
    fontSize: typography.sectionTitle.fontSize, // 14
    fontWeight: '700',
  },
  /**
   * PATCH UI-POLISH (PART 4): the grid is laid out as EXPLICIT rows of 3 with
   * `flex: 1` tiles instead of `width: 28%` + `gap`.
   *
   * The old formula `(100 - gap*2)/3 = 28%` is only correct when the container
   * happens to be 100 units wide — the percentage is taken against the real
   * container while the gaps are absolute dp, so on a 366dp container three 28%
   * tiles plus two 8dp gaps came to ~323dp and left ~42dp of dead space on the
   * right. That is exactly the "inner cards narrower than their section bar"
   * defect. `flex: 1` divides the width that is actually left AFTER the gaps, so
   * the first tile starts on the bar's left edge and the last ends on its right
   * edge at ANY screen width.
   */
  grid: {
    marginTop: gridGap,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: gridGap,
  },
  tile: {
    flex: 1,
    marginRight: gridGap,
    borderRadius: radii.tile,
    padding: spacing.tilePad,
    minHeight: sizes.sensorTileMin,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  /** Last tile of a full row drops its trailing margin so it lands on the edge. */
  tileRowEnd: {
    marginRight: 0,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tileLabel: {
    color: colors.text.secondary,
    fontSize: 10,
    flex: 1,
  },
  tileValue: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  banner: {
    marginTop: gridGap,
    borderRadius: radii.banner,
    padding: spacing.tilePad,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerText: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
});
