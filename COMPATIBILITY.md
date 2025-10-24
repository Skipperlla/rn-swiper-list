# React Native 0.76.x Compatibility Fix

## Problem
Users on React Native 0.76.x could not upgrade to rn-swiper-list v3.0.0 because:
- v3.0.0 requires `react-native-worklets`
- `react-native-worklets` 0.6.1 only supports React Native 0.78+
- Users needed the bug fixes in v3.0.0 (especially single-item card rendering)

## Solution
Made `react-native-worklets` an optional dependency by:

1. **Created a compatibility layer** (`src/utils/workletCompat.ts`)
   - Tries to import from `react-native-worklets` (for RN 0.78+)
   - Falls back to `react-native-reanimated`'s `runOnJS` and `runOnUI` (for RN 0.76.x)
   - Provides the same API (`scheduleOnRN` and `scheduleOnUI`)

2. **Updated imports**
   - Changed `Swiper.tsx` and `SwiperCard/index.tsx` to use the compatibility layer
   - No changes to the actual logic or functionality

3. **Updated package.json**
   - Made `react-native-worklets` an optional peer dependency using `peerDependenciesMeta`
   - Removed it from direct dependencies

4. **Updated documentation**
   - README now explains that `react-native-worklets` is only needed for RN 0.78+
   - For older versions, the library uses functions from `react-native-reanimated`

## Compatibility Matrix

| React Native Version | react-native-worklets | Works? | Notes |
|---------------------|----------------------|--------|-------|
| 0.76.x | Not required | ✅ Yes | Uses `runOnJS`/`runOnUI` from reanimated |
| 0.77.x | Not required | ✅ Yes | Uses `runOnJS`/`runOnUI` from reanimated |
| 0.78+ | Optional | ✅ Yes | Can use worklets or reanimated |

## Testing
- ✅ All 18 tests passing (15 existing + 3 new)
- ✅ TypeScript compilation successful
- ✅ Linting passes
- ✅ CodeQL security scan passed
- ✅ Build output verified

## Technical Details

### scheduleOnRN
- **Worklets**: Uses `scheduleOnRN` from react-native-worklets
- **Reanimated**: Uses `runOnJS` wrapper that schedules callbacks on the React Native thread

### scheduleOnUI
- **Worklets**: Uses `scheduleOnUI` from react-native-worklets
- **Reanimated**: Uses `runOnUI` wrapper that schedules work on the UI thread

Both implementations provide the same API and behavior, ensuring seamless compatibility.
