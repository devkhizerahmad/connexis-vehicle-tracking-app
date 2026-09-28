// styles.ts — HistoryScreen layout (S2 chip row, list gutters, S9 section bar).
import { StyleSheet } from 'react-native';
import { colors } from '@shared/theme';
import { historyColors, historySizes } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  /** S2–S8 stack above the S9 list. */
  header: {
    paddingHorizontal: historySizes.gutter,
    paddingTop: 10,
    gap: 10,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: historySizes.vehicleChipH,
    paddingHorizontal: 10,
    // PATCH T-HISTORY: the reference chip is a rounded rect (~7pt), not a full pill
    borderRadius: 8,
    backgroundColor: historyColors.chipBg,
    maxWidth: '68%',
  },
  vehiclePhoto: {
    // PATCH T-HISTORY: the reference car photo fills most of the chip height
    width: historySizes.vehiclePhotoW,
    height: historySizes.vehiclePhotoH,
    resizeMode: 'contain',
  },
  vehicleName: {
    color: historyColors.chipInk,
    fontSize: 13,
    fontWeight: '700',
  },
  viewLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  viewLiveText: {
    color: historyColors.viewLiveInk,
    fontSize: 13,
  },
  /** S9 dark section header above the virtualised list. */
  sectionBar: {
    paddingHorizontal: 12,
    height: historySizes.panelTitleH,
    justifyContent: 'center',
    backgroundColor: historyColors.sectionBarBg,
  },
  sectionBarText: {
    color: historyColors.sectionBarInk,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default styles;
