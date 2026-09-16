import { StyleSheet } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@shared/theme';

const gridGap = spacing.gridGap;
const gridCols = 3;
const tileW = `${(100 - gridGap * (gridCols - 1)) / gridCols}%`;

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
  headerRight: {
    flex: 0.3,
    backgroundColor: colors.white,
    borderLeftWidth: 1,
    borderLeftColor: colors.navyLine,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gridGap,
    marginTop: gridGap,
  },
  tile: {
    width: tileW as any,
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
