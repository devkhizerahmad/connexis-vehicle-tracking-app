/* eslint-env jest */
// jest.setup.js — global test environment.
// `react-native-safe-area-context` needs its official Jest mock, otherwise every
// screen that reads insets throws "No safe area value available" under
// react-test-renderer (the native provider is not mounted there).
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);
