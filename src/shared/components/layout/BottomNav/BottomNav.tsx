// BottomNav.tsx — fixed 5-tab bar with active red tile derived from navigation state
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DocIcon, HomeIcon, KeyIcon, MapOutline, PersonIcon } from '@shared/components/icons';
import { colors, sizes } from '@shared/theme';
import { styles } from './styles';

function NavIcon({ name, color }: { name: string; color: string }) {
  switch (name) {
    case 'Home':
    case 'HomeTab':
      return <HomeIcon color={color} size={sizes.navIcon} />;
    case 'Report':
    case 'ReportTab':
      return <DocIcon color={color} size={sizes.navIcon} />;
    case 'Engine Control':
    case 'EngineControl':
    case 'EngineControlTab':
      return <KeyIcon color={color} size={sizes.navIcon} />;
    case 'Map':
    case 'MapTab':
      return <MapOutline color={color} size={sizes.navIcon} />;
    case 'Profile':
    case 'ProfileTab':
      return <PersonIcon color={color} size={sizes.navIcon} />;
    default:
      return <DocIcon color={color} size={sizes.navIcon} />;
  }
}

export function BottomNav({
  tabs = ['Home', 'Report', 'Engine Control', 'Map', 'Profile'],
  active = 'Home',
  onTabPress,
}: {
  tabs?: string[];
  active: string;
  onTabPress?: (t: string) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        {
          height: sizes.bottomNav + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}>
      {tabs.map(t => {
        const isActive = t === active || (active === 'Details' && t === 'Home');
        return (
          <Pressable key={t} style={styles.tab} onPress={() => onTabPress?.(t)}>
            {isActive ? (
              <View style={styles.activeTile}>
                <NavIcon name={t} color={colors.white} />
                <Text style={styles.activeText}>{t}</Text>
              </View>
            ) : (
              <View style={styles.idleContainer}>
                <NavIcon name={t} color={colors.icon.navGray} />
                <Text style={styles.idleText}>{t}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export default BottomNav;
