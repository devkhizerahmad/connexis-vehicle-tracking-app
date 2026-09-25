/**
 * Manual mock for react-native-maps (jest auto-applies root __mocks__ for node
 * modules). The native MapView has no JS implementation in the test env — the
 * mocked components render null so screens can mount and effects can run.
 */
const React = require('react');

const MapView = React.forwardRef(function MockMapView(_props, _ref) {
  return null;
});

module.exports = {
  __esModule: true,
  default: MapView,
  Marker: () => null,
  Polyline: () => null,
  Overlay: () => null,
  PROVIDER_GOOGLE: 'google',
  PROVIDER_DEFAULT: 'default',
};