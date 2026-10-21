// styles.ts — static styles for the Profile DOB field + the 3-segment sheet.
import { StyleSheet } from 'react-native';
import { profileTokens } from '@shared/theme';

export const styles = StyleSheet.create({
  // The label + value share ONE press target, so the whole row is tappable
  // (>= 44dp) without the row growing — the rows below it stay put.
  field: {
    width: '100%',
  },
  // ── the tappable "Date of Birth" row (same label/value/divider language as
  //    the other Profile form rows, plus a caret affordance) ──
  label: {
    color: profileTokens.color.fieldLabel,
    fontSize: profileTokens.type.fieldLabel.fontSize,
    fontWeight: profileTokens.type.fieldLabel.fontWeight,
    marginLeft: profileTokens.space.fieldPadL,
    marginTop: profileTokens.space.fieldLabelMt,
  },
  // The value line. It carries the SAME margins/typography as the other
  // Profile form rows' value, so the row geometry is identical — the touch
  // target comes from the whole label+value Pressable, NOT from growing the
  // row (which would push the rows below it down).
  valueLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: profileTokens.space.fieldPadL,
    marginTop: profileTokens.space.fieldValueMt,
    marginBottom: profileTokens.space.fieldValueMb,
  },
  value: {
    flex: 1,
    color: profileTokens.color.fieldValue,
    fontSize: profileTokens.type.fieldValue.fontSize,
    fontWeight: profileTokens.type.fieldValue.fontWeight,
  },
  valuePlaceholder: {
    color: profileTokens.color.fieldPlaceholder,
  },
  divider: {
    height: profileTokens.size.hairline,
    backgroundColor: profileTokens.color.dividerLine,
    marginHorizontal: profileTokens.space.dividerInset,
  },

  // ── the bottom sheet ──
  backdrop: {
    // Longhand: this RN version's generated types no longer expose
    // `StyleSheet.absoluteFillObject`.
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: profileTokens.color.sheetBackdrop,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: profileTokens.color.cardSurface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: profileTokens.color.dividerLine,
    marginBottom: 14,
  },
  title: {
    color: profileTokens.color.fieldValue,
    fontSize: profileTokens.type.fieldValue.fontSize,
    fontWeight: '700',
    marginBottom: 6,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // >= 44dp touch target on every segment row.
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: profileTokens.color.dividerLine,
  },
  segmentLabel: {
    color: profileTokens.color.fieldLabel,
    fontSize: profileTokens.type.fieldLabel.fontSize,
    fontWeight: profileTokens.type.fieldLabel.fontWeight,
  },
  segmentValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentValue: {
    color: profileTokens.color.fieldValue,
    fontSize: profileTokens.type.fieldValue.fontSize,
    fontWeight: '600',
    marginRight: 6,
  },
  list: {
    maxHeight: 260,
    marginTop: 6,
  },
  option: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  optionSelected: {
    backgroundColor: profileTokens.color.dividerLine,
    borderRadius: 6,
  },
  optionLabel: {
    color: profileTokens.color.fieldValue,
    fontSize: profileTokens.type.fieldValue.fontSize,
    fontWeight: '400',
  },
  optionLabelSelected: {
    fontWeight: '700',
  },
});
