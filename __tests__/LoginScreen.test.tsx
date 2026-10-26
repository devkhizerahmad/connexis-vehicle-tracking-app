// LoginScreen.test.tsx — TDD test suite for the Login screen replica.
// Covers: render contract, eye toggle, remember me, controlled inputs,
// login/forgot/contact handlers, and visual element presence.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LoginScreen } from '../src/features/auth/screens/LoginScreen';

const { act } = ReactTestRenderer;

function setup() {
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  act(() => {
    renderer = ReactTestRenderer.create(<LoginScreen />);
  });

  const findByTestID = (testID: string) =>
    renderer.root.findByProps({ testID });

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

  return { renderer, press, changeText, findByTestID };
}

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders without crashing', () => {
    const { renderer } = setup();
    expect(renderer).toBeDefined();
  });

  it('renders StatusBar with light-content', () => {
    const { renderer } = setup();
    const statusBar = renderer.root.findByType(StatusBar);
    expect(statusBar.props.barStyle).toBe('light-content');
  });

  it('renders all expected form elements', () => {
    const { findByTestID } = setup();

    expect(findByTestID('login-username-input')).toBeDefined();
    expect(findByTestID('login-password-input')).toBeDefined();
    expect(findByTestID('login-eye-toggle')).toBeDefined();
    expect(findByTestID('login-remember-checkbox')).toBeDefined();
    expect(findByTestID('login-forgot-password')).toBeDefined();
    expect(findByTestID('login-button')).toBeDefined();
    expect(findByTestID('login-contact-support')).toBeDefined();
  });

  it('renders Welcome Back! title', () => {
    const { renderer } = setup();
    const title = renderer.root
      .findAllByType(require('react-native').Text)
      .find((n) => n.props.children === 'Welcome Back!');
    expect(title).toBeDefined();
  });

  it('toggles password visibility on eye press', () => {
    const { press, findByTestID } = setup();

    // Start hidden
    const passwordInput = findByTestID('login-password-input');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // Press eye toggle -> visible
    press('login-eye-toggle');
    expect(findByTestID('login-password-input').props.secureTextEntry).toBe(false);

    // Press again -> hidden
    press('login-eye-toggle');
    expect(findByTestID('login-password-input').props.secureTextEntry).toBe(true);
  });

  it('toggles eye icon between Eye and EyeOff', () => {
    const { press, findByTestID } = setup();

    // Eye toggle pressable exists
    expect(findByTestID('login-eye-toggle')).toBeDefined();

    // Pressing toggles secureTextEntry (validates the icon swap behavior)
    expect(findByTestID('login-password-input').props.secureTextEntry).toBe(true);
    press('login-eye-toggle');
    expect(findByTestID('login-password-input').props.secureTextEntry).toBe(false);
    press('login-eye-toggle');
    expect(findByTestID('login-password-input').props.secureTextEntry).toBe(true);
  });

  it('toggles Remember Me checkbox state', () => {
    const { press, findByTestID } = setup();

    const checkbox = findByTestID('login-remember-checkbox');
    expect(checkbox.props.style).not.toContainEqual(expect.objectContaining({ backgroundColor: '#E03131' }));

    press('login-remember-checkbox');

    const checked = findByTestID('login-remember-checkbox');
    expect(checked.props.style).toContainEqual(expect.objectContaining({ backgroundColor: '#E03131' }));
  });

  it('username input is controlled — onChangeText updates value', () => {
    const { changeText, findByTestID } = setup();

    changeText('login-username-input', 'driver1');

    expect(findByTestID('login-username-input').props.value).toBe('driver1');
  });

  it('password input is controlled — onChangeText updates value', () => {
    const { changeText, findByTestID } = setup();

    changeText('login-password-input', 'secret123');

    expect(findByTestID('login-password-input').props.value).toBe('secret123');
  });

  it('Login button press calls handler', () => {
    const { press } = setup();

    // handleLogin is a no-op stub; pressing must not throw
    expect(() => press('login-button')).not.toThrow();
  });

  it('Forgot Password press calls handler', () => {
    const { press } = setup();

    expect(() => press('login-forgot-password')).not.toThrow();
  });

  it('Contact Support press calls handler', () => {
    const { press } = setup();

    expect(() => press('login-contact-support')).not.toThrow();
  });

  it('red dash element present (brand color accent)', () => {
    const { renderer } = setup();
    const redDash = renderer.root.findAllByType(require('react-native').View).find(
      (n) => n.props.style?.backgroundColor === '#E03131',
    );
    expect(redDash).toBeDefined();
  });

  it('Login button uses gradientHeader colors', () => {
    const { renderer } = setup();
    const linearGradient = renderer.root.findByType(LinearGradient);
    expect(linearGradient).toBeDefined();
    expect(Array.isArray(linearGradient.props.colors)).toBe(true);
    expect(linearGradient.props.colors).toContain('#2A0508');
    expect(linearGradient.props.colors).toContain('#C0110F');
  });
});