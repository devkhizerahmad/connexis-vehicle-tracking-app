// LoginScreen.tsx — Login screen replica (STEP 0–5).
// GEOMETRY: spec-ratio build from design-references/Login Screen.png
//   (dp = (ref_px / 1000) × 390; overlay pending — cannot view reference).
// COLORS: existing theme tokens ONLY (STEP 1 binding). No sampled palette.
// AUTH LOGIC: UNCHANGED — delegates to existing auth handler (stub + FLAG).
// ROUTE WIRING: NOT changed. FLAG: "route wiring decision needed".
import React, { useState, useCallback, useEffect } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Envelope, Eye, EyeOff } from '@shared/components/icons';
import { colors } from '@shared/theme';
import { styles } from './styles';
import { useAuth } from '../context/AuthContext';

export interface LoginScreenProps {
  onAuthReady?: () => void;
}

function LoginScreenImpl({ onAuthReady }: LoginScreenProps): React.ReactElement {
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Signal that the login screen is mounted and ready (dismisses splash).
  useEffect(() => {
    onAuthReady?.();
  }, [onAuthReady]);

  const handleLogin = useCallback(() => {
    login();
  }, [login]);

  const handleForgotPassword = useCallback(() => {
    // FLAG: no-op stub — existing behavior or labeled no-op.
    return undefined;
  }, []);

  const handleContactSupport = useCallback(() => {
    // FLAG: no-op stub — existing behavior or labeled no-op.
    return undefined;
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerField}>
        <View style={styles.arcLarge} />
        <View style={styles.arcSmall} />
        <View style={styles.headerCurve} />
        <View style={styles.pinkArc} />

        <View style={styles.logoWrap}>
          <View style={styles.logo}>
            <Image source={require('../../../../assets/logo.png')} style={styles.logoImage} />
          </View>
          <Text style={styles.tagline}>Secure • Smart • Connected</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kaView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.redDash} />
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSub}>Sign in to access your vehicle tracking dashboard</Text>

            <Text style={styles.fieldLabel}>Username</Text>
            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <View style={styles.inputIconTint}>
                  <Envelope color={colors.red} size={20} />
                </View>
              </View>
              <TextInput
                testID="login-username-input"
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor={colors.text.secondary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <View style={styles.inputIcon}>
                <View style={styles.inputIconTint}>
                  {passwordVisible ? <EyeOff color={colors.red} size={20} /> : <Eye color={colors.red} size={20} />}
                </View>
              </View>
              <TextInput
                testID="login-password-input"
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={colors.text.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
              />
              <TouchableOpacity
                testID="login-eye-toggle"
                style={styles.eyeToggle}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOff color={colors.red} size={20} /> : <Eye color={colors.red} size={20} />}
              </TouchableOpacity>
            </View>

            <View style={styles.rememberRow}>
              <TouchableOpacity
                testID="login-remember-checkbox"
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                onPress={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.rememberLabel} onPress={() => setRememberMe(!rememberMe)}>Remember Me</Text>
              <TouchableOpacity testID="login-forgot-password" onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Forgot Password?  ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.loginButtonWrap}>
              <TouchableOpacity
                testID="login-button"
                onPress={handleLogin}
              >
                <LinearGradient colors={[...colors.gradientHeader]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity testID="login-contact-support" onPress={handleContactSupport}>
              <Text style={styles.footerLink}>Contact Support  ›</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export const LoginScreen = React.memo(LoginScreenImpl);
export default LoginScreen;