// App.tsx — Connexis Splash Screen
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import DetailsScreen from './src/screens/details/DetailsScreen';

const {width} = Dimensions.get('window');

export default function App() {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showDetails, setShowDetails] = useState(false);

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
    const t = setTimeout(() => setShowDetails(true), 2400);
    return () => clearTimeout(t);
  }, [fadeAnim, scaleAnim]);

  if (showDetails) {
    return <DetailsScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Dark background behind the status bar (edge-to-edge safe) */}
      <View style={styles.statusBarBg} />
      <StatusBar barStyle="light-content" />

      {/* Logo with Animation */}
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

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, {opacity: fadeAnim}]}>
        VEHICLE MANAGEMENT SYSTEM
      </Animated.Text>

      {/* Loading Dots */}
      <Text style={styles.loading}>● ● ●</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffcccc',
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