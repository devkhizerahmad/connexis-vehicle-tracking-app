// BottomNav.tsx — fixed 5-tab bar with active red Home tile
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {DocIcon, HomeIcon, KeyIcon, MapOutline, PersonIcon} from './Icons';
import {C, FS, H, R, SZ} from '../../theme/detailsTokens';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function NavIcon({name, color}: {name: string; color: string}) {
  switch (name) {
    case 'Home':
      return <HomeIcon color={color} size={SZ.navIcon} />;
    case 'Report':
      return <DocIcon color={color} size={SZ.navIcon} />;
    case 'Engine Control':
      return <KeyIcon color={color} size={SZ.navIcon} />;
    case 'Map':
      return <MapOutline color={color} size={SZ.navIcon} />;
    case 'Profile':
      return <PersonIcon color={color} size={SZ.navIcon} />;
    default:
      return <DocIcon color={color} size={SZ.navIcon} />;
  }
}

export function BottomNav({
  tabs,
  active,
  onTabPress,
}: {
  tabs: string[];
  active: string;
  onTabPress?: (t: string) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        {
          height: H.bottomNav + insets.bottom,
          paddingBottom: insets.bottom,
          shadowColor: C.black,
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: {width: 0, height: -2},
          elevation: 8,
        },
      ]}>
      {tabs.map(t => {
        const isActive = t === active;
        return (
          <Pressable key={t} style={styles.tab} onPress={() => onTabPress?.(t)}>
            {isActive ? (
              <View
                style={{
                  width: 52,
                  height: 40,
                  borderRadius: R.navActive,
                  backgroundColor: C.red,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}>
                <NavIcon name={t} color={C.white} />
                <Text style={{color: C.white, fontSize: FS.navLabel, fontWeight: '600'}}>{t}</Text>
              </View>
            ) : (
              <View style={{alignItems: 'center', gap: 3}}>
                <NavIcon name={t} color={C.navGray} />
                <Text style={{color: C.navGray, fontSize: FS.navLabel}}>{t}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
