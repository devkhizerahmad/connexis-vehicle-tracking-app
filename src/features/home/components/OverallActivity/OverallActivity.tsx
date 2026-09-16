// OverallActivity.tsx — tabs + Driving Score donut
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { SadFace } from '@shared/components/icons';
import { colors, sizes } from '@shared/theme';
import { styles } from './styles';

function Donut({ score = 64 }: { score?: number }) {
  const size = sizes.donut; // 84
  const stroke = sizes.ringW; // 18.5
  const dotSize = sizes.dotSize; // 16
  const c = size / 2; // 42
  const r = c - stroke / 2; // 32.75

  const [progress, setProgress] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({ value }) => setProgress(value * score));
    return () => anim.removeListener(id);
  }, [anim, score]);

  const currentScore = Math.min(100, Math.max(0, progress));
  const gapDeg = (100 - currentScore) * 3.6;

  const offsetDeg = gapDeg >= 40 ? 18 : gapDeg * 0.45;
  const dotAngle = currentScore >= 99.5 ? 0 : gapDeg - offsetDeg;

  const rad = ((dotAngle - 90) * Math.PI) / 180;
  const dotX = c + r * Math.cos(rad);
  const dotY = c + r * Math.sin(rad);

  const effectiveStartAngle = currentScore >= 99.5 ? 14 : gapDeg;

  const RingView = ({ style }: { style?: any }) => (
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
                  borderColor: colors.text.sub,
        },
        style,
      ]}
    />
  );

  return (
    <View style={{ width: size, height: size }}>
      {currentScore > 0.1 && (
        <View style={{ position: 'absolute', width: size, height: size }}>
          {effectiveStartAngle < 360 && (
            <View style={{ position: 'absolute', left: 0, top: 0, width: c, height: c, overflow: 'hidden' }}>
              {effectiveStartAngle <= 270 ? (
                <RingView />
              ) : (
                <View style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, transform: [{ rotate: `${effectiveStartAngle - 270}deg` }] }}>
                  <View style={{ position: 'absolute', left: 0, top: 0, width: c, height: size, overflow: 'hidden' }}>
                    <RingView />
                  </View>
                </View>
              )}
            </View>
          )}

          {effectiveStartAngle < 270 && (
            <View style={{ position: 'absolute', left: 0, top: c, width: c, height: c, overflow: 'hidden' }}>
              {effectiveStartAngle <= 180 ? (
                <RingView style={{ top: -c }} />
              ) : (
                <View style={{ position: 'absolute', left: 0, top: -c, width: size, height: size, transform: [{ rotate: `${effectiveStartAngle - 180}deg` }] }}>
                  <View style={{ position: 'absolute', left: 0, top: c, width: size, height: c, overflow: 'hidden' }}>
                    <RingView style={{ top: -c }} />
                  </View>
                </View>
              )}
            </View>
          )}

          {effectiveStartAngle < 180 && (
            <View style={{ position: 'absolute', left: c, top: c, width: c, height: c, overflow: 'hidden' }}>
              {effectiveStartAngle <= 90 ? (
                <RingView style={{ left: -c, top: -c }} />
              ) : (
                <View style={{ position: 'absolute', left: -c, top: -c, width: size, height: size, transform: [{ rotate: `${effectiveStartAngle - 90}deg` }] }}>
                  <View style={{ position: 'absolute', left: 0, top: c, width: size, height: c, overflow: 'hidden' }}>
                    <RingView style={{ top: -c }} />
                  </View>
                </View>
              )}
            </View>
          )}

          {effectiveStartAngle < 90 && (
            <View style={{ position: 'absolute', left: c, top: 0, width: c, height: c, overflow: 'hidden' }}>
              {effectiveStartAngle <= 0 ? (
                <RingView style={{ left: -c }} />
              ) : (
                <View style={{ position: 'absolute', left: -c, top: 0, width: size, height: size, transform: [{ rotate: `${effectiveStartAngle}deg` }] }}>
                  <View style={{ position: 'absolute', left: c, top: 0, width: c, height: size, overflow: 'hidden' }}>
                    <RingView style={{ left: -c }} />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: dotX - dotSize / 2,
          top: dotY - dotSize / 2,
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
                    backgroundColor: colors.orange,
        }}
      />

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text.score, textAlign: 'center' }}>
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
      <Text style={styles.title}>{title}</Text>

      <View style={styles.tabRow}>
        {tabs.map((t, i) => (
          <Pressable
            key={t}
            onPress={() => setActive(i)}
            style={[
              styles.tab,
              i === active ? styles.tabActive : styles.tabIdle,
            ]}>
            <Text
              style={[
                styles.tabText,
                i === active ? styles.tabTextActive : styles.tabTextIdle,
              ]}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {active === 0 ? (
        <View style={styles.contentRow}>
          <View style={styles.sadCircle}>
            <SadFace color={colors.white} size={sizes.sadCircle * 0.55} />
          </View>
          <Donut score={score} />
          <Text style={styles.adviceText}>{advice}</Text>
        </View>
      ) : (
        <View style={styles.placeholderBox} />
      )}
    </View>
  );
}

export default OverallActivity;
