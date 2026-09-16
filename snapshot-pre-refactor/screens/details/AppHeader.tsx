// AppHeader.tsx — edge-to-edge gradient header (Fix suite v2 / Fix 2):
//  • NO app-drawn status bar (no "9:41", no signal/wifi/battery) — the native OS
//    status bar is the only status row (white icons via barStyle="light-content")
//  • Gradient runs from the very top pixel (behind the transparent status bar)
//  • App bar row (back / "Details" / avatar) offset by the system top inset only
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {VerticalGradient} from './Gradient';
import {Chevron} from './Icons';
import {C, FS, H, S, SZ} from '../../theme/detailsTokens';

export function AppHeader({onBack}: {onBack?: () => void}) {
  const insets = useSafeAreaInsets();
  return (
    <View>
      {/* gradient from y=0, seamless through the app bar (statusBar inset + app bar) */}
      <VerticalGradient height={insets.top + H.appBar} />
      <View style={StyleSheet.absoluteFill}>
        {/* native status bar zone — transparent, system draws the only status row */}
        <View style={{height: insets.top}} />
        {/* App bar */}
        <View
          style={{
            height: H.appBar,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: S.headerPadH,
          }}>
          <View style={{width: SZ.avatar, alignItems: 'flex-start'}}>
            <Pressable onPress={onBack} hitSlop={8}>
              <Chevron dir="left" color={C.white} size={16} />
            </Pressable>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{color: C.white, fontSize: FS.title, fontWeight: '700'}}>Details</Text>
          </View>
          <View style={{width: SZ.avatar}}>
            <Image
              source={require('../../assets/profile.jpeg')}
              style={{width: SZ.avatar, height: SZ.avatar, borderRadius: SZ.avatar / 2}}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
