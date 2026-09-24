import { StyleSheet } from 'react-native';
import { colors } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  // PATCH H-D: header h40, name 13pt/400 padL 12, status 13pt bold centred
  header: {
    height: 40,
    flexDirection: 'row',
  },
  headerName: {
    width: '55%',
    backgroundColor: colors.black,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  headerNameText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '400',
  },
  headerStatus: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStatusText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  // body — PATCH H-D: photo 86x55 at (14,12)
  body: {
    backgroundColor: colors.surface.card,
    paddingTop: 12,
    paddingLeft: 14,
    paddingRight: 12,
    paddingBottom: 12,
    flexDirection: 'row',
  },
  leftCol: {
    width: '35%',
    alignItems: 'flex-start',
  },
  photo: {
    width: 86,
    height: 55,
  },
  // PATCH H-D: battery/satellite/signal rows wrapped in a dashed box
  batteryBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 2,
    padding: 6,
    marginTop: 8,
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  batteryText: {
    color: colors.grayText,
    fontSize: 7.5,
    marginLeft: 3,
  },
  // PATCH H-D: "More Details" 10pt/600 #8A9199 with an ArrowRight glyph (10)
  moreDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  moreDetails: {
    color: colors.home.moreDetails,
    fontSize: 10,
    fontWeight: '600',
    marginRight: 2,
  },
  rightCol: {
    flex: 1,
    paddingLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  infoIcon: {
    marginTop: 1,
  },
  // PATCH H-D: LABEL bold 11pt #4A4F54 + VALUE regular 11pt #7A8288
  infoLabel: {
    color: colors.text.label,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 8,
  },
  infoValue: {
    color: colors.text.secondary,
    fontSize: 11,
    flexShrink: 1,
  },
  // PATCH H-D: buttons h24, text 9pt, r4, gap 8, right-aligned marginTop 10
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  actionBtn: {
    height: 24,
    borderRadius: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 9,
  },
  // PATCH H-D: premium bar h26 maroon, star 12 + 11pt/400 #C9CED4 padL 10
  premiumBar: {
    height: 26,
    backgroundColor: colors.home.premiumMaroon,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  premiumText: {
    color: colors.home.premiumLabel,
    fontSize: 11,
    fontWeight: '400',
    marginLeft: 6,
  },
  chevronWrap: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  // PATCH H-D: sensor strip h44, cells HORIZONTAL (icon 14 + label/value column)
  sensorClip: {
    overflow: 'hidden',
    backgroundColor: colors.surface.card,
  },
  sensorStrip: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: colors.surface.card,
  },
  sensorCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  sensorCol: {
    marginLeft: 6,
  },
  sensorDivider: {
    width: 1,
    backgroundColor: colors.home.sensorDivider,
  },
  sensorLabel: {
    color: colors.text.secondary,
    fontSize: 9,
  },
  sensorValue: {
    color: colors.home.bodyText,
    fontSize: 11,
    fontWeight: '700',
  },
});