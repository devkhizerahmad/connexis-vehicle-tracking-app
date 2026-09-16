// AppHeader.tsx — single shared edge-to-edge gradient header (Details + Profile)
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MultiStopGradient, VerticalGradient } from '@shared/components/feedback/Gradient';
import { Chevron } from '@shared/components/icons';
import { colors, sizes } from '@shared/theme';
import { GradientStop } from '@shared/types/common';
import { makeHeightStyle } from '@shared/utils/styleFactories';
import { styles } from './styles';

export function AppHeader({
  onBack,
  title = 'Details',
  contentHeight = sizes.appBar,
  contentCenterOffset = 0,
  gradientStops,
  showAvatar = true,
}: {
  onBack?: () => void;
  title?: string;
  /** Gradient band height below the safe-area inset (Details = 56, Profile = 100). */
  contentHeight?: number;
  /** Vertical offset so a taller band can place the title row's centre lower. */
  contentCenterOffset?: number;
  /** Multi-stop gradient override (e.g. the Profile artboard stops). */
  gradientStops?: readonly GradientStop[];
  showAvatar?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {gradientStops ? (
        <MultiStopGradient height={insets.top + contentHeight} stops={gradientStops} />
      ) : (
        <VerticalGradient height={insets.top + contentHeight} />
      )}
      <View style={StyleSheet.absoluteFill}>
        <View style={makeHeightStyle(insets.top + contentCenterOffset)} />
        <View style={styles.appBar}>
          <View style={styles.leftContainer}>
            <Pressable onPress={onBack} hitSlop={8}>
              <Chevron dir="left" color={colors.white} size={16} />
            </Pressable>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          {showAvatar ? (
            <View style={styles.avatarContainer}>
              <Image
                source={require('../../../../assets/profile.jpeg')}
                style={styles.avatarImage}
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default AppHeader;
