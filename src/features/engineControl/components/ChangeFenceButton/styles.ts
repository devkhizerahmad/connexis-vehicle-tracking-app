// styles.ts — S5: "Change Fence" button.
//
// PHASE-1 (P7): the reference's button is the one deliberately ROUNDED element in
// Phase 1 (radius ~8, kept here via `fenceBtnRadius`), with a hairline green
// outline rather than the old 1.5 pt one, ~15% less height (32 -> 27) and
// smaller, medium-weight type.
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  button: {
    height: ecSizes.fenceBtnH,
    marginHorizontal: ecSizes.pageGutter,
    borderRadius: ecSizes.fenceBtnRadius,
    borderWidth: 1,
    borderColor: ecColors.fenceGreen,
    backgroundColor: ecColors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  /** P7: 13/700 -> 11.5/600. */
  label: {
    color: ecColors.fenceGreen,
    fontSize: 11.5,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;