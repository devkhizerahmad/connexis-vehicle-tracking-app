// index.tsx — dependency-free icon barrel
//
// Every glyph is hand-drawn from `View`/`Text` primitives (no SVG runtime), so
// the set has no dependencies beyond react-native. The implementations live in
// sibling modules, split by domain:
//
//   primitives.tsx     chevrons, pin, clock, tick, star, grid, ruler
//   navigation.tsx     bottom-nav glyphs + arrows and carets
//   vehicle.tsx        gauges/sensors, car, battery, signal, door
//   tiles.tsx          TileIcon dispatcher + tile-only drawings
//   map.tsx            route, stop, flag, fence, group, geofence, teardrop pin
//   reports.tsx        report tiles, clipboard, highway, share, add
//   status.tsx         alert/check circles, sad face, alert ring
//   playback.tsx       history playback ring, calendar, transport runes
//   engineControl.tsx  locks, support, camera, external link, shield-check
//
// Shared plumbing: `styles.ts` (memoised `StyleSheet.create` sheets, shared
// rules) and `types.ts` (the `IconProps` contract).
//
// Each glyph is wrapped in `React.memo`, and every one is re-exported here, so
// the public import surface is unchanged:
//
//   import { Pin } from '@shared/components/icons';
//
// The visual output of every glyph is byte-identical to the original single-file
// implementation: same viewBox-less geometry, colours, stroke widths, testIDs
// and accessibility props — this is a structural split only.
export type { IconProps } from './types';

export { Chevron, ChevronDown, Pin, Clock, CheckMark, StarIcon, GridIcon, Ruler } from './primitives';
export {
  HomeIcon,
  DocIcon,
  KeyIcon,
  PersonIcon,
  MapOutline,
  ListIcon,
  BellIcon,
  ArrowLeft,
  ArrowRight,
  ArrowCircle,
  CaretSolid,
  NavArrow,
  RefreshIcon,
} from './navigation';
export {
  Speedo,
  FuelPump,
  Thermo,
  Droplet,
  Shield,
  Steering,
  CarGlyph,
  BatteryGlyph,
  SignalBars,
  DoorIcon,
} from './vehicle';
export { TileIcon } from './tiles';
export { RouteIcon, StopSign, FlagIcon, Fence, Group, TeardropPin, GeofenceGlyph } from './map';
export { Clipboard, ReportIcon, HighwayGlyph, ShareGlyph, PlusCircleGlyph } from './reports';
export { AlertCircle, CheckCircle, SadFace, AlertRing, WarningTriangle, CirclePlay } from './status';
export { StatusRing, CalendarGlyph, TransportGlyph } from './playback';
export {
  LockGlyph,
  UnlockGlyph,
  SupportGlyph,
  CameraLockGlyph,
  ExternalLinkGlyph,
  ShieldCheckGlyph,
} from './engineControl';
