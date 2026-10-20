// AppHeader.tsx — TOP-HEADER STANDARD: the ONE header every screen uses.
//
// ZONES
//   1. Status bar : device safe-area inset ONLY (never hardcoded); the shared
//      diagonal ramp paints edge-to-edge behind it; status icons forced LIGHT.
//   2. Nav row    : FIXED height (headerSpec.navRowH = 56) on every screen;
//      vertical centre = inset.top + 28; back | title | right slot.
//   3. Extended band (variant="extended" only): the one screen (Home) may add a
//      band; it sits on the ramp's dark backdrop so its white text keeps its
//      contrast. Immersive variant: floating circular back (currently unused).
//
// GRADIENT: the shared DIAGONAL ramp (colors.gradientHeader) painted on a fixed
// nav-row strip, so the hue behind the title is identical on every screen.
// There are NO per-screen overrides any more: the Engine Control P8 overrides
// (its own title size, chevron size, and local gradient) were removed so that
// screen consumes the same shared token as everyone else.
//
// TOUCH: the left and right slots are 44dp wide (the touch-target floor) and
// the right slot is ALWAYS rendered — an empty one is a transparent spacer, so
// the title stays optically centred on screens that have no right action.
import React from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chevron } from '@shared/components/icons';
import { colors, headerSpec, sizes } from '@shared/theme';
import { makeHeightStyle } from '@shared/utils/styleFactories';
import { styles } from './styles';

export type HeaderVariant = 'standard' | 'extended' | 'immersive';

export interface AppHeaderProps {
  /** Header model variant (default 'standard'). Every new screen MUST declare one. */
  variant?: HeaderVariant;
  title?: string;
  onBack?: () => void;
  /** Nav-row right slot for custom actions; touch targets must be >= 44dp. */
  actions?: React.ReactNode;
  /** Right-slot avatar (default true) — `profile_avatar.png`, 32dp, no ring. */
  showAvatar?: boolean;
  /** variant="extended" only: band height below the nav row (default sizes.extendedBandH). */
  bandH?: number;
  /** variant="extended" only: content rendered inside the extended band. */
  bandContent?: React.ReactNode;
}

function AppHeaderImpl({
  variant = 'standard',
  title = 'Details',
  onBack,
  actions,
  showAvatar = true,
  bandH,
  bandContent,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

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
          style={[styles.scrim, makeHeightStyle(insets.top + headerSpec.navRowH)]}
          pointerEvents="none"
        />
        {statusBar}
        {/* floating circular back at inset + 8; title optional in row zone */}
        <View style={makeHeightStyle(insets.top + 8)} />
        <View style={styles.navRow} pointerEvents="box-none">
          <Pressable
            onPress={onBack}
            style={styles.immersiveBack}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={headerSpec.back.label}>
            <Chevron dir="left" color={colors.white} size={headerSpec.back.size} weight={headerSpec.back.weight} />
          </Pressable>
          {title ? (
            <View style={styles.titleContainer} pointerEvents="none">
              <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
                {title}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  const bandHeight = bandH ?? sizes.extendedBandH;
  const total =
    insets.top + headerSpec.navRowH + (variant === 'extended' ? bandHeight : 0);

  return (
    <View style={[styles.container, makeHeightStyle(total)]}>
      {/*
        THE ONE background layer: the shared diagonal ramp painted as the
        header's own background, edge to edge — nav row AND (for the one
        extended screen) the band below it.

        On a standard screen the container IS the nav-row strip, so this is
        byte-identical to the previous strip-only gradient. On the extended
        screen the same single layer continues through the band, so the header
        has exactly ONE gradient surface: no flat slab, no seam, and no
        per-zone duplicate gradient.
      */}
      <LinearGradient
        colors={[...headerSpec.background.colors]}
        start={headerSpec.background.start}
        end={headerSpec.background.end}
        style={styles.gradientStrip}
        pointerEvents="none"
      />
      {statusBar}
      {/*
        `box-none` (not `none`) on the layers that CONTAIN interactive slots:
        on Android, `pointerEvents: 'none'` makes the ViewGroup swallow the
        touch before its children see it, which left the back chevron — and
        every right-slot action — untappable. `box-none` keeps the layer itself
        inert while letting the slots' Pressables receive the touch.
      */}
      <View style={[StyleSheet.absoluteFill, styles.contentLayer]} pointerEvents="box-none">
        <View style={makeHeightStyle(insets.top)} />
        <View style={styles.navRow} pointerEvents="box-none">
          <View style={styles.leftContainer} pointerEvents="box-none">
            {/* 44dp slot + the glyph's own hitSlop = a >= 44 x 48dp target. */}
            <Pressable
              onPress={onBack}
              hitSlop={16}
              accessibilityRole="button"
              accessibilityLabel={headerSpec.back.label}>
              <Chevron dir="left" color={colors.white} size={headerSpec.back.size} weight={headerSpec.back.weight} />
            </Pressable>
          </View>
          <View style={styles.titleContainer} pointerEvents="none">
            <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </View>
          {/* The right slot is ALWAYS rendered — an empty one is a transparent
              spacer that keeps the title optically centred. `box-none` so the
              action inside it stays tappable. */}
          <View style={styles.rightContainer} pointerEvents="box-none">
            {showAvatar ? (
              <View style={styles.avatarContainer}>
                <Image
                  source={require('../../../../assets/profile_avatar.png')}
                  style={styles.avatarImage}
                />
              </View>
            ) : (
              actions
            )}
          </View>
        </View>
        {/* Zone 3 extended band (variant="extended" only) */}
        {variant === 'extended' ? (
          <View style={[styles.extendedBand, makeHeightStyle(bandHeight)]}>
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
