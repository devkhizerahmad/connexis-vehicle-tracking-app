// RoutesCard.tsx — navy header (collapsible, 250ms) + timeline of 3 route stops + View More link
import React, {useRef, useState} from 'react';
import {Animated, Easing, Pressable, StyleSheet, Text, View} from 'react-native';
import {Chevron, RouteIcon} from './Icons';
import {Collapsible} from './Collapsible';
import {badgeColor, C, FS, H, L, R, S, SZ, statusColor} from '../../theme/detailsTokens';

export interface RouteStop {
  n: string;
  color: string;
  address: string;
  time: string;
  status: string;
  statusColor: string;
  duration: string;
}

interface Props {
  routes: RouteStop[];
  viewMore: string;
  onViewMore?: () => void;
}

export function RoutesCard({routes, viewMore, onViewMore}: Props) {
  const [expanded, setExpanded] = useState(true); // shown on first load
  // chevronRotation: 0 when open, 180 when closed — animated in sync with state
  const rot = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !expanded;
    setExpanded(next); // 1. flip state
    Animated.timing(rot, {
      // 2. animate chevron 0 <-> 180 over 250ms ease-out
      toValue: next ? 0 : 1,
      duration: L.collapseMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      {/* ENTIRE header row is the tap target (including empty space) */}
      <Pressable
        style={[styles.header, {height: H.sectionHeader, borderRadius: R.card}]}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{expanded}}>
        <RouteIcon color={C.white} size={SZ.headerIcon - 2} />
        <Text style={[styles.headerTitle, {marginLeft: 6}]}>Routes</Text>
        <View style={{flex: 1}} />
        <Animated.View
          style={{
            transform: [
              {rotate: rot.interpolate({inputRange: [0, 1], outputRange: ['0deg', '180deg']})},
            ],
          }}>
          <Chevron dir="down" color={C.white} size={SZ.headerIcon} />
        </Animated.View>
      </Pressable>

      {/* Body ALWAYS mounted (never unmounted) — Collapsible animates height+opacity */}
      <Collapsible open={expanded}>
        <View
          style={{
            backgroundColor: C.white,
            borderRadius: R.card,
            padding: S.tilePad + 2,
            marginTop: L.gridGap,
            shadowColor: C.black,
            shadowOpacity: 0.05,
            shadowRadius: 4,
            shadowOffset: {width: 0, height: 1},
            elevation: 1,
          }}>
          {routes.map((r, i) => (
            <View key={r.n} style={{flexDirection: 'row'}}>
              {/* Badge + dashed connector */}
              <View style={{width: SZ.badge, alignItems: 'center'}}>
                <View
                  style={{
                    width: SZ.badge,
                    height: SZ.badge,
                    borderRadius: R.badge,
                    backgroundColor: badgeColor(r.color),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: C.white, fontSize: FS.badge, fontWeight: '700'}}>{r.n}</Text>
                </View>
                {i < routes.length - 1 ? (
                  <View style={{width: 0, flex: 1, minHeight: 26, borderLeftWidth: 1, borderLeftColor: C.dash, borderStyle: 'dashed', marginVertical: 2}} />
                ) : null}
              </View>

              {/* Middle: address / time / status */}
              <View style={{flex: 1, paddingLeft: 8, paddingBottom: 10}}>
                <Text style={{color: C.mid, fontSize: FS.address, lineHeight: FS.address + 4}} numberOfLines={2}>
                  {r.address}
                </Text>
                <Text style={{color: C.sub, fontSize: FS.small, marginTop: 2}}>{r.time}</Text>
                <Text style={{color: statusColor(r.statusColor), fontSize: FS.body, marginTop: 2, fontWeight: '600'}}>
                  {r.status}
                </Text>
              </View>

              {/* Right: duration */}
              <Text style={{color: C.sub, fontSize: FS.small, paddingTop: 2}}>{r.duration}</Text>
            </View>
          ))}

          <Pressable style={{alignSelf: 'flex-end', padding: 2}} onPress={onViewMore}>
            <Text style={{color: C.navy, fontSize: FS.body, fontWeight: '600'}}>{viewMore}</Text>
          </Pressable>
        </View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: C.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: S.sectionPadH,
    borderRadius: R.card,
  },
  headerTitle: {
    color: C.white,
    fontSize: FS.sectionTitle,
    fontWeight: '700',
  },
});
