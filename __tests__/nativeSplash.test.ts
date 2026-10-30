/// <reference types="node" />
// nativeSplash.test.ts — locks the pre-JS window (native splash) to the app's palette.
//
// The blank cold start this covers: Android paints `android:windowBackground` before
// React Native mounts, so that drawable is the only thing the user sees while the JS
// bundle loads. These assertions keep the launch theme wired to the Connexis wordmark
// and to the same cream as `colors.splash`, keep that window in place behind React
// (so a slow load never falls back to a blank page), and forbid a second JS splash.
import fs from 'fs';
import path from 'path';

const root = path.join(__dirname, '..');
const read = (relative: string) =>
  fs.readFileSync(path.join(root, relative), 'utf8');

/** Returns the `<activity …>` opening tag for MainActivity. */
const mainActivityTag = (manifest: string): string => {
  const start = manifest.indexOf('android:name=".MainActivity"');
  if (start === -1) {
    throw new Error('MainActivity is not declared in AndroidManifest.xml');
  }
  const open = manifest.lastIndexOf('<activity', start);
  const close = manifest.indexOf('>', start);
  return manifest.slice(open, close);
};

/** Returns one `<style name="…">…</style>` block. */
const styleBlock = (xml: string, name: string): string => {
  const match = xml.match(
    new RegExp(`<style name="${name}"[^>]*>[\\s\\S]*?</style>`),
  );
  if (!match) {
    throw new Error(`style ${name} is not defined`);
  }
  return match[0];
};

describe('native splash (pre-JS window)', () => {
  it('gives MainActivity the splash theme', () => {
    const manifest = read('android/app/src/main/AndroidManifest.xml');
    expect(mainActivityTag(manifest)).toContain(
      'android:theme="@style/SplashTheme"',
    );
  });

  it('defines SplashTheme on top of AppTheme with the splash drawable', () => {
    const styles = read('android/app/src/main/res/values/styles.xml');
    const splash = styleBlock(styles, 'SplashTheme');
    expect(splash).toContain('parent="AppTheme"');
    expect(splash).toContain(
      'android:windowBackground">@drawable/splash_background<',
    );
  });

  it('keeps the Android 12 system splash on the same cream', () => {
    const v31 = read('android/app/src/main/res/values-v31/styles.xml');
    const splash = styleBlock(v31, 'SplashTheme');
    expect(splash).toContain(
      'android:windowSplashScreenBackground">@color/splashBackground<',
    );
  });

  it('shows the wordmark in the Android 12 system splash', () => {
    const v31 = read('android/app/src/main/res/values-v31/styles.xml');
    const splash = styleBlock(v31, 'SplashTheme');
    expect(splash).toContain(
      'android:windowSplashScreenAnimatedIcon">@drawable/splash_icon<',
    );
    // A coloured icon background would clip the wide wordmark into a circle, so
    // the mark is drawn unmasked straight onto the cream splash background.
    expect(splash).not.toContain('windowSplashScreenIconBackgroundColor');
  });

  it('ships a square splash icon big enough not to be upscaled', () => {
    const icon = path.join(
      root,
      'android/app/src/main/res/drawable-nodpi/splash_icon.png',
    );
    expect(fs.existsSync(icon)).toBe(true);
    const png = fs.readFileSync(icon);
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    expect(width).toBe(height);
    expect(width).toBeGreaterThanOrEqual(512);
  });

  it('paints the shared splash colour behind the wordmark', () => {
    const drawable = read(
      'android/app/src/main/res/drawable/splash_background.xml',
    );
    expect(drawable).toContain('@color/splashBackground');
    expect(drawable).toContain('@drawable/splash_logo');
  });

  it('ships the wordmark bitmap the drawable points at', () => {
    const logo = path.join(
      root,
      'android/app/src/main/res/drawable-nodpi/splash_logo.png',
    );
    expect(fs.existsSync(logo)).toBe(true);
    expect(fs.statSync(logo).size).toBeGreaterThan(0);
  });

  it('matches colors.splash so the JS and native splash cannot drift', () => {
    const nativeColors = read('android/app/src/main/res/values/colors.xml');
    const jsColors = read('src/shared/theme/colors.ts');
    const native = nativeColors.match(
      /<color name="splashBackground">(#[0-9A-Fa-f]{6})<\/color>/,
    );
    const js = jsColors.match(/splash:\s*'(#[0-9A-Fa-f]{6})'/);
    expect(native?.[1]).toBeDefined();
    expect(js?.[1]).toBeDefined();
    expect(native?.[1]?.toUpperCase()).toBe(js?.[1]?.toUpperCase());
  });

  it('keeps the splash window behind React until the first frame paints', () => {
    const activity = read(
      'android/app/src/main/java/com/connexistracker/MainActivity.kt',
    );
    // Restoring a flat theme in onCreate would repaint the window cream before React
    // mounts — that is exactly the blank-page regression this test locks out.
    expect(activity).not.toContain('setTheme(');
  });

  it('shows exactly one splash: the platform one', () => {
    const app = read('App.tsx');
    expect(app).not.toContain('splashOverlay');
    expect(app).not.toContain('MIN_SPLASH_MS');
    expect(app).not.toContain('Animated.timing');
  });
});
