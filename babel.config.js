const path = require('path');

// PATCH T-RESOLVE: alias paths ko ABSOLUTE banaya gaya hai.
// Wajah: babel-plugin-module-resolver relative aliases ko process.cwd() se resolve karta hai.
// Jab bundler Metro kisi doosre cwd se chalta hai (misaal: `cd android` ke baad start), to
// './src/navigation' -> '<root>/android/src/navigation' ban jata tha aur Metro
// "Unable to resolve module ./android/src/navigation/RootNavigator from App.tsx" deta tha.
// `cwd: 'babelrc'` + absolute paths = cwd se aazad, hamesha project root se resolve.
const src = (...segments) => path.resolve(__dirname, 'src', ...segments);

module.exports = {
  // RN 0.72+ ke liye:
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        // Relative aliases ko babel config file ke folder se resolve karo (process.cwd() se nahi)
        cwd: 'babelrc',
        // NO "root" option — alias paths project-root se relative hain (double-src bug ka ilaj)
        alias: {
          '@shared': src('shared'),
          '@features': src('features'),
          '@navigation': src('navigation'),
        },
        // .tsx resolution ke liye zaroori (isi ke bagair UnableToResolveError aata tha)
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
    // Reanimated 4 delegates worklet compilation to react-native-worklets.
    // This plugin MUST stay last in the list.
    'react-native-worklets/plugin',
  ],
};

