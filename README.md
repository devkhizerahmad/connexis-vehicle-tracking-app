# ConnexisTracker

Production-grade React Native vehicle tracking application (bare RN CLI, not Expo).

## Getting Started

### Prerequisites
| Tool | Version / Note |
|------|----------------|
| Node.js | >= 22.11.0 |
| JDK | 17 |
| Android SDK | Latest platform-tools + build-tools (install via Android Studio) |
| Xcode + CocoaPods | Only required if building for iOS |

> ⚠️ **Fresh clone caveat:** The following files are gitignored and will be missing on a fresh clone: `android/local.properties`, `node_modules/`, `ios/Pods/`. The setup steps below handle these automatically.

### Installation & Setup

```bash
# 1. Clone repository and install dependencies
git clone <repo-url> && cd ConnexisTracker
npm install

# 2. Configure Android SDK path (Compulsory — this file does not exist on fresh clones)
#    Create android/local.properties with your machine-specific SDK path:
#      Windows: sdk.dir=C\:\\Users\\<username>\\AppData\\Local\\Android\\Sdk
#      macOS/Linux: sdk.dir=/Users/<username>/Library/Android/sdk

# 3. Configure Maps API Key (Required for LiveMap / History / Engine Control screens)
#    If the key is NOT committed in the repo, obtain it privately from the owner, then add to android/gradle.properties:
#      MAPS_API_KEY=<your-key>
#    ⚠️ SECURITY: Never commit the actual key value. Before distribution, restrict the key in Google Cloud Console 
#       (package name + SHA-1 fingerprint) and rotate any exposed keys.

# 4. Start Metro bundler (development server)
npm start

# 5. Run on device/emulator (Ensure USB cable connected or emulator running)
npm run android        # Debug build — no release keystore required
npm run ios            # For iOS: run `cd ios && pod install` first

# 6. Run tests
npm test