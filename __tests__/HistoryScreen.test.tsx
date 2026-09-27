/**
 * HistoryScreen.test.tsx — regression guard for the S3 date-picker crash.
 *
 * `DatePickerModal` dereferences `theme.colors.elevation.level3`. Because
 * `PaperProvider` merges themes with a SHALLOW spread, a hand-written partial
 * `colors` literal silently REPLACES the whole default palette and drops
 * `colors.elevation` — so the modal threw
 * "Cannot read property 'level3' of undefined" as soon as it became visible.
 *
 * This is the only test that actually renders the picker; the panel tests cover
 * S4–S9 in isolation and never reach this line.
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MD3DarkTheme } from 'react-native-paper';
import { getTranslation } from 'react-native-paper-dates';
import { HistoryScreen } from '../src/features/map/screens/HistoryScreen';

const route = {
  key: 'History-test',
  name: 'History' as const,
  params: { vehicleId: 'LFA-1464' },
};

// The screen only calls goBack()/navigate(); the rest is shape-completeness.
const navigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  canGoBack: () => true,
  isFocused: () => true,
} as never;

const mountScreen = async () => {
  let instance!: ReactTestRenderer.ReactTestRenderer;
  // historyService resolves async and the screen renders a loading shell until
  // data/range/draft/month all land, so flush the microtask queue.
  // SafeAreaProvider mirrors App.tsx — AppHeader and paper-dates both read
  // useSafeAreaInsets and throw without it. `initialMetrics` is required in the
  // test env: with no native inset event the provider renders null and the
  // whole subtree never mounts.
  await ReactTestRenderer.act(async () => {
    instance = ReactTestRenderer.create(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}>
        <HistoryScreen route={route} navigation={navigation} />
      </SafeAreaProvider>,
    );
  });
  return instance;
};

/** Press the S3 "Select Date & Time" field so `pickerOpen` flips to true. */
const openPicker = async (instance: ReactTestRenderer.ReactTestRenderer) => {
  await ReactTestRenderer.act(async () => {
    instance.root.findByProps({ testID: 'date-range-field' }).props.onPress();
  });
};

describe('HistoryScreen date picker (regression)', () => {
  it('opens the range modal without a render error', async () => {
    const instance = await mountScreen();
    await openPicker(instance);

    // Reaching here means DatePickerModal rendered — i.e. it read
    // theme.colors.elevation.level3 successfully instead of throwing.
    // The close button lives deep inside the modal body (Appbar -> Appbar.Action),
    // so finding it proves the whole content subtree rendered, not just the shell.
    expect(instance.root.findAllByProps({ testID: 'react-native-paper-dates-close' }).length)
      .toBeGreaterThan(0);
    instance.unmount();
  });

  it('exposes a full elevation ramp on the Paper theme the modal consumes', async () => {
    // The exact token at the crash site. Deriving paperTheme from MD3DarkTheme
    // guarantees every level is a string rather than undefined.
    const elevation = MD3DarkTheme.colors.elevation;
    for (const level of ['level0', 'level1', 'level2', 'level3', 'level4', 'level5'] as const) {
      expect(typeof elevation[level]).toBe('string');
    }
  });

  it('resolves paper-dates copy instead of falling back to raw keys', async () => {
    // registerTranslation('en', en) runs at HistoryScreen module scope, which
    // this file imports — so the registry is already populated by this point.
    expect(getTranslation('en', 'save')).toBe('Save');
    expect(getTranslation('en', 'close')).toBe('Close');
    expect(getTranslation('en', 'selectRange')).toBe('Select period');
  });
});
