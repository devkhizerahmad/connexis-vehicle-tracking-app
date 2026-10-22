// ScreenState.tsx — shared loading / error / empty body for every screen.
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { colors } from '@shared/theme';
import { styles } from './styles';

export type ScreenStateKind = 'loading' | 'error' | 'empty';

export interface ScreenStateProps {
  kind: ScreenStateKind;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
}

const DEFAULTS: Record<ScreenStateKind, { title: string; message: string }> = {
  loading: { title: 'Loading…', message: 'Fetching the latest data.' },
  error: { title: 'Something went wrong', message: 'The data could not be loaded.' },
  empty: { title: 'Nothing here yet', message: 'There is nothing to show right now.' },
};

export function ScreenState({
  kind,
  title,
  message,
  actionLabel,
  onAction,
  testID,
}: ScreenStateProps) {
  const copy = DEFAULTS[kind];
  const buttonLabel = actionLabel ?? 'Try again';

  return (
    <View style={styles.container} testID={testID ?? `screen-state-${kind}`}>
      {kind === 'loading' ? (
        <ActivityIndicator size="large" color={colors.reportBlue} />
      ) : null}

      <Text style={styles.title} accessibilityRole="header">
        {title ?? copy.title}
      </Text>
      <Text style={styles.message}>{message ?? copy.message}</Text>

      {onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={buttonLabel}
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
          <Text style={styles.actionText}>{buttonLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default ScreenState;
