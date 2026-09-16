// EngineControlScreen placeholder shell
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppHeader from '@shared/components/layout/AppHeader';
import { colors } from '@shared/theme';

export function EngineControlScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Engine Control" />
      <View style={styles.body}>
        <Text style={styles.text}>Engine Control</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: colors.text.primary, fontSize: 14 },
});

export default EngineControlScreen;
