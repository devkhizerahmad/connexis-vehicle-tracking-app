import { StyleSheet } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@shared/theme';

const gridGap = spacing.gridGap;

export const styles = StyleSheet.create({
  header: {
    height: sizes.sectionHeader,
    backgroundColor: colors.surface.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sectionPadH,
    borderRadius: radii.card,
  },
  headerTitle: {
    color: colors.white,
    fontSize: typography.sectionTitle.fontSize, // 14
    fontWeight: '700',
    marginLeft: 6,
  },
  spacer: {
    flex: 1,
  },
  /** PATCH UI-POLISH (PART 4): explicit 3-wide rows — see SensorBlock/styles.ts
   * `gridRow` for the full rationale (the old `width: 28%` + absolute gap
   * under-filled the row and left the tiles narrower than the section bar). */
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
    height: sizes.reportTile,
    borderRadius: radii.banner,
    padding: spacing.tilePad,
    justifyContent: 'space-between',
  },
  /** Last tile of a full row drops its trailing margin so it lands on the edge. */
  tileRowEnd: {
    marginRight: 0,
  },
  tileLabel: {
    color: colors.white,
    fontSize: 10, // report tile label — 10pt (verbatim)
    fontWeight: '600',
  },
});
