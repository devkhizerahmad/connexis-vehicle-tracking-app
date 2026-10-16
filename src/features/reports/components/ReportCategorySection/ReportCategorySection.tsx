// ReportCategorySection.tsx — S7–S9: white card with a dark title bar over a
// row of two ReportTiles. Memoized so picking a vehicle / toggling the date
// section does not re-render the tile grid (G2).
import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { reportColors, reportSizes, sizes } from '@shared/theme';
import type { ReportCategory } from '@features/reports/types/reports';
import { ReportTile } from '../ReportTile';

export interface ReportCategorySectionProps {
  category: ReportCategory;
  onTilePress: (title: string) => void;
  onShare: (title: string) => void;
  onAdd: (title: string) => void;
}

function ReportCategorySectionBase({
  category,
  onTilePress,
  onShare,
  onAdd,
}: ReportCategorySectionProps) {
  const tiles = useMemo(
    () =>
      category.tiles.map((tile, index) => (
        <ReportTile
          key={`${category.title}-${index}`}
          tile={tile}
          onPress={onTilePress}
          onShare={onShare}
          onAdd={onAdd}
        />
      )),
    [category, onTilePress, onShare, onAdd],
  );

  return (
    <View style={styles.card} testID={`reports-category-${category.title}`}>
      <View style={styles.header}>
        <Text style={styles.headerText} numberOfLines={1}>
          {category.title}
        </Text>
      </View>
      <View style={styles.body}>{tiles}</View>
    </View>
  );
}

export const ReportCategorySection = memo(ReportCategorySectionBase);
export default ReportCategorySection;

const styles = StyleSheet.create({
  /**
   * PATCH UI-POLISH (PART 6): page gutter comes from the single shared token
   * `sizes.marginH` so this card lines up with the calendar / picker rows
   * above it (same 16 value as before — token consistency, no pixel change).
   * `body` keeps `padding: cardBodyPad`, so the tiles always sit INSIDE this
   * 1pt border and never touch the border line.
   */
  card: {
    marginHorizontal: sizes.marginH,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: reportColors.cardBorder,
    backgroundColor: reportColors.cardBg,
    overflow: 'hidden',
  },
  header: {
    height: reportSizes.cardHeaderH,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: reportColors.cardHeaderBg,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
    color: reportColors.cardHeaderInk,
  },
  body: {
    flexDirection: 'row',
    gap: reportSizes.tileGap,
    padding: reportSizes.cardBodyPad,
  },
});
