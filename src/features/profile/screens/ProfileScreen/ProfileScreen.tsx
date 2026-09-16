// ProfileScreen.tsx — Profile screen assembly (390x844 reference)
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileActions from '@features/profile/components/ProfileActions';
import ProfileAvatar from '@features/profile/components/ProfileAvatar';
import ProfileFormField from '@features/profile/components/ProfileFormField';
import ProfileHeader from '@features/profile/components/ProfileHeader';
import { useProfile } from '@features/profile/hooks/useProfile';
import { PROFILE_FIELDS } from '@features/profile/types/profile';
import { ProfileStackParamList, RootTabParamList } from '@navigation/types';
import { spacing } from '@shared/theme';
import { makeProfileScrollContentStyle } from '@shared/utils/styleFactories';
import { styles } from './styles';

type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

/** Keyboard avoidance strategy per platform: padding on iOS, height on Android. */
type KeyboardBehavior = 'padding' | 'height' | 'position' | undefined;

const KEYBOARD_BEHAVIOR: KeyboardBehavior = Platform.select({
  ios: 'padding' as const,
  android: 'height' as const,
  default: 'height' as const,
});

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const { values, setField, save, saving } = useProfile();

  const [toast, setToast] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const contentStyle = useMemo(
    () => makeProfileScrollContentStyle(insets.bottom),
    [insets.bottom],
  );

  const showToast = useCallback(
    (message: string) => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
      setToast(message);
      Animated.timing(toastAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      toastTimer.current = setTimeout(() => {
        Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      }, spacing.toastMs);
    },
    [toastAnim],
  );

  useEffect(
    () => () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    },
    [],
  );

  /** Back chevron pops the tab stack (falls back to the Home tab). */
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation
      .getParent<BottomTabNavigationProp<RootTabParamList>>()
      ?.navigate('HomeTab', { screen: 'Home' });
  }, [navigation]);

  const handleUpdate = useCallback(async () => {
    await save();
    showToast('Profile updated successfully');
  }, [save, showToast]);

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // TODO: navigate to the Auth flow once authentication screens exist.
          showToast('Logged out');
        },
      },
    ]);
  }, [showToast]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView style={styles.flex} behavior={KEYBOARD_BEHAVIOR}>
        <ScrollView
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* PATCH F: the header stays INSIDE the scroll content so the avatar —
              its immediate next sibling in tree order — paints ABOVE the gradient
              (later sibling wins on both platforms) and is not clipped by the
              ScrollView's top edge on Android. */}
          <ProfileHeader onBack={handleBack} />
          <ProfileAvatar />

          <View style={styles.formCard}>
            {PROFILE_FIELDS.map(field => (
              <ProfileFormField
                key={field.key}
                fieldKey={field.key}
                label={field.label}
                value={values[field.key]}
                placeholder={field.placeholder}
                keyboardType={field.keyboardType}
                showDivider={field.dividerAfter}
                onChange={setField}
              />
            ))}
          </View>

          <ProfileActions onUpdate={handleUpdate} onLogout={handleLogout} saving={saving} />
        </ScrollView>
      </KeyboardAvoidingView>

      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.toast, { opacity: toastAnim }]}>
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default ProfileScreen;