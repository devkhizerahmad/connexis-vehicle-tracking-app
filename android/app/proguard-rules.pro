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

# Keep OkHttp / Networking
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
