package com.connexistracker

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * The activity keeps `SplashTheme` for its whole life on purpose. Its window
   * background is the Connexis wordmark on cream (res/drawable/splash_background.xml),
   * and Android only replaces the starting window once this activity draws — which
   * happens before React mounts. Restoring a flat AppTheme here would bring back the
   * blank cream page during a slow JS bundle load. React's first frame simply paints
   * over the splash, so the wordmark is never visible behind a running screen.
   */

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ConnexisTracker"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
