// styles.ts — S11: FAQ card.
//
// ENGINE CONTROL VEHICLE DASHBOARD (NEW reference): an INSET WHITE ROUNDED
// SHADOWED card, a bold "FAQ" heading with a SHORT RED UNDERLINE beneath it
// (no gradient bar), numbered items each ending in an accordion caret, and
// hairline dividers between items.
//
// Type sizes stay where the PATCH S11-FIT pass measured them: the card is
// content-driven and those values were derived from the artboard's own line
// pitch, not from the old design language.
import { StyleSheet } from 'react-native';
import { ecCardRadius, ecColors, ecShadow, ecSizes } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: ecSizes.pageGutter,
    backgroundColor: ecColors.card,
    borderRadius: ecCardRadius,
    paddingHorizontal: ecSizes.faqPadH,
    paddingVertical: ecSizes.faqPadV,
    // NEW design language: shadows are back on every card.
    ...ecShadow,
  },
  title: {
    color: ecColors.faqTitleInk,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 6,
  },
  /** The short RED rule under "FAQ" (NEW reference — replaces any gradient). */
  titleRule: {
    width: 34,
    height: 3,
    borderRadius: 2,
    backgroundColor: ecColors.fencePillBg,
    marginTop: -2,
    marginBottom: 6,
  },
  item: {
    marginTop: ecSizes.faqGap,
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ecColors.cardBorder,
  },
  /** No divider under the final entry (reference divides BETWEEN items). */
  itemLast: {
    borderBottomWidth: 0,
  },
  itemHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  question: {
    flex: 1,
    color: ecColors.faqQInk,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
    paddingRight: 6,
  },
  caret: {
    marginTop: 1,
  },
  answer: {
    color: ecColors.faqAInk,
    fontSize: 8.5,
    fontWeight: '400',
    lineHeight: 9.5,
    marginTop: 2,
    marginLeft: ecSizes.faqIndent,
  },
});

export default styles;
