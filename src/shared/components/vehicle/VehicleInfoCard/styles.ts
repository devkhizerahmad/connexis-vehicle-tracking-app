import { StyleSheet } from 'react-native';
import { colors, radii, sizes } from '@shared/theme';

const cyanTop = sizes.imgT + sizes.sedanH + sizes.cyanTopGap; // 27 + 68 + 22 = 117

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.vehicleCard,
    minHeight: cyanTop + sizes.btnH + sizes.cardBottomPad,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    /* no overflow:hidden — cyan box paints below card bottom */
  },
  carImageContainer: {
    position: 'absolute',
    left: sizes.imgL,
    top: sizes.imgT,
    width: sizes.sedanW,
    height: sizes.sedanH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: sizes.sedanW,
    height: sizes.sedanH,
  },
  rightColumn: {
    marginLeft: `${sizes.cyanWpct}%`,
    paddingLeft: 0,
    paddingRight: 4,
    paddingTop: sizes.colTopPad,
    gap: sizes.colGap,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTopAlign: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  labelBold: {
    fontWeight: '700',
    color: colors.text.grayStrong,
    fontSize: 10.5,
    lineHeight: 15,
  },
  valueText: {
    color: colors.text.grayText,
    fontSize: 10.5,
    lineHeight: 15,
  },
  liveLocationContainer: {
    position: 'absolute',
    left: `${sizes.cyanWpct}%`,
    top: cyanTop,
    right: 0,
  },
  liveLocationButton: {
    alignSelf: 'flex-start',
    marginLeft: sizes.btnPinGapL,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: sizes.btnH,
    paddingHorizontal: sizes.btnPadH,
    borderWidth: 1.5,
    borderColor: colors.icon.outlineGray,
    borderRadius: radii.button,
  },
  liveLocationText: {
    color: colors.text.grayStrong,
    fontSize: 10.5,
    fontWeight: '500',
  },
});
