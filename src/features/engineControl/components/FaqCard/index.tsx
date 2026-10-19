// FaqCard (S11) — numbered Q&A list with a trailing accordion caret.
// Wording (including the reference's own typos) is read verbatim from the mock.
//
// FLAG: the reference draws a caret on every row, but no accordion EXPAND/COLLAPSE
// behaviour exists on this screen — the caret is therefore rendered as a VISUAL
// affordance only and every answer is always shown. No behaviour was invented.
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { ChevronDown } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import type { FaqEntry } from '@features/engineControl/types/engineControl';
import { styles } from './styles';

export interface FaqCardProps {
  title: string;
  entries: FaqEntry[];
}

function FaqCardImpl({ title, entries }: FaqCardProps) {
  const lastIndex = entries.length - 1;
  return (
    <View style={styles.card} testID="ec-faq-card">
      <Text style={styles.title}>{title}</Text>
      <View style={styles.titleRule} />
      {entries.map((entry, index) => (
        <View
          key={entry.id}
          style={[styles.item, index === lastIndex ? styles.itemLast : null]}
          testID={`ec-faq-${entry.id}`}>
          <View style={styles.itemHead}>
            <Text style={styles.question}>
              {index + 1}. {entry.question}
            </Text>
            <View style={styles.caret}>
              <ChevronDown color={ecColors.chevronInk} size={14} />
            </View>
          </View>
          <Text style={styles.answer}>{entry.answer}</Text>
        </View>
      ))}
    </View>
  );
}

export const FaqCard = memo(FaqCardImpl);
export default FaqCard;
