// FaqCard (S11) — numbered Q&A list. Wording (including the reference's own
// typos) is read verbatim from the mock.
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import type { FaqEntry } from '@features/engineControl/types/engineControl';
import { styles } from './styles';

export interface FaqCardProps {
  title: string;
  entries: FaqEntry[];
}

function FaqCardImpl({ title, entries }: FaqCardProps) {
  return (
    <View style={styles.card} testID="ec-faq-card">
      <Text style={styles.title}>{title}</Text>
      {entries.map((entry, index) => (
        <View key={entry.id} style={styles.item} testID={`ec-faq-${entry.id}`}>
          <Text style={styles.question}>
            {index + 1}. {entry.question}
          </Text>
          <Text style={styles.answer}>{entry.answer}</Text>
        </View>
      ))}
    </View>
  );
}

export const FaqCard = memo(FaqCardImpl);
export default FaqCard;
