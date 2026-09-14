// PlateStatusRow.tsx — 50/50 black plate | green status, height 38
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {C, FS, H, R} from '../../theme/detailsTokens';

export function PlateStatusRow({plate, status}: {plate: string; status: string}) {
  return (
    <View style={[styles.row, {height: H.plateRow, borderRadius: R.plateRow}]}>
      <View style={[styles.seg, {backgroundColor: C.black, alignItems: 'flex-start'}]}>
        <Text style={{color: C.white, fontSize: FS.plate, fontWeight: '600', marginLeft: 12}} numberOfLines={1}>
          {plate}
        </Text>
      </View>
      <View style={[styles.seg, {backgroundColor: C.green}]}>
        <Text style={{color: C.white, fontSize: FS.plate, fontWeight: '700'}}>{status}</Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
