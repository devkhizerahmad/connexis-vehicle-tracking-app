// styles.ts — S11: FAQ card (1747..2009 px → 141 pt, one white card).
//
// PATCH S11-FIT: the card is content-driven, so matching the artboard's 141 pt
// means matching its TYPE. Sampled from the artboard's body lines (16..17 px
// pitch at 1.856 px/dp → ≈9 pt leading, Q&A pairs ≈24 px apart → ≈3 pt of air,
// long answers spanning ≈183 pt for ≈55 characters → ≈8.5 pt):
//   title    20    -> 14 pt   (cap-height band 22 px → ≈12 pt; measured width
//                              ratio 0.76 gives 15.2, so 14 keeps the family
//                              ratio with the body below)
//   question 13    -> 9 pt    (width ratio of the same string: 0.57-0.64x)
//   answer   12.5  -> 8.5 pt
// Line heights are set explicitly because 9/8.5 pt at the default leading
// (≈1.35x) would put the card right back over 180 pt.
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
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 17,
    marginBottom: 4,
  },
  item: {
    marginTop: ecSizes.faqGap,
  },
  question: {
    color: ecColors.faqQInk,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 10,
  },
  answer: {
    color: ecColors.faqAInk,
    fontSize: 8.5,
    fontWeight: '400',
    lineHeight: 9.5,
    marginTop: 1,
    marginLeft: ecSizes.faqIndent,
  },
});

export default styles;
