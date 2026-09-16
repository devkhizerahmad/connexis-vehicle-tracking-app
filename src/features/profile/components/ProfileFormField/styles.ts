// styles.ts — static styles for a single profile form row
import { StyleSheet } from 'react-native';
import { profileTokens } from '@shared/theme';

export const styles = StyleSheet.create({
  label: {
    color: profileTokens.color.fieldLabel,
    fontSize: profileTokens.type.fieldLabel.fontSize,
    fontWeight: profileTokens.type.fieldLabel.fontWeight,
    marginLeft: profileTokens.space.fieldPadL,
    marginTop: profileTokens.space.fieldLabelMt,
  },
  value: {
    color: profileTokens.color.fieldValue,
    fontSize: profileTokens.type.fieldValue.fontSize,
    fontWeight: profileTokens.type.fieldValue.fontWeight,
    marginLeft: profileTokens.space.fieldPadL,
    marginTop: profileTokens.space.fieldValueMt,
    marginBottom: profileTokens.space.fieldValueMb,
    // kill the platform TextInput chrome so the row geometry matches the artboard
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  divider: {
    height: profileTokens.size.hairline,
    backgroundColor: profileTokens.color.dividerLine,
    marginHorizontal: profileTokens.space.dividerInset,
  },
});