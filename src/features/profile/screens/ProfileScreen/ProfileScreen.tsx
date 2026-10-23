// ProfileScreen.tsx — Profile screen assembly (390x844 reference)
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileActions from '@features/profile/components/ProfileActions';
import ProfileAvatar from '@features/profile/components/ProfileAvatar';
import ProfileDobField from '@features/profile/components/ProfileDobPicker/ProfileDobField';
import ProfileDobSheet from '@features/profile/components/ProfileDobPicker/ProfileDobSheet';
import ProfileFormField from '@features/profile/components/ProfileFormField';
import ProfileHeader from '@features/profile/components/ProfileHeader';
import { useProfile } from '@features/profile/hooks/useProfile';
import { PROFILE_FIELDS } from '@features/profile/types/profile';
import { ProfileStackParamList, RootTabParamList } from '@navigation/types';
import { Toast } from '@shared/components/feedback/Toast';
import { useToast } from '@shared/hooks/useToast';
import { profileTokens } from '@shared/theme';
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

  const { message: toast, anim: toastAnim, showToast } = useToast();
  /** The 3-segment DOB sheet is open. */
  const [dobSheetOpen, setDobSheetOpen] = useState(false);

  const contentStyle = useMemo(
    () => makeProfileScrollContentStyle(insets.bottom),
    [insets.bottom],
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
    const result = await save();
    if (result?.ok) {
      showToast('Profile updated successfully');
      return;
    }
    showToast('Could not update your profile. Try again.');
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
            {PROFILE_FIELDS.map(field =>
              // The Date of Birth row is a BUTTON, not a text input: it opens the
              // international 3-segment (Month / Day / Year) picker with
              // auto-save. Every other row keeps the plain editable field.
              field.key === 'dob' ? (
                <ProfileDobField
                  key={field.key}
                  value={values.dob}
                  onPress={() => setDobSheetOpen(true)}
                  showDivider={field.dividerAfter}
                />
              ) : (
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
              ),
            )}
          </View>

          {/* The 3-segment DOB sheet. Auto-saves on every selection - there is
              no OK/Done button. */}
          <ProfileDobSheet
            visible={dobSheetOpen}
            value={values.dob}
            onChange={iso => setField('dob', iso)}
            onClose={() => setDobSheetOpen(false)}
          />

          <ProfileActions onUpdate={handleUpdate} onLogout={handleLogout} saving={saving} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast
        message={toast}
        anim={toastAnim}
        bottom={profileTokens.space.toastBottom}
        testID="profile-toast"
      />
    </View>
  );
}

export default ProfileScreen;