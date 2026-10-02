const path = require('path');

// Alias paths are ABSOLUTE on purpose: babel-plugin-module-resolver resolves
// relative aliases against process.cwd(). When Metro runs from a different cwd
// (e.g. `cd android` before start), './src/navigation' became
// '<root>/android/src/navigation' and Metro failed with
// "Unable to resolve module ./android/src/navigation/RootNavigator from App.tsx".
// `cwd: 'babelrc'` + absolute paths makes resolution cwd-independent and always
// anchored at the project root.
const src = (...segments) => path.resolve(__dirname, 'src', ...segments);

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        // Resolve relative aliases against this config file's folder, not process.cwd().
        cwd: 'babelrc',
        // NO "root" option — alias paths are already project-root absolute.
        alias: {
          '@shared': src('shared'),
          '@features': src('features'),
          '@navigation': src('navigation'),
        },
        // Required for .tsx resolution (otherwise UnableToResolveError).
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
    // Reanimated 4 delegates worklet compilation to react-native-worklets.
    // This plugin MUST stay last in the list.
    'react-native-worklets/plugin',
  ],
};

