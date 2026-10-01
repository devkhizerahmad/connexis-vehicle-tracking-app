// styles.ts — S11: FAQ card (1747..2009 px → 141 pt, one white card).
import { StyleSheet } from 'react-native';
import { ecColors, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: ecSizes.gutter,
    backgroundColor: ecColors.card,
    borderRadius: ecSizes.cardRadius,
    paddingHorizontal: ecSizes.faqPadH,
    paddingVertical: ecSizes.faqPadV,
  },
  title: {
    color: ecColors.faqTitleInk,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  item: {
    marginTop: ecSizes.faqGap,
  },
  question: {
    color: ecColors.faqQInk,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
  },
  answer: {
    color: ecColors.faqAInk,
    fontSize: 12.5,
    fontWeight: '400',
    lineHeight: 16,
    marginTop: 2,
    marginLeft: ecSizes.faqIndent,
  },
});

export default styles;
