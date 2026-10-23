// styles.ts — Details "Routes" card chrome.
//
// B10: the ROW styles moved to `@shared/components/vehicle/RouteRow` (the shared
// row both lists render). What stays here is card chrome: the navy collapsible
// header (3c, unchanged), the padded white body, and the "View More" link.
import { StyleSheet } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@shared/theme';

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
  body: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.tilePad + 2,
    marginTop: spacing.gridGap,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  viewMoreButton: {
    alignSelf: 'flex-end',
    padding: 2,
  },
  viewMoreText: {
    color: colors.surface.navy,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
});

export default styles;
