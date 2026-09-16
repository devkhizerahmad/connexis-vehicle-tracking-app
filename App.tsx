// App.tsx — thin entry point.
// PATCH H2 boot flow: RootNavigator mounts IMMEDIATELY on first frame (exactly once).
// The splash is an absolutely-positioned overlay on top; it fades out (300ms) only
// after BOTH: NavigationContainer.onReady fired AND >=2400ms elapsed (logo animation
// completes), then the overlay is unmounted entirely (splashGone).
// PATCH H1: native window background = colors.splash (#F8F3F3) — see android
// res/values/colors.xml + styles.xml (safety net for any pre-JS paint gap).
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNavigator from '@navigation/RootNavigator';
import {colors} from '@shared/theme/colors';

const MIN_SPLASH_MS = 2400; // logo spring + 800ms fade + tagline visibility
const FADE_MS = 300;

export default function App() {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const mountedAt = useRef<number>(Date.now());
  const [navReady, setNavReady] = useState(false);
  const [splashGone, setSplashGone] = useState(false);

  // Logo entrance animation (native-driven: scale spring + fade timing).
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // Dismiss: wait for navigator ready + minimum splash time, then fade 1->0 and unmount.
  const fadeScheduled = useRef(false);
  useEffect(() => {
    if (!navReady || fadeScheduled.current) {
      return;
    }
    fadeScheduled.current = true;
    const elapsed = Date.now() - mountedAt.current;
    const delay = Math.max(0, MIN_SPLASH_MS - elapsed);
    const t = setTimeout(() => {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(() => setSplashGone(true));
    }, delay);
    return () => clearTimeout(t);
  }, [navReady, overlayOpacity]);

  // Navigator mounts exactly once; splash renders above it as an overlay.
  // The gap that previously flashed black is now covered by the still-visible splash.
  return (
    <SafeAreaProvider>
      <RootNavigator onReady={() => setNavReady(true)} />

      {!splashGone && (
        <Animated.View
          style={[styles.splashOverlay, {opacity: overlayOpacity}]}
          pointerEvents="auto">
          <View style={styles.statusBarBg} />
          <StatusBar barStyle="light-content" />

          <Animated.View
            style={[
              styles.logoContainer,
              {transform: [{scale: scaleAnim}], opacity: fadeAnim},
            ]}>
            <Image
              source={require('./src/assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.Text style={[styles.tagline, {opacity: fadeAnim}]}>
            VEHICLE MANAGEMENT SYSTEM
          </Animated.Text>

          <Text style={styles.loading}>● ● ●</Text>
        </Animated.View>
      )}
    </SafeAreaProvider>
  );
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  splashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: colors.splash,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBarBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight ?? 0,
    backgroundColor: '#0f0f0f',
  },
  logoContainer: {
    width: width * 0.75,
    height: 110,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    color: '#ea0e0e',
    fontSize: 12,
    letterSpacing: 4,
    marginTop: 28,
    fontWeight: '600',
  },
  loading: {
    color: '#333333',
    fontSize: 18,
    position: 'absolute',
    bottom: 60,
    letterSpacing: 8,
  },
});