// App.tsx — thin entry point.
//
// SPLASH: the splash is the native launch window, not a React component.
//   `SplashTheme` (android/app/src/main/res/values/styles.xml) paints the Connexis
//   wordmark on the cream `@color/splashBackground` and stays behind React until the
//   first frame covers it. That means a slow dev bundle shows branding instead of a
//   blank page, and there is exactly ONE splash — the platform one — which is the
//   Android SplashScreen guidance (no JS splash, no artificial minimum duration, no
//   fade-out overlay to hand off from).
//
// AUTH: unauthenticated users see LoginScreen; authenticated users see RootNavigator.
//   Every screen owns its own <StatusBar barStyle="light-content" />.
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@navigation/RootNavigator';
import { LoginScreen } from './src/features/auth/screens/LoginScreen';
import { AuthProvider, useAuth } from './src/features/auth/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <RootNavigator /> : <LoginScreen />;
}
