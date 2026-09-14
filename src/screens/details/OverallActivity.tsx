// OverallActivity.tsx — segment tabs + Driving Score donut (64%, orange dot at ~140deg) + advice text
import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {SadFace} from './Icons';
import {C, FS, L, R, SZ} from '../../theme/detailsTokens';

function Donut() {
  const c = SZ.donut / 2;
  const r = c - SZ.ringW / 2;
  const rad = (L.donutDotDeg * Math.PI) / 180;
  const dx = c + r * Math.sin(rad) - SZ.dotSize / 2;
  const dy = c - r * Math.cos(rad) - SZ.dotSize / 2;
  return (
    <View
      style={{
        width: SZ.donut,
        height: SZ.donut,
        borderRadius: c,
        borderWidth: SZ.ringW,
        borderColor: C.ringGray,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{fontSize: 14, fontWeight: '700', color: C.dark}}>64%</Text>
      <View
        style={{
          position: 'absolute',
          left: dx,
          top: dy,
          width: SZ.dotSize,
          height: SZ.dotSize,
          borderRadius: SZ.dotSize / 2,
          backgroundColor: C.orange,
        }}
      />
    </View>
  );
}

export function OverallActivity({
  title,
  tabs,
  advice,
}: {
  title: string;
  tabs: string[];
  advice: string;
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
          <Donut />
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

