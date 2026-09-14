// OverallActivity.tsx — tabs + Driving Score donut (Fix suite v2 / Fix 3):
// Ring is a PROGRESS gauge. Geometry (gap-first, reference-matched):
//   gap  = (100 - score) x 3.6 deg clockwise from 12 o'clock
//   fill = score x 3.6 deg, from the gap end clockwise, closing at 12 o'clock
//   dot  = 8pt #F5A623 at the arc START (the gap/fill junction)
// Pure RN: track ring + fill from rotated half-ring pieces + track-colored half-ring
// covers (z-ordered so covers never paint the hole). The whole frame is rotated by
// the FINAL gap angle (static) while the sweep animates 0 -> target, so the fill
// grows from its final start position and closes at 12 o'clock; the label counts up.
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Pressable, Text, View} from 'react-native';
import {SadFace} from './Icons';
import {C, FS, L, R, SZ} from '../../theme/detailsTokens';

/** Half-ring piece covering 180deg of the ring band (right or left side). */
function HalfRing({side}: {side: 'right' | 'left'}) {
  const child =
    side === 'right'
      ? {
          left: SZ.donut / 2,
          top: 0,
          width: SZ.donut / 2,
          height: SZ.donut,
          borderRightWidth: SZ.ringW,
          borderTopRightRadius: SZ.donut / 2,
          borderBottomRightRadius: SZ.donut / 2,
        }
      : {
          left: 0,
          top: 0,
          width: SZ.donut / 2,
          height: SZ.donut,
          borderLeftWidth: SZ.ringW,
          borderTopLeftRadius: SZ.donut / 2,
          borderBottomLeftRadius: SZ.donut / 2,
        };
  return (
    <View style={{position: 'absolute', width: SZ.donut, height: SZ.donut}}>
      <View
        style={[
          {position: 'absolute', borderColor: C.ringGray, borderWidth: 0},
          child,
        ]}
      />
    </View>
  );
}

/** Half-ring cover in TRACK color, rotated to hide [deg, deg+180] of the band. */
function Cover({deg}: {deg: number}) {
  return (
    <View
      style={{
        position: 'absolute',
        width: SZ.donut,
        height: SZ.donut,
        transform: [{rotate: `${deg}deg`}],
      }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: SZ.donut / 2,
          width: SZ.donut,
          height: SZ.donut / 2,
          borderTopWidth: SZ.ringW,
          borderColor: C.trackGray,
        }}
      />
    </View>
  );
}

function Donut({score = 64}: {score?: number}) {
  const size = SZ.donut; // 84
  const stroke = SZ.ringW; // 18.5
  const dotSize = SZ.dotSize; // 16
  const c = size / 2; // 42
  const r = c - stroke / 2; // 32.75 (centerline radius)

  const [progress, setProgress] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({value}) => setProgress(value * score));
    return () => anim.removeListener(id);
  }, [anim, score]);

  const currentScore = Math.min(100, Math.max(0, progress));
  const gapDeg = (100 - currentScore) * 3.6; // arc start angle clockwise from 12 o'clock

  // Fix 5: Offset dot into empty gap zone ahead of arc start tip to leave ~3.5-4pt clearance
  const offsetDeg = gapDeg >= 40 ? 18 : gapDeg * 0.45;
  const dotAngle = currentScore >= 99.5 ? 0 : gapDeg - offsetDeg;

  // Polar position for orange dot centered on ring centerline at dotAngle
  const rad = ((dotAngle - 90) * Math.PI) / 180;
  const dotX = c + r * Math.cos(rad);
  const dotY = c + r * Math.sin(rad);

  // For score 100: trim arc sweep by ~8pt arc length (~14deg) at 12 o'clock seam
  const effectiveStartAngle = currentScore >= 99.5 ? 14 : gapDeg;

  const RingView = ({style}: {style?: any}) => (
    <View
      style={[
        {
          position: 'absolute',
          left: 0,
          top: 0,
          width: size,
          height: size,
          borderRadius: c,
          borderWidth: stroke,
          borderColor: C.ringGray,
        },
        style,
      ]}
    />
  );

  return (
    <View style={{width: size, height: size}}>
      {/* SINGLE-ARC GAUGE: #5F656C, stroke 18.5pt, flat ends, zero track underneath */}
      {currentScore > 0.1 && (
        <View style={{position: 'absolute', width: size, height: size}}>
          {/* Quadrant 4 (Top-Left: 270° -> 360°) */}
          {effectiveStartAngle < 360 && (
            <View style={{position: 'absolute', left: 0, top: 0, width: c, height: c, overflow: 'hidden'}}>
              {effectiveStartAngle <= 270 ? (
                <RingView />
              ) : (
                <View style={{position: 'absolute', left: 0, top: 0, width: size, height: size, transform: [{rotate: `${effectiveStartAngle - 270}deg`}]}}>
                  <View style={{position: 'absolute', left: 0, top: 0, width: c, height: size, overflow: 'hidden'}}>
                    <RingView />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Quadrant 3 (Bottom-Left: 180° -> 270°) */}
          {effectiveStartAngle < 270 && (
            <View style={{position: 'absolute', left: 0, top: c, width: c, height: c, overflow: 'hidden'}}>
              {effectiveStartAngle <= 180 ? (
                <RingView style={{top: -c}} />
              ) : (
                <View style={{position: 'absolute', left: 0, top: -c, width: size, height: size, transform: [{rotate: `${effectiveStartAngle - 180}deg`}]}}>
                  <View style={{position: 'absolute', left: 0, top: c, width: size, height: c, overflow: 'hidden'}}>
                    <RingView style={{top: -c}} />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Quadrant 2 (Bottom-Right: 90° -> 180°) */}
          {effectiveStartAngle < 180 && (
            <View style={{position: 'absolute', left: c, top: c, width: c, height: c, overflow: 'hidden'}}>
              {effectiveStartAngle <= 90 ? (
                <RingView style={{left: -c, top: -c}} />
              ) : (
                <View style={{position: 'absolute', left: -c, top: -c, width: size, height: size, transform: [{rotate: `${effectiveStartAngle - 90}deg`}]}}>
                  <View style={{position: 'absolute', left: 0, top: c, width: size, height: c, overflow: 'hidden'}}>
                    <RingView style={{top: -c}} />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Quadrant 1 (Top-Right: 0° -> 90°) */}
          {effectiveStartAngle < 90 && (
            <View style={{position: 'absolute', left: c, top: 0, width: c, height: c, overflow: 'hidden'}}>
              {effectiveStartAngle <= 0 ? (
                <RingView style={{left: -c}} />
              ) : (
                <View style={{position: 'absolute', left: -c, top: 0, width: size, height: size, transform: [{rotate: `${effectiveStartAngle}deg`}]}}>
                  <View style={{position: 'absolute', left: c, top: 0, width: c, height: size, overflow: 'hidden'}}>
                    <RingView style={{left: -c}} />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* ORANGE DOT: #F79C1D, 16pt diameter, separated from arc tip by ~3.5-4pt clearance */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: dotX - dotSize / 2,
          top: dotY - dotSize / 2,
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: C.orangeDot,
        }}
      />

      {/* CENTER LABEL: bold 15pt #3A3F45 centered in hole */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 15, fontWeight: '700', color: C.dark}}>
          {Math.round(currentScore)}%
        </Text>
      </View>
    </View>
  );
}

export function OverallActivity({
  title,
  tabs,
  advice,
  score = 64,
}: {
  title: string;
  tabs: string[];
  advice: string;
  score?: number;
}) {
  const [active, setActive] = useState(0);
  return (
    <View>
      <Text style={{color: C.dark, fontSize: FS.activityTitle, fontWeight: '600'}}>{title}</Text>

      <View style={{flexDirection: 'row', gap: 4, marginTop: 8}}>
        {tabs.map((t, i) => (
          <Pressable
            key={t}
            onPress={() => setActive(i)}
            style={{
              flex: 1,
              height: 30,
              borderRadius: R.tab,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: i === active ? C.red : C.tabIdle,
            }}>
            <Text
              style={{
                fontSize: FS.body,
                fontWeight: i === active ? '700' : '500',
                color: i === active ? C.white : C.grayText,
              }}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {active === 0 ? (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 4}}>
          <View
            style={{
              width: SZ.sadCircle,
              height: SZ.sadCircle,
              borderRadius: SZ.sadCircle / 2,
              backgroundColor: C.sadRed,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SadFace color={C.white} size={SZ.sadCircle * 0.55} />
          </View>
          <Donut score={score} />
          <Text style={{flex: 1, color: C.navGray, fontSize: FS.advice, textAlign: 'center', lineHeight: FS.advice + 5}}>
            {advice}
          </Text>
        </View>
      ) : (
        <View
          style={{
            height: 90,
            marginTop: L.gridGap,
            borderRadius: R.card,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: C.border,
          }}
        />
      )}
    </View>
  );
}

