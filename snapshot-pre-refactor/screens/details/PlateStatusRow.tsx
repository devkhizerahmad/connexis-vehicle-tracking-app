// PlateStatusRow.tsx — 59% black plate | 41% green status (+check), height 44, contiguous
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CheckMark} from './Icons';
import {C, FS, H, R, SZ} from '../../theme/detailsTokens';

export function PlateStatusRow({plate, status}: {plate: string; status: string}) {
  return (
    <View style={[styles.row, {height: H.plateRow, borderRadius: R.plateRow}]}>
      <View style={[styles.seg, {flex: SZ.plateBlackPct, backgroundColor: C.black, alignItems: 'flex-start'}]}>
        <Text style={{color: C.white, fontSize: FS.plate, fontWeight: '700', marginLeft: 12}} numberOfLines={1}>
          {plate}
        </Text>
      </View>
      <View style={[styles.seg, {flex: SZ.plateGreenPct, backgroundColor: C.plateGreen}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <CheckMark color={C.white} size={16} />
          <Text style={{color: C.white, fontSize: FS.plate, fontWeight: '700'}}>{status}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  seg: {
    justifyContent: 'center',
  },
});
