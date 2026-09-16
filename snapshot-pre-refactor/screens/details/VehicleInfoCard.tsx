// VehicleInfoCard.tsx — Fix suite v3 / Fix 1:
//  • Car image: 115x68 (contain) at left 14, top 27 from card top.
//  • Vertical chain: 0 -> +27 (car top) -> +68 (car bot 95) -> +22 (cyan top 117)
//    -> button top 117 -> button bot 147 -> +23 (card bot 170) -> cyan bot ~197 (~27pt hang).
//  • Cyan box: 56% card width, left flush, radius 6, pad 12, bg #45E3F0, body font 10/15lh in 3 lines.
//  • Right column: left edge = cyan right (56%) + pad 8, right edge = card right - 8.
//  • Speed row: MUST fit on 1 line with label 11pt bold #4A4F54, value 11pt regular #7A8288.
//  • Live Location button: top == cyan top (117), left == right column text start (56% + 8 + 26 = 56% + 34pt).
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

const cyanTop = SZ.imgT + SZ.sedanH + SZ.cyanTopGap; // 27 + 68 + 22 = 117

export function VehicleInfoCard(p: Props) {
  return (
    <View style={[styles.card, {minHeight: cyanTop + SZ.btnH + SZ.cardBottomPad}]}>
      {/* Left: car image anchored at (14, 27) — explicit 115x68 fixed box; card does not clip */}
      <View
        style={{
          position: 'absolute',
          left: SZ.imgL,
          top: SZ.imgT,
          width: SZ.sedanW,
          height: SZ.sedanH,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../assets/img_car_sedan.png')}
          style={{
            width: SZ.sedanW,
            height: SZ.sedanH,
          }}
          resizeMode="contain"
        />
      </View>

      {/* Right column — left edge at exactly 56% of card width (=203pt), paddingRight: 4 */}
      <View
        style={{
          marginLeft: `${SZ.cyanWpct}%`,
          paddingLeft: 0,
          paddingRight: 4,
          paddingTop: SZ.colTopPad,
          gap: SZ.colGap,
        }}>
        {/* row1 — speed: MUST stay on one line */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Speedo color={C.brick} size={18} />
          <Text numberOfLines={1} style={{flex: 1, marginLeft: 8}}>
            <Text style={{fontWeight: '700', color: C.grayStrong, fontSize: FS.spLabel, lineHeight: FS.spLh}}>
              {p.speedLabel}
            </Text>
            <Text style={{color: C.grayText, fontSize: FS.spValue, lineHeight: FS.spLh}}>{p.speed}</Text>
          </Text>
        </View>

        {/* row2 — last update: wraps between date and (time) group; line 2 after the icon */}
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <Clock color={C.brick} size={18} />
          <Text numberOfLines={2} style={{flex: 1, marginLeft: 8}}>
            <Text style={{fontWeight: '700', color: C.grayStrong, fontSize: FS.spLabel, lineHeight: FS.spLh}}>
              {p.updateLabel}
            </Text>
            <Text style={{color: C.grayText, fontSize: FS.spValue, lineHeight: FS.spLh}}>{p.update}</Text>
          </Text>
        </View>
      </View>

      {/* row3 — Live Location: ABSOLUTE at top == cyanTop (117);
          left = column left (56%) + btnPinGapL(26) == text start */}
      <View style={{position: 'absolute', left: `${SZ.cyanWpct}%`, top: cyanTop, right: 0}}>
        <Pressable
          onPress={p.onLiveLocation}
          style={{
            alignSelf: 'flex-start',
            marginLeft: SZ.btnPinGapL,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            height: SZ.btnH,
            paddingHorizontal: SZ.btnPadH,
            borderWidth: 1.5,
            borderColor: C.outlineGray,
            borderRadius: R.button,
          }}>
          <Pin color={C.btnPin} size={14} />
          <Text style={{color: C.grayStrong, fontSize: FS.spValue, fontWeight: '500'}}>{p.liveLocation}</Text>
        </Pressable>
      </View>

      {/* CYAN OVERLAY — 56% wide, left-flush, auto height, hangs below card bottom */}
      <View
        pointerEvents="none"
        onLayout={e => p.onCyanHeight?.(e.nativeEvent.layout.height)}
        style={[styles.cyanBox, {top: cyanTop, padding: SZ.cyanPad}]}>
        <ArrowCircle color={C.cyanText} size={14} />
        <View style={{flex: 1, marginLeft: 8}}>
          <Text style={{fontSize: FS.cyanTitle, fontWeight: '700', color: C.cyanText}}>
            {p.lastLocationLabel}
          </Text>
          {/* no numberOfLines -> full address, 3 lines, no ellipsis */}
          <Text
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
    /* no overflow:hidden — cyan box paints below card bottom */
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
