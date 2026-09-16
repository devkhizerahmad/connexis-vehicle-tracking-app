module.exports = {
  // RN 0.72+ ke liye:
  presets: ['module:@react-native/babel-preset'],
  // RN 0.71 ya purani ho to upar wali line ki jagah:
  // presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        // NO "root" option — alias paths project-root se relative hain (double-src bug ka ilaj)
        alias: {
          '@shared': './src/shared',
          '@features': './src/features',
          '@navigation': './src/navigation',
        },
        // .tsx resolution ke liye zaroori (isi ke bagair UnableToResolveError aata tha)
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
  ],
};

