# ConnexisTracker

Production-grade React Native vehicle tracking application.

## Getting Started

### Prerequisites
- Node.js >= 22.11.0
- React Native CLI
- Android Studio / Xcode

### Install dependencies
```bash
npm install
```

### Run Metro bundler
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS
```bash
npm run ios
```

### Run Tests
```bash
npm test
```

---

## Architecture

Production-grade **feature-based modular architecture** with strict path aliases.

```
src/
├── assets/                    # Static media (logo, vehicle images, profile)
├── features/                  # Feature modules (self-contained)
│   ├── home/                  # Home & Details feature
│   │   ├── components/        # Feature-scoped UI components
│   │   ├── hooks/             # Feature-scoped data hooks
│   │   ├── mocks/             # Mock JSON data
│   │   ├── screens/           # DetailsScreen (frozen), HomeScreen (shell)
│   │   ├── services/          # vehicleService (API-ready)
│   │   └── types/             # Feature-scoped TypeScript types
│   ├── map/                   # LiveMap & History features
│   ├── reports/               # Reports feature
│   ├── engineControl/         # Engine Control feature
│   └── profile/               # Profile feature
├── navigation/                # React Navigation setup
│   ├── RootNavigator.tsx      # Bottom tab navigator
│   ├── types.ts               # Typed param lists
│   └── stacks/                # Per-tab stack navigators
└── shared/                    # Cross-feature utilities
    ├── components/            # Reusable UI (layout, vehicle, controls, icons)
    ├── hooks/                 # Shared hooks (useCollapsible, useDonutProgress)
    ├── theme/                 # Semantic design tokens
    ├── types/                 # Shared TypeScript types
    └── utils/                 # format.ts, styleFactories.ts, navigationHelpers.ts
```

### Path Aliases
| Alias | Resolves To |
|-------|-------------|
| `@shared/*` | `src/shared/*` |
| `@features/*` | `src/features/*` |
| `@navigation/*` | `src/navigation/*` |

### Key Dependencies
| Package | Purpose |
|---------|---------|
| `react-navigation/native` | Navigation container |
| `react-navigation/native-stack` | Stack navigators |
| `react-navigation/bottom-tabs` | Bottom tab navigator |
| `react-native-screens` | Native screen optimization |
| `react-native-safe-area-context` | Safe area insets |
| `babel-plugin-module-resolver` | Path alias support |

---

## Development Notes

- **Initial Route**: `HomeStack` starts at `Details` screen during development (set `INITIAL_ROUTE='Home'` in `HomeStack.tsx` to switch)
- **Mock Data**: `features/home/mocks/details.mock.json` — replace `vehicleService.getVehicleDetails()` with real API when ready
- **Performance**: All event handlers use `useCallback`, collapse state uses `useCollapsible` hook, donut animation uses `useDonutProgress` hook
- **Theme**: All design tokens are in `src/shared/theme/` — never use raw hex values in components

---

## Refactor History

- **v1.0** — Production refactor: Feature-based architecture, React Navigation, semantic theme tokens, data service layer, performance hardening (P0–P7)
