// LoginScreen.tsx — sign-in screen.
//
// FLOW (OWASP ASVS / NIST 800-63B aligned):
//   1. Client validates presence only — composition rules belong to sign-up,
//      never to sign-in, and the password is passed through verbatim.
//   2. One generic credential error for every failure (no user enumeration).
//   3. Loading state disables the control and blocks double submits.
//   4. Inline field errors + a live-region banner; focus moves to the first
//      invalid field and the error is announced to assistive tech.
//   5. Password managers get `username` / `current-password` autofill tokens;
//      the field is masked, paste is allowed, reveal is explicit.
//   6. Session handling lives in AuthContext (expiry, logout, remember-me).
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertCircle, ArrowRight, Envelope, Eye, EyeOff, Lock } from '@shared/components/icons';
import { colors, headerSpec } from '@shared/theme';
import { useAuth } from '../../context/AuthContext';
import rememberedUsernameStore from '../../services/rememberedUsername';
import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  type AuthError,
} from '../../types/auth';
import { focusScrollDelta } from './scrollMath';
import { heroInsetTop, styles } from './styles';

export interface LoginScreenProps {
  onAuthReady?: () => void;
}

type FieldErrors = {
  username?: string;
  password?: string;
};

const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

export function LoginScreenImpl({ onAuthReady }: LoginScreenProps): React.ReactElement {
  const { login, status } = useAuth();
  const insets = useSafeAreaInsets();
  const submitting = status === 'authenticating';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);
  // Android hands the IME an overlay here (the ScrollView keeps its full
  // layout height), so the content needs the keyboard inset as scrollable
  // space — otherwise a focused field cannot be raised above the IME.
  const [keyboardInset, setKeyboardInset] = useState(0);

  const usernameRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const scrollY = useRef(0);
  const viewportHeight = useRef(0);
  const keyboardHeight = useRef(0);
  const keyboardTop = useRef(0);
  const focusedInput = useRef<React.ComponentRef<typeof TextInput> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Splash handshake: this screen is mounted and painted.
  useEffect(() => {
    onAuthReady?.();
  }, [onAuthReady]);

  // "Remember Me" only restores the USERNAME; the password is never persisted.
  useEffect(() => {
    let cancelled = false;
    rememberedUsernameStore
      .read()
      .then(saved => {
        if (cancelled || !saved) {
          return;
        }
        setUsername(current => (current.length > 0 ? current : saved));
        setRememberMe(true);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  /** Scroll the focused field above the keyboard (measure, then correct). */
  const scrollToField = useCallback((input: React.ComponentRef<typeof TextInput> | null) => {
    if (!input) {
      return;
    }
    focusedInput.current = input;
    const run = () => {
      if (!mounted.current) {
        return;
      }
      input.measureInWindow((_x, y, _width, fieldHeight) => {
        const windowHeight = Dimensions.get('window').height;
        // The ScrollView's own layout height is the truth under Android's
        // adjustResize (Dimensions keeps the full window height). On iOS the
        // KAV does not shrink it, so fall back to window minus keyboard. The
        // IME's top edge wins when available: Samsung's reported height alone
        // under-counts the covered strip by ~29dp.
        const bounds = [
          viewportHeight.current,
          windowHeight - keyboardHeight.current,
          keyboardTop.current,
        ].filter(value => value > 0);
        const visibleHeight = Math.min(...bounds);
        const delta = focusScrollDelta({
          fieldY: y,
          fieldHeight,
          windowHeight: visibleHeight,
          keyboardHeight: 0,
        });
        const scroller = scrollRef.current;
        if (!scroller) {
          return;
        }
        if (delta > 0) {
          scroller.scrollTo({ y: scrollY.current + delta, animated: true });
        } else if (y < 96) {
          scroller.scrollTo({ y: Math.max(0, scrollY.current - (96 - y)), animated: true });
        }
      });
    };
    // Let the keyboard finish animating before measuring.
    setTimeout(run, Platform.OS === 'ios' ? 320 : 120);
  }, []);

  // Keyboard metrics: the IME overlays the window here — neither Dimensions nor
  // the ScrollView's layout height shrinks. Store the measured height and top
  // edge; the height is also applied as scrollable bottom padding (see the
  // ScrollView's contentContainerStyle) so a focused field can clear the IME.
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, event => {
      keyboardHeight.current = event.endCoordinates.height;
      keyboardTop.current = event.endCoordinates.screenY;
      setKeyboardInset(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      keyboardHeight.current = 0;
      keyboardTop.current = 0;
      setKeyboardInset(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Re-scroll after the inset padding has been committed and laid out, so the
  // measurement sees the newly scrollable content (not the pre-keyboard box).
  useEffect(() => {
    const input = focusedInput.current;
    if (keyboardInset <= 0 || !input) {
      return;
    }
    const timer = setTimeout(() => scrollToField(input), 120);
    return () => clearTimeout(timer);
  }, [keyboardInset, scrollToField]);

  const clearFieldError = useCallback((field: 'username' | 'password') => {
    setFieldErrors(prev => {
      if (!prev[field]) {
        return prev;
      }
      return { ...prev, [field]: undefined };
    });
    setFormError(null);
  }, []);

  const handleLogin = useCallback(async () => {
    if (submitting) {
      return;
    }

    const trimmedUsername = username.trim();
    const nextErrors: FieldErrors = {};
    if (!trimmedUsername) {
      nextErrors.username = 'Enter your username.';
    }
    if (!password) {
      nextErrors.password = 'Enter your password.';
    }

    if (nextErrors.username || nextErrors.password) {
      setFieldErrors(nextErrors);
      setFormError(null);
      if (nextErrors.username) {
        usernameRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
      return;
    }

    setFieldErrors({});
    setFormError(null);
    Keyboard.dismiss();

    const outcome = await login({ username: trimmedUsername, password, rememberMe });
    if (!mounted.current || outcome.ok) {
      return;
    }

    const error: AuthError = outcome.error;
    if (error.code === 'validation' && error.field) {
      setFieldErrors({ [error.field]: error.message });
      if (error.field === 'username') {
        usernameRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
      return;
    }

    setFormError(error.message);
    AccessibilityInfo.announceForAccessibility(error.message);
  }, [login, password, rememberMe, submitting, username]);

  const handleUsernameFocus = useCallback(() => {
    setFocusedField('username');
    scrollToField(usernameRef.current);
  }, [scrollToField]);

  const handlePasswordFocus = useCallback(() => {
    setFocusedField('password');
    scrollToField(passwordRef.current);
  }, [scrollToField]);

  const handleFieldBlur = useCallback(() => {
    setFocusedField(null);
    focusedInput.current = null;
  }, []);

  const handleUsernameSubmit = useCallback(() => {
    passwordRef.current?.focus();
  }, []);

  const handleForgotPassword = useCallback(() => {
    // Password reset never discloses whether the account exists (ASVS V2.5.1).
    const name = username.trim();
    if (!name) {
      Alert.alert('Reset password', 'Enter your username first, then tap "Forgot Password?".', [
        { text: 'OK', onPress: () => usernameRef.current?.focus() },
      ]);
      return;
    }
    Alert.alert(
      'Reset password',
      'If an account exists for this username, your fleet administrator will send reset instructions. Passwords are never sent by email.',
      [{ text: 'OK' }],
    );
  }, [username]);

  const handleContactSupport = useCallback(() => {
    Alert.alert(
      'Contact support',
      'Contact your fleet administrator to request an account or report a sign-in problem.',
      [{ text: 'OK' }],
    );
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView behavior={keyboardBehavior} style={styles.kaView}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 16 + keyboardInset },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          onLayout={event => {
            viewportHeight.current = event.nativeEvent.layout.height;
          }}
          onScroll={event => {
            scrollY.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[...headerSpec.background.colors]}
            start={headerSpec.background.start}
            end={headerSpec.background.end}
            style={styles.hero}
            testID="login-hero"
          >
            <View style={[styles.heroContent, { paddingTop: insets.top + heroInsetTop }]}>
              <View style={styles.logoWrap}>
                <Image
                  source={require('../../../../assets/full white color logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                  accessibilityRole="image"
                  accessibilityLabel="Connexis"
                />
              </View>
              <Text testID="login-brand-technologies" style={styles.technologies}>
                TECHNOLOGIES
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.card} testID="login-card">
            <View style={styles.redDash} />
            <Text style={styles.welcomeTitle} accessibilityRole="header">
              Welcome Back!
            </Text>
            <Text style={styles.welcomeSub}>Sign in to your account to continue</Text>

            {formError ? (
              <View
                style={styles.errorBanner}
                testID="login-error"
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
              >
                <AlertCircle color={colors.authErrorText} size={16} />
                <Text style={styles.errorBannerText}>{formError}</Text>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Username</Text>
              <View
                style={[
                  styles.inputRow,
                  focusedField === 'username' && styles.inputRowFocused,
                  fieldErrors.username ? styles.inputRowInvalid : null,
                ]}
              >
                <View style={styles.inputIcon}>
                  <View style={styles.inputIconTint}>
                    <Envelope color={colors.red} size={18} />
                  </View>
                </View>
                <TextInput
                  ref={usernameRef}
                  testID="login-username-input"
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.text.placeholder}
                  value={username}
                  onChangeText={text => {
                    setUsername(text);
                    clearFieldError('username');
                  }}
                  onFocus={handleUsernameFocus}
                  onBlur={handleFieldBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  autoComplete="username"
                  textContentType="username"
                  importantForAutofill="yes"
                  maxLength={MAX_USERNAME_LENGTH}
                  editable={!submitting}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={handleUsernameSubmit}
                  accessibilityLabel="Username"
                  accessibilityHint="Enter the username provided by your administrator"
                  accessibilityState={{ disabled: submitting }}
                />
              </View>
              {fieldErrors.username ? (
                <Text
                  style={styles.fieldError}
                  testID="login-username-error"
                  accessibilityLiveRegion="polite"
                >
                  {fieldErrors.username}
                </Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View
                style={[
                  styles.inputRow,
                  focusedField === 'password' && styles.inputRowFocused,
                  fieldErrors.password ? styles.inputRowInvalid : null,
                ]}
              >
                <View style={styles.inputIcon}>
                  <View style={styles.inputIconTint}>
                    <Lock color={colors.red} size={18} />
                  </View>
                </View>
                <TextInput
                  ref={passwordRef}
                  testID="login-password-input"
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.text.placeholder}
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    clearFieldError('password');
                  }}
                  onFocus={handlePasswordFocus}
                  onBlur={handleFieldBlur}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  autoComplete={Platform.OS === 'android' ? 'current-password' : 'password'}
                  textContentType="password"
                  importantForAutofill="yes"
                  maxLength={MAX_PASSWORD_LENGTH}
                  editable={!submitting}
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                  accessibilityLabel="Password"
                  accessibilityHint="Enter your password, then press Go to sign in"
                  accessibilityState={{ disabled: submitting }}
                />
                <TouchableOpacity
                  testID="login-eye-toggle"
                  style={styles.eyeToggle}
                  onPress={() => setPasswordVisible(visible => !visible)}
                  accessibilityRole="button"
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  accessibilityState={{ selected: passwordVisible }}
                  hitSlop={8}
                >
                  {passwordVisible ? (
                    <EyeOff color={colors.red} size={20} />
                  ) : (
                    <Eye color={colors.red} size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {fieldErrors.password ? (
                <Text
                  style={styles.fieldError}
                  testID="login-password-error"
                  accessibilityLiveRegion="polite"
                >
                  {fieldErrors.password}
                </Text>
              ) : null}
            </View>

            <View style={styles.rememberRow}>
              <TouchableOpacity
                testID="login-remember-checkbox"
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                onPress={() => setRememberMe(checked => !checked)}
                accessibilityRole="checkbox"
                accessibilityLabel="Remember me"
                accessibilityState={{ checked: rememberMe, disabled: submitting }}
                hitSlop={12}
              >
                {rememberMe ? <Text style={styles.checkMark}>✓</Text> : null}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rememberLabelHit}
                onPress={() => setRememberMe(checked => !checked)}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <Text style={styles.rememberLabel}>Remember Me</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="login-forgot-password"
                style={styles.forgotHit}
                onPress={handleForgotPassword}
                accessibilityRole="link"
                accessibilityLabel="Forgot password"
                hitSlop={8}
              >
                <Text style={styles.forgotPassword}>Forgot Password? ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.loginButtonWrap}>
              <TouchableOpacity
                testID="login-button"
                style={[
                  styles.loginButtonPressable,
                  submitting && styles.loginButtonPressableDisabled,
                ]}
                onPress={handleLogin}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel="Login"
                accessibilityState={{ disabled: submitting, busy: submitting }}
              >
                <LinearGradient
                  colors={[colors.red, colors.gradientHeader[1], colors.gradientHeader[0]]}
                  locations={[0, 0.6, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  {submitting ? (
                    <ActivityIndicator color={colors.onAccent} />
                  ) : (
                    <Lock color={colors.onAccent} size={18} />
                  )}
                  <Text style={styles.loginButtonText}>
                    {submitting ? 'Signing in…' : 'Login'}
                  </Text>
                  {submitting ? null : <ArrowRight color={colors.onAccent} size={18} />}
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
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <TouchableOpacity
              testID="login-contact-support"
              style={styles.footerLinkHit}
              onPress={handleContactSupport}
              accessibilityRole="link"
              accessibilityLabel="Contact support"
            >
              <Text style={styles.footerLink}>Contact Support ›</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export const LoginScreen = React.memo(LoginScreenImpl);
export default LoginScreen;
