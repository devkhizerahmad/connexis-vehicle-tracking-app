// RESERVED: pending LiveMap/Reports screens (alert/success banner)

// Banner component index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@shared/theme';
import { AlertCircle, CheckCircle } from '@shared/components/icons';

interface BannerProps {
  kind: 'alert' | 'success';
  text: string;
}

export const Banner: React.FC<BannerProps> = ({ kind, text }) => {
  const isAlert = kind === 'alert';
  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: isAlert ? colors.surface.alertBg : colors.surface.bannerGreen },
      ]}>
      {isAlert ? (
        <AlertCircle color={colors.surface.alertText} size={14} />
      ) : (
        <CheckCircle color={colors.white} size={14} />
      )}
      <Text
        style={[
          styles.text,
          { color: isAlert ? colors.surface.alertText : colors.white },
        ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginTop: spacing.gridGap,
    borderRadius: radii.banner,
    padding: spacing.tilePad,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    flex: 1,
  },
});

export default Banner;
