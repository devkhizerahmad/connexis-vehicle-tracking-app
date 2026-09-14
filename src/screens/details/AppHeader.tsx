// AppHeader.tsx — gradient status bar + app bar (back chevron, "Details", avatar)
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {VerticalGradient} from './Gradient';
import {Chevron, StatusIcons} from './Icons';
import {C, FS, H, S, SZ} from '../../theme/detailsTokens';

export function AppHeader({onBack}: {onBack?: () => void}) {
  return (
    <View>
      <VerticalGradient height={H.statusBar + H.appBar} />
      <View style={StyleSheet.absoluteFill}>
        {/* iOS status bar */}
        <View
          style={{
            height: H.statusBar,
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingBottom: 6,
            paddingHorizontal: S.statusPadH,
          }}>
          <Text style={{color: C.white, fontSize: FS.statusTime, fontWeight: '600'}}>9:41</Text>
          <View style={{flex: 1}} />
          <StatusIcons />
        </View>
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
