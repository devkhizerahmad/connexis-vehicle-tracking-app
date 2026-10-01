// styles.ts — S5: "Change Fence" button (790..849 px → 32 pt, x=30..694 px).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  button: {
    height: ecSizes.fenceBtnH,
    marginHorizontal: ecSizes.fenceGutter,
    borderRadius: ecSizes.radiusSm,
    borderWidth: 1.5,
    borderColor: ecColors.fenceGreen,
    backgroundColor: ecColors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    color: ecColors.fenceGreen,
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;
