import { StyleSheet } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@shared/theme';

const gridGap = spacing.gridGap;
const gridCols = 3;
const tileW = `${(100 - gridGap * (gridCols - 1)) / gridCols}%`;

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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gridGap,
    marginTop: gridGap,
  },
  tile: {
    width: tileW as any,
    height: sizes.reportTile,
    borderRadius: radii.banner,
    padding: spacing.tilePad,
    justifyContent: 'space-between',
  },
  tileLabel: {
    color: colors.white,
    fontSize: 10, // report tile label — 10pt (verbatim)
    fontWeight: '600',
  },
});
