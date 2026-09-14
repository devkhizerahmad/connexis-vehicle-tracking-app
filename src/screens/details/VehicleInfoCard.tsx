// VehicleInfoCard.tsx — 45/55 split, van image, brick-red stats, Live Location button,
// cyan Last-Location overlay that hangs ~1/3 below the card (card overflow visible)
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {ArrowCircle, Clock, Pin, Speedo} from './Icons';
import {C, FS, R, SZ} from '../../theme/detailsTokens';

interface Props {
  speedLabel: string;
  speed: string;
  updateLabel: string;
  update: string;
  lastLocationLabel: string;
  location: string;
  liveLocation: string;
  onLiveLocation?: () => void;
  /** measured height of the cyan overlay (for downstream spacing) */
  onCyanHeight?: (h: number) => void;
}

const cyanTop = SZ.imgT + SZ.sedanH + SZ.cyanTopGap;

export function VehicleInfoCard(p: Props) {
  return (
    <View style={styles.card}>
      <View style={{flexDirection: 'row'}}>
        {/* Left column 45% — van image anchored at (14, 26) */}
        <View style={{width: `${SZ.leftColPct}%`}}>
          <Image
            source={require('../../assets/img_car_sedan.png')}
            style={{
              position: 'absolute',
              left: SZ.imgL,
              top: SZ.imgT,
              width: SZ.sedanW,
              height: SZ.sedanH,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Right column 55% — stats + button (defines card height) */}
        <View style={{width: `${SZ.rightColPct}%`, paddingTop: SZ.imgT, gap: SZ.colGap}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Speedo color={C.brick} size={18} />
            <Text numberOfLines={1} style={{flex: 1, marginLeft: 6}}>
              <Text style={{fontWeight: '700', color: C.grayStrong, fontSize: FS.spLabel}}>{p.speedLabel}</Text>
              <Text style={{color: C.grayText, fontSize: FS.spValue}}>{p.speed}</Text>
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Clock color={C.brick} size={18} />
            <Text numberOfLines={2} style={{flex: 1, marginLeft: 6}}>
              <Text style={{fontWeight: '700', color: C.grayStrong, fontSize: FS.spLabel}}>{p.updateLabel}</Text>
              <Text style={{color: C.grayText, fontSize: FS.spValue}}>{p.update}</Text>
            </Text>
          </View>

          <View style={{alignSelf: 'flex-start'}}>
            <Pressable
              onPress={p.onLiveLocation}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                height: SZ.btnH,
                paddingHorizontal: SZ.btnPadH,
                borderWidth: 1.5,
                borderColor: C.outlineGray,
                borderRadius: R.button,
              }}>
              <Pin color={C.outlineGray} size={14} />
              <Text style={{color: C.grayStrong, fontSize: FS.spValue}}>{p.liveLocation}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* 24pt bottom padding (card stops at Live Location + 24) */}
      <View style={{height: SZ.cardBottomPad}} />

      {/* CYAN OVERLAY — absolute, hangs below card bottom (card must not clip it) */}
      <View
        pointerEvents="none"
        onLayout={e => p.onCyanHeight?.(e.nativeEvent.layout.height)}
        style={[styles.cyanBox, {top: cyanTop, padding: SZ.cyanPad}]}>
        <ArrowCircle color={C.cyanText} size={14} />
        <View style={{flex: 1, marginLeft: 8}}>
          <Text style={{fontSize: FS.cyanTitle, fontWeight: '700', color: C.cyanText}}>
            {p.lastLocationLabel}
          </Text>
          <Text
            numberOfLines={3}
            style={{fontSize: FS.cyanBody, color: C.cyanText, lineHeight: FS.cyanBodyLh, marginTop: 3}}>
            {p.location}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: R.vehicleCard,
    shadowColor: C.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    /* no overflow:sitenote — children may paint outside bounds */
  },
  cyanBox: {
    position: 'absolute',
    left: 0,
    width: `${SZ.cyanWpct}%`,
    backgroundColor: C.cyan,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
