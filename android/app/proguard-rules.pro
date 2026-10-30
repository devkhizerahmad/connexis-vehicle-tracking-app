# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in getDefaultProguardFile("proguard-android-optimize.txt")

# Keep React Native NativeModules & JNI methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# React Native core
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# React Native Reanimated & Worklets
-keep class com.swmansion.reanimated.** { *; }
-keep class com.worklets.** { *; }

# React Native Maps & Google Play Services
-keep class com.rnmaps.maps.** { *; }
-keep class com.google.android.gms.maps.** { *; }
-dontwarn com.google.android.gms.**

# Keep annotations and inner classes
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# Room / WorkManager (pulled in by react-native-maps).
# Room instantiates the generated `*_Impl` class through reflection and needs its
# no-arg constructor, but room-runtime 2.5's own consumer rule only keeps the class —
# R8 then strips the constructor and the app crashes at startup with
# "Failed to create an instance of class androidx.work.impl.WorkDatabase".
-keep class * extends androidx.room.RoomDatabase { <init>(); }
-keep class androidx.work.impl.WorkDatabase_Impl { *; }

# Keep OkHttp / Networking
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
