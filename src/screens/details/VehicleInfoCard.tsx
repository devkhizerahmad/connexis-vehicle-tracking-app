// VehicleInfoCard.tsx — sedan illustration, speed/update rows, cyan Last Location callout + Live Location button
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Clock, Pin, Speedo} from './Icons';
import {C, FS, L, R, S, SZ} from '../../theme/detailsTokens';

interface Props {
  speedLabel: string;
  speed: string;
  updateLabel: string;
  update: string;
  lastLocationLabel: string;
  location: string;
  liveLocation: string;
  onLiveLocation?: () => void;
}

export function VehicleInfoCard(p: Props) {
  return (
    <View style={[styles.card, {borderRadius: R.vehicleCard, padding: S.vehicleCardPad}]}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={require('../../assets/img_car_sedan.png')}
          style={{width: SZ.sedanW, height: SZ.sedanH}}
          resizeMode="contain"
        />
        <View style={{flex: 1, justifyContent: 'center', paddingLeft: 8, gap: 6}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
            <Speedo color={C.red} size={16} />
            <Text style={styles.label}>{p.speedLabel}</Text>
            <Text style={[styles.value, {fontWeight: '700'}]}>{p.speed}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
            <Clock color={C.red} size={14} />
            <Text style={styles.label}>{p.updateLabel}</Text>
            <Text style={styles.value}>{p.update}</Text>
          </View>
        </View>
      </View>

      <View style={{flexDirection: 'row', gap: L.gridGap, marginTop: 10, alignItems: 'center'}}>
        {/* Cyan callout ~60% width */}
        <View style={{flex: L.calloutFlex, backgroundColor: C.cyan, borderRadius: R.tile, padding: S.tilePad + 2, flexDirection: 'row', gap: 6}}>
          <View style={{paddingTop: 2}}>
            <Pin color={C.cyanText} size={13} />
          </View>
          <View style={{flex: 1}}>
            <Text style={{color: C.cyanText, fontSize: FS.cyanTitle, fontWeight: '700'}}>{p.lastLocationLabel}</Text>
            <Text style={{color: C.cyanText, fontSize: FS.cyanBody, marginTop: 2, lineHeight: FS.cyanBody + 3}}>
              {p.location}
            </Text>
          </View>
        </View>
        {/* Outlined Live Location button */}
        <Pressable
          onPress={p.onLiveLocation}
          style={{
            flex: L.sideFlex,
            backgroundColor: C.white,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: R.button,
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 5,
          }}>
          <Pin color={C.textDark} size={12} />
          <Text style={{color: C.textDark, fontSize: FS.body}}>{p.liveLocation}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    shadowColor: C.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  label: {color: C.grayText, fontSize: FS.body},
  value: {color: C.textDark, fontSize: FS.body, fontWeight: '600'},
});
