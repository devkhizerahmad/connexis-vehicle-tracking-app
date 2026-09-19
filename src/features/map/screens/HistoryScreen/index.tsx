// HistoryScreen placeholder shell
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppHeader from '@shared/components/layout/AppHeader';
import { colors } from '@shared/theme';

export function HistoryScreen() {
  return (
    <View style={styles.container}>
      <AppHeader variant="standard" title="Route History" />
      <View style={styles.body}>
        <Text style={styles.text}>Route Playback & History</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: colors.text.primary, fontSize: 14 },
});

export default HistoryScreen;
