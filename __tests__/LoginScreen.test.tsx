// LoginScreen.test.tsx — contract + auth-flow tests for the sign-in screen.
//
// Pinned by the task (kept intact): testIDs `login-username-input`,
// `login-password-input`, `login-eye-toggle`, `login-remember-checkbox`,
// `login-forgot-password`, `login-button`, `login-contact-support`,
// StatusBar `light-content`, "Welcome Back!", red dash #E03131 and the
// gradient #2A0508/#C0110F. Everything else is new coverage.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Image, StatusBar, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LoginScreen } from '../src/features/auth/screens/LoginScreen';
import { AuthProvider, useAuth } from '../src/features/auth/context/AuthContext';
import authService from '../src/features/auth/services/authService';
import rememberedUsernameStore from '../src/features/auth/services/rememberedUsername';
import { headerSpec } from '../src/shared/theme';
import {
  cardOverlap,
  heroHeight,
  styles as loginStyles,
} from '../src/features/auth/screens/LoginScreen/styles';

const { act } = ReactTestRenderer;

const croppedHero = require('../src/assets/login screen red background - Croped.png');
const fullHero = require('../src/assets/login screen red background.png');
const whiteLogo = require('../src/assets/full white color logo.png');
const oldLogo = require('../src/assets/connexis_logo_white_text.png');

/** Renders the session state next to the screen so tests can observe sign-in. */
function SessionProbe() {
  const { isAuthenticated, session } = useAuth();
  return (
    <Text testID="session-probe">
      {isAuthenticated && session ? `in:${session.username}` : 'out'}
    </Text>
  );
}

async function setup() {
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await act(async () => {
    renderer = ReactTestRenderer.create(
      <AuthProvider>
        <LoginScreen />
        <SessionProbe />
      </AuthProvider>,
    );
  });

  const findByTestID = (testID: string) => renderer.root.findByProps({ testID });

  const press = (testID: string) =>
    act(() => {
      const node = findByTestID(testID);
      if (typeof node.props.onPress !== 'function') {
        throw new Error(`no onPress on ${testID}`);
      }
      node.props.onPress();
    });

  const changeText = (testID: string, text: string) =>
    act(() => {
      const node = findByTestID(testID);
      if (typeof node.props.onChangeText !== 'function') {
        throw new Error(`no onChangeText on ${testID}`);
      }
      node.props.onChangeText(text);
    });

  const submit = async () => {
    await press('login-button');
    await flushTimers();
  };

  const text = (value: string) =>
    renderer.root.findAllByType(Text).find(node => node.props.children === value);

  return { renderer, press, changeText, submit, findByTestID, text };
}

/** Resolves the mock service latency (650-800ms) under fake timers. */
async function flushTimers(ms = 2000) {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    authService.__resetForTests();
    rememberedUsernameStore.__resetForTests();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('render contract (pinned)', () => {
    it('renders without crashing', async () => {
      const { renderer } = await setup();
      expect(renderer).toBeDefined();
    });

    it('renders StatusBar with light-content', async () => {
      const { renderer } = await setup();
      const statusBar = renderer.root.findByType(StatusBar);
      expect(statusBar.props.barStyle).toBe('light-content');
    });

    it('renders all expected form elements', async () => {
      const { findByTestID } = await setup();

      expect(findByTestID('login-username-input')).toBeDefined();
      expect(findByTestID('login-password-input')).toBeDefined();
      expect(findByTestID('login-eye-toggle')).toBeDefined();
      expect(findByTestID('login-remember-checkbox')).toBeDefined();
      expect(findByTestID('login-forgot-password')).toBeDefined();
      expect(findByTestID('login-button')).toBeDefined();
      expect(findByTestID('login-contact-support')).toBeDefined();
    });

    it('renders Welcome Back! title', async () => {
      const { text } = await setup();
      expect(text('Welcome Back!')).toBeDefined();
    });

    it('red dash element present (brand color accent)', async () => {
      const { renderer } = await setup();
      const redDash = renderer.root
        .findAllByType(require('react-native').View)
        .find(node => node.props.style?.backgroundColor === '#E03131');
      expect(redDash).toBeDefined();
    });

    it('Login button uses gradientHeader colors', async () => {
      const { findByTestID } = await setup();
      const linearGradient = findByTestID('login-button').findByType(LinearGradient);
      expect(Array.isArray(linearGradient.props.colors)).toBe(true);
      expect(linearGradient.props.colors).toContain('#2A0508');
      expect(linearGradient.props.colors).toContain('#C0110F');
    });
  });

  describe('reference layout', () => {
    it('paints the hero with the shared header gradient, not an image', async () => {
      const { renderer, findByTestID } = await setup();
      const hero = findByTestID('login-hero');

      expect(hero.type).toBe(LinearGradient);
      expect(hero.props.colors).toEqual([...headerSpec.background.colors]);
      expect(hero.props.start).toEqual(headerSpec.background.start);
      expect(hero.props.end).toEqual(headerSpec.background.end);
      expect(StyleSheet.flatten(loginStyles.hero)?.height).toBe(heroHeight);

      const images = renderer.root.findAllByType(Image);
      expect(images.some(node => node.props.source === croppedHero)).toBe(false);
      expect(images.some(node => node.props.source === fullHero)).toBe(false);
    });

    it('uses the full-white wordmark asset', async () => {
      const { renderer } = await setup();
      const images = renderer.root.findAllByType(Image);

      expect(images.some(node => node.props.source === whiteLogo)).toBe(true);
      expect(images.some(node => node.props.source === oldLogo)).toBe(false);

      const logo = images.find(node => node.props.source === whiteLogo);
      expect(logo?.props.resizeMode).toBe('contain');
    });

    it('shows TECHNOLOGIES under the logo instead of the tagline', async () => {
      const { findByTestID, text } = await setup();

      expect(findByTestID('login-brand-technologies').props.children).toBe('TECHNOLOGIES');
      expect(text('Secure • Smart • Connected')).toBeUndefined();
    });

    it('uses the light page fill behind the hero', () => {
      expect(StyleSheet.flatten(loginStyles.root)?.backgroundColor).toBe('#F7F7FB');
    });

    it('overlaps the card onto the hero', async () => {
      const { findByTestID } = await setup();
      const style = StyleSheet.flatten(findByTestID('login-card').props.style);
      expect(style.marginTop).toBe(-cardOverlap);
    });

    it('renders flat white fields with a pale outline', () => {
      expect(StyleSheet.flatten(loginStyles.inputRow)).toEqual(
        expect.objectContaining({
          backgroundColor: '#FFFFFF',
          borderColor: '#E6EAF2',
          height: 52,
        }),
      );
    });

    it('keeps footer copy readable on the light page', () => {
      expect(StyleSheet.flatten(loginStyles.footerText)?.color).toBe('#5F6D87');
      expect(StyleSheet.flatten(loginStyles.footerLink)?.color).toBe('#E03131');
    });
  });

  describe('password field', () => {
    it('toggles password visibility on eye press', async () => {
      const { press, findByTestID } = await setup();

      expect(findByTestID('login-password-input').props.secureTextEntry).toBe(true);

      await press('login-eye-toggle');
      expect(findByTestID('login-password-input').props.secureTextEntry).toBe(false);

      await press('login-eye-toggle');
      expect(findByTestID('login-password-input').props.secureTextEntry).toBe(true);
    });

    it('exposes the reveal control state to assistive tech', async () => {
      const { press, findByTestID } = await setup();

      expect(findByTestID('login-eye-toggle').props.accessibilityLabel).toBe('Show password');
      await press('login-eye-toggle');
      expect(findByTestID('login-eye-toggle').props.accessibilityLabel).toBe('Hide password');
    });

    it('is controlled — onChangeText updates value', async () => {
      const { changeText, findByTestID } = await setup();
      await changeText('login-password-input', 'secret123');
      expect(findByTestID('login-password-input').props.value).toBe('secret123');
    });

    it('offers password-manager autofill hints', async () => {
      const { findByTestID } = await setup();
      const input = findByTestID('login-password-input');
      expect(input.props.textContentType).toBe('password');
      expect(input.props.autoComplete).toBe(
        require('react-native').Platform.OS === 'android' ? 'current-password' : 'password',
      );
      expect(input.props.importantForAutofill).toBe('yes');
    });
  });

  describe('username field', () => {
    it('is controlled — onChangeText updates value', async () => {
      const { changeText, findByTestID } = await setup();
      await changeText('login-username-input', 'driver1');
      expect(findByTestID('login-username-input').props.value).toBe('driver1');
    });

    it('offers password-manager autofill hints', async () => {
      const { findByTestID } = await setup();
      const input = findByTestID('login-username-input');
      expect(input.props.textContentType).toBe('username');
      expect(input.props.autoComplete).toBe('username');
      expect(input.props.autoCorrect).toBe(false);
    });
  });

  describe('Remember Me', () => {
    it('toggles the checkbox state', async () => {
      const { press, findByTestID } = await setup();

      const checkbox = findByTestID('login-remember-checkbox');
      expect(checkbox.props.style).not.toContainEqual(
        expect.objectContaining({ backgroundColor: '#E03131' }),
      );

      await press('login-remember-checkbox');

      const checked = findByTestID('login-remember-checkbox');
      expect(checked.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#E03131' }),
      );
      expect(checked.props.accessibilityState.checked).toBe(true);
    });
  });

  describe('validation', () => {
    it('blocks submit and shows both inline errors when fields are empty', async () => {
      const loginSpy = jest.spyOn(authService, 'login');
      const { submit, findByTestID } = await setup();

      await submit();

      expect(loginSpy).not.toHaveBeenCalled();
      expect(findByTestID('login-username-error').props.children).toBe('Enter your username.');
      expect(findByTestID('login-password-error').props.children).toBe('Enter your password.');
      expect(findByTestID('session-probe').props.children).toBe('out');
    });

    it('treats a whitespace-only username as empty', async () => {
      const loginSpy = jest.spyOn(authService, 'login');
      const { changeText, submit, findByTestID } = await setup();

      await changeText('login-username-input', '   ');
      await changeText('login-password-input', 'Demo@1234');
      await submit();

      expect(loginSpy).not.toHaveBeenCalled();
      expect(findByTestID('login-username-error')).toBeDefined();
    });

    it('clears a field error as soon as the user types', async () => {
      const { submit, changeText, findByTestID, renderer } = await setup();

      await submit();
      expect(findByTestID('login-username-error')).toBeDefined();

      await changeText('login-username-input', 'd');
      const remaining = renderer.root.findAllByProps({ testID: 'login-username-error' });
      expect(remaining).toHaveLength(0);
    });
  });

  describe('authentication', () => {
    it('shows the busy state while the credential check runs', async () => {
      const { changeText, press, findByTestID } = await setup();

      await changeText('login-username-input', 'demo');
      await changeText('login-password-input', 'Demo@1234');
      await press('login-button');

      // Timers not advanced: the mock service is still "in flight".
      const button = findByTestID('login-button');
      expect(button.props.accessibilityState).toEqual({ disabled: true, busy: true });
      expect(button.props.disabled).toBe(true);

      // Settle the pending credential check so the test leaves no timers behind.
      await flushTimers();
    });

    it('signs in with valid credentials', async () => {
      const { changeText, submit, findByTestID, text } = await setup();

      await changeText('login-username-input', 'demo');
      await changeText('login-password-input', 'Demo@1234');
      await submit();

      expect(findByTestID('session-probe').props.children).toBe('in:demo');
      expect(text('Incorrect username or password. Please try again.')).toBeUndefined();
    });

    it('shows one generic error for a wrong password', async () => {
      const { changeText, submit, findByTestID, text } = await setup();

      await changeText('login-username-input', 'demo');
      await changeText('login-password-input', 'wrong-password');
      await submit();

      expect(findByTestID('login-error')).toBeDefined();
      expect(text('Incorrect username or password. Please try again.')).toBeDefined();
      expect(findByTestID('session-probe').props.children).toBe('out');
    });

    it('shows the identical generic error for an unknown username (no enumeration)', async () => {
      const { changeText, submit, findByTestID, text } = await setup();

      await changeText('login-username-input', 'nobody-here');
      await changeText('login-password-input', 'whatever');
      await submit();

      expect(findByTestID('login-error')).toBeDefined();
      expect(text('Incorrect username or password. Please try again.')).toBeDefined();
    });

    it('persists only the username when Remember Me is checked', async () => {
      const { changeText, press, submit } = await setup();

      await press('login-remember-checkbox');
      await changeText('login-username-input', 'demo');
      await changeText('login-password-input', 'Demo@1234');
      await submit();

      expect(await rememberedUsernameStore.read()).toBe('demo');
    });

    it('stores nothing when Remember Me is unchecked', async () => {
      const { changeText, submit } = await setup();

      await changeText('login-username-input', 'demo');
      await changeText('login-password-input', 'Demo@1234');
      await submit();

      expect(await rememberedUsernameStore.read()).toBeNull();
    });

    it('locks out after five failed attempts with a retry hint', async () => {
      const { changeText, submit, text } = await setup();

      await changeText('login-username-input', 'demo');
      await changeText('login-password-input', 'wrong-password');

      for (let attempt = 0; attempt < 5; attempt += 1) {
        await submit();
      }

      expect(
        text('Too many failed attempts. Try again in 30 seconds.'),
      ).toBeDefined();
    });
  });
});
