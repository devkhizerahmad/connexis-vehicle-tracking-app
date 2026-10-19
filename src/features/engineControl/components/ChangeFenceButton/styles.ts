// styles.ts — S5: "Change Fence" button.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): an INSET WHITE ROUNDED
// outline button with a hairline GREEN border and centred green icon + label.
// The radius now matches every other card on the screen (`ecCardRadius`)
// instead of the old flat design's dedicated 8pt `fenceBtnRadius`.
import { StyleSheet } from 'react-native';
import { ecCardRadius, ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  button: {
    height: ecSizes.fenceBtnH,
    marginHorizontal: ecSizes.pageGutter,
    borderRadius: ecCardRadius,
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
  label: {
    color: ecColors.fenceGreen,
    fontSize: 12,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default styles;