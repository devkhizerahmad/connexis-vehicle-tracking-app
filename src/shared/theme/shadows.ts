// shadows.ts — cross-platform shadow styles
import { Platform, ViewStyle } from 'react-native';

export const shadows: Record<string, ViewStyle> = {
  card: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: {
      elevation: 2,
    },
    default: {
      elevation: 2,
    },
  }) as ViewStyle,
};
