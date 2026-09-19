// AppHeader.tsx — HEADER STANDARD (PATCH K2): 3-zone header model for ALL screens.
// Zone 1 status bar: device safe-area inset ONLY (never hardcoded); the gradient paints
//   edge-to-edge behind it; status icons forced LIGHT while the header is mounted.
// Zone 2 nav row: FIXED sizes.navRowH (56dp) on every screen; vertical centre = inset + 28;
//   back | title | actions; back touch area >= sizes.touchTarget (48dp via hitSlop).
// Zone 3 extended band: optional, variant="extended" — the ONLY zone allowed to differ
//   per screen (bandH + bandContent props).
// Immersive exception: variant="immersive" — no row background, scrim
//   rgba(0,0,0,0.35) -> transparent, floating circular 48dp back at inset + 8.
// Gradient: Figma-exact colors.gradientHeader (#B2250C 0% -> #160F12 100%, vertical 180°).
// LEGACY-EXCEPTION: contentHeight / contentCenterOffset exist ONLY for the frozen Profile
//   reference design — DO NOT use them in new screens (use variant props instead).
import React from 'react';
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chevron } from '@shared/components/icons';
import { colors, sizes } from '@shared/theme';
import { makeHeightStyle } from '@shared/utils/styleFactories';
import { styles } from './styles';

export type HeaderVariant = 'standard' | 'extended' | 'immersive';

export interface AppHeaderProps {
  /** Header model variant (default 'standard'). Every new screen MUST declare one. */
  variant?: HeaderVariant;
  title?: string;
  onBack?: () => void;
  /** Nav-row right slot for custom actions; touch targets must be >= sizes.touchTarget. */
  actions?: React.ReactNode;
  /** Frozen Details design avatar slot (right). */
  showAvatar?: boolean;
  /** variant="extended" only: band height below the nav row (default sizes.extendedBandH). */
  bandH?: number;
  /** variant="extended" only: content rendered inside the extended band. */
  bandContent?: React.ReactNode;
  /**
   * LEGACY-EXCEPTION: frozen reference design (Profile) — DO NOT use in new screens.
   * @deprecated use variant="standard" | "extended" instead (frozen Profile only).
   */
  contentHeight?: number;
  /**
   * LEGACY-EXCEPTION: frozen reference design (Profile) — DO NOT use in new screens.
   * @deprecated use variant="standard" | "extended" instead (frozen Profile only).
   */
  contentCenterOffset?: number;
}

function AppHeaderImpl({
  variant = 'standard',
  title = 'Details',
  onBack,
  actions,
  showAvatar = true,
  bandH,
  bandContent,
  contentHeight,
  contentCenterOffset,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  // LEGACY-EXCEPTION (frozen Profile): replicates the pre-K2 layout exactly —
  // total = inset + contentHeight, nav-row centre = inset + contentCenterOffset + 28.
  const legacy = contentHeight !== undefined || contentCenterOffset !== undefined;

  // Zone 1: status icons stay LIGHT while any gradient/immersive-dark header is mounted.
  const statusBar = <StatusBar barStyle="light-content" />;

  if (variant === 'immersive') {
    return (
      <View style={styles.immersiveContainer} pointerEvents="box-none">
        {/* top scrim: rgba(0,0,0,0.35) -> transparent across inset + nav row */}
        <LinearGradient
          colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.scrim, makeHeightStyle(insets.top + sizes.navRowH)]}
          pointerEvents="none"
        />
        {statusBar}
        {/* floating circular back at inset + 8; title optional in row zone */}
        <View style={makeHeightStyle(insets.top + 8)} />
        <View style={styles.navRow} pointerEvents="box-none">
          <Pressable onPress={onBack} style={styles.immersiveBack} hitSlop={4}>
            <Chevron dir="left" color={colors.white} size={16} />
          </Pressable>
          {title ? (
            <View style={styles.titleContainer} pointerEvents="none">
              <Text style={styles.titleText}>{title}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  const total = legacy
    ? insets.top + contentHeight!
    : insets.top +
      sizes.navRowH +
      (variant === 'extended' ? bandH ?? sizes.extendedBandH : 0);
  // Zone 2 nav-row top: standard centre = inset + 28 (legacy offset only for frozen Profile)
  const rowTopOffset = legacy ? insets.top + (contentCenterOffset ?? 0) : insets.top;

  return (
    <View style={[styles.container, makeHeightStyle(total)]}>
      {/* Figma-exact vertical gradient — top #B2250C to bottom #160F12 (covers row + band) */}
      <LinearGradient
        colors={[...colors.gradientHeader]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientFill}
        pointerEvents="none"
      />
      {statusBar}
      <View style={[StyleSheet.absoluteFill, styles.contentLayer]} pointerEvents="box-none">
        <View style={makeHeightStyle(rowTopOffset)} />
        <View style={styles.navRow} pointerEvents="box-none">
          <View style={styles.leftContainer} pointerEvents="box-none">
            {/* 16dp chevron + 16dp hitSlop on all sides = 48x48dp touch target */}
            <Pressable onPress={onBack} hitSlop={16}>
              <Chevron dir="left" color={colors.white} size={16} />
            </Pressable>
          </View>
          <View style={styles.titleContainer} pointerEvents="none">
            <Text style={styles.titleText}>{title}</Text>
          </View>
          {showAvatar ? (
            <View style={styles.avatarContainer}>
              <Image
                source={require('../../../../assets/profile.jpeg')}
                style={styles.avatarImage}
              />
            </View>
          ) : actions ? (
            <View style={styles.actionsContainer} pointerEvents="box-none">
              {actions}
            </View>
          ) : null}
        </View>
        {/* Zone 3 extended band (variant="extended" only) */}
        {variant === 'extended' ? (
          <View style={[styles.extendedBand, makeHeightStyle(bandH ?? sizes.extendedBandH)]}>
            {bandContent}
          </View>
        ) : null}
      </View>
    </View>
  );
}

// PATCH K2/T4: memoized — stable props (title/onBack/actions) keep header re-renders 0
// while screens scroll or type (G10).
export const AppHeader = React.memo(AppHeaderImpl);
export default AppHeader;
