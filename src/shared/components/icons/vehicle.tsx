// vehicle.tsx — sensor, dashboard and asset-card glyphs: gauges, fuel, engine
// temperature, droplet, shield, steering, car, battery, signal and door, plus
// the `TileIcon` dispatcher that maps a mock tile key to its glyph.
import React, { memo } from 'react';
import { View } from 'react-native';
import { colors } from '@shared/theme';
import { styleFactory } from './styles';
import type { IconProps } from './types';

const speedoStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size * 0.62,
    borderTopWidth: size * 0.14,
    borderLeftWidth: size * 0.14,
    borderRightWidth: size * 0.14,
    borderColor: color,
    borderTopLeftRadius: size,
    borderTopRightRadius: size,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  needle: {
    width: size * 0.1,
    height: size * 0.42,
    backgroundColor: color,
    transform: [{ rotate: '35deg' }],
    marginTop: size * 0.1,
  },
}));

export const Speedo = memo(function SpeedoImpl({ color, size }: IconProps) {
  const s = speedoStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.needle} />
    </View>
  );
});

const fuelPumpStyles = styleFactory((color, size) => ({
  root: { flexDirection: 'row', alignItems: 'flex-end', height: size },
  body: {
    width: size * 0.52,
    height: size,
    backgroundColor: color,
    borderRadius: size * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
  },
  window: { width: size * 0.28, height: size * 0.3, backgroundColor: colors.white, borderRadius: 1 },
  hose: { width: size * 0.08, height: size * 0.62, backgroundColor: color, marginLeft: size * 0.06 },
  nozzle: { width: size * 0.22, height: size * 0.1, backgroundColor: color },
}));

export const FuelPump = memo(function FuelPumpImpl({ color, size }: IconProps) {
  const s = fuelPumpStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.body}>
        <View style={s.window} />
      </View>
      <View style={s.hose} />
      <View style={s.nozzle} />
    </View>
  );
});

const thermoStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center' },
  tube: {
    width: size * 0.36,
    height: size * 0.6,
    borderWidth: size * 0.1,
    borderColor: color,
    borderRadius: size * 0.18,
    alignItems: 'center',
  },
  mercury: { width: size * 0.1, height: size * 0.3, backgroundColor: color, marginTop: size * 0.14 },
  bulb: {
    width: size * 0.42,
    height: size * 0.42,
    borderRadius: size * 0.21,
    backgroundColor: color,
    marginTop: -size * 0.12,
  },
}));

export const Thermo = memo(function ThermoImpl({ color, size }: IconProps) {
  const s = thermoStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.tube}>
        <View style={s.mercury} />
      </View>
      <View style={s.bulb} />
    </View>
  );
});

const dropletStyles = styleFactory((color, size) => ({
  root: { width: size, height: size, alignItems: 'center' },
  tip: {
    width: 0,
    height: 0,
    borderLeftWidth: size * 0.18,
    borderRightWidth: size * 0.18,
    borderBottomWidth: size * 0.2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color,
  },
  body: {
    width: size * 0.62,
    height: size * 0.62,
    borderRadius: size * 0.31,
    backgroundColor: color,
    marginTop: -size * 0.04,
  },
}));

export const Droplet = memo(function DropletImpl({ color, size }: IconProps) {
  const s = dropletStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.tip} />
      <View style={s.body} />
    </View>
  );
});

const shieldStyles = styleFactory((color, size) => ({
  shape: {
    width: size * 0.7,
    height: size * 0.86,
    borderWidth: size * 0.1,
    borderColor: color,
    borderTopLeftRadius: size * 0.35,
    borderTopRightRadius: size * 0.35,
    borderBottomLeftRadius: size * 0.35,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
    marginTop: size * 0.04,
  },
}));

export const Shield = memo(function ShieldImpl({ color, size }: IconProps) {
  const s = shieldStyles(color, size);
  return <View style={s.shape} />;
});

const steeringStyles = styleFactory((color, size) => ({
  root: {
    width: size,
    height: size,
    borderWidth: size * 0.1,
    borderColor: color,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    width: size * 0.72,
    height: size * 0.09,
    backgroundColor: color,
    position: 'absolute',
    top: size * 0.3,
  },
  spokeLeft: {
    width: size * 0.09,
    height: size * 0.34,
    backgroundColor: color,
    position: 'absolute',
    bottom: size * 0.08,
    transform: [{ rotate: '28deg' }],
    left: size * 0.18,
  },
  spokeRight: {
    width: size * 0.09,
    height: size * 0.34,
    backgroundColor: color,
    position: 'absolute',
    bottom: size * 0.08,
    transform: [{ rotate: '-28deg' }],
    right: size * 0.18,
  },
  hub: {
    width: size * 0.18,
    height: size * 0.18,
    borderRadius: size * 0.09,
    backgroundColor: color,
    marginTop: size * 0.14,
  },
}));

export const Steering = memo(function SteeringImpl({ color, size }: IconProps) {
  const s = steeringStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.bar} />
      <View style={s.spokeLeft} />
      <View style={s.spokeRight} />
      <View style={s.hub} />
    </View>
  );
});

const carGlyphStyles = styleFactory((color, size) => ({
  root: { width: size, height: size * 0.62, alignItems: 'center' },
  cabin: {
    width: size * 0.8,
    height: size * 0.34,
    borderTopWidth: size * 0.1,
    borderLeftWidth: size * 0.1,
    borderRightWidth: size * 0.1,
    borderColor: color,
    borderTopLeftRadius: size * 0.2,
    borderTopRightRadius: size * 0.2,
  },
  body: { width: size, height: size * 0.14, backgroundColor: color, borderRadius: 2 },
  wheels: { flexDirection: 'row', justifyContent: 'space-between', width: size * 0.9 },
  wheel: {
    width: size * 0.18,
    height: size * 0.18,
    borderRadius: size * 0.09,
    backgroundColor: color,
    marginTop: -1,
  },
}));

/** Car silhouette — Running summary card. */
export const CarGlyph = memo(function CarGlyphImpl({ color, size }: IconProps) {
  const s = carGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.cabin} />
      <View style={s.body} />
      <View style={s.wheels}>
        <View style={s.wheel} />
        <View style={s.wheel} />
      </View>
    </View>
  );
});

const batteryGlyphStyles = styleFactory((color, size) => ({
  root: { width: size, height: size * 0.55, flexDirection: 'row', alignItems: 'center' },
  cell: {
    width: size * 0.78,
    height: size * 0.5,
    borderWidth: size * 0.1,
    borderColor: color,
    borderRadius: 1.5,
  },
  cap: {
    width: size * 0.14,
    height: size * 0.22,
    backgroundColor: color,
    marginLeft: 0.5,
    borderRadius: 0.5,
  },
}));

/** Battery (red/yellow/green variants by color) — AssetCard mini-list. */
export const BatteryGlyph = memo(function BatteryGlyphImpl({ color, size }: IconProps) {
  const s = batteryGlyphStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.cell} />
      <View style={s.cap} />
    </View>
  );
});

const signalBarsStyles = styleFactory((color, size) => {
  /** One bar; only the height differs, so the shared props stay in one place. */
  const bar = { width: size * 0.16, backgroundColor: color, borderRadius: 0.5 };
  return {
    root: {
      width: size,
      height: size * 0.62,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    bar1: { ...bar, height: size * 0.62 * 0.34 },
    bar2: { ...bar, height: size * 0.62 * 0.55 },
    bar3: { ...bar, height: size * 0.62 * 0.78 },
    bar4: { ...bar, height: size * 0.62 * 1 },
  };
});

/** Ascending signal bars (green) — AssetCard mini-list. */
export const SignalBars = memo(function SignalBarsImpl({ color, size }: IconProps) {
  const s = signalBarsStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.bar1} />
      <View style={s.bar2} />
      <View style={s.bar3} />
      <View style={s.bar4} />
    </View>
  );
});

const doorIconStyles = styleFactory((color, size) => ({
  root: {
    width: size * 0.66,
    height: size,
    borderWidth: size * 0.11,
    borderColor: color,
    borderRadius: 1.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: size * 0.12,
  },
  handle: {
    width: size * 0.1,
    height: size * 0.1,
    borderRadius: size * 0.05,
    backgroundColor: color,
  },
}));

/** Vehicle door — sensor strip. */
export const DoorIcon = memo(function DoorIconImpl({ color, size }: IconProps) {
  const s = doorIconStyles(color, size);
  return (
    <View style={s.root}>
      <View style={s.handle} />
    </View>
  );
});

