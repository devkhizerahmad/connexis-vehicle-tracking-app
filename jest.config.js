module.exports = {
  preset: '@react-native/jest-preset',
  // Allowlist of node_modules that ship untranspiled ESM/JSX and therefore must
  // go through the RN babel preset. The pattern is ANCHORED (^node_modules/)
  // so it only inspects the top-level package: without the anchor the regex
  // re-matches at any nested `node_modules/` and skips deps that live inside an
  // allowlisted package (e.g. react-native-paper-dates' own copy of `color`).
  transformIgnorePatterns: [
    '^node_modules/(?!(react-native|@react-native|@react-navigation|react-native-linear-gradient|react-native-paper|react-native-paper-dates|react-native-vector-icons|react-native-safe-area-context|react-native-screens|react-native-worklets)/)',
  ],
  moduleNameMapper: {
    // Reanimated's bundled mock imports the real package, which loads the
    // native worklets module and throws. Use our self-contained mock instead.
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.js',
  },
};
