// HomeScreen.tsx — Home tab entry screen (reference mock, S1–S7)
// Header: AppHeader variant="extended" (band 80: greeting + user chip); nav row has the
// standard 56dp row with visual-only back (tab root) + bell action.
import React, { useCallback, useMemo } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import AppHeader from '@shared/components/layout/AppHeader';
import { ScreenState } from '@shared/components/feedback/ScreenState';
import { Toast } from '@shared/components/feedback/Toast';
import { useToast } from '@shared/hooks/useToast';
import { BellIcon, RefreshIcon } from '@shared/components/icons';
import { goToLiveMap, goToReports } from '@shared/utils/navigationHelpers';
import { colors, sizes } from '@shared/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SummaryCards from '@features/home/components/SummaryCards';
import AssetCard from '@features/home/components/AssetCard';
import PromoBanner from '@features/home/components/PromoBanner';
import { useVehicleList } from '@features/home/hooks/useVehicleList';
import { VehicleSummary } from '@features/home/types/home';
import { styles } from './styles';

interface HomeScreenProps {
  navigation?: any;
}

type FeedItem =
  | { kind: 'vehicle'; vehicle: VehicleSummary }
  | { kind: 'promo' };

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { feed, loading, error, retry } = useVehicleList();

  const { message: toast, anim: toastAnim, showToast } = useToast();

  // The bottom bar is drawn by RootNavigator's CustomTabBar (an absolute overlay),
  // so this screen must not render its own BottomNav — that duplicate caused the
  // double-bar bug. The list instead clears the overlay below.
  const insets = useSafeAreaInsets();
  const scrollPadBottom = sizes.bottomNavH + insets.bottom + 12;

  // ── behaviour links (S-behaviour, all mandatory) ──
  const onMoreDetails = useCallback(
    (v: VehicleSummary) => {
      navigation?.navigate('Details', { vehicleId: v.id });
    },
    [navigation],
  );
  const onViewOnMap = useCallback(
    (v: VehicleSummary) => {
      if (navigation) {
        goToLiveMap(navigation, v.id);
      }
    },
    [navigation],
  );
  // The card's "Reports" button opens the Reports tab for THAT card's vehicle.
  // Handler-only change — the button label/icon/style are frozen.
  const onReports = useCallback(
    (v: VehicleSummary) => {
      if (navigation) {
        goToReports(navigation, v.id);
      }
    },
    [navigation],
  );
  const onBell = useCallback(() => showToast('notifications pending'), [showToast]);
  const onMoreInfo = useCallback(() => showToast('More info pending'), [showToast]);
  const onRefresh = useCallback(() => showToast('Refreshing list…'), [showToast]);
  // user chip / avatar -> ProfileTab -> Profile (cross-tab typed)
  const onChipPress = useCallback(() => navigation?.navigate('ProfileTab'), [navigation]);

  // S7 list data: [v1, v2, PROMO, v3, v4]
  const listData = useMemo<FeedItem[]>(() => {
    if (!feed) {
      return [];
    }
    return [
      { kind: 'vehicle', vehicle: feed.vehicles[0] },
      { kind: 'vehicle', vehicle: feed.vehicles[1] },
      { kind: 'promo' },
      { kind: 'vehicle', vehicle: feed.vehicles[2] },
      { kind: 'vehicle', vehicle: feed.vehicles[3] },
    ];
  }, [feed]);

  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) =>
      item.kind === 'promo' ? (
        <PromoBanner promo={feed!.promo} onMoreInfo={onMoreInfo} />
      ) : (
        <AssetCard
          vehicle={item.vehicle}
          onMoreDetails={onMoreDetails}
          onViewOnMap={onViewOnMap}
          onReports={onReports}
        />
      ),
    [feed, onMoreDetails, onMoreInfo, onReports, onViewOnMap],
  );

  // S2 + S3 + S4 above the list
  const listHeader = useMemo(
    () =>
      feed ? (
        <View>
          <SummaryCards summary={feed.summary} />
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Assets List</Text>
            <Pressable
              onPress={onRefresh}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Refresh vehicle list">
              <RefreshIcon color={colors.home.assetsTitle} size={20} />
            </Pressable>
          </View>
        </View>
      ) : null,
    [feed, onRefresh],
  );

  // B6: the feed no longer renders a silent blank list while loading, on
  // failure, or when the account has no vehicles.
  const listEmpty = useMemo(() => {
    if (loading) {
      return <ScreenState kind="loading" message="Loading your vehicles." />;
    }
    if (error) {
      return (
        <ScreenState
          kind="error"
          message="We could not load your vehicles. Check your connection and try again."
          onAction={retry}
        />
      );
    }
    return (
      <ScreenState
        kind="empty"
        message="No vehicles are assigned to this account yet."
      />
    );
  }, [error, loading, retry]);

  return (
    <View style={styles.screen}>
      {/* TOP-HEADER STANDARD: the shared AppHeader already renders the
          light-content StatusBar — this screen's own copy was a duplicate, so
          exactly one remains. */}
      <AppHeader
        variant="extended"
        // PATCH H-A: band tail of 124pt — the greeting/chip stack (29 + 20 + 8 + 30) plus the
        // reference's ~37pt of slack below the chip; the summary row then straddles the
        // gradient bottom by 20pt (list marginTop: -20).
        bandH={124}
        title="Home"
        showAvatar={false}
        onBack={() => {
          // tab root — back chevron is visual-only
        }}
        actions={
          <Pressable
            onPress={onBell}
            hitSlop={13}
            accessibilityRole="button"
            accessibilityLabel="Notifications">
            <BellIcon color={colors.white} size={18} />
          </Pressable>
        }
        bandContent={
          <View style={styles.band}>
            <Text style={styles.greeting}>Hi, Good Morning!</Text>
            <Pressable
              style={styles.chip}
              onPress={onChipPress}
              accessibilityRole="button"
              accessibilityLabel="Adeel Hussein, open profile">
              <Text style={styles.chipName} numberOfLines={1}>Adeel Hussein</Text>
              <Image source={require('../../../../assets/profile_avatar.png')} style={styles.chipAvatar} />
            </Pressable>
          </View>
        }
      />

      <FlatList
        data={listData}
        keyExtractor={item => (item.kind === 'promo' ? 'promo' : item.vehicle.name)}
        renderItem={renderItem}
        ListHeaderComponent={listHeader ?? undefined}
        ListEmptyComponent={listEmpty}
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: scrollPadBottom }]}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />

      <Toast message={toast} anim={toastAnim} testID="home-toast" />
    </View>
  );
}

export default HomeScreen;
