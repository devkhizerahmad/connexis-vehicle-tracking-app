// Manual mock for react-native-reanimated.
//
// Reanimated's own `mock.js` still imports the real package, which pulls in the
// native worklets module and throws under Jest. This mock is self-contained:
// worklet callbacks run inline, and animated styles are captured as plain
// objects so assertions can read them.
const React = require('react');
const { View, Text, Image, ScrollView, FlatList } = require('react-native');

let sharedValueId = 0;

/** A stand-in for a Reanimated shared value: readable/writable `.value`. */
const makeSharedValue = initial => {
  sharedValueId += 1;
  return { __id: sharedValueId, value: initial };
};

const useSharedValue = initial => {
  const ref = React.useRef(null);
  if (ref.current === null) {
    ref.current = makeSharedValue(initial);
  }
  return ref.current;
};

const useDerivedValue = fn => {
  const ref = React.useRef(null);
  if (ref.current === null) {
    ref.current = makeSharedValue(undefined);
  }
  ref.current.value = fn();
  return ref.current;
};

/** Worklet bodies run synchronously; the "animated" style is a plain object. */
const useAnimatedStyle = fn => fn();
const useAnimatedProps = fn => fn();
const useAnimatedRef = () => React.useRef(null);

const withTiming = toValue => toValue;
const withDelay = (_delay, value) => value;
const withSequence = (...values) => values[values.length - 1];
const withRepeat = value => value;
const cancelAnimation = () => {};

const runOnJS = fn => fn;
const runOnUI = fn => fn;

const Easing = {
  linear: t => t,
  ease: t => t,
  in: fn => fn,
  out: fn => fn,
  inOut: fn => fn,
  bezier: () => t => t,
};

module.exports = {
  __esModule: true,
  default: {
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
  },
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useAnimatedRef,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  cancelAnimation,
  runOnJS,
  runOnUI,
  Easing,
  createAnimatedComponent: Component => Component,
};
