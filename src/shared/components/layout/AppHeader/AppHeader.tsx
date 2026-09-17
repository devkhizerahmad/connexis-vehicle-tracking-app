// AppHeader.tsx — single shared edge-to-edge gradient header (Details + Profile).
// PATCH I3: gradient band is now a native LinearGradient (react-native-linear-gradient)
// using colors.gradientHeader (#EA0E0E → #000000, vertical). Content layer unchanged.
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chevron } from '@shared/components/icons';
import { colors, sizes } from '@shared/theme';
import { makeHeightStyle } from '@shared/utils/styleFactories';
import { styles } from './styles';

export function AppHeader({
  onBack,
  title = 'Details',
  contentHeight = sizes.appBar,
  contentCenterOffset = 0,
  showAvatar = true,
}: {
  onBack?: () => void;
  title?: string;
  /** Gradient band height below the safe-area inset (Details = 56, Profile = 100). */
  contentHeight?: number;
  /** Vertical offset so a taller band can place the title row's centre lower. */
  contentCenterOffset?: number;
  showAvatar?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    // PATCH I3: explicit height (inset + content band) — the native gradient is
    // absolute-filled, so the container itself must size the header again.
    <View style={[styles.container, makeHeightStyle(insets.top + contentHeight)]}>
      {/* PATCH I3: native vertical gradient — top #EA0E0E to bottom #000000 */}
      <LinearGradient
        colors={[...colors.gradientHeader]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientFill}
      />
      <View style={[StyleSheet.absoluteFill, styles.contentLayer]}>
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
