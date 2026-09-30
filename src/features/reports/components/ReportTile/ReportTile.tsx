// ReportTile.tsx — one tile inside a category card (S7–S9).
// 100pt tall, radius 4: a coloured cap (glyph top-left, share top-right,
// title bottom-left) over a white body (description + optional green "+").
// The "Other" tile sets showPlus=false and therefore has NO green circle.
import React, { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ArrowRight,
  FlagIcon,
  GeofenceGlyph,
  HighwayGlyph,
  ListIcon,
  PlusCircleGlyph,
  ShareGlyph,
  Steering,
} from '@shared/components/icons';
import { reportColors, reportSizes } from '@shared/theme';
import type { ReportIconKey, ReportTile as ReportTileData } from '@features/reports/types/reports';

interface GlyphProps {
  color: string;
  size: number;
}

/** Maps the mock's `iconKey` to its glyph. White on the coloured cap. */
const GLYPHS: Record<ReportIconKey, (p: GlyphProps) => React.JSX.Element> = {
  list: ListIcon,
  flag: FlagIcon,
  highway: HighwayGlyph,
  steering: Steering,
  geofence: GeofenceGlyph,
  // "Other" uses the same share-ish arrow affordance as its body copy implies
  other: ArrowRight,
};

export interface ReportTileProps {
  tile: ReportTileData;
  onPress: (title: string) => void;
  onShare: (title: string) => void;
  onAdd: (title: string) => void;
}

function ReportTileBase({ tile, onPress, onShare, onAdd }: ReportTileProps) {
  const Glyph = GLYPHS[tile.iconKey] ?? ListIcon;

  const handlePress = useCallback(() => onPress(tile.title), [onPress, tile.title]);
  const handleShare = useCallback(() => onShare(tile.title), [onShare, tile.title]);
  const handleAdd = useCallback(() => onAdd(tile.title), [onAdd, tile.title]);

  const cap = useMemo(
    () => [styles.cap, { backgroundColor: tile.color }],
    [tile.color],
  );

  return (
    <Pressable
      style={styles.tile}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={tile.title}
      testID={`reports-tile-${tile.title}`}>
      {/* coloured cap */}
      <View style={cap}>
        <View style={styles.capTopRow}>
          <Glyph color={reportColors.tileTitleInk} size={reportSizes.tileIcon} />
          <Pressable
            onPress={handleShare}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Share ${tile.title}`}
            testID={`reports-share-${tile.title}`}>
            <ShareGlyph color={reportColors.tileTitleInk} size={reportSizes.tileShare} />
          </Pressable>
        </View>
        <Text style={styles.capTitle} numberOfLines={1}>
          {tile.title}
        </Text>
      </View>

      {/* white body */}
      <View style={styles.body}>
        <Text style={styles.bodyDesc} numberOfLines={2}>
          {tile.desc}
        </Text>
        {tile.showPlus ? (
          <Pressable
            style={styles.plus}
            onPress={handleAdd}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`More ${tile.title}`}
            testID={`reports-plus-${tile.title}`}>
            <PlusCircleGlyph color={reportColors.plusGreen} size={reportSizes.tilePlus} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

export const ReportTile = memo(ReportTileBase);
export default ReportTile;

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    height: reportSizes.tileH,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: reportColors.cardBg,
  },
  cap: {
    height: reportSizes.tileCapH,
    paddingHorizontal: 10,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  capTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  capTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: reportColors.tileTitleInk,
    paddingBottom: 8,
  },
  body: {
    height: reportSizes.tileBodyH,
    paddingLeft: 10,
    paddingTop: 8,
    paddingRight: 8,
  },
  bodyDesc: {
    fontSize: 9,
    color: reportColors.tileDescInk,
  },
  plus: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
});
